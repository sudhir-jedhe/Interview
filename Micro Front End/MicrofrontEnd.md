# Micro Frontend Interview Questions (Senior / Lead / Architect Level)

Based on common industry topics such as **Module Federation, independent deployment, shared dependencies, state management, routing, and cross-framework integration** and internal examples discussing React/Angular micro-frontend integration, dependency sharing, event-based communication, and migration challenges. [[index.dev]](https://www.index.dev/interview-questions/micro-frontend), [[climbtheladder.com]](https://climbtheladder.com/micro-frontend-interview-questions/), [[liveloveapp.com]](https://liveloveapp.com/blog/2022-12-05-20-questions-microfrontends) [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1), [[AI_Intevie...003242 (1) | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Girija%20Ghatge%2000003242%20%281%29.pdf?web=1), [[12 MM Micr...ds 26 July | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B098E59EE-13D7-4387-AA2A-692D3B65D100%7D&file=12%20MM%20MicroFrontEnds%2026%20July.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 1\. Fundamentals

### Q1. What is a Micro Frontend and what problem does it solve?

**Expected discussion**

- Independent teams
- Independent deployment
- Scaling large frontend applications
- Domain-driven architecture
- Reduced coupling

---

### Q2. When would you NOT use Micro Frontends?

**Expected discussion**

- Small teams (< 5 developers)
- Small applications
- Unnecessary complexity
- Increased operational overhead

---

### Q3. Compare Monolith vs Micro Frontends.

**Expected discussion**

Team Ownership

Deployment

Build Times

Complexity

Performance

Testing

---

# 2\. Architecture Design

### Q4. Design a Micro Frontend architecture for an E-Commerce platform.

Modules:

Shell

Product Catalog

Search

Cart

Checkout

Profile

Orders

**Expected discussion**

- Host application
- Domain ownership
- Independent deployment
- Shared design system

---

### Q5. How do you split Micro Frontends?

**Expected discussion**

### Vertical Split

Product

Cart

Checkout

### Horizontal Split

Header

Body

Footer

Vertical/domain-based split is generally preferred for ownership and scalability. [[12 MM Micr...ds 26 July | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B098E59EE-13D7-4387-AA2A-692D3B65D100%7D&file=12%20MM%20MicroFrontEnds%2026%20July.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 3\. Module Federation

### Q6. What is Webpack Module Federation?

**Expected discussion**

- Host
- Remote
- Runtime loading
- Shared dependencies

---

### Q7. How does Module Federation work internally?

**Expected discussion**

RemoteEntry.js

Host loads remote

Runtime container

Shared dependency resolution

---

### Q8. How would you handle different React versions across Micro Frontends?

**Expected discussion**

Singleton

shared deps

strictVersion

fallback strategy

Version mismatch and shared React dependency management are commonly discussed MFE challenges. [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1), [[medium.com]](https://medium.com/@rupalsinghal/want-to-ace-frontend-interviews-understand-micro-frontend-architecture-a01ef45d9c52)

---

# 4\. Communication

### Q9. How do two Micro Frontends communicate?

**Expected discussion**

Custom Events

Event Bus

Shared State

URL

Backend

Internal examples describe React and Angular MFEs communicating using custom events. [[AI_Intevie...003242 (1) | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Girija%20Ghatge%2000003242%20%281%29.pdf?web=1)

---

### Q10. How would you share state between MFEs?

**Expected discussion**

Redux

RxJS

EventBus

Custom Events

Backend Session

---

### Q11. React Cart MFE needs to notify Angular Checkout MFE. How would you design it?

**Expected discussion**

window.dispatchEvent(

new CustomEvent(...)

)

Cross-framework communication using custom events. [[AI_Intevie...003242 (1) | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Girija%20Ghatge%2000003242%20%281%29.pdf?web=1)

---

# 5\. Routing

### Q12. How do you manage routing across MFEs?

**Expected discussion**

Shell Routing

Nested Routing

Route Ownership

Deep Linking

---

### Q13. Host uses React Router while remote uses Angular Router. How would you handle navigation?

---

# 6\. Performance

### Q14. What performance challenges do MFEs introduce?

**Expected discussion**

Multiple Bundles

Duplicate React

Extra Network Requests

CSS Duplication

---

### Q15. How do you optimize MFE performance?

**Expected discussion**

Shared Libraries

Lazy Loading

Code Splitting

CDN

Prefetching

---

# 7\. Shared Dependencies

### Q16. How do you prevent React from being downloaded multiple times?

**Expected discussion**

shared: {

react: {

   singleton: true

}

}

---

### Q17. How do you manage UI library versions?

**Expected discussion**

Shared Dependency Strategy

Design System Governance

Version Policies

Shared dependency management is a common integration concern. [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

# 8\. Security

### Q18. How would you implement Authentication across Micro Frontends?

**Expected discussion**

SSO

JWT

OAuth

Central Identity Provider

---

### Q19. How do MFEs share authenticated user information?

---

# 9\. Testing

### Q20. How do you test Micro Frontends?

**Expected discussion**

Unit Testing

Contract Testing

Integration Testing

E2E Testing

---

### Q21. What is Contract Testing in MFEs?

**Expected discussion**

API Contract

Event Contract

Interface Contract

---

# 10\. Real-World Debugging

### Q22. A remote application loads locally but fails in production. How would you debug it?

**Expected discussion**

RemoteEntry.js

CDN

CORS

Environment Variables

Version Mismatch

---

### Q23. One MFE works independently but not inside Host App. How would you debug?

A real-world example found internally involved React version conflicts between host and remote applications causing rendering issues. [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

**Expected discussion**

Shared Dependencies

Module Federation Config

Runtime Logs

Bundle Analysis

---

# 11\. Architect-Level Scenarios

### Q24. Design an MFE platform supporting:

React

Angular

Vue

simultaneously.

**Expected discussion**

Web Components

Module Federation

Event Bus

Design System

---

### Q25. How would you migrate a 500K LOC React monolith into MFEs?

**Expected discussion**

Strangler Pattern

Domain Extraction

Shell App

Incremental Migration

---

### Q26. How do you avoid "Micro Frontend Anarchy"?

**Expected discussion**

Design System

Architecture Guidelines

Shared Libraries

Version Governance

CI/CD Standards

---

# Architect-Level Question (Most Asked)

### Q27. Why did your team choose Micro Frontends, and what challenges did you face?

**Expected discussion**

- Team autonomy
- Faster deployment
- Independent releases
- State sharing
- Routing
- Shared React versions
- Performance
- Communication between MFEs

These are recurring themes in internal MFE migration and integration discussions. [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1), [[AI_Intevie...003242 (1) | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Girija%20Ghatge%2000003242%20%281%29.pdf?web=1), [[12 MM Micr...ds 26 July | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B098E59EE-13D7-4387-AA2A-692D3B65D100%7D&file=12%20MM%20MicroFrontEnds%2026%20July.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

## Top 5 Questions Frequently Asked in Senior React Interviews

1.  **Explain Module Federation and how it works internally.**
2.  **How would you share state across Micro Frontends?**
3.  **How do you handle React version conflicts?**
4.  **Design a Micro Frontend architecture for an e-commerce platform.**
5.  **How would you migrate a monolithic React application to Micro Frontends without downtime?**

These are excellent questions for your **10+ years React Project Lead / Architect interview preparation**.

## 1\. Challenges in Micro Frontend State Management

State management is one of the hardest problems in Micro Frontends because each application is designed to be **independently developed and deployed**, yet parts of the UI still need to share information. Internal MFE discussions highlight the need for routing and state coordination while maintaining loose coupling between modules.

### Challenge 1: Shared Global State

Example:

Cart MFE

↓

Checkout MFE

↓

Profile MFE

`

All need access to:

User

Cart

Permissions

Problems:

- Duplicate state across MFEs
- State synchronization issues
- Multiple sources of truth
- Race conditions

---

### Challenge 2: Framework Differences

Example:

React MFE

Angular MFE

Vue MFE

Each framework has its own state solution:

Redux

NgRx

Pinia

Sharing these directly creates tight coupling.

---

### Challenge 3: Versioning

One MFE may expect:

user.role

``

while another expects:

user.permissions

Schema drift can break applications at runtime.

---

### Challenge 4: Event Synchronization

Many teams use:

Custom Events

Event Bus

for communication.

Problems:

Missed Events

Event Ordering

Timing Issues

Duplicate Events

Internal examples describe React and Angular MFEs communicating through custom events and the challenges of coordinating them correctly.

---

### Common State Management Strategies

#### Event-Driven

window.dispatchEvent(

  new CustomEvent(

    "cart:updated"

  )

);

Best for:

Loose Coupling

Cross Framework Communication

---

#### Shared Global Store

Redux

RxJS

Zustand

Best for:

Frequently Shared Data

---

#### Backend as Source of Truth

Cart

User

Permissions

stored on server and refreshed by each MFE.

Best for:

Large Enterprise Systems

---

# 2\. Micro Frontend Deployment Strategies

One of the biggest benefits of MFEs is independent deployment. Internal MFE documentation explicitly identifies independent deployment and autonomous ownership as key drivers for adopting Micro Frontends.

---

## Strategy 1: Independent Deployment (Most Common)

Host Application

↓

Loads Remote MFEs

Example:

Cart

Deploys Independently

Checkout

Deploys Independently

Benefits:

✅ Faster releases

✅ Team autonomy

✅ Reduced coordination

---

## Strategy 2: Module Federation Runtime Loading

Host App

↓

remoteEntry.js

↓

Load Remote at Runtime

Benefits:

No Host Rebuild Required

Shared dependency management through Module Federation is commonly used to avoid duplication and version conflicts.

---

## Strategy 3: Blue-Green Deployment

Version A

Version B

switch traffic gradually.

Good for:

High Availability

---

## Strategy 4: Canary Releases

5% Users

↓

20% Users

↓

100% Users

Useful for large-scale enterprise deployments.

---

## Strategy 5: CDN-Based Deployment

Remote Assets

↓

CDN

↓

Host Downloads Latest Version

Benefits:

Low Latency

Fast Rollbacks

---

# Deployment Challenges

### Version Mismatch

A real-world issue recorded internally involved different React versions between host and remote MFEs causing rendering and hook failures.

Typical fix:

shared: {

  react: {

    singleton: true

  }

}

---

### Shared Libraries

Problems:

Duplicate React

Duplicate UI Library

Bundle Bloat

Teams often solve this using shared dependency strategies and Module Federation configuration.

---

# 3\. Tools for Debugging Micro Frontend Issues

MFE debugging typically spans:

Network

Runtime

Dependencies

Routing

Communication

Performance

---

## Browser DevTools

### Chrome DevTools

Use for:

Network Requests

Performance

Memory

Console Errors

Key tabs:

Network

Sources

Memory

Performance

Application

---

## Module Federation Inspection

Check:

remoteEntry.js

Loaded Remotes

Shared Dependencies

Useful for:

Remote Load Failures

Version Conflicts

Version conflicts are a known source of integration problems in MFEs.

---

## React DevTools

Use for:

Component Tree

Props

Context

Hooks

Especially useful when:

Remote Renders

But behaves incorrectly

---

## Bundle Analyzer

Examples:

webpack-bundle-analyzer

source-map-explorer

Find:

Duplicate React

Duplicate Libraries

Large Bundles

---

## Logging & Monitoring

Internal MFE migration examples mention using logging and monitoring tools after deployment to quickly identify integration issues.

Monitor:

Runtime Errors

Module Load Failures

User Flows

Common tools:

Sentry

Datadog

New Relic

Azure Monitor

---

## Event Bus Debugging

For event-driven architectures:

window.addEventListener(

  "\*"

)

or custom logging middleware.

Track:

Published Events

Subscribers

Payloads

This is especially valuable when using custom events between Angular and React MFEs.

---

# Architect-Level Interview Answer

> The biggest challenge in Micro Frontend state management is balancing team autonomy with the need for shared business state. Directly sharing framework-specific stores creates tight coupling, so I prefer event-driven communication, backend-driven state, or lightweight shared stores where absolutely necessary. For deployment, I favour independent deployments using Module Federation, combined with shared dependency governance and runtime loading of remotes. For debugging, I use Chrome DevTools, React DevTools, bundle analysers, runtime monitoring platforms, and Module Federation diagnostics to investigate dependency conflicts, routing issues, communication failures, and performance bottlenecks. Internal examples show that many real-world MFE issues stem from dependency version mismatches, shared library conflicts, or coordination between independently deployed modules.

1. Event-Driven State Sharing in Micro Frontends

Event-driven communication is one of the most popular approaches for sharing information across Micro Frontends because it keeps teams loosely coupled and avoids framework-specific dependencies. Internal Micro Frontend guidance explicitly lists event emitters, custom events, web storage, and query strings as communication mechanisms between MFEs.

Why Event-Driven?

Instead of:

Cart MFE
↓
Direct Dependency
↓
Checkout MFE

Use:

Cart MFE
↓
Publish Event
↓
Event Bus
↓
Checkout MFE
Profile MFE
Header MFE

Benefits:

✅ Loose coupling

✅ Cross-framework support

✅ Independent deployment

✅ Easier scalability

Event-driven patterns are frequently recommended for coordinating state across decoupled frontends.

Browser Custom Events
Publisher
window.dispatchEvent(
new CustomEvent(
"cart:updated",
{
detail: {
totalItems: 5
}
}
)
);

Subscriber
window.addEventListener(
"cart:updated",
(event) => {
console.log(
event.detail.totalItems
);
}
);

This aligns with internal guidance describing custom events dispatched through shared browser objects such as window.

Event Bus Pattern
class EventBus {

publish(event, payload) {
window.dispatchEvent(
new CustomEvent(
event,
{ detail: payload }
)
);
}

subscribe(event, handler) {

    window.addEventListener(
      event,
      handler
    );

    return () =>
      window.removeEventListener(
        event,
        handler
      );

}
}

Events Suitable for Sharing

Good candidates:

User Logged In
User Logged Out
Cart Updated
Theme Changed
Language Changed
Notification Raised

Avoid:

Large Business State
Complex Transaction Flows
Sensitive Domain Logic

For those, many organisations use backend systems as the source of truth.

2. Best Practices for MFE Version Management

One of the most common enterprise MFE failures is dependency mismatch. Internal examples explicitly describe React version conflicts between host and remote MFEs causing rendering and hook issues.

✅ 1. Share Core Dependencies

Example:

shared: {
react: {
singleton: true
},
"react-dom": {
singleton: true
}
}

Prevents:

Duplicate React
Hook Failures
Context Issues

Version conflicts are a known problem and are commonly solved through shared dependency strategies.

✅ 2. Maintain Dependency Governance

Define:

Approved React Version
Approved UI Library Version
Approved Routing Library

Avoid:

React 18
React 19
React 17

running together

unless explicitly supported.

✅ 3. Semantic Versioning

Follow:

Major.Minor.Patch

Example:

2.1.5

Use:

Major → Breaking Change
Minor → New Feature
Patch → Bug Fix

✅ 4. Contract-First Communication

Define:

UserEventV1
CartEventV2

rather than arbitrary payloads.

Internal migration experience emphasises well-defined APIs and interfaces between micro frontends.

✅ 5. Backward Compatibility

When adding fields:

{
"id": 1,
"name": "John",
"role": "Admin"
}

avoid removing fields immediately.

✅ 6. Independent Versioning

Prefer:

Cart MFE v4.1
Checkout MFE v2.8
Profile MFE v7.4

instead of forcing all MFEs to release together.

Independent deployment is one of the primary goals of Micro Frontend architecture.

✅ 7. Automate Dependency Audits

Use CI/CD validation to detect:

Duplicate React
Multiple Router Versions
UI Library Mismatch

before production.

3. Tools for Monitoring MFE Runtime Performance

Monitoring should include:

Errors
Performance
Dependencies
User Experience
Network

Internal solutions repeatedly emphasise performance checks, logging, error monitoring, and runtime visibility after deployment.

APM (Application Performance Monitoring)
New Relic

Monitor:

Page Load Time
JS Errors
API Calls
User Sessions

Mentioned within enterprise monitoring stacks.

Datadog

Monitor:

Frontend Performance
Backend Correlation
Distributed Tracing

Referenced as a monitoring/APM option.

Azure Monitor

Useful for:

Frontend + Backend Observability
Application Insights

Error Monitoring
Sentry

Track:

Runtime Errors
Unhandled Promises
Component Crashes
Remote Load Failures

Included in enterprise monitoring recommendations.

Browser Monitoring
Chrome DevTools

Use for:

Network
Performance
Memory
Coverage

Investigate:

Slow Bundles
Runtime Errors
Memory Leaks

Lighthouse

Measure:

Performance
Accessibility
SEO
Best Practices

Module Federation Troubleshooting

Validate:

remoteEntry.js
Shared Dependencies
Remote Availability

Especially when debugging:

Remote Not Loading
Version Mismatch

Internal examples show dependency mismatches causing runtime rendering issues.

Logging & Observability

Recommended stack:

Prometheus
Grafana
ELK Stack
Jaeger

These tools are explicitly referenced in enterprise monitoring architectures.

Architect-Level Interview Answer

For MFE state sharing, I generally prefer an event-driven approach using custom events or an event bus because it keeps applications loosely coupled and framework agnostic. For version management, I enforce dependency governance, semantic versioning, shared singleton libraries through Module Federation, backward-compatible contracts, and independent deployment pipelines. For runtime monitoring, I combine browser tooling with enterprise observability platforms such as Sentry, New Relic, Datadog, Prometheus, Grafana, and distributed tracing solutions to track performance, dependency issues, runtime errors, and user experience across all micro frontends.

# Event-Driven State Sharing in Micro Frontends

Event-driven communication is ideal when MFEs need to share state without directly depending on each other. Internal micro-frontend guidance and examples describe using event buses and custom events for communication and state coordination between independently deployed modules.

---

## Architecture

```text
Cart MFE
    │
    ▼
Publish Event
    │
    ▼
 Event Bus
 ┌──┼───────┐
 ▼  ▼       ▼
Header   Checkout   Analytics
 MFE      MFE         MFE
```

Benefits:

```text
Loose Coupling
Cross Framework Communication
Independent Deployment
Scalability
```

---

# Event Bus Implementation

## eventBus.js

```javascript
class EventBus {
  publish(eventName, payload) {
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: payload,
      }),
    );
  }

  subscribe(eventName, handler) {
    window.addEventListener(eventName, handler);

    return () => {
      window.removeEventListener(eventName, handler);
    };
  }
}

export default new EventBus();
```

---

# Cart MFE (Publisher)

```javascript
import eventBus from "./eventBus";

function addToCart(product) {
  eventBus.publish("cart:updated", {
    totalItems: 4,
    amount: 1200,
  });
}
```

---

# Header MFE (Subscriber)

```javascript
import eventBus from "./eventBus";

const unsubscribe = eventBus.subscribe("cart:updated", (event) => {
  console.log(event.detail.totalItems);
});
```

Output:

```javascript
4;
```

---

# React Example

```jsx
import { useEffect, useState } from "react";

function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = (event) => {
      setCount(event.detail.totalItems);
    };

    window.addEventListener("cart:updated", handler);

    return () => {
      window.removeEventListener("cart:updated", handler);
    };
  }, []);

  return <span>Cart ({count})</span>;
}
```

---

# Cross-Framework Example

```text
Angular MFE
      ↓
dispatchEvent()
      ↓
Event Bus
      ↓
React MFE
      ↓
Vue MFE
```

This pattern works regardless of framework because it relies on browser-native events rather than Redux, NgRx, or Pinia. Custom events are specifically referenced in internal MFE communication guidance and integration examples.

---

# Production Monitoring Setup for MFE Performance

A mature micro-frontend monitoring solution should capture:

```text
Availability
Performance
Errors
Dependencies
User Experience
```

Internal examples reference performance checks, error monitoring, logging, dashboards, Prometheus, Grafana, ELK, Sentry, New Relic, and Datadog-style observability approaches.

---

# Recommended Monitoring Architecture

```text
User Browser
      │
      ▼
 Application Shell
      │
 ┌────┼──────────────┐
 ▼    ▼              ▼

Cart  Checkout     Profile
MFE     MFE          MFE

      │
      ▼

Telemetry Layer

      │
 ┌────┼─────────────┬────────┐
 ▼    ▼             ▼        ▼

Sentry NewRelic  Grafana   ELK
```

---

# Layer 1: Frontend Error Monitoring

## Sentry

Capture:

```text
JavaScript Errors
Promise Rejections
Remote Load Failures
React Render Errors
```

Example:

```javascript
Sentry.captureException(error);
```

Sentry is referenced within enterprise monitoring stacks for error tracking.

---

# Layer 2: Real User Monitoring (RUM)

## New Relic / Datadog

Track:

```text
Page Load Time
TTFB
FCP
LCP
CLS
FID/INP
```

Per MFE:

```text
Shell Load Time
Cart Load Time
Checkout Load Time
```

These monitoring tools are explicitly mentioned within enterprise observability stacks.

---

# Layer 3: Performance Metrics

Capture:

```javascript
performance.mark("cart-start");

performance.mark("cart-end");

performance.measure("cart-render", "cart-start", "cart-end");
```

Report:

```text
Average Render Time
Slow Components
Runtime Delays
```

---

# Layer 4: Dependency Monitoring

Monitor:

```text
RemoteEntry.js
Shared Dependencies
React Versions
Module Federation Errors
```

A real-world internal example identified React version mismatches between host and remote MFEs as the root cause of runtime failures.

Example Alert:

```text
Remote Unavailable
Version Conflict
Shared Module Failure
```

---

# Layer 5: Central Dashboards

## Grafana

Dashboard Sections:

```text
MFE Availability
JS Errors
Response Time
Rendering Metrics
Business Metrics
```

Grafana and Prometheus are explicitly referenced within enterprise monitoring architectures.

---

# Recommended Enterprise Stack

| Layer             | Tool                          |
| ----------------- | ----------------------------- |
| Errors            | Sentry                        |
| RUM               | New Relic / Datadog           |
| Metrics           | Prometheus                    |
| Dashboards        | Grafana                       |
| Logs              | ELK Stack                     |
| Browser Analysis  | Chrome DevTools               |
| Dependency Issues | Module Federation Diagnostics |

These technologies are referenced in enterprise monitoring and observability documentation.

---

# Architect-Level Interview Answer

> For Micro Frontends, I prefer event-driven state sharing using a browser-based event bus built on `CustomEvent`. This keeps applications loosely coupled, framework agnostic, and independently deployable. For production monitoring, I use a layered observability approach: Sentry for runtime errors, New Relic or Datadog for real-user performance monitoring, Prometheus and Grafana for metrics and dashboards, ELK for centralised logging, and custom performance marks to measure MFE rendering times. I also monitor Module Federation dependencies and remote availability to quickly detect version conflicts or failed remote loads.

# Event-Driven State Sharing in Micro Frontends

Event-driven communication is ideal when MFEs need to share state without directly depending on each other. Internal micro-frontend guidance and examples describe using event buses and custom events for communication and state coordination between independently deployed modules.

---

## Architecture

```text
Cart MFE
    │
    ▼
Publish Event
    │
    ▼
 Event Bus
 ┌──┼───────┐
 ▼  ▼       ▼
Header   Checkout   Analytics
 MFE      MFE         MFE
```

Benefits:

```text
Loose Coupling
Cross Framework Communication
Independent Deployment
Scalability
```

---

# Event Bus Implementation

## eventBus.js

```javascript
class EventBus {
  publish(eventName, payload) {
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: payload,
      }),
    );
  }

  subscribe(eventName, handler) {
    window.addEventListener(eventName, handler);

    return () => {
      window.removeEventListener(eventName, handler);
    };
  }
}

export default new EventBus();
```

---

# Cart MFE (Publisher)

```javascript
import eventBus from "./eventBus";

function addToCart(product) {
  eventBus.publish("cart:updated", {
    totalItems: 4,
    amount: 1200,
  });
}
```

---

# Header MFE (Subscriber)

```javascript
import eventBus from "./eventBus";

const unsubscribe = eventBus.subscribe("cart:updated", (event) => {
  console.log(event.detail.totalItems);
});
```

Output:

```javascript
4;
```

---

# React Example

```jsx
import { useEffect, useState } from "react";

function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = (event) => {
      setCount(event.detail.totalItems);
    };

    window.addEventListener("cart:updated", handler);

    return () => {
      window.removeEventListener("cart:updated", handler);
    };
  }, []);

  return <span>Cart ({count})</span>;
}
```

---

# Cross-Framework Example

```text
Angular MFE
      ↓
