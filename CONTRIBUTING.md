# Contributing to Sleek AI

Thank you for your interest in contributing to Sleek AI! We welcome contributions from the community to help make this project better.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/sleek-ai.git
    cd sleek-ai
    ```
3.  **Install dependencies**:
    ```bash
    pnpm install
    ```
4.  **Set up environment**:
    ```bash
    cp apps/backend/.env.example apps/backend/.env
    # Fill in your keys (Clerk, API keys, database URL, etc.)
    ```
5.  **Create a branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```

## Development Workflow

This is a Turborepo monorepo. Run all services with:

```bash
pnpm dev
```

### Project Layout

- **`apps/frontend/`**: Vite + React app with Tailwind CSS
- **`apps/backend/`**: Hono.js API server (also serves the frontend in production)
- **`apps/worker/`**: BullMQ worker for background file processing
- **`packages/shared/`**: Shared types, schemas, and utilities
- **`packages/db/`**: Prisma schema and database client
- **`packages/typescript-config/`**: Shared tsconfig presets

### Available Scripts

| Command           | Description          |
| ----------------- | -------------------- |
| `pnpm dev`        | Start all services   |
| `pnpm build`      | Build all packages   |
| `pnpm lint`       | Lint with oxlint     |
| `pnpm lint:fix`   | Auto-fix lint issues |
| `pnpm format`     | Check formatting     |
| `pnpm format:fix` | Auto-fix formatting  |

### Code Quality

This project uses **oxlint** for linting and **oxfmt** for formatting. Both run automatically on pre-commit via husky and lint-staged.

To run manually:

```bash
pnpm lint        # Check for lint errors
pnpm format      # Check formatting
pnpm format:fix  # Auto-fix formatting
```

## Submitting Changes

1.  **Commit your changes** with a clear message:

    ```bash
    git commit -m "feat: add new feature"
    ```

    We follow [Conventional Commits](https://www.conventionalcommits.org/).

2.  **Push to your fork**:

    ```bash
    git push origin feature/amazing-feature
    ```

3.  **Open a Pull Request** on the main repository.

## Need Help?

Open an issue or reach out on the repository discussions.
