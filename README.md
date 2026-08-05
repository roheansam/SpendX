💸 SpendX

A modern AI-powered personal finance tracker that helps users manage expenses, visualize spending, and gain smart financial insights.

SpendX is a full-stack personal finance management application built with Next.js, TypeScript, Supabase, Tailwind CSS, and Capacitor. It enables users to securely track income and expenses, analyze spending habits, and receive AI-powered financial insights through an intuitive, responsive interface.

🚀 Features

🔐 Authentication
Secure Google Sign-In
Email & Password Authentication
Protected Routes
User Profile Management
Session Persistence

📊 Dashboard
Financial Overview
Current Balance
Monthly Income
Monthly Expenses
Savings Summary
Recent Transactions
Quick Statistics
Beautiful Cards
Responsive Layout

💰 Expense Management
Add Expenses
Edit Expenses
Delete Expenses
Categorize Transactions
Add Notes
Date Tracking
Search Expenses
Filter Transactions
Sort Records

💵 Income Management
Add Income
Edit Income
Delete Income
Income Categories
Monthly Tracking
Income History

📈 Analytics
Expense Breakdown
Income vs Expense Analysis
Monthly Reports
Spending Trends
Category-wise Analysis
Financial Summary
Interactive Charts
Data Visualization

🤖 AI Features

SpendX includes AI-powered financial assistance that helps users:

Analyze spending habits
Detect unusual expenses
Suggest better budgeting
Provide personalized financial insights
Answer finance-related questions
Recommend saving strategies

⚙️ Settings
Dark Mode
Light Mode
Profile Settings
Account Management
Theme Switching

📱 Mobile App

Built using Capacitor, allowing the web application to run as a native Android application.

Features include:

Native Android APK
Mobile Optimized UI
Responsive Design
Touch Friendly Components
Native App Icon
Splash Screen

🛠️ Tech Stack
Frontend
Next.js 16
React
TypeScript
Tailwind CSS
Shadcn UI
Lucide React
Framer Motion
Backend
Supabase
Authentication
Supabase Auth
Google OAuth
Database
PostgreSQL (via Supabase)
Charts & Visualization
Recharts
Mobile
Capacitor
Android Studio
Deployment
Vercel

📂 Project Structure
SpendX
│
├── app/
│   ├── dashboard/
│   ├── expenses/
│   ├── analytics/
│   ├── settings/
│   ├── login/
│   └── signup/
│
├── components/
│
├── lib/
│
├── hooks/
│
├── public/
│
├── styles/
│
├── android/
│
├── capacitor.config.ts
│
├── package.json
│
└── README.md

📸 Screenshots

Add screenshots here.

Dashboard

Expenses

Analytics

Settings

Login Page

Mobile App

Example:

## Dashboard

![Dashboard](screenshots/dashboard.png)

## Analytics

![Analytics](screenshots/analytics.png)

⚡ Installation

Clone the repository

git clone https://github.com/pointbreak6888/SpendX.git

Go to the project

cd SpendX

Install dependencies

npm install

Run development server

npm run dev

Open

http://localhost:3000
🔧 Environment Variables

Create a .env.local

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

OPENAI_API_KEY=your_openai_api_key
📱 Android Build

Build the Next.js project

npm run build

Export

npx cap sync

Open Android Studio

npx cap open android

Generate APK from Android Studio.


🎨 UI Highlights
Modern Glassmorphism Design
Smooth Animations
Responsive Layout
Mobile-first Design
Clean Dashboard
Beautiful Cards
Dark Mode
Elegant Typography
Interactive Charts

🔒 Security
Secure Authentication
Protected API Routes
User Data Isolation
Environment Variables
Secure Database Access
OAuth Authentication

📊 Future Enhancements
AI Budget Planner
Recurring Transactions
Bill Reminders
Savings Goals
Investment Tracking
Multi-Currency Support
CSV/PDF Export
Voice Expense Entry
OCR Receipt Scanner
Family Expense Sharing
Notifications
Offline Mode
Expense Predictions
Smart Categorization
Financial Score

🤝 Contributing

Contributions are welcome!

Fork the repository
Create a feature branch
git checkout -b feature-name
Commit changes
git commit -m "Add new feature"
Push changes
git push origin feature-name
Open a Pull Request

🧪 Testing

Run the development server

npm run dev

Build the project

npm run build

Lint the project

npm run lint
