# System Design Prompts

## High-Level Architecture
**Goal:** Design a scalable and maintainable architecture for the project.

**Prompt:**
"Given the following project requirements, design a high-level system architecture. The design should include the main components, their responsibilities, and the interactions between them. The output should be a JSON object with a `diagram` (in MermaidJS format) and a `description` of the architecture."

## Technology Stack Selection
**Goal:** Select the most appropriate technology stack for the project.

**Prompt:**
"Based on the project requirements and the designed architecture, recommend a technology stack. The recommendation should include choices for the frontend, backend, database, and any other relevant services. Justify each choice. The output should be a JSON object with a `stack` object and a `justification` for each choice."

## Database Schema Design
**Goal:** Design a database schema that meets the project's data storage needs.

**Prompt:**
"Design a database schema for the project. The schema should include tables, columns, data types, and relationships. The output should be a JSON object with a `schema` object, where each key is a table name and the value is an array of column definitions."
