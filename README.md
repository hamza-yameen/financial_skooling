# Financial Skool

A practical, self-paced financial education platform featuring PDF field manuals, quantitative risk simulators, and dedicated student and administrator management dashboards.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack) & React 19
- **Database & ORM:** PostgreSQL & Prisma ORM v7 (with `@prisma/adapter-pg`)
- **Styling:** Tailwind CSS v4
- **Process Manager:** PM2
- **Language:** TypeScript 5

---

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create or update your `.env` file based on `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/f_skool_db"
PORT=3055
```

### 3. Database Migrations & Seeding

Run migrations to set up database tables:
```bash
pnpm db:migrate
```
*(Or push schema directly: `pnpm db:push`)*

Seed initial categories, courses, lessons, and demo accounts:
```bash
pnpm db:seed
```

**Run both in one command:**
```bash
pnpm db:migrate && pnpm db:seed
```

*(Optional)* Open Prisma Studio to browse and inspect database records in your browser:
```bash
pnpm db:studio
```

---

## Running the Application

### Development Server

Launches the app on **http://localhost:3055** with hot-reloading:

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

### Running with PM2 (Background Daemon)

If PM2 is not installed on your system:
```bash
npm install -g pm2
```

Build and launch the application under PM2 on port 3055:
```bash
pnpm build
pnpm pm2:start
```

**PM2 Management Commands:**

```bash
pnpm pm2:status    # Check running process status
pnpm pm2:logs      # Stream real-time logs
pnpm pm2:restart   # Restart the application
pnpm pm2:stop      # Stop the process
```

To enable PM2 auto-restart on machine boot:
```bash
pm2 startup
pm2 save
```

---

## Default Seeded Accounts

After running `pnpm db:seed`, you can log in with:

| Role | Email | Password | Access Route |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@finskool.com` | `FinSkool@2026!` | `/admin` |
| **Student** | `student@finskool.com` | `FinSkool@2026!` | `/student/dashboard` |

---

## All Available Scripts

| Script | Description |
| :--- | :--- |
| `pnpm dev` | Start development server on port 3055 |
| `pnpm build` | Create optimized production build |
| `pnpm start` | Start production server on port 3055 |
| `pnpm db:migrate` | Run and apply Prisma migrations |
| `pnpm db:push` | Push schema directly to database |
| `pnpm db:seed` | Seed database with initial courses and users |
| `pnpm db:studio` | Open Prisma Studio GUI |
| `pnpm pm2:start` | Start app under PM2 on port 3055 |
| `pnpm pm2:stop` | Stop PM2 process |
| `pnpm pm2:restart` | Restart PM2 process |
| `pnpm pm2:logs` | View real-time PM2 logs |
| `pnpm pm2:status` | View PM2 status table |
| `pnpm lint` | Run ESLint code checks |
