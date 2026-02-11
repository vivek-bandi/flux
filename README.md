# Flux - AI Finance Tracker

An AI-powered expense tracking application with natural language interface built using Next.js, Tambo SDK, Drizzle ORM, and Supabase.

## Features

- Natural language interface for recording expenses via voice or text
- Real-time budget management with category-wise tracking and visual progress
- Automated overspending detection and alerts
- Monthly spending analytics and transaction history
- Row-level security ensuring data isolation per user
- AI-generated UI components based on conversation context
- Fully responsive design

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 18, TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM with auto-generated migrations
- **Auth:** Supabase Authentication
- **AI SDK:** Tambo AI React SDK for generative UI
- **Styling:** Tailwind CSS v4

## Setup

### Prerequisites

- Node.js 18+
- Supabase account
- Tambo API key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/vivek-bandi/flux.git
cd flux
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

Create `.env.local` file:

```env
# Tambo AI
NEXT_PUBLIC_TAMBO_API_KEY=tambo_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
DATABASE_URL=postgres://postgres:[PASSWORD]@[HOST]:6543/postgres
```

> **Note:** Use the Transaction Pooler connection string (port 6543) from Supabase Settings → Database → Connection string → URI

4. **Set up database**

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations
npm run db:migrate

# Initialize RLS policies
npm run db:init
```

5. **Start development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Tables

**user_profiles**
- Stores user information (name, email, notes)
- Unique constraint on email

**expenses**
- Tracks all expense transactions
- Indexed on (user_id, date) for fast queries
- Positive amount constraint

**budgets**
- Monthly budget limits per category
- Unique constraint: one budget per user/category/month
- Indexed on (user_id, month)

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- JWT claims used for auth context in queries

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run check-types  # TypeScript type checking

# Database
npm run db:generate  # Generate migrations from schema
npm run db:migrate   # Apply migrations
npm run db:init      # Setup RLS policies
```

### Project Structure

```
src/
├── app/                    # Next.js app router
│  Development      # Root layout
├── components/
│   ├── tambo/             # AI components
│   │   ├── finance-dashboard.tsx
        ├── schema.ts      # Drizzle schema
        ├── migrate.ts     # Migration runner
        └── init.ts        # RLS setup
```

## 🎯 Key Learnings

- **User-scoped AI Tools:** Tools are created with bound `userId` since server actions called through Tambo don't have cookie access
- **Component Self-fetching:** Components fetch their own data to prevent redundant AI narration
- **RLS with Drizzle:** Setting JWT claims via `set_config` enables Row Level Security with custom auth context
- **Generative UI Pattern:** Using `associatedTools` to link AI tool calls with React components

## 🔐 Security Features

- Email/password authentication via Supabase
- Middleware-protected routes
- Row Level Security at database level
- Input validation with Zod schemas
- Check constraints on database (positive amounts, unique budgets)
Architecture Highlights

- **User-scoped AI Tools:** Server actions bind `userId` at tool creation for secure context
- **Component Self-fetching:** Components independently fetch data to prevent redundant AI responses
- **RLS with Drizzle:** JWT claims via `set_config` enable Row Level Security with custom auth context
- **Generative UI:** `associatedTools` pattern links AI tool calls with React components

## Security

- Email/password authentication via Supabase
- Middleware-protected routes at edge
- Row Level Security enforced at database level
- Input validation using Zod schemas
- Database constraints for data integrity