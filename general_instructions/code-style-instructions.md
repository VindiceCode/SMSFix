# Code Style and Best Practices

1. Naming Conventions:
   - Use camelCase for variable and function names.
   - Use PascalCase for class and component names.
   - Use UPPER_CASE for constants.

2. File Structure:
   - Group related files in appropriate directories (components, services, utils).
   - Use index.ts files to simplify imports where beneficial.

3. TypeScript Usage:
   - Use strong typing. Avoid 'any' type unless absolutely necessary.
   - Create interfaces for main data structures (e.g., Account, Contact, Metric).

4. React Best Practices:
   - Use functional components and hooks.
   - Keep components focused on a single responsibility.
   - Use React.memo() for performance optimization only when necessary.

5. State Management:
   - Use React Context for global state (e.g., authentication, global settings).
   - Prefer local state (useState) for component-specific data.

6. Asynchronous Operations:
   - Use async/await for asynchronous code.
   - Handle errors with try/catch blocks.

7. Comments and Documentation:
   - Write self-documenting code where possible.
   - Use JSDoc comments for main functions and complex logic.

8. Code Formatting:
   - Use consistent indentation (2 spaces recommended).
   - Limit line length to 80-100 characters.
   - Use Prettier for automatic formatting if available.

9. Performance Considerations:
   - Optimize expensive calculations with useMemo when needed.
   - Use useCallback for function memoization when passing functions as props to child components.

10. Security:
    - Never store sensitive information (like API keys) in client-side code.
    - Sanitize user inputs to prevent XSS attacks.

Always prioritize clean, readable, and maintainable code. When in doubt, favor clarity over complexity.
