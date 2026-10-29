# TestLab — QA Playground

TestLab is a classroom sandbox built with **React 19, Vite, Node.js, and Express**. The Express API and compiled frontend run together in production. During development, Vite proxies `/api` requests to the API server.

## Run locally

1. Install Node.js 20 or later.
2. In this folder, run `npm install`.
3. Run `npm run dev`.
4. Open <http://localhost:5173> (Vite) or <http://localhost:4173/api/health> (API health check).

For a production build, run `npm run build` then `npm start`, and open <http://localhost:4173>. Demo data is in memory and resets when the Node server restarts. Uploaded files are not transmitted or stored.

## Manual testing course

The **Manual Software Testing — Beginner to Advanced Masterclass** is available from the app sidebar. It includes a 12-module, approximately 39-hour syllabus, learning outcomes, project deliverables, assessment plan, and a self-generated completion certificate notice. Learners can start with Chapter 1; additional lessons are syllabus previews for progressive release.

Course progress is saved in the learner's browser using local storage. It is device- and browser-specific and is not synced to an instructor account. The certificate is a self-generated record of course completion, not an accredited qualification.

## What students can test

- Responsive React dashboard, navigation, loading, empty, success, and error states
- Product create, read, update, delete, search, filtering, sorting, and pagination
- Order search and status filtering, sample user roles and account states
- Signup and support forms with validation, character count, and file input
- Demo login success and invalid credential handling
- API request builder with status, response body, latency, error, and unauthorized scenarios

## Demo login

- Email: `student@example.com`
- Password: `Password123!`

## API reference

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Demo login; other credentials return 401 |
| GET | `/api/products?page=1&limit=6&q=lamp&category=Home` | Searchable, filterable, paginated list |
| GET | `/api/products/:id` | Read one product |
| POST | `/api/products` | Create and validate a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/orders` | Sample orders |
| GET | `/api/users` | Sample users |
| POST | `/api/echo` | Returns submitted JSON |
| GET | `/api/not-found` | Intentional 404 |

Add `?scenario=error` or `?scenario=unauthorized` to any API URL to simulate a 500 or 401. Add `?delay=1500` to simulate a response delay (0–5000 ms).

## Suggested classroom exercises

1. Test signup required fields, malformed email, short password, and terms checkbox.
2. Search for products with no results; combine search and category filters; test pagination boundaries.
3. Create a product with invalid price or stock, then edit and delete a valid product.
4. Verify login success and failure, including the 401 response.
5. Send a delayed request; inspect loading behavior; simulate 500, 401, and 404 responses.
6. Test mobile layout, keyboard focus, empty states, and refresh behavior.

This project is a teaching sandbox, not a production commerce application. Authentication is simulated and data is ephemeral.
