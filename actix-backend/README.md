## Principium API (Actix Backend)

Rust backend API built with **Actix Web** and **PostgreSQL**.

### 🚀 Features

#### 🔐 Authentication

- User registration and login with strong password validation
- JWT-based access and refresh tokens (15 min / 24 hr)
- Session tracking via device ID stored in secure cookies
- Secure password hashing with `bcrypt`

#### 📘 Snippet Management (VSC Code Snippets)

- CRUD operations for code snippets
- Tagging, starring, and full pagination support
- Batch fetching and ownership validation
- All actions are scoped to the authenticated user

### 📚 Endpoints

All endpoints are prefixed by `/api` and their respective version (e.g. `/api/v1/**`).

#### 🧾 Auth Routes

| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| POST   | `/auth/register` | Register a new user                    |
| POST   | `/auth/login`    | Authenticate and receive access token  |
| POST   | `/auth/logout`   | Logout and revoke session              |
| POST   | `/auth/refresh`  | Refresh access token via secure cookie |

#### 🔖 Snippet Routes

| Method | Endpoint                              | Description                   |
| ------ | ------------------------------------- | ----------------------------- |
| POST   | `/users/snippets`                     | Create a new snippet          |
| GET    | `/users/{userId}/snippets`            | Get all snippets by a user    |
| GET    | `/users/{userId}/snippets/{id}`       | Get a single snippet          |
| GET    | `/public/snippets/batch?ids=...`      | Batch fetch multiple snippets |
| GET    | `/public/snippets?page=X&limit=Y&...` | Paginated search with filters |
| PUT    | `/users/snippets/{id}`                | Update a snippet (owner only) |
| DELETE | `/users/snippets/{id}`                | Delete a snippet (owner only) |
| POST   | `/users/{snippetId}/star`             | Star a snippet                |
| DELETE | `/users/{snippetId}/star`             | Unstar a snippet              |

### 🛠️ Tech Stack

- **Rust** with [Actix Web](https://actix.rs/)
- **PostgreSQL 17**
- **sqlx** for database access
- **jsonwebtoken** for token handling
- **bcrypt** for password hashing
- **serde** for JSON (de)serialization
