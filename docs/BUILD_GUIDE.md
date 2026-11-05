# One-time build guide (turn this package into your repository)

This package contains the complete **frontend** and the **Laravel code that sits on top of a fresh Laravel install** (`backend-overlay/`). Composer and npm downloads were not possible when this was generated, so you create the Laravel skeleton yourself once, then copy the overlay on top.

## 1. Create the repository

```bash
mkdir community-service && cd community-service
git init
# copy README.md, .gitignore, docs/ and frontend/ from this package into this folder
```

## 2. Create the Laravel backend

```bash
composer create-project laravel/laravel backend
cd backend
php artisan install:api          # installs Sanctum + routes/api.php (answer "yes" if asked to migrate, or "no")
cd ..
cp -R backend-overlay/. backend/ # overwrites routes/api.php, bootstrap/app.php, User model, .env.example ...
rm -rf backend-overlay           # no longer needed
```

If you do not have a `backend-overlay` folder in your repo, copy it from this package first.

## 3. Configure and run

```bash
cd backend
cp .env.example .env             # set DB_USERNAME / DB_PASSWORD
php artisan key:generate
php artisan migrate:fresh --seed
php artisan test                 # all feature tests should pass
php artisan serve
```

In another terminal: `cd frontend && npm install && cp .env.example .env && npm run dev`.

## 4. Check before you commit

- Open `http://localhost:5173`, log in as both demo accounts and click through every page.
- Import `docs/postman_collection.json` into Postman and run folder 1, then the others.
- If something fails, fix it and **note what you changed**: you must be able to explain every file.

## 5. Commit steadily

The exam asks for **20+ meaningful commits** across two weeks, so do not commit everything at once. Suggested sequence:

1. `chore: scaffold Laravel backend and install Sanctum`
2. `feat: add migrations for categories, requests, updates, notifications`
3. `feat: add models, relationships and factories`
4. `feat: add seeders with realistic barangay data`
5. `feat: add register, login, logout and current user endpoints`
6. `feat: add role middleware and ServiceRequestPolicy`
7. `feat: add service request CRUD with search, filter, pagination`
8. `feat: add status workflow endpoint with history and notifications`
9. `feat: add category CRUD (admin)`
10. `feat: add dashboard and notification endpoints`
11. `test: add feature tests`
12. `chore: scaffold React app with Vite and router`
13. `feat: add Axios service and AuthContext`
14. `feat: add login and register pages with validation`
15. `feat: add layout and route guards`
16. `feat: add reusable components (Button, FormInput, Modal, DataTable, Pagination)`
17. `feat: add request list with filters and delete confirmation`
18. `feat: add request form (create and edit)`
19. `feat: add request detail with status workflow`
20. `feat: add dashboard with chart`
21. `feat: add categories admin page`
22. `feat: add notifications page`
23. `style: responsive layout`
24. `docs: README, ERD, Postman collection, screenshots`

Spread these over the 14 days to match the checkpoints (CP1 planning, CP2 backend, CP3 frontend).

## Troubleshooting

| Symptom | Fix |
|---|---|
| CORS error in the browser | `FRONTEND_URL` in `backend/.env` must match the Vite URL; run `php artisan config:clear` |
| Every request returns 401 | Log in again; check the token in browser localStorage |
| `Access denied for user` | Fix `DB_USERNAME` / `DB_PASSWORD` in `backend/.env` |
| `Class "Laravel\Sanctum\HasApiTokens" not found` | You skipped `php artisan install:api` |
