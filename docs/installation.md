# Installation Guide

## Prerequisites
- Node.js (v18+)
- git

## Setup
1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/pavankumar9d-rgb/task.git
   cd task2-website
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Copy `.env.example` to `.env` inside the `backend/` directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
   *(Modify `JWT_SECRET` for secure remote deployments).*

4. Start the application:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.
