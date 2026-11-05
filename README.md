# Community Service Request and Tracking System

**Developer:** John Paul Mari Quider
**Course:** React Fundamentals with Laravel as Backend, Final Hands-On Exam (Mini Capstone)  
**Client:** Barangay San Isidro Office
**Demo Video:**

A web application that helps a barangay office receive, review and track service requests from residents. Residents file a request and follow its progress; administrators review each request and move it through **Pending → Approved → Completed** (or **Rejected**), and residents are notified in the app.

## Features

| Requirement | Where to see it |
|---|---|
| Authentication (register, login, logout, current user) with Sanctum tokens | Login / Register pages, `AuthController` |
| Role-based access (admin, resident) in React **and** Laravel | `RouteGuards.jsx`, `EnsureRole` middleware, `ServiceRequestPolicy` |
| Full CRUD, related resources | Service requests (resident/admin), categories (admin) |
| Search and filter | Requests list: keyword, status, category |
| API pagination | `paginate(10)` in the API, `Pagination.jsx` in React |
| Dashboard with summary figures | Total / pending / approved / completed / rejected / this month, plus a category chart |
| Validation on both sides | React validators + Laravel Form Requests (422 errors shown under fields) |
| User feedback | Loading indicators, toasts, error boxes, delete confirmation dialogs |
| Status workflow | Admin changes status; invalid jumps are rejected (422); history and remarks are saved |
| In-app notifications | Residents are notified on every status change |
| Responsive UI | Sidebar collapses to a menu and tables stack as cards on phones |
| Bonus | Dashboard chart (Recharts), Laravel Feature tests |

## Tech stack

- **Frontend:** React 18, Vite, React Router 6, Axios, Recharts, plain CSS
- **Backend:** Laravel 11-13, PHP 8.2+, Laravel Sanctum
- **Database:** MySQL / MariaDB
- **Tools:** Git, GitHub, Composer, npm, Postman

## Setup (fresh clone)

Requirements: PHP 8.2+, Composer, Node 18+, MySQL/MariaDB.

```bash
# 1. Database: create an empty database
mysql -u root -e "CREATE DATABASE community_service CHARACTER SET utf8mb4"

# 2. Backend
cd backend
composer install
cp .env.example .env          # then check DB_USERNAME / DB_PASSWORD
php artisan key:generate
php artisan migrate --seed
php artisan serve             # http://localhost:8000

# 3. Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                   # http://localhost:5173
```

Optional: `cd backend && php artisan test` runs the feature tests.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@barangay.test` | `password` |
| Resident | `resident@barangay.test` | `password` |

The seeder also creates 6 more residents and 28 sample requests (8 pending, 7 approved, 9 completed, 4 rejected).

## API summary

All routes are prefixed with `/api`. Protected routes need `Authorization: Bearer <token>`. A full Postman collection is in `docs/postman_collection.json`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/register` | Public | Create a resident account |
| POST | `/login` | Public | Return token |
| POST | `/logout` | Auth | Revoke token |
| GET | `/user` | Auth | Current user |
| GET | `/dashboard` | Auth | Summary figures (own data for residents, all data for admins) |
| GET | `/categories` | Auth | List categories |
| POST / GET / PUT / DELETE | `/categories`, `/categories/{id}` | Admin | Manage categories |
| GET | `/service-requests?search=&status=&category_id=&page=` | Auth | List (residents see only their own) |
| POST | `/service-requests` | Auth | Create |
| GET | `/service-requests/{id}` | Owner / Admin | View, including status history |
| PUT | `/service-requests/{id}` | Owner (while pending) / Admin | Update |
| DELETE | `/service-requests/{id}` | Owner (while pending) / Admin | Delete (204) |
| PATCH | `/service-requests/{id}/status` | Admin | Change status |
| GET | `/notifications` | Auth | Own notifications + unread count |
| PATCH | `/notifications/{id}/read` | Owner | Mark one as read |
| POST | `/notifications/read-all` | Auth | Mark all as read |

Status codes used: 200, 201, 204, 401, 403, 404, 409 (category in use), 422.

## Documentation

- ERD: `docs/ERD.svg`
- Postman collection: `docs/postman_collection.json`
- Screenshots: `docs/screenshots/`
- Slides: `docs/presentation.pdf`

## Changes from the original proposal

- Residents may also **delete (cancel) their own request while it is still pending**.
- Requests have a **reference number** (e.g. `SR-261106-K4TD`) and an optional **location**.
- Rejecting a request **requires a reason**, which the resident can read.
- Dashboard figures are scoped per role, and a **chart by category** was added.

## Known limitations / Phase 2 ideas

- Notifications are in-app only (no email or SMS).
- No file or photo attachments on requests.
- No password reset or profile editing.
- Admin accounts can only be created through seeders.

## References


- Laravel and Sanctum documentation: https://laravel.com/docs
- React Router and Axios documentation
- AI assistant (Claude by Anthropic) was used to draft the initial code structure, which I reviewed, tested and adapted.
