# Gunakan image Python 3 Alpine untuk ukuran kecil
FROM python:3-alpine

# Set working directory di dalam container
WORKDIR /app

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Install dependensi yang diperlukan
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variable untuk port (Railway otomatis mengatur PORT)
ENV PORT 8000

# Jalankan aplikasi menggunakan uvicorn, bind ke 0.0.0.0 dan port yang diberikan oleh Railway
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
