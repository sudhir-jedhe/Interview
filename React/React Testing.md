### **React Testing**

#### 1. **What is React Intl?**

React Intl is a library for handling internationalization (i18n) in React applications. It provides APIs for formatting dates, numbers, strings, and currencies in a way that adapts to the user's locale and language preferences.

**Example**:

```bash
npm install react-intl
```

---

#### 2. **What are the main features of React Intl?**

- **Localization**: Provides tools for localizing content (dates, times, numbers).
- **Formatted Message**: Renders formatted strings in the appropriate language.
- **Pluralization and Gender Support**: Handles plural forms based on context.
- **Date/Time Formatting**: Formats dates and times according to the user's locale.
- **Number/Currency Formatting**: Supports locale-specific formatting for numbers and currencies.

---

#### 3. **What are the two ways of formatting in React Intl?**

- **Message Format**: For formatting dynamic strings with placeholders.
- **Number/Date/Currency Format**: For formatting numbers, dates, and currencies.

**Example**:

```jsx
import { FormattedNumber, FormattedDate } from 'react-intl';

<FormattedNumber value={1000} style="currency" currency="USD" />
<FormattedDate value={Date.now()} />
```

---

#### 4. **How to use FormattedMessage as a placeholder using React Intl?**

You can use `FormattedMessage` to handle dynamic placeholders in strings.

**Example**:

```jsx
import { FormattedMessage } from "react-intl";

const message = <FormattedMessage id="greeting" values={{ name: "John" }} />;
```

---

#### 5. **How to access the current locale with React Intl?**

You can access the current locale by using `injectIntl` or the `useIntl` hook in a function component.

**Example**:

```jsx
import { useIntl } from "react-intl";

const LocaleDisplay = () => {
  const { locale } = useIntl();
  return <div>Current Locale: {locale}</div>;
};
```

---

#### 6. **How to format a date using React Intl?**

You can use the `FormattedDate` component to format dates.

**Example**:

```jsx
import { FormattedDate } from "react-intl";

<FormattedDate value={Date.now()} year="numeric" month="long" day="2-digit" />;
```

---

### **React Internationalization**

#### 7. **What is Shallow Renderer in React testing?**

The Shallow Renderer is used for testing a component in isolation, without rendering its child components. It is useful for unit testing.

**Example**:

```jsx
import { shallow } from "enzyme";
const wrapper = shallow(<MyComponent />);
expect(wrapper.find("button").text()).toBe("Click me");
```

---

#### 8. **What is the TestRenderer package in React?**

The `TestRenderer` package is used for rendering React components for testing purposes, providing a way to test the component tree and its properties.

**Example**:

```javascript
import TestRenderer from "react-test-renderer";
const testRenderer = TestRenderer.create(<MyComponent />);
console.log(testRenderer.toJSON());
```

---

#### 9. **What is the purpose of the ReactTestUtils package?**

`ReactTestUtils` is a utility library for simulating events and interacting with components during tests. It provides methods for simulating clicks, changes, and other user interactions.

**Example**:

```javascript
import { Simulate } from "react-dom/test-utils";
Simulate.click(buttonElement);
```

---

#### 10. **What is Jest?**

Jest is a JavaScript testing framework by Facebook used for writing unit and integration tests. It includes a test runner, assertion library, and mock functionality.

---

#### 11. **What are the advantages of Jest over Jasmine?**

- **Built-in test runner**: Jest has a built-in test runner, while Jasmine requires a separate runner like Karma.
- **Snapshot Testing**: Jest supports snapshot testing out-of-the-box.
- **Mocking**: Jest provides a better and easier API for mocking.
- **Zero Config**: Jest requires no configuration to get started, while Jasmine needs more setup.

---

#### 12. **Give a simple example of a Jest test case.**

**Example**:

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```
