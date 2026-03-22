FROM python:3.11-slim

WORKDIR /app

# Install docker CLI so backend can exec commands into the Kali container
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        docker.io \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT"]