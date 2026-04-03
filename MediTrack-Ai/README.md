# 🏥 MediTrack AI

**AI-Powered Medication Adherence & Health Tracking System**

MediTrack AI helps patients stay on top of their medication schedules with smart reminders, prescription scanning (OCR), drug interaction checks, adherence analytics, and caretaker notifications via SMS/WhatsApp.

---

## 📁 Project Structure

```
MediTrack-Ai/
├── App/                    # React Native (Expo) Mobile App
│   ├── src/
│   │   ├── screens/        # Home, Scanner, Medicine, Analytics, Caretaker, Auth, etc.
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API client, background monitoring, SMS, notifications
│   │   ├── navigation/     # Tab & stack navigators
│   │   ├── theme/          # Colors, typography, spacing
│   │   └── data/           # Static data / lookups
│   ├── assets/             # Icons, splash screens
│   ├── app.json            # Expo config
│   └── package.json        # JS dependencies
│
├── Backend/                # Python Flask REST API
│   ├── routes/             # auth, medicines, reminders, doses, scanner, analytics, etc.
│   ├── models/             # DB models (User, Medicine, Dose, Reminder, Alert, Caretaker)
│   ├── ml/                 # ML modules (adherence prediction, OCR, drug interactions, AI insights)
│   ├── database/           # MySQL schema auto-creation
│   ├── utils/              # Auth middleware, Twilio SMS/WhatsApp, helpers
│   ├── config.py           # Environment-based configuration
│   ├── app.py              # Flask entry point
│   └── requirements.txt    # Python dependencies
│
└── .gitignore
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Email/password signup & login with JWT tokens |
| 💊 **Medicine Management** | Add, edit, track medicines with schedules & refill alerts |
| 📸 **Prescription Scanner** | OCR-powered scanning using Tesseract to extract medicine info from images |
| ⏰ **Smart Reminders** | Adaptive reminders that learn from your behavior patterns |
| 📊 **Analytics Dashboard** | Adherence trends, risk scoring, monthly reports, AI insights |
| ⚠️ **Drug Interactions** | Automatic checks for dangerous drug combinations |
| 🔔 **Background Monitoring** | Tracks missed doses in the background; auto-alerts after 3 misses |
| 👨‍👩‍👦 **Caretaker Alerts** | SMS / WhatsApp notifications to caretakers via Twilio |
| 📱 **QR Codes** | Generate & scan QR codes for quick medicine identification |
| 🩺 **Health Logging** | Track steps and sleep alongside medication data |

---

## 🛠️ Prerequisites

Make sure you have the following installed **before** starting:

| Tool | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18.x | Run the Expo app |
| **npm** | ≥ 9.x | Package manager (comes with Node) |
| **Python** | ≥ 3.9 | Run the Flask backend |
| **pip** | Latest | Python package manager |
| **MySQL** | ≥ 8.0 | Database |
| **Tesseract OCR** | ≥ 4.x | Prescription image scanning |
| **Expo CLI** | Latest | Build & run the mobile app |
| **Expo Go** app | Latest | Run app on physical device (iOS/Android) |

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd MediTrack-Ai
```

---

### 2. Backend Setup (Flask API)

#### 2a. Create a Python virtual environment

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate          # Windows
```

#### 2b. Install Python dependencies

```bash
pip install -r requirements.txt
```

#### 2c. Install Tesseract OCR

```bash
# macOS (Homebrew)
brew install tesseract

# Ubuntu / Debian
sudo apt-get install tesseract-ocr

# Windows — download installer from:
# https://github.com/UB-Mannheim/tesseract/wiki
```

#### 2d. Install & Start MySQL

```bash
# macOS (Homebrew)
brew install mysql
brew services start mysql

# Ubuntu / Debian
sudo apt-get install mysql-server
sudo systemctl start mysql

# Windows — download MySQL Installer from:
# https://dev.mysql.com/downloads/installer/
```

Create the database (the app auto-creates it, but you can also do it manually):

```bash
mysql -u root -p
# Then in the MySQL shell:
CREATE DATABASE IF NOT EXISTS meditrack_ai;
EXIT;
```

#### 2e. Configure environment variables

Create a `.env` file inside the `Backend/` folder:

```bash
touch .env
```

Add the following content (update with your actual values):

```env
# ─── MySQL Database ────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=meditrack_ai

