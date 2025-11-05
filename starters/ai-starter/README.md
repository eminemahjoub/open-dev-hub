# AI Starter — Notebook + FastAPI (minimal)

A minimal starter that shows the flow from notebook to API deployment.

## Features
- Jupyter Notebook demonstrating data prep and a small model
- FastAPI service that loads the model and exposes predict endpoint
- Dockerfile for deployment

## Quick start
1. `cd starters/ai-starter`
2. `pip install -r requirements.txt`
3. Run the notebook to reproduce experiments.
4. `uvicorn app.main:app --reload` to run API locally.