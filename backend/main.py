from contextlib import asynccontextmanager
from datetime import date, datetime
from pathlib import Path
import hashlib, hmac, os, secrets, sqlite3

import joblib
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from sklearn.linear_model import LinearRegression

from train_model import train

BASE = Path(__file__).resolve().parent
DB = BASE / 'expense_tracker.db'
MODEL_PATH = BASE / 'models' / 'category_model.joblib'


def db():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    return con


def init_db():
    with db() as con:
        con.executescript(
            '''
            CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS tokens(
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS expenses(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                description TEXT NOT NULL,
                date TEXT NOT NULL,
                mode TEXT NOT NULL,
                category TEXT NOT NULL,
                predicted_category TEXT,
                created_at TEXT NOT NULL
            );
            '''
        )


def hash_password(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 120000).hex()


def issue_token(user_id):
    token = secrets.token_urlsafe(32)
    with db() as con:
        con.execute(
            'INSERT INTO tokens VALUES(?,?,?)',
            (token, user_id, datetime.utcnow().isoformat()),
        )
    return token


def current_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(401, 'Missing authentication token')
    token = authorization[7:]
    with db() as con:
        row = con.execute(
            'SELECT users.* FROM tokens JOIN users ON users.id=tokens.user_id WHERE token=?',
            (token,),
        ).fetchone()
    if not row:
        raise HTTPException(401, 'Invalid authentication token')
    return dict(row)


class Register(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class Login(BaseModel):
    email: EmailStr
    password: str


# Category is deliberately NOT accepted from the frontend.
# The backend ML classifier always decides the saved category.
class ExpenseIn(BaseModel):
    amount: float = Field(gt=0)
    description: str = Field(min_length=2, max_length=250)
    date: date
    mode: str


class PredictIn(BaseModel):
    description: str = Field(min_length=2)
    amount: float = 0
    mode: str = 'UPI'


model_bundle = {}


@asynccontextmanager
async def lifespan(app):
    init_db()
    if not MODEL_PATH.exists():
        train()
    model_bundle.update(joblib.load(MODEL_PATH))
    yield


app = FastAPI(title='SpendSense API', version='1.1.0', lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/api/health')
def health():
    return {
        'status': 'ok',
        'model_rows': model_bundle.get('rows'),
        'model_accuracy': model_bundle.get('accuracy'),
    }


@app.post('/api/auth/register')
def register(x: Register):
    salt = os.urandom(16).hex()
    pwd = hash_password(x.password, salt)
    try:
        with db() as con:
            cur = con.execute(
                'INSERT INTO users(name,email,password_hash,salt,created_at) VALUES(?,?,?,?,?)',
                (x.name, x.email.lower(), pwd, salt, datetime.utcnow().isoformat()),
            )
            uid = cur.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(409, 'Email is already registered')
    return {
        'token': issue_token(uid),
        'user': {'id': uid, 'name': x.name, 'email': x.email.lower()},
    }


@app.post('/api/auth/login')
def login(x: Login):
    with db() as con:
        row = con.execute('SELECT * FROM users WHERE email=?', (x.email.lower(),)).fetchone()
    if not row or not hmac.compare_digest(
        row['password_hash'], hash_password(x.password, row['salt'])
    ):
        raise HTTPException(401, 'Incorrect email or password')
    return {
        'token': issue_token(row['id']),
        'user': {'id': row['id'], 'name': row['name'], 'email': row['email']},
    }


@app.post('/api/predict-category')
def predict(x: PredictIn, user=Depends(current_user)):
    model = model_bundle['model']
    probs = model.predict_proba([x.description])[0]
    classes = model.classes_
    idx = int(probs.argmax())
    return {
        'category': str(classes[idx]),
        'confidence': float(probs[idx]),
        'model_accuracy': model_bundle.get('accuracy'),
    }


@app.get('/api/expenses')
def expenses(user=Depends(current_user)):
    with db() as con:
        rows = con.execute(
            'SELECT id,amount,description,date,mode,category,predicted_category '
            'FROM expenses WHERE user_id=? ORDER BY date DESC,id DESC',
            (user['id'],),
        ).fetchall()
    return [dict(r) for r in rows]


@app.post('/api/expenses', status_code=201)
def add_expense(x: ExpenseIn, user=Depends(current_user)):
    # Automatic category detection: the classifier result is the real saved category.
    predicted = str(model_bundle['model'].predict([x.description])[0])

    with db() as con:
        cur = con.execute(
            'INSERT INTO expenses('
            'user_id,amount,description,date,mode,category,predicted_category,created_at'
            ') VALUES(?,?,?,?,?,?,?,?)',
            (
                user['id'],
                x.amount,
                x.description,
                x.date.isoformat(),
                x.mode,
                predicted,
                predicted,
                datetime.utcnow().isoformat(),
            ),
        )
        eid = cur.lastrowid

    return {
        'id': eid,
        'amount': x.amount,
        'description': x.description,
        'date': x.date.isoformat(),
        'mode': x.mode,
        'category': predicted,
        'predicted_category': predicted,
    }


@app.delete('/api/expenses/{expense_id}')
def delete_expense(expense_id: int, user=Depends(current_user)):
    with db() as con:
        cur = con.execute(
            'DELETE FROM expenses WHERE id=? AND user_id=?',
            (expense_id, user['id']),
        )
    if cur.rowcount == 0:
        raise HTTPException(404, 'Expense not found')
    return {'deleted': True}


@app.get('/api/analytics/dashboard')
def dashboard(user=Depends(current_user)):
    with db() as con:
        rows = con.execute(
            'SELECT amount,category,date FROM expenses WHERE user_id=?',
            (user['id'],),
        ).fetchall()

    total = sum(float(r['amount']) for r in rows)
    cats = {}
    months = {}

    for r in rows:
        amount = float(r['amount'])
        cats[r['category']] = cats.get(r['category'], 0) + amount
        month_key = r['date'][:7]
        months[month_key] = months.get(month_key, 0) + amount

    # Use every available month in chronological order.
    sorted_months = sorted(months.keys())
    monthly_totals = [months[m] for m in sorted_months]

    # No averaging and no +5% fallback.
    # A real line needs at least two monthly observations.
    if len(monthly_totals) >= 2:
        X = [[i] for i in range(len(monthly_totals))]
        y = monthly_totals

        regression = LinearRegression()
        regression.fit(X, y)
        prediction = float(regression.predict([[len(monthly_totals)]])[0])
        prediction = max(0.0, prediction)
        method = 'Linear Regression on monthly spending trend'
    else:
        prediction = 0.0
        method = 'Need at least 2 months of data for Linear Regression'

    breakdown = [
        {'name': k, 'value': round(v, 2)}
        for k, v in sorted(cats.items(), key=lambda z: z[1], reverse=True)
    ]

    return {
        'total_spend': round(total, 2),
        'predicted_next_month': round(prediction, 2),
        'prediction_method': method,
        'top_category': breakdown[0]['name'] if breakdown else 'No data',
        'category_breakdown': breakdown,
        'model_accuracy': model_bundle.get('accuracy'),
    }
