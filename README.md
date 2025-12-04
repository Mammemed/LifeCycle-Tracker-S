# LifeCycle Tracker

A web application to track and visualize the lifecycle of entities (articles, projects, proposals, etc.) with states, transitions, versions, contributors, comments, and statistics.

## 🏗️ Project Structure

```
LifeCycle/
├── backend/          # Express.js API server
├── frontend/         # Next.js 14 App Router + TypeScript
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (optional - can use MongoDB Atlas or local MongoDB)
- npm or yarn

### Quick Start (Windows PowerShell)

**Option 1: Démarrage automatique (recommandé)**
```powershell
.\start-all.ps1
```

**Option 2: Démarrage manuel**

Ouvrez **deux terminaux PowerShell** :

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Installation des Dépendances

Si vous n'avez pas encore installé les dépendances :

```powershell
# Installer toutes les dépendances
cd backend
npm install
cd ../frontend
npm install
```

Ou utilisez le script racine :
```powershell
npm run install:all
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults are provided):
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/lifecycle-tracker
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

**Note:** If MongoDB is not available, the server will still start but database operations will return empty results or error messages. For a quick demo, you can use MongoDB Atlas (free tier) or install MongoDB locally.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure Details

### Backend (`/backend`)

- **`server.js`** - Express app entry point
- **`config.js`** - Configuration (MongoDB URI, port, etc.)
- **`models/`** - Mongoose models (Entity model)
- **`controllers/`** - Request handlers (entity, statistics, reports)
- **`routes/`** - API route definitions
- **`middleware/`** - Express middleware (error handler, request logger)
- **`utils/`** - Utility functions (statistics computation)

### Frontend (`/frontend`)

- **`app/`** - Next.js App Router pages
  - `dashboard/` - Main dashboard with entity list and KPIs
  - `entities/new/` - Create new entity
  - `entities/[id]/` - Entity details page
  - `entities/[id]/compare/` - Version comparison
  - `statistics/` - Analytics and visualizations
- **`components/`** - React components
  - `EntityCard.tsx` - Entity card component
  - `StatusBadge.tsx` - Status badge with colors
  - `Timeline.tsx` - Status history timeline
  - `Charts/` - Chart components (pie, bar, heatmap)
  - `Layout/` - Layout components (sidebar, topbar)
- **`lib/api.ts`** - API client functions

## 🎯 Features

### Core Features

- ✅ Create and manage entities (articles, projects, proposals, etc.)
- ✅ Track status transitions with history
- ✅ Version management
- ✅ Contributors tracking
- ✅ Comments and feedback
- ✅ Statistics and analytics
- ✅ Visualizations (pie charts, bar charts, heatmaps)
- ✅ Export reports (CSV, PDF placeholder)

### API Endpoints

#### Entities
- `GET /api/entities` - List all entities
- `POST /api/entities` - Create new entity
- `GET /api/entities/:id` - Get entity details
- `PATCH /api/entities/:id/status` - Change status
- `POST /api/entities/:id/comments` - Add comment
- `POST /api/entities/:id/versions` - Create version
- `GET /api/entities/:id/versions` - Get versions
- `GET /api/entities/:id/versions/compare` - Compare versions

#### Statistics
- `GET /api/statistics/summary` - Get summary KPIs
- `GET /api/statistics/analytics` - Get detailed analytics

#### Reports
- `GET /api/reports/export/csv` - Export CSV
- `GET /api/reports/export/pdf` - Export PDF (placeholder)

## 🎨 UI Pages

1. **Dashboard** (`/dashboard`) - Overview of all entities with KPIs
2. **New Entity** (`/entities/new`) - Create a new entity
3. **Entity Details** (`/entities/[id]`) - Full entity details, timeline, versions, comments
4. **Version Comparison** (`/entities/[id]/compare`) - Compare two versions
5. **Statistics** (`/statistics`) - Analytics and visualizations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **State Management**: React hooks, Context API (simple)

## 📝 Usage Example

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Click "New Entity" to create your first entity
4. Fill in the form and save
5. On the entity details page, change status, add comments, create versions
6. View statistics on the Statistics page
7. Compare versions using the Compare page

## 🔧 Development

### Backend
- Uses `nodemon` for auto-reload during development
- MongoDB connection is optional (graceful fallback)

### Frontend
- Next.js hot reload enabled
- TypeScript for type safety
- Tailwind CSS for styling

## 📦 Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Frontend
- `next` - React framework
- `react` & `react-dom` - UI library
- `axios` - HTTP client
- `recharts` - Chart library
- `tailwindcss` - CSS framework

## 🐛 Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running or update `MONGO_URI` in backend config
- **CORS errors**: Backend has CORS enabled, but check if ports match
- **API errors**: Ensure backend is running on port 5000 (or update frontend API URL)

## 📄 License

This is a hackathon/student project. Feel free to use and modify as needed.

## 👥 Contributing

This is a demo project for a hackathon challenge. Contributions and improvements are welcome!