dispatchEvent()
      ↓
Event Bus
      ↓
React MFE
      ↓
Vue MFE
```

This pattern works regardless of framework because it relies on browser-native events rather than Redux, NgRx, or Pinia. Custom events are specifically referenced in internal MFE communication guidance and integration examples.

---

# Production Monitoring Setup for MFE Performance

A mature micro-frontend monitoring solution should capture:

```text
Availability
Performance
Errors
Dependencies
User Experience
```

Internal examples reference performance checks, error monitoring, logging, dashboards, Prometheus, Grafana, ELK, Sentry, New Relic, and Datadog-style observability approaches.

---

# Recommended Monitoring Architecture

```text
User Browser
      │
      ▼
 Application Shell
      │
 ┌────┼──────────────┐
 ▼    ▼              ▼

Cart  Checkout     Profile
MFE     MFE          MFE

      │
      ▼

Telemetry Layer

      │
 ┌────┼─────────────┬────────┐
 ▼    ▼             ▼        ▼

Sentry NewRelic  Grafana   ELK
```

---

# Layer 1: Frontend Error Monitoring

## Sentry

Capture:

```text
JavaScript Errors
Promise Rejections
Remote Load Failures
React Render Errors
```

Example:

```javascript
Sentry.captureException(error);
```

Sentry is referenced within enterprise monitoring stacks for error tracking.

---

# Layer 2: Real User Monitoring (RUM)

## New Relic / Datadog

Track:

```text
Page Load Time
TTFB
FCP
LCP
CLS
FID/INP
```

Per MFE:

```text
Shell Load Time
Cart Load Time
Checkout Load Time
```

These monitoring tools are explicitly mentioned within enterprise observability stacks.

---

# Layer 3: Performance Metrics

Capture:

```javascript
performance.mark("cart-start");

