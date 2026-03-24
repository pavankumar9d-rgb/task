# REST API Documentation

The AlarmPro backend handles secure authentication and task synchronization via JWT patterns.

## Base URL
`/api`

## Authentication

### `POST /auth/register`
Creates a new user. Passwords are automatically hashed via bcrypt.
- **Body**: `{ "username": "...", "password": "...", "genre": "student" }`
- **Response**: `{ "id": "...", "token": "JWT_TOKEN" }`

### `POST /auth/login`
Authenticates a user and issues a JWT token. Demo mode is fully intercepted.
- **Body**: `{ "username": "...", "password": "..." }`
- **Response**: `{ "token": "JWT_TOKEN", "is_premium": 0 }`

## Tasks

*All task endpoints require the `Authorization: Bearer <TOKEN>` header.*

### `GET /tasks`
Retrieves all tasks for the authenticated user.
- **Query**: `?userId=...`

### `POST /tasks`
Creates or updates a task. **Free users are strictly limited to 3 active tasks.**
- **Body**: Task Object (Title, Desc, Time, etc.)
- **Error**: `403` if Limit Reached.

### `DELETE /tasks/history/all`
Wipes the user's completed history. Does not apply to the active queue.
