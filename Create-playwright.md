FX API Test Framework (Playwright + Docker)
Overview

This setup consists of two independent repositories designed to keep API testing logic reusable, portable, and environment-agnostic.

Repositories

fx-common-utilities
A shared, Dockerized utilities library that contains:

Environment configurations

API route definitions

API agent libraries

Shared helpers

fx-test-meta_data
A Playwright-based API test framework that:

Consumes fx-common-utilities as a Docker image

Focuses purely on test orchestration and assertions

Remains lightweight and environment-driven

This separation allows multiple test repos to reuse the same FX API logic without duplication.

Repository 1: fx-common-utilities
Purpose

Centralize FX API configuration and behavior

Provide reusable API agents

Abstract environment and endpoint management

Package everything as a Docker image consumable by test frameworks

Directory Structure
fx-common-utilities/
├─ README.md
├─ package.json
├─ package-lock.json
├─ playwright.config.js
├─ src/
│  ├─ configs/
│  │  ├─ env/
│  │  │  ├─ dev.json
│  │  │  ├─ uat.json
│  │  │  └─ ppe.json
│  │  ├─ route_endpoints/
│  │  │  └─ fx_meta_data_endpoints.json
│  ├─ libs/
│  │  └─ fx_meta_data_api_agent.js
│  ├─ utils/
│  │  ├─ http_client.js
│  │  ├─ logger.js
│  │  └─ validators.js
│  └─ index.js
├─ docker/
│  ├─ Dockerfile
│  └─ entrypoint.sh
└─ .gitignore
Key Concepts
Environment Configs (configs/env)

Each environment JSON defines:

baseUrl

timeouts

authentication parameters

feature toggles

Example:

{
  "env": "dev",
  "baseUrl": "https://fx-dev.example.com",
  "timeout": 30000
}
Route Endpoints (configs/route_endpoints)

All API paths are declared once and reused everywhere.

Example:

{
  "getMetaData": "/api/fx/meta-data",
  "health": "/api/health"
}
API Agents (libs)

Encapsulate API behavior, not tests.

class FxMetaDataApiAgent {
  async getMetaData() {}
}

Agents:

Know what to call

Do not assert

Do not depend on test framework logic

Repository 2: fx-test-meta_data
Purpose

Execute API tests using Playwright

Consume fx-common-utilities as a Docker dependency

Focus on test intent, not API mechanics

Directory Structure
fx-test-meta_data/
├─ README.md
├─ package.json
├─ package-lock.json
├─ playwright.config.js
├─ tests/
│  ├─ api/
│  │  ├─ meta_data/
│  │  │  ├─ get_meta_data.spec.js
│  │  │  ├─ negative_cases.spec.js
│  │  │  └─ contract_validation.spec.js
│  │  └─ health/
│  │     └─ health.spec.js
│  ├─ fixtures/
│  │  ├─ request_bodies/
│  │  └─ expected_responses/
│  └─ helpers/
│     ├─ test_context.js
│     └─ assertions.js
├─ docker/
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  └─ run-tests.sh
├─ reports/
│  ├─ playwright-report/
│  └─ results/
└─ .gitignore
Docker Relationship
fx-common-utilities

Built and published as a Docker image

Contains configs, routes, and API agents

fx-test-meta_data

Uses:

FROM fx-common-utilities:latest

Imports utilities via Node module or mounted path

Executes Playwright tests on top

Environment Selection

Tests are environment-driven using a single variable:

ENV=dev | uat | ppe

Resolution order:

ENV variable

Load matching env/{ENV}.json

Inject into API agents and test context

Design Principles

✔ Separation of concerns
✔ Config-driven testing
✔ Docker-first execution
✔ Zero duplication of API logic
✔ Test repos stay small and focused
✔ Utilities evolve independently

Typical Flow

API routes & logic live in fx-common-utilities

Test scenarios live in fx-test-meta_data

Docker binds them together at runtime

Same utilities → multiple test suites
