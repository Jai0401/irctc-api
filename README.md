# IRCTC API (Node.js)

This is a simplified railway management API built for the SDE API Round, using Node.js, Express, and Sequelize.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd irctc-api-node
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure the database:**
    *   Create a `.env` file in the root directory and set the environment variables as described above (in the `.env` section).
    *   Make sure your PostgreSQL or MySQL server is running.

4.  **Run the application:**
    ```bash
    node server.js
    ```

## API Endpoints

(Same endpoints as the Python version, but the base URL is `/api`)

| Method | Endpoint                          | Description                                            | Authentication        |
| ------ | --------------------------------- | ------------------------------------------------------ | --------------------- |
| POST   | /api/users/register                 | Register a new user                                   | None                  |
| POST   | /api/users/login                    | Log in a user and get an auth token                   | None                  |
| POST   | /api/trains                       | Add a new train (admin only)                           | API Key, Admin Token  |
| GET    | /api/trains/availability          | Get train availability between two stations             | Token                 |
| POST   | /api/bookings                      | Book a seat on a train                                  | Token                 |
| GET    | /api/bookings/:bookingId          | Get details of a specific booking                     | Token                 |
| GET    | /api/users/me  | Get currently logged-in user | Token

**Request Headers:**

*   Admin endpoints require: `x-api-key: your-admin-api-key`
*   User endpoints (except register/login) require: `Authorization: Bearer <your_auth_token>`

**Assumptions and Further Improvements:** (Same as the Python README)

**Concurrency:**

*   Sequelize transactions with `lock: t.LOCK.UPDATE` are used for optimistic locking to handle race conditions during booking.