# ─── JWT Secret ────────────────────────────────────
SECRET_KEY=your-secret-key-here
JWT_EXPIRY_HOURS=24

# ─── Twilio (optional — for SMS/WhatsApp alerts) ──
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_NUMBER=+1234567890
```

#### 2f. Start the backend server

```bash
python app.py
```

> The server will auto-create all database tables on first startup.
> By default it runs on **http://localhost:5001**.

---

### 3. Frontend Setup (Expo React Native App)

#### 3a. Install Node.js dependencies

```bash
cd App
npm install
```

#### 3b. Update the API base URL

Open `App/src/services/api.js` and set the `BASE_URL` to your backend's IP address:

```javascript
// Replace with your machine's local IP (not localhost) for physical devices
const BASE_URL = 'http://<YOUR_LOCAL_IP>:5001/api';
```

> **Tip:** Find your local IP with `ifconfig` (macOS/Linux) or `ipconfig` (Windows).

#### 3c. Start the Expo development server

```bash
npx expo start
```

Then:
- **Physical device:** Scan the QR code with the **Expo Go** app.
- **Android emulator:** Press `a` in the terminal.
- **iOS simulator:** Press `i` in the terminal (macOS only).

---

## 📦 Quick Start (Summary)

```bash
# ── Terminal 1: Backend ──────────────────────────
cd Backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# (Create .env file with your DB credentials)
python app.py

# ── Terminal 2: Frontend ─────────────────────────
cd App
npm install
npx expo start
```

---

## 🔌 API Endpoints

Once the backend is running, visit **http://localhost:5001** for the full endpoint list. Key endpoints:

| Category | Endpoints |
|---|---|
| **Auth** | `POST /api/auth/signup`, `POST /api/auth/login` |
| **Medicines** | `GET /api/medicines`, `POST /api/medicines`, `GET /api/medicines/refills` |
| **Reminders** | `GET /api/reminders`, `POST /api/reminders/adaptive` |
| **Doses** | `POST /api/doses/log`, `GET /api/doses/today` |
| **Dashboard** | `GET /api/dashboard` |
| **Analytics** | `GET /api/analytics`, `GET /api/analytics/insights`, `GET /api/analytics/risk` |
| **Scanner** | `POST /api/scanner/scan`, `POST /api/scanner/confirm` |
| **QR** | `GET /api/qr/generate/:id`, `POST /api/qr/scan` |
| **Interactions** | `POST /api/interactions/check`, `POST /api/interactions/check-new` |
| **Caretaker** | `GET /api/caretaker/patients`, `GET /api/caretaker/alerts` |
| **Health** | `POST /api/health/log`, `GET /api/health/today` |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Mobile App** | React Native 0.81 + Expo SDK 54 |
| **Backend API** | Python 3 + Flask 3.1 |
| **Database** | MySQL 8+ |
| **Auth** | JWT (PyJWT) + Bcrypt |
| **OCR** | Tesseract via pytesseract + Pillow |
| **ML** | scikit-learn, NumPy, Pandas |
| **Notifications** | Expo Notifications + Expo Background Fetch |
| **SMS/WhatsApp** | Twilio API |
| **Navigation** | React Navigation (stack + bottom tabs) |

---

## 🐞 Troubleshooting

| Issue | Solution |
|---|---|
| `mysql.connector` connection error | Ensure MySQL is running and `.env` credentials are correct |
| Tesseract not found | Install Tesseract and ensure it's in your system `PATH` |
| Expo app can't reach backend | Use your machine's **local IP** (not `localhost`) in `api.js` |
| `npm install` fails | Delete `node_modules/` and `package-lock.json`, then retry |
| Python package install fails | Make sure you're inside the virtual environment (`source venv/bin/activate`) |

---

## 📄 License

This project is for educational / personal use.

---

> Built with ❤️ using React Native, Flask, and AI/ML