performance.mark("cart-end");

performance.measure("cart-render", "cart-start", "cart-end");
```

Report:

```text
Average Render Time
Slow Components
Runtime Delays
```

---

# Layer 4: Dependency Monitoring

Monitor:

```text
RemoteEntry.js
Shared Dependencies
React Versions
Module Federation Errors
```

A real-world internal example identified React version mismatches between host and remote MFEs as the root cause of runtime failures.

Example Alert:

```text
Remote Unavailable
Version Conflict
Shared Module Failure
```

---

# Layer 5: Central Dashboards

## Grafana

Dashboard Sections:

```text
MFE Availability
JS Errors
Response Time
Rendering Metrics
Business Metrics
```

Grafana and Prometheus are explicitly referenced within enterprise monitoring architectures.

---

# Recommended Enterprise Stack

| Layer             | Tool                          |
| ----------------- | ----------------------------- |
| Errors            | Sentry                        |
| RUM               | New Relic / Datadog           |
| Metrics           | Prometheus                    |
| Dashboards        | Grafana                       |
| Logs              | ELK Stack                     |
| Browser Analysis  | Chrome DevTools               |
| Dependency Issues | Module Federation Diagnostics |

These technologies are referenced in enterprise monitoring and observability documentation.

---

# Architect-Level Interview Answer

> For Micro Frontends, I prefer event-driven state sharing using a browser-based event bus built on `CustomEvent`. This keeps applications loosely coupled, framework agnostic, and independently deployable. For production monitoring, I use a layered observability approach: Sentry for runtime errors, New Relic or Datadog for real-user performance monitoring, Prometheus and Grafana for metrics and dashboards, ELK for centralised logging, and custom performance marks to measure MFE rendering times. I also monitor Module Federation dependencies and remote availability to quickly detect version conflicts or failed remote loads.

# Handling Event-Driven Errors in Micro Frontends

One challenge with event-driven MFEs is that publishers don't know who consumes an event. Failures can be silent unless you build observability into the event layer. Internal MFE guidance recommends event-based communication while maintaining loose coupling and monitoring after deployment. [1](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)[1](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

# Problem Scenario

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Cart MFE</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; ↓</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">cart:updated event</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; ↓</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Checkout MFE</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

If Checkout throws:

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">undefined.totalPrice</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

the Cart MFE won't know.

---

# Solution 1: Safe Event Wrapper

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">class EventBus {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; publish(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; eventName,</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; payload</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; ) {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; try {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; window.dispatchEvent(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; new CustomEvent(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; eventName,</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; detail: payload</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; );</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; } catch (error) {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.error(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Event Failed: ${eventName}`,</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; error</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; );</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; reportError(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; eventName,</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; error</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; );</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

