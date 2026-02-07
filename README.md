# ONESEC Security Lab

Interactive cybersecurity demo showcasing a Microsoft 365 security architecture with real-time attack simulations.

## Features

- **Interactive Architecture Map** - Visual representation of the complete security ecosystem
- **3D Cyber Threat Map** - Globe visualization of global threats
- **Attack Simulations** - Phishing, Ransomware, and Insider threat scenarios with step-by-step walkthroughs
- **Ecosystem Tour** - Guided tour explaining each security component with voice narration
- **Auto Demo Mode** - Fully automated presentation for events and trade shows
- **Voice Interaction** - Bidirectional voice chat (ask questions about any component)
- **Fuzzy Matching** - Understands misspelled or mispronounced component names
- **Live Metrics** - Real-time animated counters (attacks blocked, events processed, SOC response time)
- **Data Flow Animations** - Visual particles showing log flow between components

## Components Covered

| Component | Description |
|-----------|-------------|
| Microsoft Sentinel | SIEM & SOAR - Security brain |
| Microsoft Defender | Endpoint, Office 365, Identity protection |
| Security Copilot | AI-powered security assistant |
| Microsoft Entra ID | Identity & Access Management (MFA) |
| Microsoft Purview | Data classification & DLP |
| Microsoft Intune | Device management |
| Log Analytics | Centralized log storage |
| MITRE ATT&CK | Threat framework mapping |
| Playbooks | Automated response recipes |
| Workbooks | Executive dashboards & KPIs |
| Logic Apps | Orchestration & automation |
| ONESEC SOC | 24/7 Security Operations Center |

## Quick Start

```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node.js
npx serve .

# Option 3: PHP
php -S localhost:8080
```

Then open: [http://localhost:8080](http://localhost:8080)

## Project Structure

```
ONESEC-LAB/
├── index.html          # Landing page with 3D cyber threat map
├── lab.html            # Security architecture lab (main demo)
├── admin.html          # Admin configuration panel
├── ai_core.js          # AI personality module
├── cybermap/           # 3D globe threat visualization
│   ├── index.html
│   ├── assets/
│   │   ├── index-NxcngSdn.js
│   │   └── index-BEa0Evgp.css
│   └── textures/
│       └── earth_day.jpg
├── textures/
│   └── earth_day.jpg
└── README.md
```

## Deployment

### Netlify (Recommended - Free)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag & drop the `ONESEC-LAB` folder
3. Done! Get your URL instantly

### GitHub Pages
1. Push this repo to GitHub
2. Go to Settings > Pages
3. Select branch `main`, folder `/ (root)`
4. Your site will be live at `https://username.github.io/ONESEC-LAB`

### Vercel
```bash
npx vercel
```

## Requirements

- Modern browser (Chrome/Edge recommended for voice features)
- HTTPS required for Speech Recognition in production
- No backend needed - 100% static site

## Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Core Demo | Yes | Yes | Yes | Yes |
| Voice Narration (TTS) | Yes | Yes | Yes | Yes |
| Speech Recognition | Yes | Yes | No | No |
| Fullscreen | Yes | Yes | Yes | Yes |

---

Built by **ONESEC** - Always Secure, Never at Risk.
