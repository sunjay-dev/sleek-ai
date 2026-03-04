# Contributing to Sleek AI

Thank you for your interest in contributing to Sleek AI! We welcome contributions from the community to help make this project better.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/sunjay-dev/sleek-ai.git
    cd sleek-ai
    ```
3.  **Install dependencies**:
    ```bash
    pnpm install
    ```
4.  **Create a branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```

## Development Workflow

- **Backend**: Located in `backend/`. Uses Hono and Bun.
- **Frontend**: Located in `frontend/`. Uses React and Vite.
- **Worker**: Located in `worker/`. Handles background jobs.

Ensure you have the necessary environment variables set up in each service's `.env` file (see `README.md`).

### Running Locally

Run `pnpm dev` in the root directory to start all services.
