from pathlib import Path
import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
BASE=Path(__file__).resolve().parent
DATA=BASE/'data'/'expenses_dataset.csv'; MODEL=BASE/'models'/'category_model.joblib'
def train():
    df=pd.read_csv(DATA).dropna(subset=['description','category'])
    X_train,X_test,y_train,y_test=train_test_split(df['description'],df['category'],test_size=.2,random_state=42,stratify=df['category'])
    model=Pipeline([('tfidf',TfidfVectorizer(ngram_range=(1,2),lowercase=True)),('clf',LogisticRegression(max_iter=1500,class_weight='balanced'))])
    model.fit(X_train,y_train)
    accuracy=accuracy_score(y_test,model.predict(X_test))
    MODEL.parent.mkdir(exist_ok=True);joblib.dump({'model':model,'accuracy':accuracy,'rows':len(df)},MODEL)
    print(f'Saved model to {MODEL} | rows={len(df)} | test_accuracy={accuracy:.3f}')
    return model
if __name__=='__main__':train()
