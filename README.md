#  Mini Heart X

**AI-Powered Cyber Operations Dashboard with Real Linux Integration**

A cinematic, glassmorphic interface that bridges natural language commands with actual penetration testing tools. Built for cybersecurity professionals, students, and ethical hackers working in controlled lab environments.

![Mini Heart X Dashboard](docs/screenshot.png)

## ✨ Features

### 🧠 AI Command Translation
- Natural language to Linux command conversion
- OpenAI integration for intelligent command interpretation
- Context-aware tool selection based on operation mode

### 🐧 Real Linux Integration
- Execute actual Kali Linux tools (nmap, hydra, sqlmap, metasploit)
- GNOME terminal integration for interactive sessions
- Support for all major Linux distributions

### 🎨 Cinematic UI
- iOS 16+ inspired glassmorphism design
- Dynamic cyber themes (Matrix Green, Attack Red, Defense Blue, Purple Ops)
- Smooth Framer Motion animations and effects
- Real-time terminal output display

### 🔧 Configurable & Extensible
- JSON-based tool configuration system
- Easy addition of new tools and mappings
- Customizable command arguments and examples

### 🌐 Network Operations
- Automated network discovery and mapping
- Multi-target scanning capabilities
- Local lab network integration

## 🚀 Quick Start

### Prerequisites
- Linux system (Ubuntu 20.04+, Kali Linux, Parrot OS, Arch Linux)
- Python 3.8+
- Node.js 16+
- Common penetration testing tools

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mini-heart-x.git
cd mini-heart-x

# Run the automated setup script
chmod +x setup.sh
./setup.sh

# Or install manually:
# Backend dependencies
cd backend && pip install -r requirements.txt

# Frontend dependencies  
cd .. && npm install
```

### Running the Application

```bash
# Terminal 1: Start the backend
cd backend
python main.py

# Terminal 2: Start the frontend
npm run dev

# Access the dashboard
open http://localhost:5173
```

### Docker Deployment

```bash
# Quick start with Docker Compose
docker-compose up -d

# Access the application
open http://localhost:5173
```

## 🔧 Configuration

### Tool Configuration
Edit `backend/config/tools.json` to add or modify tools:

```json
{
  "recon": {
    "custom_scanner": {
      "name": "Custom Network Scanner",
      "command": "my-custom-tool",
      "args": "--scan -v",
      "category": "recon",
      "description": "Custom scanning tool",
      "examples": ["scan network 192.168.1.0/24"]
    }
  }
}
```

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Optional: OpenAI API key for enhanced AI translation
OPENAI_API_KEY=your_api_key_here

# Backend configuration
BACKEND_PORT=8000
ENABLE_REAL_EXECUTION=true
```

## 🎯 Usage Examples

### Network Reconnaissance
```
Natural Language: "Scan the network 192.168.1.0/24 for open SSH ports"
Translated Command: nmap -p 22 192.168.1.0/24
```

### Web Application Testing
```
Natural Language: "Test SQL injection on http://target.com/login"
Translated Command: sqlmap -u "http://target.com/login" --batch
```

### Brute Force Testing
```
Natural Language: "Brute force SSH on 192.168.1.10 with common passwords"
Translated Command: hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10
```

## 🔒 Security & Legal

### ⚠️ Important Warnings
- **Only use on networks you own or have explicit written permission to test**
- **Never use against production systems without proper authorization**
- **Follow responsible disclosure practices for any vulnerabilities found**
- **Ensure compliance with local laws and regulations**

### Recommended Lab Setup
- **Isolated VM Networks**: Use VirtualBox/VMware with host-only networking
- **Test Targets**: Set up Metasploitable, DVWA, WebGoat, VulnHub VMs
- **Network Segmentation**: Separate lab environment from production networks
- **Regular Backups**: Snapshot VMs before testing sessions

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │  Linux Tools    │
│                 │    │                 │    │                 │
│ • Glassmorphic UI│◄───┤ • AI Translation│◄───┤ • nmap          │
│ • Real-time logs│    │ • Command Exec   │    │ • hydra         │
│ • Network viz   │    │ • History DB     │    │ • sqlmap        │
│ • Theme system  │    │ • Tool Config    │    │ • metasploit    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📚 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration Reference](docs/configuration.md)
- [Tool Integration](docs/tools.md)
- [API Documentation](docs/api.md)
- [Security Best Practices](docs/security.md)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Test thoroughly** in isolated lab environment
4. **Commit changes** (`git commit -m 'Add amazing feature'`)
5. **Push to branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines
- Test all tool integrations in safe, isolated environments
- Follow security best practices in code
- Update documentation for new features
- Ensure responsible disclosure practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Disclaimer

This tool is intended for educational purposes and authorized penetration testing only. Users are responsible for complying with applicable laws and obtaining proper authorization before using this software. The developers assume no liability for misuse of this tool.

## 🙏 Acknowledgments

- [Kali Linux](https://www.kali.org/) for the comprehensive tool ecosystem
- [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for the modern UI framework
- [FastAPI](https://fastapi.tiangolo.com/) for the high-performance backend
- The cybersecurity community for continuous tool development

---

**Made with ❤️ for the ethical hacking community**

*"With great power comes great responsibility" - Use this tool wisely and ethically.*