---

# Solution 2: Error Event Channel

Instead of hiding failures:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">cart:updated</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

also publish:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">mfe:error</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">try {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; processEvent(data);</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">} catch (error) {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; window.dispatchEvent(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; new CustomEvent(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "mfe:error",</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; detail: {</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mfe: "Checkout",</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; event:</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "cart:updated",</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; error:</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; error.message</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; )</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; );</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Global listener:

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">window.addEventListener(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; "mfe:error",</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; (event) =&gt; {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; Sentry.captureMessage(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; JSON.stringify(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; event.detail</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp; );</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">);</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Sentry is commonly used for frontend error tracking and runtime monitoring. [2](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[3](https://geekflare.com/guides/frontend-error-monitoring-tools/)[4](https://sentry.io/welcome/)

---

# Solution 3: Event Timeout Detection

Detect missing responses.

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">function waitForEvent(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> eventName,</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> timeout = 3000</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">) {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> return new Promise(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; (resolve, reject) =&gt; {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp; const timer =</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp; setTimeout(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; () =&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; reject(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "Timeout"</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ),</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; timeout</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp; );</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp; window.addEventListener(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp; eventName,</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp; (event) =&gt; {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; clearTimeout(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; timer</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; );</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; resolve(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; event.detail</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; );</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp; },</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp; { once: true }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp; );</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> );</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Useful when:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Checkout must respond</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Inventory must respond</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Payment must respond</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

---

# MFE Performance Tuning Best Practices

Internal MFE migration experiences emphasize monitoring load times, bundle sizes, dependency management, and performance validation after integration. [1](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

## ✅ Share Common Dependencies

Bad:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">React x 3</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">ReactDOM x 3</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Material UI x 3</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Good:

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">shared: {</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> react: {</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp; singleton: true</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> },</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> reactDom: {</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp; singleton: true</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> }</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

This avoids duplicate framework loading and version conflicts. Internal examples cite React version mismatches as a root cause of MFE runtime issues. [1](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

## ✅ Lazy Load Remotes

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">const Cart =</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> React.lazy(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; () =&gt; import(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp; "cart/App"</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; )</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> );</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Load only when required.

---

## ✅ Route-Based Loading

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Home</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">↓</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Load Home MFE</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Checkout</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">↓</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Load Checkout MFE</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Avoid loading all MFEs at startup.

---

## ✅ Track Core Web Vitals

Monitor:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">LCP</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">CLS</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">INP</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">FCP</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">TTFB</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Performance monitoring frameworks frequently recommend collecting frontend performance metrics and browser performance data. [5](https://www.freecodecamp.org/news/the-front-end-monitoring-handbook/)[2](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

## ✅ Reduce Event Chatter

Bad:

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">cart:update</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">cart:update</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">cart:update</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">cart:update</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Good:

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">debounce(</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> updateCart,</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> 300</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">);</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

---

## ✅ Use Error Boundaries

`jsx</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&lt;ErrorBoundary&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; &lt;CheckoutMFE /&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&lt;/ErrorBoundary&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Prevents a failing MFE from crashing the host application. Runtime observability research specifically discusses error boundary instrumentation for micro-frontends. [6](https://ijetcsit.org/index.php/ijetcsit/article/download/759/691)[7](https://gitnation.com/contents/observability-for-microfrontends)

---

# Alerting Setup for MFE Runtime Issues

A production-ready setup should monitor:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Errors</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Availability</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Performance</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Remote Loading</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Business Flows</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Internal observability guidance recommends dashboards, error-rate monitoring, latency monitoring, alert thresholds, metrics, logs, and traces. [2](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[8](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/dotnet-C#-coding-guidelines.pdf?web=1)[9](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Engineering%20Excellence%20Quality%20Standards%20and%20Guidelines.pdf?web=1)[10](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/_layouts/15/Doc.aspx?sourcedoc=%7B39416C27-88DE-4969-9396-FB32058024BC%7D&file=Agentic_SRE_Platform_MVP1_Final_Consolidated.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Architecture

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Micro Frontends</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ▼</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Telemetry Layer</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> ┌──────┼─────────┐</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}"> ▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ▼</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Sentry&nbsp; Prometheus Grafana</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ▼</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Alert Manager</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ▼</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Teams / Email / PagerDuty</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

---

# Alert 1: Remote Module Failure

Trigger:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">remoteEntry.js</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Load Failure</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Example:

`javascript</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">catch(error) {</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; alertService.trigger({</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp; type:</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "REMOTE_LOAD_FAIL",</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp; mfe:</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "checkout"</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&nbsp; });</span></div><br class="scriptor-paragraph"><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Threshold:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">&gt; 5 failures</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">in 5 min</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

---

# Alert 2: JS Error Spike

Monitor:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Unhandled Exceptions</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Promise Rejections</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Alert:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Error Rate &gt; 2%</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">for 5 minutes</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Enterprise observability guidance explicitly recommends alerting on error rates and SLO health. [8](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/dotnet-C#-coding-guidelines.pdf?web=1)[11](https://persistentsystems.sharepoint.com/sites/AgenticAIEnabledSDLC/_layouts/15/Doc.aspx?sourcedoc=%7BABB29C39-972F-4F5A-830E-92FF64AB1B77%7D&file=Agent_Spec_06A_Observability_and_Monitoring_Agent.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Alert 3: Performance Regression

Alert when:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">LCP &gt; 4s</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">INP &gt; 300ms</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

for a sustained period.

Browser performance APIs and frontend metrics monitoring are recommended components of web application monitoring. [2](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[5](https://www.freecodecamp.org/news/the-front-end-monitoring-handbook/)

---

# Alert 4: Event Bus Failure

Track:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Events Published</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Events Consumed</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Alert when:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Published &gt;&gt; Consumed</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

indicating potential subscribers have failed.

---

# Alert 5: Availability

Monitor:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Remote Availability</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">HTTP 500</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">HTTP 404</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Alert when:

`text</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Checkout MFE</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">Availability &lt; 99%</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1784355000000,&quot;dataSource&quot;:0}">`

Real-time dashboards and threshold-based alerts are recommended for availability, latency, and error monitoring. [12](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BB8DC8BD6-2E26-4528-8827-3F3E032A1303%7D&file=Persistent%20Metamo%20API%20gateway%20response.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)[2](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[9](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Engineering%20Excellence%20Quality%20Standards%20and%20Guidelines.pdf?web=1)

---

# Architect-Level Interview Answer

> In event-driven MFEs, I treat the event bus as a first-class platform service. Every event is versioned, observable, and monitored. I implement global error channels, event correlation IDs, timeout handling, and structured telemetry. For performance, I optimize shared dependencies, lazy-load remotes, track Core Web Vitals, and isolate failures with error boundaries. For runtime monitoring, I combine Sentry for frontend exceptions, Prometheus/Grafana for metrics, distributed tracing for cross-MFE flows, and alerting based on error rates, remote loading failures, latency regressions, and business-critical event failures. This provides both technical and business-level visibility across independently deployed micro frontends. [2](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[8](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/dotnet-C#-coding-guidelines.pdf?web=1)[10](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/_layouts/15/Doc.aspx?sourcedoc=%7B39416C27-88DE-4969-9396-FB32058024BC%7D&file=Agentic_SRE_Platform_MVP1_Final_Consolidated.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[1](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

Architect-Level React Micro Frontend Scenario (Detailed)

This is one of the hardest Micro Frontend interview questions because it tests:

System Design
React Internals
Module Federation
Deployment Strategy
Observability
Performance
Incident Handling
Leadership

Scenario

You have:

Host Application (React)

15 Remote MFEs

Cart
Checkout
Profile
Orders
Search
Payments
Recommendations
...

Each team deploys independently using:

Webpack Module Federation

Suddenly production users report:

Random blank screens

Some pages work

Some pages fail

React hooks throw errors

Issue cannot be reproduced locally

Only:

10% users affected

Interview Question
Walk me through:

1. Detection
2. Containment
3. Root Cause Analysis
4. Recovery
5. Prevention

Step 1 — Detection

My first goal:

Determine
if issue is local
or systemic

Observability Dashboard

I would immediately check:

Sentry
New Relic
Datadog
Grafana

Looking for:

Runtime Errors
Error Rate
Deployment Timeline
Affected Routes

Enterprise observability guidance recommends monitoring errors, performance metrics, dashboards, logs and traces, with alerting based on error rates and latency.

Example Error
Invalid Hook Call

or

Cannot read properties of null

or

Shared module is not available

These are strong indicators of a Module Federation dependency issue.

Step 2 — Containment

Before debugging deeply:

Stop Further Impact

Option A — Feature Flag

Disable:

Checkout MFE

temporarily.

Users see:

Checkout unavailable

instead of:

Entire app crashes

Option B — Rollback

Revert:

Latest MFE Deployment

Option C — Error Boundary

Host application:

<ErrorBoundary
fallback={<FallbackUI />}

>   <CheckoutMFE />
> </ErrorBoundary>

This prevents one failing MFE from crashing the entire shell. Error boundary instrumentation is commonly recommended for micro-frontend observability and fault isolation.

Step 3 — Root Cause Analysis

Now I investigate.

Check Deployment History

Question:

What changed?

Commonly:

New deployment
New dependency
New remote

Compare Versions

Example:

Host
React 19

Checkout
React 20

Suddenly:

Invalid Hook Call

appears.

An internally documented MFE debugging scenario identified different React versions between host and remote MFEs as the root cause of production rendering and hook failures.

Validate Shared Dependencies

Module Federation:

shared: {

react: {
singleton: true
},

"react-dom": {
singleton: true
}

}

Without singleton:

React Host

React Remote

Two React Trees

causing:

Context failures
Hooks failures

Step 4 — Deep Technical Investigation

Suppose version mismatch is NOT the problem.

Then I investigate:

Event Bus
cart:updated

published.

Never consumed.

Potential causes:

Timing Issue
Missed Subscription
Payload Change

Internal MFE communication guidance highlights event buses and custom events as common integration mechanisms.

Contract Drift

Cart publishes:

{
"count": 5
}

Checkout expects:

{
"items": 5
}

Result:

Runtime Break

This is why well-defined interfaces and contracts between MFEs are important.

Remote Loading

Check:

remoteEntry.js

Network tab:

200
404
500

Potential issue:

CDN Deployment Incomplete

Step 5 — Recovery

Once the root cause is identified:

If Dependency Issue
Rollback immediately

restore:

Stable React Version

If Contract Issue

Deploy:

Backward Compatible Contract

Example:

{
"count": 5,
"items": 5
}

temporarily supporting both versions.

If Deployment Issue

Rebuild:

remoteEntry.js

and invalidate CDN cache.

Step 6 — Prevention

This is where architects differentiate themselves.

Dependency Governance

Every MFE must use:

Approved React Version

CI validation:

Block deployment
if version mismatch exists

Internal examples recommend careful shared dependency management to avoid duplication and conflicts.

Contract Testing

Before deployment:

Cart Event Contract

validated automatically.

Example:

interface CartUpdated {

count: number;
amount: number;
}

Runtime Monitoring

Track:

Remote Load Failures
Error Rate
Missing Events
Performance

in a central dashboard.

Recommended monitoring stacks include Prometheus, Grafana, ELK, Sentry, New Relic/Datadog, distributed tracing and alerting.

Canary Deployment

Instead of:

100%

release to:

1%
↓
10%
↓
100%

This limits blast radius.

What Interviewers Actually Want to Hear

A weak answer:

I would check logs.

A strong architect answer:

First I would contain the incident using feature flags
or rollback.

Next I would analyse observability data
to identify whether the issue is caused
by deployment, dependency conflicts,
contract drift or runtime communication failures.

I would validate shared dependency
configuration in Module Federation,
inspect remote loading,
verify event contracts,
and review the latest release.

After recovery,
I would implement dependency governance,
contract testing,
canary deployments,
runtime monitoring,
error boundaries,
and deployment validation
to prevent recurrence.

Follow-Up Question Interviewers Often Ask

"What if one MFE goes down completely, but the business still wants users to checkout?"

Expected architect discussion:

Graceful Degradation
Fallback Components
Cached Data
Feature Flags
Error Boundaries
Circuit Breakers
Progressive Enhancement

This is usually the level of answer expected for a 10+ years React Lead / Frontend Architect interview.

# 1. Error Boundaries in Micro Frontends

## Why Error Boundaries Are Critical

In a monolith:

```text
Component Crash
↓
Part of App Fails
```

In Micro Frontends:

```text
Checkout MFE Crash
↓
Entire Host App Crash
```

Without isolation, one team's deployment can impact every user.

Runtime observability guidance for micro-frontends specifically highlights using React Error Boundaries to isolate failures and capture errors with module attribution.

---

## Strategy 1: Boundary Around Each Remote MFE

```jsx
<AppShell>
  <ErrorBoundary mfe="Header">
    <HeaderMFE />
  </ErrorBoundary>

  <ErrorBoundary mfe="Cart">
    <CartMFE />
  </ErrorBoundary>

  <ErrorBoundary mfe="Checkout">
    <CheckoutMFE />
  </ErrorBoundary>
</AppShell>
```

Result:

```text
Checkout crashes
↓
Only Checkout replaced
↓
Rest of application works
```

---

## Production Error Boundary

```jsx
class MFEErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      tags: {
        mfe: this.props.mfe,
      },

      extra: {
        errorInfo,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>Service temporarily unavailable</div>;
    }

    return this.props.children;
  }
}
```

This gives:

```text
Error Isolation
MFE Attribution
Fallback UI
Production Monitoring
```

Frontend monitoring platforms frequently use error tracking, replay, tracing and module-level instrumentation to identify runtime failures.

---

## Advanced Fallback

```jsx
<ErrorBoundary>
  <Suspense fallback={<Loader />}>
    <CheckoutMFE />
  </Suspense>
</ErrorBoundary>
```

Handle:

```text
Render Failures
Network Failures
Remote Load Failures
```

independently.

---

# 2. Contract Testing Between MFEs

## Problem

Cart Team deploys:

### Old Contract

```json
{
  "cartCount": 5
}
```

Checkout expects:

```json
{
  "cartCount": 5
}
```

---

Cart Team changes:

```json
{
  "items": 5
}
```

Checkout breaks.

No compile error.

No build failure.

Only production outage.

Internal MFE guidance emphasises clear interfaces, predictable communication, and avoiding runtime integration failures through strong contracts between modules.

---

## Contract-First Design

Create a shared definition.

```typescript
export interface CartUpdatedEvent {
  cartCount: number;

  amount: number;
}
```

---

## Consumer Contract Tests

Checkout defines:

```typescript
describe("Cart Contract", () => {
  expect(event).toHaveProperty("cartCount");

  expect(event).toHaveProperty("amount");
});
```

CI validates every deployment.

---

## Event Versioning

Avoid:

```text
cart:updated
```

Use:

```text
cart:updated:v1

cart:updated:v2
```

Example:

```javascript
window.dispatchEvent(new CustomEvent("cart:updated:v2"));
```

---

## Backward Compatibility

Instead of:

```json
{
  "items": 5
}
```

support:

```json
{
  "cartCount": 5,
  "items": 5
}
```

during migration.

---

## CI/CD Validation Pipeline

```text
Build
↓
Unit Tests
↓
Contract Tests
↓
Integration Tests
↓
Deploy
```

Recommended for:

```text
API Contracts
Events
Shared Interfaces
Module Federation Contracts
```

---

# 3. Monitoring & Tracing Cross-MFE User Flows

One of the hardest MFE problems:

```text
User clicks Checkout
↓
Header MFE
↓
Cart MFE
↓
Checkout MFE
↓
Payment MFE
↓
Backend
```

Which component is slow?

Which component failed?

Observability guidance for micro-frontends recommends distributed tracing, module attribution, performance monitoring and tracing across independently deployed modules.

---

# Correlation IDs

Generate once:

```javascript
const traceId = crypto.randomUUID();
```

Attach everywhere:

```javascript
{
  traceId: traceId;
}
```

---

# Event Tracing

Publisher:

```javascript
eventBus.publish("checkout:start", {
  traceId,
  userId,
});
```

Consumer:

```javascript
eventBus.subscribe("checkout:start", (event) => {
  log(event.detail.traceId);
});
```

---

# OpenTelemetry Style Flow

```text
Trace 123

Header MFE
      ↓

Cart MFE
      ↓

Checkout MFE
      ↓

Payment API
```

All logs contain:

```text
traceId=123
```

Distributed tracing, correlation and trace context propagation are frequently recommended observability patterns.

---

# Performance Marks Per MFE

```javascript
performance.mark("checkout-start");

renderCheckout();

performance.mark("checkout-end");

performance.measure("checkout-render", "checkout-start", "checkout-end");
```

Track:

```text
Cart Render Time
Checkout Render Time
Profile Render Time
```

Browser performance APIs are recommended as part of web application monitoring.

---

# Monitoring Stack

### Error Monitoring

```text
Sentry
```

Track:

```text
Runtime Failures
MFE Load Failures
Blank Screens
```

---

### Performance Monitoring

```text
New Relic
Datadog
```

Track:

```text
LCP
INP
CLS
Route Performance
```

---

### Metrics

```text
Prometheus
Grafana
```

Track:

```text
Error Rate
Latency
Availability
Traffic
```

These are explicitly referenced in enterprise monitoring architectures.

---

# Architect Interview Answer

> In Micro Frontends I isolate every remote behind its own Error Boundary so that failures are contained and attributed to the responsible MFE. For reliability, I use contract-first communication with versioned events and automated consumer-driven contract tests in CI/CD. For observability, I propagate correlation IDs across MFEs, instrument events and user journeys, measure per-MFE performance using browser performance APIs, and integrate Sentry, OpenTelemetry-style tracing, Prometheus/Grafana, and APM platforms like New Relic or Datadog. This allows me to identify exactly which MFE introduced an error, latency spike, or business-flow failure while preserving independent deployment autonomy.
