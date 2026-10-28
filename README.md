🎟️ Laravel Inertia SPA Ticketing System
A modern Web Application for managing and tracking support/maintenance tickets. Built with a robust Laravel 10 backend and a reactive React SPA frontend (via Inertia.js), featuring a modern HSL-based UI design, robust roles and access control, OTP email verification, and comprehensive reporting analytics.

🚀 Features
Core Functionality
- **User Authentication**: Secure authentication with role-based access control (User & Admin), including secure registration, OTP email verification, and password reset flows.
- **Ticket Lifecycle Management**: Open tickets with detailed metadata, update ticket progress/logs, view real-time status transitions, and close resolved tickets.
- **Work Instructions (WI)**: Upload reference guidelines and documentation files to assist technicians in resolving tickets.
- **Advanced Filtering**: Filter tickets by category, sub-category, status, creator, and date range.
- **Exporting & Reporting**: Export ticketing data to Excel, download reports, and view summaries.
- **User Profile**: Manage user details (linked to specific Departments, Sub-Departments, Gateways, and Positions).

Admin Features
- **Dashboard Analytics**: Visualized summary charts of ticket statuses, categories, and gateway activity.
- **User & Role Management**: Complete directory view of users to update details, assign roles (User/Admin), or remove accounts.
- **Category Management**: Full CRUD operations for Ticket Categories and Sub-categories to keep classifications organized.
- **Work Instruction Moderation**: Global management of reference documents (uploading and deleting).
- **Ticket Overrides**: Capability to moderate and delete tickets if necessary.

Technical Features
- **Laravel 10 Backend**: Secure, robust MVC architecture enforcing strict form validations, rate limiting, and standard controller abstractions.
- **React SPA**: Lightning-fast, single-page application transitions using React 18, Vite, and Inertia.js.
- **Modern UI & Design**: Dynamic design styled with Tailwind CSS, Radix UI primitives, Lucide React icons, and Sonner toast notifications.
- **Database Seeding**: Ready-made seeders for categories, departments, positions, locations, and sub-departments.

🎨 Design System
Color Palette
- **PSN Primary (Navy)**: HSL `211 51% 36%` / Dark: HSL `211 51% 46%` (Professional navy for brand identity and main actions)
- **PSN Accent (Gold)**: HSL `45 75% 55%` (Striking gold for accents, indicators, and highlighting special states)
- **Dark Mode Support**: Sleek, custom dark backgrounds (Base: HSL `220 15% 10%`, Card: HSL `220 15% 13%`) with clean transitions.

Typography
- **Font Family**: Figtree (clean, geometric sans-serif) / System Sans
- **Layout Grid**: Adaptive spacing systems leveraging Tailwind standards with custom CSS variables.

📱 Pages & Screens
Authentication:
- Login Screen
- Register Screen (includes selections for Gateway, Department, Sub-Department, and Position)
- OTP Verification Screen (verifies newly registered emails)
- Forgot & Reset Password Screens

Main Application (Authenticated Users):
- **Dashboard**: Analytical visualization of ticket counts and categories using Recharts.
- **Ticket Explorer (List)**: Paginated, searchable, and filterable table of all tickets.
- **Open Ticket Form**: Multi-field form validating all ticket metrics (gateway, categories, alarms, etc.).
- **View Ticket Details**: Visual timeline showing ticket details and history of updates.
- **Update Ticket**: Add updates, update action taken, change ticket status, or close the ticket.
- **Work Instructions**: Guidelines directory for technicians to read and download files.
- **Report & Export**: Exporter dashboard for generating Excel and summary logs.
- **User Profile**: Update profile details and view organizational affiliations.

Admin Panel (Admin Users Only):
- **User Management**: Admin-exclusive control panel to modify user accounts, roles, or delete users.
- **Category Management**: Live editor to create, view, and delete categories or nested sub-categories.

🛠 Technology Stack
Backend
- **Framework**: Laravel 10 (PHP 8.1+)
- **Database**: SQLite / MySQL
- **Authentication**: Built-in stateful authentication via session guards and Sanctum
- **Code Quality**: Laravel Pint (PHP formatting)

Frontend
- **Framework**: React 18 (via Inertia.js 1.0)
- **Asset Bundler**: Vite 5
- **Styling**: Tailwind CSS v3 & Tailwind CSS Animate
- **Components & Tools**: Radix UI (Primitives), Lucide React, Recharts, Sonner (Toasts), TanStack Table (v8), and DnD Kit

Testing & Tooling
- **Testing**: PHPUnit / Laravel Test Suite
- **Package Manager**: Composer & NPM

🏗 Project Structure
```text
ticketing-system/
├── app/
│   ├── Http/
│   │   ├── Controllers/   # Controllers grouped by Auth, Admin, and Ticket
│   │   └── Requests/      # Request Validation Rules
│   └── Models/            # Strictly defined Eloquent Models (User, Ticket, Category, etc.)
├── database/
│   ├── migrations/        # Database Schemas
│   └── seeders/           # Seeders (Category, Department, Location, Position, SubDepartment)
├── resources/
│   ├── js/                # React SPA Frontend
│   │   ├── Components/    # Reusable UI widgets and layout views
│   │   ├── Pages/         # Full page views (Admin, Auth, Ticket, Profile)
│   │   └── app.jsx        # Inertia React entry point
│   └── css/               # app.css styling with HSL design variables
├── routes/                # Application routes (web.php, auth.php, api.php, etc.)
└── tests/                 # PHPUnit test suites (Unit/Feature)
```

🔧 Getting Started
Requires PHP 8.1+ and Node.js (with NPM).

Clone the repository and enter the directory:
```bash
git clone https://github.com/aminssmilee/ticketing-system.git
cd ticketing-system
```

Initial Setup
1. **Install Backend Dependencies**:
   ```bash
   composer install
   ```
2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   *Make sure to configure your database settings in the `.env` file.*

3. **Generate Application Key**:
   ```bash
   php artisan key:generate
   ```

4. **Run Migrations & Seeders**:
   ```bash
   php artisan migrate --seed
   ```

5. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

6. **Start the Development Servers**:
   ```bash
   # Run Vite development server (hot-reloads changes)
   npm run dev

   # In a separate terminal, start the Laravel server
   php artisan serve
   ```

Verify Installation
To run the PHPUnit test suite:
```bash
php artisan test
```

👑 Creating an Admin User
By default, users registered via the sign-up form are assigned the standard `'user'` role. To promote an account to Admin:

1. Register an account through the application UI.
2. Open your database or run Laravel Tinker:
   ```bash
   php artisan tinker
   ```
3. Update the user's role:
   ```php
   \App\Models\User::where('email', 'your-email@example.com')->update(['role' => 'admin']);
   ```

📊 Performance Optimizations
- **Eager Loading**: Enforced relations eager loading (`load()`, `with()`) to eliminate N+1 database queries.
- **Inertia SPA Flow**: Smooth UI changes without page refreshes, reducing payloads and backend processing overhead.
- **Asset Minimization**: Compiled production bundles utilizing tree-shaking and minification via Vite.

🎯 Future Enhancements
- Real-time ticket updates and notifications (Laravel Echo / Websockets).
- SLA (Service Level Agreement) duration tracking & indicators.
- Automated email alerts on ticket creation and status updates.
- PDF export options for tickets and summary sheets.

📄 License
This project is created for portfolio and academic purposes.

**Developer**: aminssmile
*Showcasing modern Laravel development, Inertia.js React SPA integration, custom dark mode styling, and structured ticketing workflows.*
