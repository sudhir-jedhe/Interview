When building apps with React, it’s important to know when to use client components and when to use server components.

🔹 Client Components:

1. Whenever your need to add interactivity and event listeners such as onClick(), onChange(), etc to the pages.
💡Example : A form that updates in real-time as users type or click.

2. If you need to use State and Lifecycle Effects like useState(), useReducer(), useEffect() etc.
💡Example: A switch to change between light and dark themes on a user profile page.

3. If there is a requirement to use browser-only APIs.
💡Example: A photo uploader that uses the browser’s FileReader API.

4. If you need to implement custom hooks that depend on state, effects, or browser-only APIs.
💡Example: A custom hook to check if the user is online using the browser’s navigator.onLine.

5. There are React Class components in the pages.

🔹 Server Components:

1. If the component logic is about data fetching.
💡Example: A blog that loads posts from a CMS and shows them quickly.

2. If you need to access backend resources directly.
💡Example: An admin dashboard that pulls sensitive data from a database.

3. When you need to keep sensitive information((access tokens, API keys, etc) ) on the server.
💡Example: Protecting payment processing details by handling them on the server.

4. If you want reduce client-side JavaScript and placing large dependencies on the server
💡Example: Complex data processing for reports done on the server, so users get a faster experience.
