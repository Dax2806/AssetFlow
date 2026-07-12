# 🚀 AssetFlow – Enterprise Asset & Resource Management System

> A modern Enterprise Asset & Resource Management System built for the **Odoo India Hackathon**.

AssetFlow simplifies how organizations register, allocate, monitor, maintain, and audit physical assets and shared resources through a centralized, modern ERP platform.

Designed with a clean enterprise experience, AssetFlow replaces spreadsheets and manual processes with an intuitive workflow-driven system suitable for companies, educational institutions, hospitals, government organizations, factories, and offices.

---

## ✨ Overview

Managing physical assets across an organization is often fragmented and inefficient.

AssetFlow provides a centralized platform to:

- 📦 Track asset lifecycle
- 👥 Allocate assets to employees
- 🔄 Manage transfers and returns
- 📅 Book shared resources
- 🛠️ Handle maintenance workflows
- ✅ Conduct audit cycles
- 📊 Generate analytics
- 🔔 Notify users about important events

The application follows modern ERP principles with role-based access control, reusable modules, and an enterprise-grade UI.

---

# 🎯 Problem Statement

Organizations often rely on spreadsheets or manual logs to manage physical assets and shared resources.

This results in:

- Duplicate allocations
- Lost assets
- Scheduling conflicts
- Poor maintenance tracking
- Difficult audits
- Lack of visibility

AssetFlow digitizes the complete asset lifecycle while providing a scalable ERP architecture.

---

# 🏗️ Key Features

## 🔐 Authentication

- Employee Signup
- Secure Login
- Forgot Password
- Role-based Authentication

---

## 📊 Dashboard

- Real-time KPIs
- Asset Overview
- Upcoming Returns
- Active Bookings
- Pending Transfers
- Recent Activity
- Operational Insights

---

## 🏢 Organization Management

- Department Management
- Employee Directory
- Asset Categories
- Department Hierarchy
- Role Assignment

---

## 📦 Asset Management

- Register Assets
- Asset Directory
- Asset Search
- QR Code Support
- Asset Timeline
- Asset Health Score
- Documents & Images

---

## 🔄 Allocation & Transfer

- Asset Allocation
- Conflict Detection
- Transfer Workflow
- Return Workflow
- Allocation History
- Overdue Tracking

---

## 📅 Resource Booking

- Calendar View
- Availability Check
- Conflict Detection
- Shared Resources
- Booking Management

---

## 🛠️ Maintenance

- Raise Requests
- Approval Workflow
- Technician Assignment
- Repair Timeline
- Maintenance History

---

## ✅ Asset Audit

- Audit Cycles
- Auditor Assignment
- Asset Verification
- Discrepancy Reports
- Audit History

---

## 📈 Reports & Analytics

- Asset Utilization
- Department Allocation
- Maintenance Trends
- Booking Analytics
- Export Reports

---

## 🔔 Notifications

- Asset Assignment
- Booking Reminders
- Maintenance Updates
- Transfer Approvals
- Audit Alerts
- Activity Timeline

---

# 👥 User Roles

| Role | Responsibilities |
|-------|------------------|
| Admin | Manage organization, departments, categories, employees and analytics |
| Asset Manager | Register assets, approve maintenance, transfers and returns |
| Department Head | Manage departmental assets and approvals |
| Employee | Book resources, request maintenance, initiate returns and transfers |

---

# 🏛️ Asset Lifecycle

```
Available
    ↓
Allocated
    ↓
Reserved
    ↓
Under Maintenance
    ↓
Available
    ↓
Retired
    ↓
Disposed
```

---

# 🔄 Workflow

```
Organization Setup

↓

Register Assets

↓

Allocate Assets

↓

Book Resources

↓

Maintenance

↓

Audit

↓

Reports & Analytics

↓

Notifications
```

---

# 🛠️ Tech Stack

### Frontend

- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide Icons

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT Authentication
- Role-Based Access Control

### Deployment

- Vercel / Netlify (Frontend)
- Render / Railway (Backend)

---

# 🎨 Design Principles

AssetFlow follows a modern enterprise SaaS design language inspired by premium productivity platforms.

Design goals:

- Clean
- Minimal
- Consistent
- Responsive
- Accessible
- Enterprise-focused

---

# 📁 Project Structure

```
AssetFlow/

├── client/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── services/
│   └── assets/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

---

# 📸 Screenshots

Add screenshots here:

- Landing Page
- Dashboard
- Organization Setup
- Asset Directory
- Allocation
- Booking
- Maintenance
- Audit
- Reports

---

# 🌟 Future Enhancements

- Barcode Scanner
- AI-powered Asset Insights
- Predictive Maintenance
- Mobile Application
- Email Notifications
- Calendar Integration
- Multi-Organization Support
- Offline Mode

---

# 🤝 Team

Developed for the **Odoo India Hackathon**.

---

# 📄 License

This project was developed for the **Odoo India Hackathon**.

---

# ❤️ Thank You

Thank you for reviewing AssetFlow.

We hope AssetFlow demonstrates how modern ERP systems can simplify enterprise asset and resource management through intuitive workflows, clean architecture, and exceptional user experience.
