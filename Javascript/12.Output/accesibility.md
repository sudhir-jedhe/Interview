Accessibility Interview Questions
These questions try to stay away from asking people to recite specifications, or rattle off screen reader hot keys. Those can easily be looked up on the job. Instead these questions try to act as conversation starters, to gain insight into how someone solves problems, and interprets accessible, inclusive user experiences.



### General Accessibility Questions:

1. **Who benefits from accessibility?**
   - Everyone can benefit from accessibility, including people with disabilities (e.g., visual, auditory, motor, or cognitive impairments) and those without disabilities, as it often leads to a better user experience for all.

2. **How would you define inclusive and/or universal design?**
   - Inclusive design is an approach that considers the needs of diverse users, including those with disabilities. Universal design aims to create environments that are usable by all people, regardless of age, ability, or circumstance, without the need for adaptation.

3. **Can you provide an example of inclusive design (does not need to be web/tech related)?**
   - A curb cut on sidewalks, designed for wheelchair access, benefits not just those with mobility impairments, but also parents with strollers, travelers with luggage, or cyclists.

4. **How has your approach to accessibility changed over time?**
   - Over time, my approach has evolved from basic compliance to a deeper understanding of the diverse needs of users and the importance of proactive design that integrates accessibility from the start.

5. **Name some ways responsive/mobile-first design can affect accessibility.**
   - Responsive design ensures that users can access content on various screen sizes, and mobile-first design ensures features like touch targets are optimized for small screens, which improves usability for users with motor impairments.

6. **What are some user experience (UX) concerns to be aware of when using iconography in user interfaces (UI)?**
   - Icons may not be universally understood, leading to confusion. They should be accompanied by labels or tooltips to ensure clarity for all users, including those with visual impairments or cognitive disabilities.

7. **What assistive technologies (ATs) are you familiar with (desktop and/or mobile)?**
   - Screen readers (e.g., JAWS, NVDA), voice recognition software (e.g., Dragon NaturallySpeaking), magnifiers, and switches are common assistive technologies that help users with disabilities navigate and interact with content.

8. **What do you feel is your skill level with these AT(s)?**
   - I am familiar with using screen readers for testing and have worked with various ATs to understand their capabilities and limitations. I would rate myself as intermediate, with a continual learning approach.

9. **What are skip links? What benefit(s) do they provide?**
   - Skip links allow users to bypass repetitive content (like navigation) and jump directly to the main content, improving the experience for screen reader and keyboard users.

10. **What are some of their limitations?**
   - Skip links might not always be visible on non-keyboard devices, and they might be overlooked if not styled properly or if the site doesn’t have sufficient landmarks to navigate to.

### Technical Accessibility Questions:

1. **What methods can you use to find an element’s accessible name?**
   - Use the `aria-label`, `aria-labelledby`, or the `alt` attribute for images. Screen readers compute the accessible name by looking at these attributes and the content of the element.

2. **What is the accessibility tree?**
   - The accessibility tree is a representation of the DOM (Document Object Model) that assistive technologies use to interpret the content and structure of the page, enabling users to navigate and interact with the page.

3. **Why are rems or ems preferable to pixels for setting type size?**
   - `rem` and `em` units are scalable and responsive to the user’s settings (e.g., browser font size adjustments). Pixels, on the other hand, are fixed and do not adapt to changes in user preferences.

4. **Why is it important to allow the viewport to be resized, and/or zoomed?**
   - Allowing resizing ensures users with low vision can zoom in on content for better readability. Disabling zoom can create accessibility barriers for users who rely on zooming to see content.

5. **How is the title attribute exposed to assistive technologies?**
   - The `title` attribute is often exposed to screen readers as a tooltip, providing additional context about an element, but it should not be relied on as the sole means of conveying important information.

6. **What kind of elements can title attributes be used on?**
   - Title attributes can be used on most HTML elements, such as links, images, buttons, and form elements.

7. **What sort of information is appropriate for use with the title attribute?**
   - The `title` attribute should provide additional context or information that is not already conveyed in the content of the element. However, avoid using it for essential information, as screen readers may not always announce it.

8. **Provide an example of when you might need to add a description to an element.**
   - When an image conveys complex information (e.g., a chart or diagram), a description (e.g., via `aria-describedby`) can provide additional context that is not immediately clear from the image alone.

