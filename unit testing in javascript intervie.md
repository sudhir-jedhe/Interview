Here are comprehensive, interview-ready answers for **Q1 through Q23** from your JavaScript Unit Testing screenshots, designed to highlight practical developer experience, modern testing frameworks (Jest/Vitest), and core software architecture principles.

---

### **Q1 & Q19: How to unit test an object with database queries / Strategy for database-driven apps?**

Unit tests must run in isolation without connecting to a real database:

1. **Mock the Database Client/ORM:** Mock the database layer (e.g., Prisma, Knex, Mongoose, or `pg`) to return canned data structures.
2. **Repository Pattern:** Abstract database operations into repository methods so business logic functions accept an injected or mocked repository dependency.
3. **In-Memory Databases:** For integration tests, use lightweight in-memory databases (like SQLite in-memory or Dockerized test instances), but keep unit tests purely mocked for speed.

```javascript
// Example using Jest mocking a database service
import { getUserProfile } from "./userService";
import db from "./db";

jest.mock("./db"); // Mocks the database instance

test("returns user profile correctly", async () => {
  db.query.mockResolvedValue([{ id: 1, name: "Alice" }]); // Mock DB response
  const user = await getUserProfile(1);
  expect(user.name).toBe("Alice");
});
```

---

### **Q2 & Q9: Difference between Unit Tests, Integration Tests, and Functional Tests?**

| Test Type               | Scope                                          | Execution Speed                | Focus                                                                         |
| ----------------------- | ---------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| **Unit Test**           | Isolated function, module, or component.       | Extremely fast (milliseconds). | Logic correctness of single code units in isolation.                          |
| **Integration Test**    | Interaction between multiple modules/services. | Moderate speed.                | Verifies APIs, DB connections, or multi-component flows work together.        |
| **Functional/E2E Test** | Full system flow from end-user perspective.    | Slow (seconds to minutes).     | Validates business requirements and user journeys (e.g., Cypress/Playwright). |

---

### **Q3 & Q11: What is Mocking, and when/where should I use it?**

**Mocking** is the practice of replacing a real dependency (API, file system, database, timer, external module) with a fake implementation that simulates its behavior under controlled conditions.

**When to use Mocking:**

- Network calls (`fetch`, `axios`).
- Database or file system operations.
- Non-deterministic functions (`Date.now()`, `Math.random()`).
- Heavy dependencies that slow down test suites.

---

### **Q4: Should unit tests be written for Getters and Setters?**

- **No (generally):** Simple pass-through getters/setters (`get name() { return this._name; }`) do not contain business logic and add unnecessary maintenance overhead.
- **Yes:** Only if the getter/setter contains validation, transformations, calculations, or side effects.

---

### **Q5: What's the difference between Mocking an object or Spying on it?**

- **Mock:** Completely replaces the target object/function with a fake implementation, ignoring the original logic.
- **Spy:** Wraps an **existing real method**, allowing you to record execution metadata (call count, parameters, return values) while keeping the real implementation intact (or optionally overriding it).

```javascript
// Spy Example
const calculator = { add: (a, b) => a + b };
const spy = jest.spyOn(calculator, "add");

calculator.add(2, 3);
expect(spy).toHaveBeenCalledWith(2, 3); // Checks invocation without breaking functionality
```

---

### **Q6: What do I lose by adopting TDD? What are the disadvantages of Test Driven Development?**

- **Higher Initial Setup Time:** Writing tests before implementation slows down early prototyping phases.
- **Maintenance Overhead:** Poorly written tests coupled to implementation details require constant rewriting when refactoring code.
- **False Security:** Passing unit tests doesn't guarantee system integration or UX quality.
- **Learning Curve:** Requires discipline and training across the development team.

---

### **Q7, Q12 & Q22: Should I unit test private methods? How do I test a private method/class?**

- **Rule:** **Do not test private methods directly.**
- **Why:** Private methods are internal implementation details. Unit tests should test public contracts (inputs and outputs).
- **How to test them:** Test private methods **indirectly through public methods** that invoke them. If a private method becomes so complex that it needs its own dedicated unit tests, extract it into its own separate utility module with a public interface.

---

### **Q8: Fundamental value of Unit Tests vs Integration Tests?**

