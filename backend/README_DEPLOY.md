Deployment notes for the backend (Gunicorn)

1. Create a Python virtual environment and install requirements:

   python -m venv venv
   venv\Scripts\Activate.ps1  # PowerShell
   pip install -r requirements.txt

2. Collect static files:

   python manage.py collectstatic --noinput

3. Run database migrations:

   python manage.py migrate

4. Run Gunicorn (local test):

   gunicorn sih_backend.wsgi:application --config gunicorn_config.py

5. Systemd service (Ubuntu/Debian):
   - Copy `deploy/gunicorn.service` to `/etc/systemd/system/gunicorn.service` and edit paths.
   - Reload systemd: `sudo systemctl daemon-reload`
   - Enable and start: `sudo systemctl enable --now gunicorn`

Security/production notes:
- Set `DJANGO_SECRET_KEY` and `DJANGO_DEBUG=0` in the environment for production.
- Configure `DJANGO_ALLOWED_HOSTS` to your domain(s).
- Consider running behind a reverse proxy (nginx) for TLS, buffering, and static file caching.
