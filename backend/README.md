# Mini Heart X Backend

AI-powered cyber operations backend with real Linux/Kali tool integration.

## Features

- 🐧 **Real Linux Integration**: Execute actual Kali/Linux tools
- 🧠 **AI Command Translation**: Natural language to terminal commands
- 🔧 **Configurable Tools**: Easily add/modify tool mappings
- 🌐 **Network Discovery**: Automated network scanning
- 📊 **Command History**: SQLite-based logging
- 🔒 **Multi-Mode Support**: Red/Blue/Purple team operations

## Prerequisites

### Linux Distribution
- Ubuntu 20.04+ / Kali Linux / Parrot OS / Arch Linux
- Python 3.8+
- Common penetration testing tools

### Install Required Tools

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nmap nikto hydra sqlmap tcpdump netstat-nat wireshark-tshark

# Kali Linux (most tools pre-installed)
sudo apt update && sudo apt upgrade

# Arch Linux  
sudo pacman -S nmap nikto hydra sqlmap tcpdump net-tools wireshark-cli
```

### Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

## Configuration

### 1. Tool Mappings
Edit `config/tools.json` to add/modify tools:

```json
{
  "recon": {
    "custom_scanner": {
      "name": "Custom Network Scanner",
      "command": "my-custom-tool",
      "args": "--scan",
      "category": "recon",
      "description": "Custom scanning tool"
    }
  }
}
```

### 2. Environment Variables
```bash
# Optional: OpenAI API key for AI translation
export OPENAI_API_KEY="your-api-key"

# Required for GUI terminal integration
export DISPLAY=:0
```

## Running the Backend

### Development
```bash
cd backend
python main.py
```

### Production  
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Core Operations
- `POST /api/translate` - Translate natural language to commands
- `GET /api/tools` - Get available tool configurations  
- `GET /api/network/discover` - Discover network devices
- `GET /api/history` - Get command execution history

### Example Usage

```bash
# Translate and execute command
curl -X POST "http://localhost:8000/api/translate" \
  -H "Content-Type: application/json" \
  -d '{"input": "scan network for SSH servers", "mode": "recon"}'

# Get tool configuration
curl "http://localhost:8000/api/tools"

# Network discovery
curl "http://localhost:8000/api/network/discover"
```

## Terminal Integration

### GUI Mode (Recommended)
- Uses `gnome-terminal` for real terminal experience
- Commands execute in separate terminal windows
- Supports interactive tools (msfconsole, etc.)

### Headless Mode  
- Falls back to subprocess execution
- Captures output for web interface
- Limited interactivity

## Security Considerations

⚠️ **WARNING**: This tool executes real penetration testing commands.

### Safe Usage
- Only use on networks you own or have explicit permission to test
- Run in isolated lab environments (VMs, containers)
- Never use against production systems without authorization
- Follow responsible disclosure practices

### Lab Setup Recommendations
- Use isolated VM networks
- Set up test targets: Metasploitable, DVWA, WebGoat
- Network segmentation from production systems
- Regular backups before testing

## Extending the Backend

### Adding New Tools
1. Edit `config/tools.json`
2. Add tool configuration with proper category
3. Update AI translation prompts if needed
4. Test command execution

### Custom Categories
```json
{
  "custom_category": {
    "tool_name": {
      "name": "Display Name",
      "command": "actual-command",
      "args": "default-arguments", 
      "category": "custom_category",
      "description": "Tool description",
      "examples": ["usage example 1"]
    }
  }
}
```

## Troubleshooting

### Common Issues

**Tool not found:**
```bash
# Check if tool is installed
which nmap
# Install missing tools
sudo apt install nmap
```

**Permission denied:**
```bash
# Some tools require root privileges
sudo python main.py
# Or add user to required groups
sudo usermod -a -G wireshark $USER
```

**Display issues:**
```bash
# Set display for GUI terminals
export DISPLAY=:0
# Or run in headless mode
```

### Debug Mode
```bash
# Enable verbose logging
PYTHONPATH=. python -m uvicorn main:app --reload --log-level debug
```

## Docker Deployment

```dockerfile
FROM kalilinux/kali-rolling

RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    nmap nikto hydra sqlmap tcpdump \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . /app
WORKDIR /app

CMD ["python3", "main.py"]
```

## Contributing

1. Test all tool integrations
2. Validate security practices
3. Update documentation
4. Follow responsible disclosure