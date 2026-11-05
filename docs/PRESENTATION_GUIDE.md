# Presentation guide (15-20 minutes, you are the developer, the instructor is the client)

Both apps must already be running. Slides: **8 maximum**, short, supporting the demo.

## Slide outline
1. **Title:** project name, your name, the client
2. **The problem:** paper logbooks and chat messages: lost requests, no way to check progress
3. **Goals:** what the system had to achieve (three short bullets)
4. **Users and features:** resident vs administrator, in plain words
5. **How it works:** simple diagram: React app → Laravel API → MySQL; ERD in one sentence ("one resident files many requests; each request has a history of updates")
6. **Handover:** repository, README setup, demo accounts, API docs, how data is secured (tokens, roles, validation)
7. **Delivered vs proposed:** what you built, what changed and why
8. **Limitations and Phase 2:** email/SMS alerts, attachments, password reset

## Timing script
| Time | Section | What to do |
|---|---|---|
| 2 min | Opening | Introduce yourself, restate the barangay's problem and goals |
| 3 min | Solution overview | Roles, features, ERD and architecture without jargon |
| 8-10 min | Live walkthrough | Follow one story (below) |
| 2-3 min | Handover | Repo, README, accounts, Postman, security |
| 2 min | Closing | Delivered vs proposal, limits, Phase 2 |

## Demo story (hits every required feature)
1. **Register** a new resident: submit the empty form to show **validation messages**, then register properly.
2. **Submit a request:** show client-side errors, then a successful submission and the toast.
3. **Edit** the request while it is pending. **Log out.**
4. **Log in as admin:** show the **dashboard** (figures and chart).
5. Open **All requests:** use **search**, the **status filter**, the **category filter**, and go to **page 2**.
6. Open the new request: try to **reject without a reason** (validation), then **Approve** with remarks.
7. Show **Categories** (add, edit, try deleting one that is in use) and a **delete confirmation** on a request.
8. **Log in as the resident:** show the **notification**, the status history, and that **Categories** is not visible. Paste `/categories` in the address bar to show the redirect.
9. (Optional) In Postman, call an admin endpoint with the resident token to show **403**.

## Checklist
- Business casual, speak to the client, not to classmates
- Realistic data only (the seeder already provides it)
- Stay within the time limit
- Record the 5-8 minute demo video using the same story as backup