9. **What is a focus trap, or focus trapping?**
   - Focus trapping ensures that keyboard focus remains within a defined section (e.g., a modal), preventing users from accidentally tabbing out of the modal and making it difficult to exit.

10. **Describe an instance of when this would be an accessibility barrier.**
    - A focus trap in a modal that doesn’t allow users to exit or focus on other areas of the page can be frustrating for keyboard and screen reader users, leading to a poor user experience.

### Design Accessibility Questions:

1. **Talk about the pros and cons of flat and skeuomorphic design trends in regards to accessibility.**
   - **Flat design** is minimalistic and can be more accessible as it avoids visual clutter, but can sometimes be too ambiguous, requiring more effort to clarify interactivity. **Skeuomorphic design** mimics real-world objects, which can be intuitive for some users, but may be visually overwhelming for others.

2. **Explain the importance of color contrast in designing for inclusion.**
   - Color contrast ensures that text is readable by people with low vision, color blindness, or other visual impairments. Proper contrast can improve legibility and prevent important content from being missed.

3. **Besides :hover, name other states an actionable element (links, buttons, form controls, etc.) could have styles for, and why providing them is important?**
   - Focus, active, and visited states are crucial for users relying on keyboard navigation. Clear visual feedback helps users understand their current interaction state, ensuring they know where they are on the page.

4. **When might it be appropriate to remove the visual outline from a focused element?**
   - It might be appropriate to remove the visual outline if it conflicts with your design, but it’s crucial to provide an alternative way of indicating focus (e.g., using `:focus` styles) to ensure keyboard users can still navigate effectively.

5. **If a form or form field were to return an error message, where might you want those error messages to be located?**
   - Error messages should be close to the form field that triggered the error, and they should be clearly visible. Using `aria-live` regions can announce error messages to screen reader users.

### Content Accessibility Questions:

1. **What are some things you can do to make an accessible presentation?**
   - Use large fonts with high contrast, provide captions or transcripts for videos, and ensure all interactive elements are keyboard-navigable. Avoid relying on color alone to convey meaning.

2. **Is it possible to make email accessible?**
   - Yes, accessible emails can be made by using semantic HTML, providing alt text for images, ensuring proper color contrast, and ensuring that forms within the email are accessible to screen readers.

3. **How can you make a podcast accessible?**
   - Provide a transcript for the podcast and ensure any relevant visuals (e.g., charts or graphs) are described. Ensure the podcast is captioned if it includes video content.

4. **How would you make sure that a Word document is accessible?**
   - Use built-in styles for headings, provide alt text for images, ensure proper reading order, and use the accessibility checker in Word to identify potential issues.

5. **How would you make sure that an Excel spreadsheet document is accessible?**
   - Use headers for tables, ensure proper cell and column labels, avoid merged cells, and ensure that complex data is accompanied by explanations in text format.

These questions cover various aspects of accessibility, from conceptual knowledge to technical expertise, and from design decisions to content creation. The goal is to understand how a candidate approaches accessibility challenges and how they think about creating more inclusive experiences.


Questions are grouped into four buckets:

General,
Technical,
Design, and
Content
These categories may be a mistake, but we’re going with it for now. If you have ideas for categories, and questions in general, please let us know! Ideally a candidate would be able to answer questions from each category.

