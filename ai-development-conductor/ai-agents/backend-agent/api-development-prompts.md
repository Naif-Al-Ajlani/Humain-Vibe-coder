# API Development Prompts

## REST API Endpoint
**Goal:** Create a new REST API endpoint.

**Prompt:**
"Create a new REST API endpoint at `[endpoint_path]` that handles `[HTTP_method]` requests. The endpoint should `[description of what it does]`. The response should be a JSON object with `[response_format]`. The code should be in a new Express.js router file."

## Database Integration
**Goal:** Integrate an endpoint with the database.

**Prompt:**
"Integrate the `[endpoint_path]` endpoint with the database. The endpoint should `[description of database interaction]`. The response should include data from the database. Use the `[database_library]` library to interact with the database."

## Authentication Middleware
**Goal:** Add authentication to an endpoint.

**Prompt:**
"Add authentication middleware to the `[endpoint_path]` endpoint. The middleware should verify a JWT token and ensure the user has the `[required_role]` role. If authentication fails, the middleware should respond with a `401 Unauthorized` error."
