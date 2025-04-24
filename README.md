# Spotify Clone

A full-stack web application that replicates core Spotify functionality, built with Django REST Framework for the backend and Angular for the frontend.

## Features

- User authentication with JWT
- Browse artists and albums
- Create and manage playlists
- Music player with play/pause and volume controls
- Responsive design

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL (optional, SQLite for development)
- JWT Authentication
- Spotify API integration

### Frontend
- Angular (Standalone Components)
- Bootstrap for styling
- JWT for secure API requests

## Project Structure

```
spotify-clone/
├── backend/        # Django project
│   ├── spotify/    # Main Django app
│   └── api/        # Django REST API app
└── frontend/       # Angular app
```

## Backend Setup

1. Create a virtual environment and install required packages:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Run migrations:

```bash
python manage.py migrate
```

3. Load sample data from Spotify API:

```bash
python manage.py import_spotify --artist "The Beatles"
python manage.py import_spotify --artist "Queen"
```

4. Start the Django server:

```bash
python manage.py runserver
```

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the Angular development server:

```bash
ng serve
```

3. Access the application at http://localhost:4200

## API Endpoints

### Authentication
- `POST /api/register/`: Register a new user
- `POST /api/token/`: Get JWT token
- `POST /api/token/refresh/`: Refresh JWT token

### Artists
- `GET /api/artists/`: List all artists
- `GET /api/artists/:id/`: Get artist details

### Albums
- `GET /api/albums/`: List all albums
- `GET /api/albums/:id/`: Get album details with tracks

### Playlists
- `GET /api/playlists/`: List user's playlists
- `POST /api/playlists/`: Create a new playlist
- `GET /api/playlists/:id/`: Get playlist details
- `PUT /api/playlists/:id/`: Update playlist
- `DELETE /api/playlists/:id/`: Delete playlist
- `POST /api/playlists/:id/tracks/`: Add track to playlist
- `DELETE /api/playlists/:id/tracks/`: Remove track from playlist

## Implementation Requirements

### Frontend
- Interface with backend API through services
- Click events that make API requests
- Form controls with ngModel bindings
- CSS styling with Bootstrap
- Angular Router for navigation
- ngFor and ngIf for data rendering
- JWT authentication with interceptor

### Backend
- Django models with relationships
- Serializers for API response formatting
- Function and Class-Based Views
- Token-based authentication
- CRUD operations for playlists
- Link created objects to authenticated user

## Future Enhancements

- Audio playback visualization
- Recommendation system
- Social features (sharing, following)
- Mobile responsive design improvements

## License

This project is for educational purposes only. Spotify is a trademark of Spotify AB.