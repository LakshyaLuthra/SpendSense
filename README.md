# SpendSense Full-Stack Expense Tracker

This starter combines the React frontend, FastAPI backend, SQLite database, CSV dataset, and a trained text-classification model.

## Automatic behavior

- Backend creates `expense_tracker.db` on first run.
- Backend trains `backend/models/category_model.joblib` from `backend/data/expenses_dataset.csv` if the model is missing.
- Frontend calls the backend APIs for authentication, expenses, category prediction, dashboard totals, pie-chart data, and next-month estimates.

## Run backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API docs: `http://localhost:8000/docs`

## Run frontend

Open a second terminal:

```bash
cd frontend
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
npm install
npm run dev
```

Open `http://localhost:5173`.

## Main APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/expenses`
- `POST /api/expenses`
- `DELETE /api/expenses/{id}`
- `POST /api/predict-category`
- `GET /api/analytics/dashboard`
- `GET /api/health`

## Retrain after changing the dataset

```bash
cd backend
python train_model.py
```

Then restart the FastAPI server.
