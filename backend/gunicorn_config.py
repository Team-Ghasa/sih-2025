# gunicorn_config.py
# Minimal Gunicorn configuration suitable for simple deployments.
bind = "0.0.0.0:8000"
workers = 2
threads = 2
timeout = 120

# Preload app for slightly faster worker spawn at the cost of higher memory
preload_app = True
