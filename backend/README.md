# SIH 2025 Backend

Django REST API backend for the SIH 2025 project.

## Setup

1. **Activate virtual environment:**
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start development server:**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

- **Health Check:** `GET /api/health/`
- **API Info:** `GET /api/info/`
- **Admin Panel:** `http://localhost:8000/admin/`

## Features

- Django REST Framework for API development
- CORS enabled for frontend integration
- User authentication and profiles
- Supply chain tracking models
- Transaction management

## Models

- **UserProfile:** Extended user profiles with user types (farmer, distributor, retailer, consumer)
- **Product:** Agricultural products catalog
- **SupplyChainItem:** Individual items being tracked through the supply chain
- **Transaction:** Transactions between supply chain participants

## Development

The backend is configured to work with the React frontend running on `http://localhost:5173` (Vite default port).
