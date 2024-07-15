# Testing Guidelines

1. Test Types:
   - Unit Tests: For individual functions and components.
   - Integration Tests: For interactions between core components.

2. Testing Framework:
   - Use Jest for unit and integration tests.

3. Component Testing:
   - Use React Testing Library for component tests.
   - Focus on testing component behavior, not implementation details.

4. API Integration Tests:
   - Mock API responses for consistent test results.
   - Test both success and error scenarios for critical API calls.

5. Test Coverage:
   - Aim for at least 70% code coverage for core functionality.
   - Prioritize testing critical business logic and main user flows.

6. Test Organization:
   - Group tests logically, mirroring the structure of the source code.
   - Use describe blocks to group related tests.

7. Naming Conventions:
   - Use descriptive test names: "it should... when..."
   - Name test files with .test.ts or .test.tsx extensions.

8. Asynchronous Testing:
   - Use async/await for asynchronous tests.
   - Ensure all asynchronous operations are properly waited for.

9. Mocking:
   - Use Jest's mocking capabilities for external dependencies.
   - Create simple mocks for Bonzo API responses.

10. Continuous Integration:
    - Run all tests before merging code.
    - Set up a basic CI pipeline to run tests automatically if possible.

Remember: Tests should provide confidence in the code's correctness and serve as documentation. Write clear, maintainable tests that focus on critical functionality and main user flows.
