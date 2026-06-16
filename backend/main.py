from fastapi import FastAPI

app = FastAPI(title="Home Library API")


@app.get("/")
def health():
    return {"status": "ok"}
