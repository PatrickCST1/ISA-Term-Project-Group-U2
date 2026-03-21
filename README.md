# Lumina API

## Prerequisites
- Docker Desktop
- Node.js 20+
- Git

## Setup

1. Clone the repo
   git clone https://github.com/PatrickCST1/ISA-Term-Project-Group-U2
   cd lumina-api

2. Set up environment variables
   cp server/.env.example server/.env
   cp .env.example .env
   cp client/.env.example client/.env

3. Start everything
   docker compose up --build

## URLs
- App: http://localhost:5173/IsaAsgn1/
- API: http://localhost:3000
- DB Viewer: http://localhost:8080

## Daily workflow
- Start: docker compose up
- Stop: docker compose down
- After pulling new changes: docker compose up --build

## Environment Variables
Set up root .env, server/.env, and client/.env using the .env.example files.
I shared the keys over discord but dm me if you need them.