- **Unit Tests:** Provide fast feedback during development, precise error localization, and serve as executable documentation for individual functions.
- **Integration Tests:** Provide high confidence that distinct modules, services, and external interfaces work together correctly in real-world environments.

---

### **Q10: Name some Unit Testing benefits for devs that you personally experienced**

1. **Refactoring Confidence:** Safely upgrade dependencies or rewrite internal code without breaking existing features.
2. **Built-in Documentation:** Tests explicitly demonstrate how functions are supposed to be invoked and handled.
3. **Better Software Design:** Writing unit tests forces modular, loosely-coupled code structures (Dependency Injection).

---

### **Q13: How can I unit test a GUI?**

Use component testing frameworks like **React Testing Library** or **Vue Testing Library**:

1. Focus on testing **user interactions and DOM state** (e.g., clicking buttons, firing input events).
2. Avoid testing internal component implementation state.
3. Query elements by accessible roles and labels (`getByRole('button', { name: /submit/i })`).

---

### **Q14 & Q16: Is writing Unit Tests worth it for already existing/exciting production projects?**

**Yes**, but avoid attempting 100% coverage immediately:

1. Start by adding tests around **critical business paths** and frequently modified features.
2. Add a unit test whenever a bug is reported to reproduce and prevent regressions (**Regression Testing**).
3. Enforce unit tests on all **newly created features and refactored code**.

---

### **Q15: What is a reasonable Code Coverage % for unit tests (and why)?**

- **Target:** **70% – 80% coverage**.
- **Why:** Chasing 100% code coverage leads to diminishing returns, forcing developers to write trivial tests for boilerplate code rather than testing complex edge cases. Coverage measures which lines executed, not whether the assertions are meaningful.

---

### **Q17: Explain what is Arrange-Act-Assert (AAA) pattern?**

The **AAA pattern** is a standard structure for organizing unit test code cleanly:

1. **Arrange:** Set up variables, state, mocks, and inputs required for the test.
2. **Act:** Invoke the target function or method being tested.
3. **Assert:** Verify that the output matches expected results or side effects.

```javascript
test("calculates discount correctly", () => {
  // Arrange
  const price = 100;
  const discountRate = 0.2;

  // Act
  const finalPrice = calculateDiscount(price, discountRate);

  // Assert
  expect(finalPrice).toBe(80);
});
```

---

### **Q18: What are best practices for Unit Testing methods that use cache heavily?**

1. **Inject the Cache Instance:** Pass the caching layer as a dependency so it can be mocked or reset easily in tests.
2. **Test Cache Miss:** Verify that the primary source (e.g., DB or API) is called when cache is empty, and the cache is updated with the result.
3. **Test Cache Hit:** Verify that data is returned directly from the cache without hitting the underlying DB/API.
4. **Isolate Cache State:** Clear or flush the cache in `beforeEach()` hooks to prevent test leakage across cases.

---

### **Q20: What is Unit test, Integration Test, Smoke test, Regression Test and what are the differences between them?**

| Test Type            | Definition & Purpose                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Unit Test**        | Tests individual functions or components in strict isolation.                                                 |
| **Integration Test** | Tests interactions between multiple modules, databases, or external services.                                 |
| **Smoke Test**       | Quick high-level check ("sanity check") after a deployment to ensure core builds and basic paths don't crash. |
| **Regression Test**  | Running test suites after code changes to guarantee existing features weren't broken by new code.             |

---

### **Q21: What is the best way to unit test a method that doesn't return anything (`void`)?**

Since `void` methods have no return value, test their **observable side effects**:

1. **State Mutation:** Check if an object's internal state changed as a result of the call.
2. **Interaction Testing:** Verify that dependencies (e.g., logger, API, DB) were called with expected arguments using **spies or mocks**.

```javascript
test("logs user action on audit", () => {
  const loggerSpy = jest.spyOn(logger, "info");
  auditUserAction("USER_LOGIN"); // void function

  expect(loggerSpy).toHaveBeenCalledWith("Action logged: USER_LOGIN");
});
```

---

### **Q23: Is Unit Testing worth the effort?**

**Yes.** While unit testing adds upfront development effort, it drastically reduces long-term software maintenance costs, lowers production bug occurrences, speeds up continuous integration pipelines, and enables confident code refactoring at scale.
