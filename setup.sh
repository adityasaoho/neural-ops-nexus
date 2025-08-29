#!/bin/bash

echo "🚀 Mini Heart X - Setup Script"
echo "================================"

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This tool is designed for Linux systems (Ubuntu/Kali/Parrot/Arch)"
    echo "   Please run on a Linux distribution with penetration testing tools"
    exit 1
fi

# Check if running as root (optional warning)
if [[ $EUID -eq 0 ]]; then
   echo "⚠️  Running as root - consider using a regular user for safety"
fi

# Detect Linux distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO=$ID
else
    echo "❌ Cannot detect Linux distribution"
    exit 1
fi

echo "🐧 Detected distribution: $DISTRO"

# Update package manager
echo "📦 Updating package manager..."
case $DISTRO in
    "ubuntu"|"debian")
        sudo apt update
        ;;
    "kali")
        sudo apt update
        ;;
    "arch"|"manjaro")
        sudo pacman -Sy
        ;;
    "fedora")
        sudo dnf update
        ;;
    *)
        echo "⚠️  Unsupported distribution. Manual tool installation required."
        ;;
esac

# Install penetration testing tools
echo "🔧 Installing penetration testing tools..."
case $DISTRO in
    "ubuntu"|"debian")
        sudo apt install -y nmap nikto hydra sqlmap tcpdump wireshark-tshark \
                            netstat-nat net-tools gobuster dirb curl wget \
                            python3 python3-pip python3-venv sqlite3
        ;;
    "kali")
        echo "✅ Kali Linux detected - most tools already installed"
        sudo apt install -y python3-pip python3-venv sqlite3
        ;;
    "arch"|"manjaro") 
        sudo pacman -S nmap nikto hydra sqlmap tcpdump wireshark-cli \
                       net-tools gobuster python python-pip sqlite
        ;;
    "fedora")
        sudo dnf install -y nmap nikto hydra sqlmap tcpdump wireshark-cli \
                           net-tools python3 python3-pip sqlite
        ;;
esac

# Install Node.js and npm (for frontend)
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    case $DISTRO in
        "ubuntu"|"debian"|"kali")
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        "arch"|"manjaro")
            sudo pacman -S nodejs npm
            ;;
        "fedora")
            sudo dnf install -y nodejs npm
            ;;
    esac
else
    echo "✅ Node.js already installed"
fi

# Create Python virtual environment for backend
echo "🐍 Setting up Python backend environment..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create necessary directories
echo "📁 Creating application directories..."
mkdir -p backend/data backend/config backend/logs

# Copy environment configuration
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file - please configure your settings"
fi

# Set permissions
echo "🔒 Setting permissions..."
chmod +x backend/main.py
chmod +x setup.sh

# Test tool availability
echo "🧪 Testing tool availability..."
TOOLS=("nmap" "nikto" "hydra" "sqlmap" "tcpdump")
MISSING_TOOLS=()

for tool in "${TOOLS[@]}"; do
    if command -v $tool &> /dev/null; then
        echo "✅ $tool - installed"
    else
        echo "❌ $tool - missing"
        MISSING_TOOLS+=($tool)
    fi
done

# Security reminder
echo ""
echo "🔐 SECURITY REMINDER:"
echo "================================"
echo "• Only use this tool on networks you own or have explicit permission to test"
echo "• Set up isolated lab environments for training"
echo "• Follow responsible disclosure practices" 
echo "• Keep your tools updated"
echo ""

# Final instructions
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with API keys (optional)"
echo "2. Start the backend: cd backend && python main.py"
echo "3. Start the frontend: npm run dev" 
echo "4. Access the dashboard at http://localhost:5173"
echo ""

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo "⚠️  Missing tools: ${MISSING_TOOLS[*]}"
    echo "   Install manually or run with Docker for complete tool set"
fi

echo "🚀 Mini Heart X is ready for cyber operations!"