CI/CD and Deployment interview trap questions with simple answers 👇

Q1: "What's the difference between Continuous Delivery and Continuous Deployment?"

Most candidates say they're the same. They're not.

Continuous Delivery means your code is always ready to go live, but a human still clicks the deploy button.
Continuous Deployment means every passing build goes live automatically. No human involved.

Simple rule: Delivery = ready anytime. Deployment = ships every time.

Q2: "If a deployment fails in production, what do you do?"

Wrong answer: "I'll fix the bug and redeploy."

Right answer: Rollback immediately. Never debug in production. Then go to staging, find the issue, fix it, test it, and redeploy.

Protect users first. Debug second.

Q3: "What is a Blue-Green Deployment?"

Blue is your current live version. Green is the new one. You switch traffic from Blue to Green. If Green breaks, you instantly switch back to Blue. No downtime. No panic.

Q4: "What is a Pipeline in CI/CD?"

It is a series of automatic steps your code goes through before reaching users. Code Push, then Build, then Test, then Security Scan, then Deploy. If any step fails, everything stops. Nothing broken ever reaches production.

Q5: "What is a Canary Release?"

You release the new version to only 5% of users first. If nothing breaks, you slowly roll it out to everyone. If something breaks, you roll back and only 5% were affected. Named after the canary in a coal mine. Small group tests the risk before everyone else.

Q6: "Build artifact vs Deployment artifact — what's the difference?"

A build artifact is what your pipeline produces, like a Docker image or a zip file. A deployment artifact is the specific one you picked to go live. Every deployment artifact was once a build artifact. But not every build artifact makes it to production.

Q7: "Why should you never deploy on Fridays?"

If something breaks on Friday evening, your whole team is offline for two days while users suffer. Traffic is usually high on weekends. Most bugs show up in the first few hours after a deploy. So the golden rule is: deploy early in the week, early in the day.
