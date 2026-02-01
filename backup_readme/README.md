<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express-5.x-black?style=for-the-badge&logo=express" alt="Express" />
</p>

# 🚔 Police Malkhana - Evidence Management System

A comprehensive full-stack web application for managing police evidence (Malkhana) records, chain of custody tracking, and case documentation. Built with modern technologies for reliability, security, and ease of use.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication with HTTP-only cookies
- Role-based access control (Admin & Officer)
- Protected routes and session management

### 📋 Incident Management
- Register and track FIR-based incidents
- Link multiple evidence items to incidents
- Track incident status (ACTIVE/CLOSED)
- Comprehensive incident search and filtering

### 📦 Evidence Management
- Register evidence with detailed categorization
- Upload evidence photographs (Cloudinary integration)
- Auto-generated QR codes for evidence tracking
- Storage location tracking (Room/Rack/Compartment)
- Associated party tracking (Suspect/Victim/Unidentified)

### 🔄 Chain of Custody
- Complete custody transfer history
- Transfer purpose documentation
- Officer-wise custody tracking
- Timeline view of all transfers

### 📊 Analytics Dashboard
- Real-time statistics overview
- Monthly incident trends
- Evidence distribution by category
- Officer workload analysis

### 🔒 Case Closure
- Formal incident closure workflow
- Disposition method recording
- Court order documentation
- Audit trail maintenance

## 🏗️ Project Structure

```
PoliceEmalkhana/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── core/
│   │   │   ├── components/    # Shared UI components
│   │   │   ├── layout/        # App shell, navigation
│   │   │   ├── network/       # HTTP client (Axios)
│   │   │   ├── providers/     # Context providers
│   │   │   └── services/      # API service modules
│   │   ├── routes/            # Route definitions
│   │   ├── styles/            # Global CSS (Tailwind)
│   │   └── views/             # Page components
│   │       ├── auth/          # Login views
│   │       ├── closures/      # Closure forms
│   │       ├── dashboard/     # Analytics dashboard
│   │       ├── evidence/      # Evidence CRUD views
│   │       ├── incidents/     # Incident CRUD views
│   │       ├── staff/         # Staff management
│   │       └── transfers/     # Custody transfer views
│   └── package.json
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/            # Database & environment config
│   │   ├── infrastructure/    # Seeds, migrations
│   │   ├── modules/           # Feature modules
│   │   │   ├── closures/      # Closure handler, model, routes
│   │   │   ├── evidence/      # Evidence handler, model, routes
│   │   │   ├── incidents/     # Incident handler, model, routes
│   │   │   ├── reports/       # Analytics & reporting
│   │   │   ├── staff/         # Staff/User management
│   │   │   └── transfers/     # Custody transfer module
│   │   └── shared/            # Shared utilities
│   │       ├── middleware/    # Auth, error, upload middleware
│   │       ├── services/      # Cloudinary service
│   │       └── utils/         # Response helpers, error classes
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB** (Local or Atlas)
- **Cloudinary** account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/PoliceEmalkhana.git
cd PoliceEmalkhana
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://your_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=7d
COOKIE_NAME=accessToken

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed the admin user:

```bash
npm run seed:admin
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` folder:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Start the development server:

```bash
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/v1

**Default Admin Credentials:**
- Badge Number: `ADMIN001`
- Password: `admin123`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/staff/authenticate` | Login |
| POST | `/api/v1/staff/logout` | Logout |
| GET | `/api/v1/staff/me` | Get current user |

### Staff Management (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/staff/register` | Register new staff |
| GET | `/api/v1/staff` | List all staff |

### Incidents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/incidents` | List all incidents |
| POST | `/api/v1/incidents` | Create incident |
| GET | `/api/v1/incidents/:id` | Get incident details |

### Evidence
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/evidence` | List all evidence |
| POST | `/api/v1/evidence` | Register evidence |
| GET | `/api/v1/evidence/:id` | Get evidence details |
| GET | `/api/v1/incidents/:id/evidence` | Get evidence by incident |

### Transfers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/transfers` | Record transfer |
| GET | `/api/v1/transfers/evidence/:evidenceId` | Get custody history |

### Closures (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/closures` | Close incident |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/overview` | Dashboard analytics |

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite 7** - Build Tool
- **React Router 7** - Navigation
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime
- **Express 5** - Web Framework
- **MongoDB + Mongoose 9** - Database
- **JWT** - Authentication
- **Cloudinary** - Image Storage
- **QRCode** - QR Generation
- **bcryptjs** - Password Hashing

## 🎨 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Login Page
Modern, responsive login interface with dark mode support.

### Dashboard
Real-time analytics with charts showing incident trends and evidence distribution.

### Evidence Registration
Comprehensive form with image upload and auto-generated QR codes.

### Custody Chain
Timeline view showing complete chain of custody for each evidence item.

</details>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👩‍💻 Author

**Aditi Raj**
- 📧 Email: aditiraj2024ugcs016@nitsri.ac.in
- 🎓 NIT Srinagar - B.Tech Computer Science

---

<p align="center">
  Made with ❤️ for Police Evidence Management
</p>



