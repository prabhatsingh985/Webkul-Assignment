# Social Network Project

This is a full-stack social network application built with Django (Backend) and React (Frontend).

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL

## Getting Started

### 1. Backend Setup (Django)

1.  **Navigate to the project root directory:**
    ```bash
    cd c:\Users\ps265\Desktop\AntiGravity
    ```

2.  **Create and activate a virtual environment (optional but recommended):**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary
    ```

4.  **Configure Database:**
    Ensure PostgreSQL is running and you have created a database named `social_network_db` (or update `social_network/settings.py` with your DB credentials).

5.  **Run Migrations:**
    ```bash
    python manage.py migrate
    ```

6.  **Start the Backend Server:**
    ```bash
    python manage.py runserver
    ```
    The backend will run at `http://localhost:8000/`.

### 2. Frontend Setup (React)

1.  **Open a new terminal and navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will run at `http://localhost:5173/`.

## Usage

1.  Open your browser and go to `http://localhost:5173/`.
2.  Sign up for a new account.
3.  Login to access your profile and create posts.