General
Who benefits from accessibility?
How would you define inclusive and/or universal design?
Can you provide an example? (does not need to be web/tech related)
How has your approach to accessibility changed over time?
Name some ways responsive/mobile first design can affect accessibility.
What are some user experience (UX) concerns to be aware of when using iconography in user interfaces (UI)?
What assistive technologies (ATs) are you familiar with (desktop and/or mobile)?
What do you feel is your skill level with these AT(s)?
What are skip links?
What benefit(s) do they provide?
What are some of their limitations?
What are some of the tools available to test the accessibility of a website or web application?
What is WCAG?
What are the differences between A, AA, and AAA compliance?
How can using plain language benefit the accessibility of a project?
Describe instances where one might use a link or button.
Describe ways to convey an element or component’s state that aren’t entirely reliant on visuals.
How can carousels be problematic for users with disabilities?
How would you convince your Manager to allocate funds for an accessibility audit?
Describe a situation where a coworker may have been resistant to accessibility or inclusive design best practices.
What sort of strategies do you use in situations like these to help educate coworkers?
If one is looking to take on a leadership role:
Describe the kind of culture around accessibility you would create and how you would go about creating it
When there is more accessibility work to be done than the team can handle, how do you prioritize?
If a client/stakeholder doesn’t want to pay for accessibility what would you do?
Technical
What methods can you use to find an element’s accessible name?
What is the accessibility tree?
Why are rems or ems preferable to pixels for setting type size?
Why is it important to allow the viewport to be resized, and/or zoomed?
How is the title attribute exposed to assistive technologies?
What kind of elements can title attributes be used on?
What sort of information is appropriate for use with the title attribute?
Provide an example of when you might need to add a description to an element.
How would you expose that description programmatically?
What is a focus trap, or focus trapping?
Describe an instance of when you’d need focus trapping.
Describe an instance of when this would be an accessibility barrier.
Describe a situation where the tabindex attribute would be useful.
Provide an example of when using the tabindex attribute can cause problems.
What are landmark regions and how can they be useful?
In what situations might you use a toggle button, vs a switch control, vs a checkbox?
Describe methods to hide content:
From all users.
From only screen reader users.
From sighted users, but not screen reader users.
And why you might do so.
Provide examples of common incorrect usage of ARIA attributes.
Aside from screen readers, what other assistive technologies can be affected by use of ARIA? How?
What is the difference between the following attributes: hidden, aria-hidden="true" and role="presentation" or role="none"?
Describe instances where you might need to use aria-live.
What values (such as assertive or polite) might you give the attribute in different situations?
How would you mark-up an icon font or SVG that was for decorative purposes?
Is CSS pseudo content understood by screen readers?
What is the purpose of the alt attribute for images?
Can you describe the effect of an empty alt, and/or the lack of the attribute, on an image?
In what instances might an empty alt or no alt be appropriate?
How might alternative text for an image vary, depending on the context the image is used in?
Since svgs don’t accept the alt attribute, how can one provide alternative text for these graphics?
Do you need to supply an image an alt attribute if used witin a figure with a figcaption?
Describe the steps you take in reviewing or auditing a website or application for accessibility?
Describe an instance where an automated test would not flag a blatant accessibility error?
When should you use or recommend ARIA roles or attributes to solve an accessibility issue?
Describe your process for figuring out if an accessibility bug is due to a developer, browser, or assistive technology error?
What is the difference between legend, caption and label elements?
What are their similarities?
Describe the purpose of heading and header elements, and how they are useful in websites and applications.
Describe how you’d handle managing keyboard focus within a single page web app (SPA) when changing routes.
Name an ARIA attribute that requires either a child/parent relationship or a pairing role.
What is your understanding of “accessible name computation” and how it affects modifying the way screen readers announce certain content?
What are some issues with modifying normal scrolling behavior? For example: infinite scrolling or scrolljacking.
Some ARIA widgets are presently best supported on devices with physical keyboard, rather than mobile/touch interfaces. Are you aware of any widgets that would be described this way, and why?
Design
Talk about the pros and cons of flat and skeuomorphic design trends in regards to accessibility.
Explain the importance of color contrast in designing for inclusion.
Besides :hover, name other states an actionable element (links, buttons, form controls, etc.) could have styles for, and why providing them is important?
When might it be appropriate to remove the visual outline from a focused element?
If a form or form field were to return an error message, where might you want those error messages to be located?
How can utilizing animation in an interface affect the user experience?
Explain how you could make an infographic accessible for screen reader users.
Why is color alone insufficient to draw attention to actionable elements, or to convey state?
What are some of the inclusive UX problems that need to be solved when content (static or actionable) is revealed on :hover, and how would you propose solving for them?
Content
What are some things you can do to make an accessible presentation?
Is it possible to make email accessible?
How can you make a podcast accessible?
How would you make sure that a Word document is accessible?
How would you make sure that an Excel spreadsheet document is accessible?
Why is it important to tag a PDF correctly?
What goes into making an accessible eBook?
Tell me some social media accessibility best practices.
Facebook
Instagram
Pinterest
Snapchat
TikTok
Twitter
YouTube
How would you handle a situation where your organization accidentally disseminates an inaccessible document?
What do you think should happen if an employee repeatedly ignores making their documents accessible after being trained?
What steps would you undertake to create a sustainable culture of creating accessible documents?
In your previous experiences, was there an opportunity to insert accessibility checks and content authoring best practices into existing workflows?