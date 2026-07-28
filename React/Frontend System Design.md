https://learnersbucket.com/examples/frontend-system-design/what-to-expect-in-frontend-system-design/

We already discussed what system design is in software engineering in detail. I would summarise it here again, but I would advise you to read the article once for in depth understanding with real-life example.

System design is a concept in software engineering and is mostly asked during interviews, but senior engineers do it daily at work when designing the architecture of the product.

Before starting the development of any product or feature, the architecture is discussed in theory or through a POC (proof of concept), considering different scenarios so that there is at least one strong foundation to commence the development that the team has brainstormed and agreed on.

This is often referred to as creating the solution architecture in a technical specification document, where you list all the possible approaches, the finalised approach, the pros and cons of using the approaches, the tech stack, the server stack, deployment strategies, monitoring and alerting, etc.

And for the frontend, we will specifically discuss the ecosystems where HTML, CSS, and JavaScript run, i.e., in browsers, mobile apps, desktop apps, etc., along with the application-level things like deciding the rendering pattern, usage of state management tools, authorization and authentication techniques, etc.

Advertisements
×
Ezoic
What is frontend system design?
What to expect in frontend system design?

Frontend system design is a vague term as it does not specify which frontend it is referring to. Frontend is any application that the user interacts with; it can be a web app, mobile app, desktop app, TV app, watch UI, or any other application.

For native mobile apps built in Android or SwiftUI, it would be a little bit different to discuss their designing of system as they work differently and on different platform. The same goes for the desktop app, TV app, or gaming consoles.

Here we are going to specifically discuss on the web application’s system designs and the browser ecosystem, where we will be using HTML, CSS, and JavaScript and what to expect in frontend system design?.

Prepare for your JavaScript Interview practically on each Interview rounds and grab that job.
Web development is a big field, and there are many things that have to be covered when designing a system around it. Mostly, we divide the system design into two types.

High-level design
Low-level design
What is high-level design for frontend?
In the high-level design, usually the architecture of the application is explained through diagrams and flow charts, highlighting the major components and how they will interact with each other. It gives a broader picture of the application workflow.

For example, during the interviews if you are asked to provide high-level design for any frontend applicaiton. You will create an architecture diagram with how the user will access the application, that is on mobile, web, desktop, and based on this decide the tech stack you will use, the rendering architecture you will prefer (client-side rendered, server-side rendered), the application architecture such as micro-frontend, MVVM, etc you will prefer, how authorization will take place among the applications and more.

In my opinion, high-level gives an overview of what can be used to create the product, while low-level goes deep into how to do it.

To ace the frontend high-level system design interview rounds, you should be well versed with the following topics.

Platform identification (Mobile, Web, Desktop)
Rendering strategy (CSR, SSR, SSG, ISR)
Frontend application architecture (Micro-frontend, MVVM)
Internationalization
Testing strategy (E2E)
Tech Stack finalization
Tools integration
Error monitoring, logging, and tracing
User analytics monitoring, logging.
Security
Authentication and authorization
Data exchange, sharing, storing, and caching strategies
CI and deployment strategy
What is low-level design for frontend?
Low-level design generally refers to application-level architectures and code-level implications.

During the frontend low-level design interviews, you go through the mock-ups, wirefames, Figma, break the application in multiple features and then modules and finally to the component. Decide on the API needed and request and response payloads for the API’s, the design pattern you will follow, how will you handle the error if any component or feature breaks down, write the code to showcase its implementation, the user flow, user/customer experience, data sharing between components, etc.

To ace the low-level front end system design interviews, you should be clear with the following listed topics.

File and folder structure
Design system (CSS styling and optimisation)
Component designing
Route management and normalisation
State management and normalisation
Instrumentation
API contract finalisation (request and response payloads)
Error handling
HTML and SEO optimisation
Performance optimisation
Pagination, lazy loading, and skeleton UI
Accessibility
Bundling and caching techniques
Unit testing, e2e testing
Versioning
Design pattern
Security practices and form management
Authorization and user role management
Best practices and guidelines for code reviews
Team collaboration and task distribution
