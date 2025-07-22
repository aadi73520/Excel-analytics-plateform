# 📊 Excel Analyzer Dashboard

A **Full Stack AI-powered Excel Analyzer Platform** where users can:

- Upload Excel files (.xlsx / .xls)
- Select chart type & category (2D/3D)
- Visualize data as **Pie, Bar, Line, etc.**
- Generate **AI Summary** of uploaded data for trends & insights
- Use **Light/Dark Mode** for better UI experience

---

## 🚀 Features

### ✅ User Panel

- **Excel Upload**  
- **Data Analysis & Visualization**
  - Chart Category: **2D / 3D**
  - Chart Type: **Pie, Bar, Line, etc.**
- **AI Summary Generator**
  - Get trends, analysis, and insights using OpenAI API
  
### 🔐 Admin Panel

- **User Management** (View/Delete Users)
- **File Management** (View/Download/Delete Files)
- **Audit Logs** (Track uploads, deletions, etc.)

### 🎨 UI

- **Dark Mode / Light Mode**
- Responsive Dashboard UI
- Clean & Modern Styling (Tailwind CSS)

---

## 🛠️ Tech Stack

| Frontend  | Backend |
|-----------|---------|
| React.js  | Node.js / Express.js |
| Tailwind CSS | MongoDB (Mongoose) |
| Redux Toolkit | JWT Authentication |
| Axios    | Redis (Token Blacklist) |
| Chart.js / Three.js | Multer (File Upload) |
| React Router | OpenAI API (AI Summary) |

---

## 📂 Project Structure
```
EXCEL-ANALYTICS/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── build/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
├── tailwind.config.js
└── postcss.config.js
```
## ⚙️ Installation Guide

### 1️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev   # Run backend
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev    # Run frontend
```

## 🔐 User Roles

| Role   | Features                                                                 |
|--------|--------------------------------------------------------------------------|
| **User**   | Upload Excel, Analyze Data, Select Charts, AI Summary                     |
| **Admin**  | All User Features + Manage Users, Manage Files, View Audit Logs           |

## 🧑‍💻 How It Works

1️⃣ **User Uploads Excel File**  
2️⃣ **Select Chart Category**  
&emsp;↳ _2D / 3D_  
3️⃣ **Select Chart Type**  
&emsp;↳ _Pie, Bar, Line, etc._  
4️⃣ **Click "Analyze"** to visualize data  
5️⃣ **Click "AI Summary"**  
&emsp;↳ _AI returns insights, trends & data summary_

## ✨ Features

- 📂 **Excel Upload & Storage**
- 📊 **Visualization with 2D / 3D Charts**
- 🤖 **AI Summary Generator using OpenAI**
- 🛠️ **Admin Panel**:
  - 👥 User Management  
  - 📁 File Management  
  - 🧾 Audit Logs
- 🌗 **Light/Dark Mode Toggle**
- 🔐 **Secure Authentication with JWT**

## 📦 Packages Used

| Frontend              | Backend                  |
|-----------------------|---------------------------|
| React.js              | Express.js                |
| Vite                  | MongoDB + Mongoose        |
| Tailwind CSS          | Redis                     |
| Redux Toolkit         | Multer                    |
| Chart.js / Three.js   | OpenAI API                |
| Axios                 | JWT Auth                  |
