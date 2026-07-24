# Sleek AI

![Sleek AI Preview](./assets/preview.webp)

[![ci](https://github.com/sunjay-dev/sleek-ai/actions/workflows/docker-build-push.yaml/badge.svg)](https://github.com/sunjay-dev/sleek-ai/actions/workflows/docker-build-push.yaml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Last Commit](https://img.shields.io/github/last-commit/sunjay-dev/sleek-ai)](https://github.com/sunjay-dev/sleek-ai/commits/main)

A full-stack AI chat application featuring real-time messaging, file ingestion, and vector search capabilities. Optimized for speed, reliability, and seamless AI interactions.

## Features

- **AI Chat Interface**: Interactive chat with AI models.
- **File Ingestion**: Upload and process documents (PDF, Docx, TXT) for context-aware responses.
- **Vector Search**: Semantic search powered by Pinecone and Google Gemini embeddings.
- **Authentication**: Secure user authentication via Clerk.
- **Background Processing**: Asynchronous file processing with BullMQ workers.
- **Infrastructure**: Containerized development environment with Docker.

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Lucide-React](https://img.shields.io/badge/Lucide--React-000000.svg?style=for-the-badge&logo=lucide&logoColor=white) ![Hono](https://img.shields.io/badge/Hono-ff5018?style=for-the-badge&logo=hono&logoColor=white) ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white) ![BullMQ](https://img.shields.io/badge/BullMQ-E03E2F?style=for-the-badge&logo=bullmq&logoColor=white) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain.js-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white) ![Pinecone](https://img.shields.io/badge/Pinecone-2C3E50?style=for-the-badge&logo=pinecone&logoColor=white) ![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white) ![Gemini](https://img.shields.io/badge/Gemini-1A73E8?style=for-the-badge&logo=google-gemini&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Grafana](https://img.shields.io/badge/Grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white) ![Prometheus](https://img.shields.io/badge/Prometheus-%23E6522C.svg?style=for-the-badge&logo=prometheus&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-7C3AED.svg?style=for-the-badge&logo=zod&logoColor=white) ![Pino](https://img.shields.io/badge/Pino-4B9E5F.svg?style=for-the-badge&logo=pino&logoColor=white) ![Turborepo](https://img.shields.io/badge/Turborepo-E10098?style=for-the-badge&logo=turborepo&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220) ![OXC](https://img.shields.io/badge/OXC-007ACC?style=for-the-badge&logo=oxc&logoColor=white)

## Architecture

![Architecture Diagram](./assets/architecture_diagram.png)

## Prerequisites

- **Node.js** (v24+)
- **pnpm** (v10+)
- **Docker & Docker Compose**

## Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/sunjay-dev/sleek-ai.git
    cd sleek-ai
    ```

2.  **Install Dependencies**

    ```bash
    pnpm install
    ```

3.  **Environment Configuration**

    Copy the `.env.example` file to `.env` in the backend directory and fill in your secrets.

    ```bash
    cp apps/backend/.env.example apps/backend/.env
    ```

4.  **Start Infrastructure (Redis/Postgres)**

    ```bash
    docker compose up -d redis
    ```

5.  **Database Migration**

    ```bash
    pnpm --filter @app/db prisma:migrate
    ```

6.  **Run Development Servers**

    ```bash
    pnpm dev
    ```

    This will start all services via Turborepo.

## Project Structure

This is a Turborepo monorepo containing:

- **`apps/frontend/`**: Vite + React application with Tailwind CSS.
- **`apps/backend/`**: Hono.js API server serving the frontend and handling chat logic, authentication, and job dispatching.
- **`apps/worker/`**: BullMQ-based background worker for processing file metadata and vector embeddings.
- **`packages/shared/`**: Shared TypeScript types, schemas, and utility functions.
- **`packages/db/`**: Prisma schema and database client.
- **`packages/typescript-config/`**: Shared TypeScript configurations.

## Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `pnpm dev`        | Start all services in development mode |
| `pnpm build`      | Build all packages                     |
| `pnpm lint`       | Lint with oxlint                       |
| `pnpm format`     | Check formatting with oxfmt            |
| `pnpm format:fix` | Auto-fix formatting                    |

## Docker

```bash
# Build and run everything
docker compose up --build

# Or run in detached mode
docker compose up -d
```

## Contribution

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.
