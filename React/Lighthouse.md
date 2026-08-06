
Interviewer: What is Lighthouse and why do you use it?
Priya: Lighthouse is an automated auditing tool built into Chrome DevTools. I use it to evaluate performance, accessibility, best practices, and SEO. It gives me a clear, measurable view of how a frontend app behaves from a real user’s perspective.

Interviewer: How does Lighthouse help in performance debugging?
Priya: Lighthouse highlights problems that slow down the app, like large JavaScript bundles, render-blocking resources, unused code, and slow server responses. Instead of guessing, it shows exact metrics like Largest Contentful Paint and Total Blocking Time so I know what to fix first.

Interviewer: Can you give a real example where Lighthouse helped you?
Priya: Yes. In one case, Lighthouse showed a poor LCP score. After checking the report, I found a large hero image loading without optimization. Compressing the image and lazy-loading non-critical assets improved both the Lighthouse score and real user experience.

Interviewer: How do you use Lighthouse along with Chrome DevTools?
Priya: Lighthouse tells me what is wrong, and DevTools helps me understand why. If Lighthouse reports long main-thread blocking time, I open the Performance panel to see which functions are causing it. This combination makes debugging faster and more accurate.

Interviewer: How does Lighthouse help in building scalable applications?
Priya: Scalability is about consistency. Lighthouse helps ensure that performance, accessibility, and best practices don’t degrade as the app grows. Running Lighthouse before every major release helps catch regressions early, especially in large teams.

Interviewer: Do Lighthouse scores matter more than real users?
Priya: No. Lighthouse is a guide, not the goal. I focus on fixing the real issues behind low scores, not just improving numbers. When real user experience improves, Lighthouse scores naturally follow.
