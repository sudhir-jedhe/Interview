. S — Single Responsibility Principle
One function. One purpose.
Daily Example:
When building a login flow, we often separate:
Validate user input
Call login API
Store token
Navigate to dashboard
Each step has a different responsibility.

1. O — Open/Closed Principle
Add features without changing existing working logic.
Daily Example:
You already do this when adding:
New payment methods
New notification channels
New dashboard widgets
New API endpoints
Instead of rewriting old code, you extend behavior.

2. L — Liskov Substitution Principle
Replace one implementation with another without breaking the application.
Daily Example:
You switch:
Local API → Production API
Mock service → Real service
Stripe → Another payment provider
UI should continue working without changes.

3. I — Interface Segregation Principle
Use only what you actually need.
Daily Example:
While creating a profile page:
Profile component → fetch user data
Analytics → track events
Notification → send alerts
No component should depend on unnecessary things.

4. D — Dependency Inversion Principle
Depend on contracts and reusable abstractions, not fixed implementations.
Daily Example:
Instead of hardcoding:
API services
Storage mechanism
Logging provider
Authentication provider
Keep them replaceable and configurable.

![alt text](image.png)

SOLID Principles Explained with Clear Examples:

𝐒 - 𝐒𝐢𝐧𝐠𝐥𝐞 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐢𝐛𝐢𝐥𝐢𝐭𝐲 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐥𝐞
A class should have only one reason to change.

- Example: Instead of one giant User class that handles authentication, profile updates, and sending emails, split it into UserAuth, UserProfile, and EmailService.

𝐎 - 𝐎𝐩𝐞𝐧/𝐂𝐥𝐨𝐬𝐞𝐝 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐥𝐞
Classes should be open for extension but closed for modification.

- Example: Define a Shape interface with an area() method. When you need a new shape, just add a Circle or Triangle class that implements it.

𝐋 - 𝐋𝐢𝐬𝐤𝐨𝐯 𝐒𝐮𝐛𝐬𝐭𝐢𝐭𝐮𝐭𝐢𝐨𝐧 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐥𝐞
Subtypes must be substitutable for their base types without breaking behavior.

- Example: If Bird has a fly() method, then Eagle and Sparrow should both work anywhere a Bird is expected.

𝐈 - 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞 𝐒𝐞𝐠𝐫𝐞𝐠𝐚𝐭𝐢𝐨𝐧 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐥𝐞
Don't force classes to implement interfaces they don't use.

- Example: Instead of one fat Machine interface with print(), scan(), and fax(), break it into Printable, Scannable, and Faxable. A SimplePrinter only implements Printable.

𝐃 - 𝐃𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 𝐈𝐧𝐯𝐞𝐫𝐬𝐢𝐨𝐧 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐥𝐞
High-level modules should not depend on low-level modules. Both should depend on abstractions.

- Example: Your OrderService should depend on a PaymentGateway interface, not directly on Stripe or PayPal.

![alt text](image-1.png)
