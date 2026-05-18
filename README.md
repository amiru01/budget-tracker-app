# 💰 Smart Finance

A modern personal finance management web app built with React and Firebase.
LIVE SITE : https://budget-tracker-app-58l5.vercel.app/
## ✨ Features

### 📊 Financial Tracking
- **Income Management** - Track all income sources with categories and dates
- **Expense Tracking** - Monitor spending across multiple categories
- **Budget Rules** - Set spending limits and get alerts when exceeded
- **Real-time Dashboard** - View financial overview with charts and statistics

### 🔔 Smart Notifications
- Budget violation alerts
- Spending pattern warnings
- Low savings rate notifications
- Automatic financial insights

### 📈 Reports & Analytics
- Monthly spending breakdown
- Category-wise expense analysis
- Income vs expense comparison
- Visual charts and graphs

### 👤 User Features
- Email/password authentication
- Google sign-in
- Personal profile management
- Multi-currency support
- Secure data isolation per user

### 📱 Progressive Web App
- Installable on mobile and desktop
- Offline-capable
- Responsive design
- Fast and lightweight

## 🚀 Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Auth, Firestore)
- **Charts:** Recharts
- **Icons:** Heroicons
- **Routing:** React Router

## 🛠️ Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🔐 Security

- User data is completely isolated by `userId`
- Firestore security rules enforce access control
- Environment variables for sensitive config
- Secure authentication with Firebase Auth

## 📄 License

MIT
