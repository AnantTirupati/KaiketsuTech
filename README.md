# KaiketsuTech — Premium Enterprise Software Agency Platform

KaiketsuTech is a high-performance Next.js 16 application designed as a premium, secure portal for a software engineering agency. The platform streamlines interactions between **Clients** requesting bespoke software, **Interns** developing deliverables, and **Administrators** managing engineering leads, projects, budgets, and cohort performance.

---

## 💎 Core Capabilities

### 1. Unified Authentication System
* **Clean Routes**: Standardized pathways under `/login`, `/register`, and `/forgot-password` wrapping reusable forms.
* **Role Selection**: Candidates can register as a **Client** or an **Intern**. This is handled securely via Supabase Auth metadata, auto-provisioning profiles in the database.
* **Google OAuth**: Integrated OAuth login flow with Supabase Auth providers.
* **Role-Based Protection**: Dynamic route guarding using Next.js Middleware to enforce permissions:
  * `/dashboard/admin/*` — Restricted to Administrator accounts.
  * `/dashboard/client/*` — Restricted to Client partners.
  * `/dashboard/intern/*` — Restricted to Internship squad members.

### 2. Client Workspace (`/dashboard/client`)
* **Overview Dashboard**: High-level telemetry showing active project metrics and outstanding invoice totals.
* **Bespoke Request Wizard (`/request-project`)**: A structured 4-step wizard form to submit company specs, target timelines, urgency priority, and attachments.
* **Secure Document Space**: Direct integration with Supabase Storage (`project-files` bucket) allowing clients to upload, list, download, and delete project files.
* **Engineering Comms**: Project-based real-time chat polling with administrator accounts.
* **Ledger Audits**: Detailed invoicing and payment records showing transaction details from Razorpay.

### 3. Intern Workspace (`/dashboard/intern`)
* **Kanban Sprint Board**: Interactive column boards (To Do, In Progress, Done) to manage assigned tasks and shift statuses.
* **Allocated Projects**: Review assigned project specs.
* **Deliverable Uploads**: Upload completed deliverables (code zip bundles, assets, or blueprints) directly to the private `deliverables` storage bucket.
* **Performance Logs**: Tracks completed tasks count, deadline met ratios, and rating scores.
* **Admin chat**: Dedicated message threads to communicate with administration leads.

### 4. Admin Console (`/dashboard/admin`)
* **System Analytics**: Track revenue metrics (completed transactions), active project counts, clients, and intern numbers.
* **Lead Ingestion**: Review incoming client requests with tools to Approve (auto-provisions a project record) or Reject leads.
* **Project Engine**: Provision projects, assign specific tasks directly to interns, modify progress statuses, and delete projects.
* **Ledger Audit**: Full monitor of all successful Razorpay checkout records.
* **Internship Cohort**: Review career applications, download signed-URL resumes securely, and track intern ratings.

### 5. Career Center (`/careers` & `/apply`)
* **Careers Landing**: Highlights active roles (Software Engineer, Product Design, Solutions Architect) and core technology stacks.
* **Apply Portal**: Structured application form supporting secure resume uploads (stored in the private `resumes` storage bucket) and candidate entries in `intern_applications`.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (Turbopack compiler), TypeScript, Tailwind CSS, Lucide Icons
* **Backend & API**: Next.js App Router (Route Handlers & Server Actions)
* **Database**: Supabase PostgreSQL
* **Storage**: Supabase Storage (Private and Public buckets)
* **Security**: PostgreSQL Row Level Security (RLS) policies
* **Payments**: Razorpay Node SDK & Client Checkout integrations

---

## 🗄️ Database Architecture & Storage Schema

The database includes the following tables and triggers:
* **`profiles`**: Stores user metadata and roles (`admin`, `client`, `intern`). Promotes role upgrades.
* **`project_requests`**: Log of all inbound project requests (leads).
* **`projects`**: Active agency projects containing budgets, timelines, and velocity stats.
* **`tasks`**: Project tasks assigned to interns.
* **`milestones`**: Key checkpoints for projects.
* **`conversations` & `messages`**: Messaging records supporting project-based communications.
* **`payments`**: Razorpay invoices and receipt records.
* **`intern_applications`**: Registered job applications.
* **Trigger (`on_auth_user_created`)**: Listens to Supabase Auth sign-ups and automatically creates matching profile records.

### Storage Buckets Structure
* **`resumes`**: Private bucket storing candidate resumes. Accessible only by administrators via secure signed URLs.
* **`project-files`**: Private bucket for client documentation. Access restricted to owners and administrators.
* **`deliverables`**: Private bucket for code handovers.
* **`assets`**: Public bucket for agency assets.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Environment Setup
Create a `.env.local` file in the root of the project with the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Initialization
Copy and run the migrations inside [20260610000000_init_schema.sql](file:///e:/AnantTirupati-updated/KaiketsuTech/supabase/migrations/20260610000000_init_schema.sql) and [20260611000000_intern_applications.sql](file:///e:/AnantTirupati-updated/KaiketsuTech/supabase/migrations/20260611000000_intern_applications.sql) inside your **Supabase Dashboard SQL Editor** to create the tables, triggers, and RLS policies.

### 4. Installation & Start

Install the project dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

### 5. Production Build
Compile the production bundle:
```bash
npm run build
```
