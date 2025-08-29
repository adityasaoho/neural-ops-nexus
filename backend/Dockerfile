# Multi-stage build for Mini Heart X Backend
FROM kalilinux/kali-rolling as base

# Update and install essential tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    # Network tools
    nmap \
    nikto \
    dirb \
    gobuster \
    # Exploitation tools  
    hydra \
    sqlmap \
    metasploit-framework \
    # Analysis tools
    tcpdump \
    tshark \
    wireshark-common \
    netstat-nat \
    net-tools \
    # System tools
    sqlite3 \
    curl \
    wget \
    vim \
    # Additional utilities
    wordlists \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/config /app/logs

# Set permissions
RUN chmod +x /app/main.py

# Create non-root user (optional, for security)
RUN useradd -m -s /bin/bash miniheartx && \
    chown -R miniheartx:miniheartx /app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Run as non-root user (uncomment for security)
# USER miniheartx

# Start the application
CMD ["python3", "main.py"]