#!/usr/bin/env python3
"""
Mini Heart X - AI-Powered Cyber Operations Backend
Real Linux/Kali tool integration with FastAPI
"""

import os
import json
import sqlite3
import subprocess
import asyncio
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai

# Initialize FastAPI app
app = FastAPI(title="Mini Heart X API", version="1.0.0")

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class CommandRequest(BaseModel):
    input: str
    mode: str = "matrix"

class CommandResponse(BaseModel):
    id: str
    input: str
    command: str
    output: List[str]
    type: str
    timestamp: str

class ToolConfig(BaseModel):
    name: str
    command: str
    args: str
    category: str
    description: str

# Global configuration
TOOLS_CONFIG_PATH = Path("backend/config/tools.json")
DB_PATH = Path("backend/data/commands.db")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class CyberToolsManager:
    def __init__(self):
        self.tools_config = self.load_tools_config()
        self.init_database()
        
    def load_tools_config(self) -> Dict:
        """Load configurable tool mappings"""
        if TOOLS_CONFIG_PATH.exists():
            with open(TOOLS_CONFIG_PATH, 'r') as f:
                return json.load(f)
        else:
            # Default configuration
            default_config = {
                "recon": {
                    "nmap": {
                        "name": "Nmap Network Scanner",
                        "command": "nmap",
                        "args": "-sS -O",
                        "category": "recon",
                        "description": "Network discovery and security auditing"
                    },
                    "nikto": {
                        "name": "Nikto Web Scanner", 
                        "command": "nikto",
                        "args": "-h",
                        "category": "recon",
                        "description": "Web server scanner"
                    }
                },
                "exploit": {
                    "hydra": {
                        "name": "Hydra Brute Force",
                        "command": "hydra",
                        "args": "-l root -P /usr/share/wordlists/rockyou.txt",
                        "category": "exploit", 
                        "description": "Login cracker"
                    },
                    "sqlmap": {
                        "name": "SQLMap",
                        "command": "sqlmap",
                        "args": "-u --batch",
                        "category": "exploit",
                        "description": "SQL injection tool"
                    }
                },
                "defense": {
                    "netstat": {
                        "name": "Netstat",
                        "command": "netstat",
                        "args": "-tulpn",
                        "category": "defense",
                        "description": "Network connections"
                    },
                    "tcpdump": {
                        "name": "Tcpdump",
                        "command": "tcpdump",
                        "args": "-i any -n",
                        "category": "defense", 
                        "description": "Packet analyzer"
                    }
                }
            }
            self.save_tools_config(default_config)
            return default_config
    
    def save_tools_config(self, config: Dict):
        """Save tools configuration"""
        TOOLS_CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(TOOLS_CONFIG_PATH, 'w') as f:
            json.dump(config, f, indent=2)
    
    def init_database(self):
        """Initialize SQLite database for command history"""
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS commands (
                id TEXT PRIMARY KEY,
                timestamp TEXT,
                input TEXT,
                command TEXT,
                output TEXT,
                type TEXT,
                mode TEXT
            )
        ''')
        conn.commit()
        conn.close()
    
    async def translate_command(self, input_text: str, mode: str) -> str:
        """Use AI to translate natural language to Linux commands"""
        if not OPENAI_API_KEY:
            # Fallback to simple mapping if no OpenAI key
            return self.simple_translate(input_text)
        
        try:
            # OpenAI prompt for command translation
            system_prompt = f"""
            You are a cybersecurity expert assistant. Convert natural language requests into precise Linux/Kali commands.
            
            Available tools: {', '.join(self.get_available_tools())}
            Current mode: {mode}
            
            Rules:
            - Return ONLY the command, no explanations
            - Use appropriate tool based on the request
            - Include proper arguments and syntax
            - For network scans, use common private IP ranges if not specified
            - For brute force, use standard wordlists from /usr/share/wordlists/
            
            Example:
            Input: "scan network for SSH"
            Output: nmap -p 22 192.168.1.0/24
            """
            
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": input_text}
                ],
                temperature=0.2,
                max_tokens=200
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"OpenAI translation failed: {e}")
            return self.simple_translate(input_text)
    
    def simple_translate(self, input_text: str) -> str:
        """Simple rule-based command translation"""
        input_lower = input_text.lower()
        
        # Network scanning
        if "scan" in input_lower and ("network" in input_lower or "subnet" in input_lower):
            return "nmap -sn 192.168.1.0/24"
        elif "scan" in input_lower and ("port" in input_lower or "ssh" in input_lower):
            return "nmap -p 22 192.168.1.0/24"
        elif "scan" in input_lower and "web" in input_lower:
            return "nikto -h http://192.168.1.1"
        
        # Network monitoring
        elif "network" in input_lower and ("connection" in input_lower or "check" in input_lower):
            return "netstat -tulpn"
        elif "monitor" in input_lower and "traffic" in input_lower:
            return "tcpdump -i any -n -c 20"
        
        # Brute force
        elif "brute" in input_lower and "ssh" in input_lower:
            return "hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10"
        
        return f"# Could not translate: '{input_text}' - try being more specific"
    
    def get_available_tools(self) -> List[str]:
        """Get list of available tools from configuration"""
        tools = []
        for category in self.tools_config.values():
            if isinstance(category, dict):
                tools.extend(category.keys())
        return tools
    
    async def execute_command(self, command: str, use_terminal: bool = True) -> tuple[List[str], str]:
        """Execute Linux command and return output"""
        try:
            if command.startswith('#'):
                return [command], "error"
            
            # Check if running in GUI environment for terminal
            if use_terminal and os.environ.get('DISPLAY'):
                # Use GNOME terminal for real terminal experience
                terminal_cmd = f"gnome-terminal -- bash -c '{command}; echo; echo Press any key to close...; read -n 1; exit'"
                subprocess.Popen(terminal_cmd, shell=True)
                return [f"Command executed in terminal: {command}"], "success"
            else:
                # Execute via subprocess and capture output
                process = await asyncio.create_subprocess_shell(
                    command,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.STDOUT,
                    timeout=30
                )
                
                stdout, _ = await process.communicate()
                output_lines = stdout.decode('utf-8', errors='ignore').split('\n')
                
                # Filter empty lines and limit output
                output_lines = [line for line in output_lines if line.strip()][:50]
                
                result_type = "success" if process.returncode == 0 else "error"
                return output_lines, result_type
                
        except asyncio.TimeoutError:
            return ["Command timed out after 30 seconds"], "error"
        except Exception as e:
            return [f"Execution error: {str(e)}"], "error"
    
    def save_command_history(self, cmd_id: str, input_text: str, command: str, 
                           output: List[str], cmd_type: str, mode: str):
        """Save command to database"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO commands (id, timestamp, input, command, output, type, mode)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            cmd_id,
            datetime.now().isoformat(),
            input_text,
            command,
            json.dumps(output),
            cmd_type,
            mode
        ))
        conn.commit()
        conn.close()

# Initialize tools manager
tools_manager = CyberToolsManager()

@app.get("/")
async def root():
    return {"message": "Mini Heart X API - Cyber Operations Backend"}

@app.post("/api/translate", response_model=CommandResponse)
async def translate_command(request: CommandRequest, background_tasks: BackgroundTasks):
    """Translate natural language to Linux command and execute"""
    
    # Generate command ID
    cmd_id = f"cmd_{int(datetime.now().timestamp())}"
    
    # Translate natural language to command
    command = await tools_manager.translate_command(request.input, request.mode)
    
    # Execute command
    output, cmd_type = await tools_manager.execute_command(command, use_terminal=False)
    
    # Save to history
    background_tasks.add_task(
        tools_manager.save_command_history,
        cmd_id, request.input, command, output, cmd_type, request.mode
    )
    
    return CommandResponse(
        id=cmd_id,
        input=request.input,
        command=command,
        output=output,
        type=cmd_type,
        timestamp=datetime.now().strftime("%H:%M:%S")
    )

@app.get("/api/tools")
async def get_tools():
    """Get available tools configuration"""
    return tools_manager.tools_config

@app.get("/api/network/discover")
async def discover_network():
    """Discover devices on local network"""
    try:
        # Simple network discovery
        command = "nmap -sn 192.168.1.0/24 | grep -E 'Nmap scan report|MAC Address'"
        output, _ = await tools_manager.execute_command(command, use_terminal=False)
        
        # Parse network hosts
        hosts = []
        current_host = {}
        
        for line in output:
            if "Nmap scan report for" in line:
                if current_host:
                    hosts.append(current_host)
                current_host = {"ip": line.split()[-1].strip("()")}
            elif "MAC Address:" in line:
                mac_info = line.split("MAC Address:")[1].strip()
                current_host["mac"] = mac_info.split()[0]
                if "(" in mac_info:
                    current_host["vendor"] = mac_info.split("(")[1].strip(")")
        
        if current_host:
            hosts.append(current_host)
        
        return {"hosts": hosts}
        
    except Exception as e:
        return {"error": str(e), "hosts": []}

@app.get("/api/history")
async def get_command_history(limit: int = 50):
    """Get command history"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM commands ORDER BY timestamp DESC LIMIT ?
    ''', (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    history = []
    for row in rows:
        history.append({
            "id": row[0],
            "timestamp": row[1], 
            "input": row[2],
            "command": row[3],
            "output": json.loads(row[4]),
            "type": row[5],
            "mode": row[6]
        })
    
    return {"history": history}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Mini Heart X Backend...")
    print("🔧 Configurable tools loaded")
    print("🐧 Real Linux integration ready")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)