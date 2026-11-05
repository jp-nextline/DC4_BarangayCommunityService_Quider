# Requirement checklist: where each item lives

## Required features
| # | Requirement | Backend | Frontend |
|---|---|---|---|
| 1 | Authentication | `AuthController`, Sanctum | `AuthContext.jsx`, `Login.jsx`, `Register.jsx`, `services/api.js` (Bearer token) |
| 2 | Role-based access | `EnsureRole` (`role:admin`), `ServiceRequestPolicy` | `RouteGuards.jsx` (`adminOnly`), role-based nav in `Layout.jsx`, `permissions` from the API |
| 3 | Full CRUD (2 resources, related) | `ServiceRequestController`, `CategoryController` | `RequestList/Form/Detail.jsx`, `Categories.jsx` |
| 4 | Search and filter | `ServiceRequest::scopeFilter` | Filters in `RequestList.jsx` (debounced search) |
| 5 | Pagination | `paginate(10)` | `Pagination.jsx` |
| 6 | Dashboard (3+ figures) | `DashboardController` | `Dashboard.jsx` |
| 7 | Validation both sides | `app/Http/Requests/*` | `utils/validators.js`, `FormInput.jsx` shows errors |
| 8 | User feedback | JSON messages | `Loader`, `ToastContext`, `ErrorBox`, `ConfirmDialog` |
| 9 | Status workflow | `ServiceRequest::TRANSITIONS`, `updateStatus()` | Status modal in `RequestDetail.jsx` |

## Backend checklist
- Migrations with foreign keys: `database/migrations`
- Eloquent relationships: `app/Models`
- Seeders and factories (1 admin, 1 resident, 28 requests): `database/seeders`, `database/factories`
- Routes grouped under `auth:sanctum`: `routes/api.php`
- Resource controllers, Form Requests, API Resources: `app/Http`
- Policy and middleware: `app/Policies`, `app/Http/Middleware`
- Status codes 200, 201, 204, 401, 403, 404, 422: shown in `docs/postman_collection.json` tests
- CORS: `config/cors.php`
- Eager loading: `with(['category', 'user'])` in `ServiceRequestController@index`

## Frontend checklist
- Folders `components/`, `pages/`, `services/`, `context/`, `hooks/`, `utils/`
- Public, protected and admin routes: `App.jsx`
- Single Axios instance with token interceptor and 401 handling: `services/api.js`
- Context API auth: `AuthContext.jsx`
- 3+ reusable components: Button, FormInput, Modal, ConfirmDialog, DataTable, Pagination, StatusBadge, Loader, ErrorBox
- Controlled forms, 422 display, `useEffect` fetching with loading/error states, keyed lists, empty states
- Logout clears the token, 401 redirects to login
- Responsive layout: `styles.css` (breakpoints at 900px and 640px)

## Bonus targeted
- Dashboard chart (Recharts) +2
- Laravel Feature tests `tests/Feature` +2
- Still available: image upload (+3), deployment (+3), CSV export or dark mode (+2 each)
