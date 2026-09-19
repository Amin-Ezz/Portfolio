import os
import sys

# -----------------------------------------------------------------------------
# Phusion Passenger WSGI configuration for cPanel / CloudLinux
# Project: aminez.ir Portfolio
# -----------------------------------------------------------------------------

# Base directory where passenger_wsgi.py is located (/home/aminezir/Portfolio)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path to the Django backend directory containing manage.py & portfolio_backend
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')

# Add paths to sys.path so Python can find portfolio_backend and api
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

if BASE_DIR not in sys.path:
    sys.path.insert(1, BASE_DIR)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')

# Initialize WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
