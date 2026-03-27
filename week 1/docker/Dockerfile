FROM python:3.11-slim

LABEL maintainer="AI Security Lab"
LABEL description="TRINET LAYER AI Assistant — Week 1 Lab (Intentionally Vulnerable)"

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
