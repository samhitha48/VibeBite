#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR"
BACKEND_DIR="$ROOT_DIR/backend"
VENV_DIR="$BACKEND_DIR/.venv"

echo "🔧 Setting up VibeBite project..."

echo "📦 Installing frontend dependencies (npm install)"
cd "$FRONTEND_DIR"
npm install

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  echo "❌ Python is required but was not found on your PATH."
  exit 1
fi

echo "🐍 Using Python interpreter: $PYTHON_BIN"

mkdir -p "$BACKEND_DIR"
cd "$BACKEND_DIR"

if [ ! -d "$VENV_DIR" ]; then
  echo "🧪 Creating virtual environment at backend/.venv"
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  ACTIVATE_PATH="$VENV_DIR/Scripts/activate"
else
  ACTIVATE_PATH="$VENV_DIR/bin/activate"
fi

echo "✅ Activating virtual environment"
# shellcheck disable=SC1090,SC1091
source "$ACTIVATE_PATH"

echo "⬆️  Updating pip"
pip install --upgrade pip

echo "📦 Installing backend dependencies (pip install -r requirements.txt)"
pip install -r requirements.txt

echo "🎉 Setup complete! Frontend and backend dependencies are ready."

