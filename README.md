# Forensic Case Management System (Forensic CMS)

A full-stack web-based Forensic Case Management System designed to manage digital forensic investigations efficiently. The system enables investigators to create cases, upload evidence, maintain chain of custody, and track actions through immutable audit logs.

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Roadmap](#-roadmap)

---

## ✨ Features

### Core Functionality
* **🗂️ Case Management**: Create and manage forensic investigation cases, assign investigators, and track statuses (open, closed, pending).
* **📁 Evidence Management**: Upload evidence files (disk images, memory dumps, logs) with automatic **SHA-256 hash generation** for integrity verification.
* **🔗 Chain-of-Custody Tracking**: Maintain a complete history of every evidence item to document who accessed it and when for legal compliance.
* **📊 Audit Logging**: Comprehensive, append-only logging of all system actions (CRUD operations) for accountability.

### 🔐 Security Features
* JWT token-based authentication.
* Role-based access control (Admin / Investigator).
* Bcrypt password hashing.
* Secure file upload with validation and CORS protection.
* SQL injection prevention through SQLAlchemy ORM.

### 🎨 Modern UI/UX
* Responsive design for mobile, tablet, and desktop.
* Intuitive workflows with real-time form validation.
* Professional interface built with Tailwind CSS.

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **FastAPI** | 0.104+ | REST API framework |
| **Python** | 3.9+ | Programming language |
| **PostgreSQL** | 14+ | Relational database |
| **SQLAlchemy** | 2.0 | ORM for database operations |
| **Pydantic** | 2.5+ | Data validation |
| **JWT** | - | Authentication tokens |
| **Uvicorn** | 0.24+ | ASGI server |
| **Passlib** | 1.7+ | Password hashing |

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 18+ | UI framework |
| **Vite** | - | Build tool |
| **Tailwind CSS** | - | Styling framework |
| **Axios** | - | HTTP client |
| **React Router** | 6+ | Client-side routing |

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│              (React.js Frontend Application)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS (REST API)
                         │ JSON Data Exchange
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│                  (FastAPI Backend Server)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQLAlchemy ORM
                         │
┌────────────────────────▼────────────────────────────────────┐
│                       DATA LAYER                             │
│                  (PostgreSQL Database)                       │
└─────────────────────────────────────────────────────────────┘
```
## 📦 Installation

### Prerequisites
Before you begin, ensure you have the following installed on your system:

- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Git**

---

### 🚀 Quick Start

#### Clone the Repository

```bash
git clone https://github.com/yourusername/forensic-cms.git
cd forensic-cms
```
#### Backend Setup
```bash
cd backend
```
#### Create virtual environment
```bash
python3 -m venv venv
```
#### Activate virtual environment
#### On Linux/Mac:
```bash
source venv/bin/activate
```
#### On Windows:
```bash
venv\Scripts\activate
```
#### Install dependencies
```bash
pip install -r requirements.txt
```
#### Database Setup

Log into your PostgreSQL terminal (psql) and run the following commands:
```bash
CREATE DATABASE forensic_cms;
CREATE USER forensic_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE forensic_cms TO forensic_user;
```
#### Configure Environment Variables

Create a file named .env in the backend/ directory and add the following:
```bash
DATABASE_URL=postgresql://forensic_user:your_secure_password@localhost/forensic_cms
SECRET_KEY=your_generated_hex_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIRECTORY=./uploads
MAX_FILE_SIZE=104857600
```
### Start Servers

Backend
```bash
uvicorn app.main:app --reload
```

Frontend
```bash
cd frontend
npm install
npm run dev
```
## 🚀 Usage
#### Basic Workflow

#### Register / Login:
Access the frontend URL and create an investigator account to receive your JWT token.

#### Create a Case:
Start a new investigation by assigning a unique case number (e.g., CASE-2025-001) and description.

#### Upload Evidence:
Upload digital evidence files. The system automatically computes a SHA-256 hash to ensure data integrity.

#### Chain of Custody:
Navigate to the evidence details to view a timestamped timeline of every investigator who has accessed or modified the item.

#### Audit Logs:
Administrators can access the audit trail to review all system-wide activities for legal and compliance auditing.

## 📚 API Documentation

Once the backend server is running, you can access the interactive API documentation:
```bash
Swagger UI: http://localhost:8000/docs
(Best for interactive testing)

ReDoc: http://localhost:8000/redoc
(Best for clean, structured reading)
```
---

## 🗄️ Database Schema

The system uses a relational PostgreSQL schema to ensure data integrity and track relationships between investigators, cases, and evidence.

### Entity Relationship Overview
* **investigators (1) ──────< (N) cases**: One investigator can be assigned to multiple cases.
* **cases (1) ──────< (N) evidence_items**: A single case contains multiple evidence files.
* **evidence_items (1) ──────< (N) chain_of_custody**: Each piece of evidence has its own unique history.
* **investigators (1) ──────< (N) audit_logs**: All administrative actions are linked to the user who performed them.

### Main Tables
| Table | Key Fields | Description |
| :--- | :--- | :--- |
| **investigators** | `id`, `username`, `email`, `role` | Stores user profiles and authentication data. |
| **cases** | `id`, `case_number`, `status` | Stores high-level investigation details. |
| **evidence_items** | `id`, `hash_sha256`, `file_path` | Stores file metadata and integrity hashes. |
| **chain_of_custody** | `id`, `action`, `timestamp` | Detailed history of evidence handling. |
| **audit_logs** | `id`, `action`, `entity_type` | Immutable system-wide activity logs. |



---

## 🐛 Troubleshooting

### Common Backend Issues
* **Database connection error**: Ensure the PostgreSQL service is running (`sudo service postgresql start`) and verify your `DATABASE_URL` in the `.env` file.
* **Port 8000 already in use**: Kill the existing process using `lsof -i :8000` or change the port in the Uvicorn command.
* **Module not found**: Ensure your virtual environment is activated (`source venv/bin/activate`) before running the app.

### Common Frontend Issues
* **CORS error**: Check `backend/app/main.py` to ensure `allow_origins` includes your frontend URL (e.g., `http://localhost:5173`).
* **API Connection**: Verify `VITE_API_URL` is set correctly in your frontend `.env` file.

---

## 📄 License

**MIT License**

Copyright (c) 2025 Forensic CMS

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

---

## 📊 Project Status

* **Current Version**: 1.0.0
* **Last Updated**: December 2025
* **Status**: Active Development

<div align="center">
  ⭐ If you find this project useful, please consider giving it a star!
</div>
