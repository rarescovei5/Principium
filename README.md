# Principium Studio

**Principium** is an open-source project focused on rebuilding high-quality versions of popular apps — without locking essential features behind paywalls.

This repository hosts the **full stack** of the Principium platform:

- 🧠 **Backend** – Built in **Rust** with Actix Web and PostgreSQL (see [actix-backend](./actix-backend/README.md))
- 💻 **Frontend** – A modern UI for managing code snippets and user sessions (not yet implemented)
- 🖥️ **Store App (Desktop)** – A **Tauri + React + TypeScript** app manager that fetches a generated `apps.json` catalog from `principium-app-infos` (see [store-app](./store-app/README.md))
- 🗄️ **Database & Schema** – Designed with SQLx and Docker-based provisioning

## 🧩 Apps We're Building

| Name                                                     | Type            | Inspired By      | Status         |
| -------------------------------------------------------- | --------------- | ---------------- | -------------- |
| VSC Code Snippets                                        | Snippet Manager | -                | ✅ Working     |
| [Write Right](https://github.com/rarescovei5/WriteRight) | Markdown Editor | Notion, Obsidian | 🛠️ In Progress |
| [Task Track](https://github.com/rarescovei5/TaskTrack)   | Kanban Board    | Trello, Notion   | 🛠️ In Progress |

## 🔌 Backend API

Backend/API documentation (features + routes) lives in `actix-backend/README.md`.

## 📄 License

Licensed under the MIT License.
