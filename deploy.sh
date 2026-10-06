#!/usr/bin/env bash
# ==============================================================================
# Automated Production Deployment Script for aminez.ir
# Usage: ./deploy.sh
# ==============================================================================

set -e

echo "🚀 [1/5] Pulling latest updates from Git..."
git pull origin main || true

PROJECT_ROOT=$(pwd)

echo "📦 [2/5] Installing Frontend Dependencies & Building Assets..."
cd "$PROJECT_ROOT/front"
npm install --silent
npm run build

echo "🐍 [3/5] Updating Python Backend Virtual Environment..."
cd "$PROJECT_ROOT/backend"
if [ ! -d "$PROJECT_ROOT/venv" ]; then
    echo "Creating virtualenv..."
    python3 -m venv "$PROJECT_ROOT/venv"
fi

source "$PROJECT_ROOT/venv/bin/activate"
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

echo "🗄️  [4/5] Running Migrations & Collecting Static Files..."
python manage.py migrate --noinput
python manage.py collectstatic --noinput

echo "🔄 [5/5] Reloading Gunicorn & Nginx Services..."
sudo systemctl restart aminez.service || true
sudo systemctl reload nginx || true

echo "✅ Deployment completed successfully for https://aminez.ir!"
