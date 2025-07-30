# Testing Strategy Prompts

## Unit Test Generation
**Goal:** Generate unit tests for a component or function.

**Prompt:**
"Generate unit tests for the `[ComponentNameOrFunctionName]` using `[TestingFramework]`. The tests should cover the following cases: `[list of test cases]`. The output should be a single test file."

## Integration Test Generation
**Goal:** Generate integration tests for a feature.

**Prompt:**
"Generate integration tests for the `[feature name]` feature. The tests should verify the interaction between `[component1]`, `[component2]`, and `[backend_endpoint]`. The tests should use `[TestingFramework]` and `[MockingLibrary]`."

## End-to-End Test Generation
**Goal:** Generate end-to-end tests for a user flow.

**Prompt:**
"Generate an end-to-end test for the `[user flow name]` user flow. The test should use `[E2EFramework]` to `[description of user actions]`. The test should assert that `[expected outcome]`."
