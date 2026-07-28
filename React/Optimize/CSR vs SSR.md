https://learnersbucket.com/examples/web/single-page-application-csr-vs-multi-page-application-ssr/

In this tutorial, we will understand the difference between a single-page application (client-side rendered or CSR) and a multi-page application (server-side rendered or SSR).

Single page application (CSR) vs Multi page application (SSR)

Even though the capabilities of JavaScript have increased and it can now be used to create mobile apps and desktop apps, but its prominent usage is still more for the web applications.

Web applications have become more performant and they can be rendered as it is inside the mobile view and desktop app given the feeling of using native applications while still they can be coded as web applications.

All this has been possible because of the advancement in the rendering patterns of web applications.

Advertisements
Ezoic
While there are many, we are going to discuss two specifics ones, which are the most popular, Single page application (CSR) and Multi-page application (SSR).

Understanding both is extremely crucial as none of it is better than the other, it is all about the use case you are dealing with, and knowing both will help you to create a performance-efficient web application.

Multi page application (Server Side rendered or SSR)
The term Multi-page refers that every time you navigate on the web application, a new HTML page is generated on the server and is returned to the browser, where the browser parses the HTML and displays the content.

Working of Multi-page application (Server side rendered or SSR)

These are the traditional rendering patterns that have been followed since the inception of web applications.

When a request to the server is made, the server generates the HTML page with all the content pre-filled and it returns it to the browser, where the browser applies all the styles or CSS, loads the assets, and shows the page.

While introduction of Ajax has reduced the number of round-trips to the server as the data can be fetched asynchronously and the UI can be updated on the run-time. But it can be only used for minor operations.

Advantages of Multi-page application (SSR)
Better SEO, As the HTML is generated on the server side, all the meta tags, title, description, and other things that affect SEO are generated beforehand making it easier for the search engine crawlers to crawl the page which results in a better ranking.
Scalable, As the pages are generated on the server, you can create as many extended pages as possible without really making any code changes.
More Secure, Better for security as the forms that handle user’s data can be prevented from the Cross-site scripting attacks.
Faster Initial load, As the HTML page is generated on the server with the data already populated, it is faster to load it.
Disadvantages of Multi-page application (SSR)
Slow, as every time the user navigates, the request goes back to the server and it returns the new HTML (that also increases the response payload size) which has to be parsed, rendered, and shown in the browser.
Tightly coupled, The frontend and backend code are strongly coupled, as while the HTML is being generated it is populated with the data.
Applications of Multi-page application (SSR)
Best suited for applications that require search engine optimization.
Single page application (Client Side rendered or CSR)
Single page application as the term suggests, is composed of a single HTML file that is loaded only once along with all the static files such as CSS, JavaScript, and media assets and renders the application on the client side after loading the assets in the browser.

It uses client-side navigation (JavaScript based on the browser) that on page change, requests for only data from the server and updates the UI on run time.

Working of single page application (client-side rendered or CSR)

To understand why single page application is effective, we should first understand how an HTML page is rendered in the browser.

In the multi-page application, every time the server returns a fresh HTML page, that has to be parsed, constructed, and then rendered again. Even though modern browsers are more capable, it is still a performance-inefficient process to render HTML, especially in the mobile browser.

Advertisements
×
Ezoic
The modern JavaScript frameworks are trying to solve this by minimizing the DOM manipulation and HTML rendering with the implementation of Virtual DOM and other better reconciliation algorithms to update only what changes.

You can use React, Angular, Vue, etc to create single-page applications. It effectively uses the concept of Asynchronous programming (Ajax) where it requests the data from the server when required, reducing the server response time as it does not have to generate and return the whole HTML and renders the DOM with this new data the runtime.

Advantages of Single page application (CSR)
Blazing fast, as the static files are loaded only once on the initial render, and after that only required data is pulled from the server and UI is updated on runtime. Also the the JavaScript code that is not required on initial load can be split in different bundles and lazy loaded, reducing the JavaScript execution time in browser.
Decoupled, the frontend and backend can be developed independently resulting in faster development.
Extendable, the same frontend application can be used to create mobile or desktop apps without any major code changes, all thanks to these modern JavaScript frameworks.
Disadvantages of Single page application (CSR)
Poor SEO, As there is a single HTML page, it becomes difficult to handle the SEO and update the search engine crawlers.
Navigation, at times when an application becomes bigger, it becomes difficult to handle the browser history and navigation.
Security, there is an increased threat for cross-site scripting attacks for single page applications.
Slower Initial load, As all the static files are loaded at once on the initial call, it becomes little slower if the JavaScript bundle size is bigger as only after its loading and parsing, the HTML page will be constructed.
Memory usage, As the page building heavily relies on the JavaScript, large builds consume lots of memory and there is also chance of memory leakage if it is not handled properly.
Applications of Single page application (CSR)
It is best suited for web applications that do not require SEO like Analytics dashboard, Admin dashboards, Personal portfolios, Real time data showcase, etc.
Conclusion: SPA (CSR) vs MPA (SSR)
While both of them have their use cases, they are suited for the different requirements.

Single-page applications (CSR) can be most suited where we you want to show real-time data without worrying about the SEO issues and provide better user interactions.

Multi-page applications (SSR) can be used where the SEO is the major factor such as E-commerce, Blogs, SaaS, etc.

For the multi-page applications, you can use the hybrid approach with modern JavaScript frameworks such as Nextjs to take advantage of both of these.

Also read about Statis site generation (SSG) vs Incremental Static regeneration (ISR)
