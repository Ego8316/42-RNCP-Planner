# 42 RNCP Planner

42 RNCP Planner is a local-first web application for tracking 42 School project progress and planning toward RNCP certification requirements.

The project is currently in its initial tooling and infrastructure milestone. Certification calculations are intended as a planning aid and must not be interpreted as proof that a qualification has been officially awarded.

## Tech stack

| Area                        | Technology                        |
| --------------------------- | --------------------------------- |
| Runtime and package manager | Bun                               |
| Backend HTTP API            | Elysia                            |
| Frontend                    | React and TypeScript              |
| Styling                     | PandaCSS                          |
| Database                    | PostgreSQL with Bun SQL (planned) |
| Local database environment  | Docker Compose (planned)          |
| Testing                     | Bun test                          |
| Formatting                  | Prettier                          |
| Linting                     | ESLint                            |
| Continuous integration      | GitHub Actions (planned)          |

The frontend and backend are built as one full-stack Bun application. Bun serves the generated React assets, while requests under `/api` are delegated to Elysia.

## Requirements

- Bun 1.4.4 or a compatible version

Docker will also be required once the PostgreSQL environment is introduced.

## Setup

Install dependencies using the lockfile:

```bash
bun install --frozen-lockfile
```

Generate PandaCSS output:

```bash
bun run panda:build
```

## Development

PandaCSS and Bun currently run as separate watch processes. Start them in two terminals.

Terminal 1:

```bash
bun run panda:watch
```

Terminal 2:

```bash
bun run dev
```

The application is then available at `http://localhost:3000`.

## Quality checks

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `bun run format`       | Format supported files with Prettier     |
| `bun run format:check` | Verify formatting without changing files |
| `bun run lint`         | Run ESLint                               |
| `bun run lint:fix`     | Apply ESLint's safe automatic fixes      |
| `bun run typecheck`    | Run TypeScript 6 type checking           |
| `bun run test`         | Run the Bun test suite                   |
| `bun run panda:check`  | Verify generated PandaCSS output         |

Run the current local quality gate with:

```bash
bun run format:check
bun run lint
bun run typecheck
bun run test
bun run panda:check
```

## Production build

Generate PandaCSS and build the full-stack application:

```bash
bun run build
```

Start the generated application in production mode:

```bash
bun run start
```

The production bundle is written to `dist/`, which is intentionally excluded from version control.
