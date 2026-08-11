 is not recommended because React effects cannot return a Promise. [1, 2]  
An  function automatically returns a Promise. However, React expects a  hook to return either nothing () or a cleanup function. [3, 4, 5, 6]  
Why This Causes Problems

• Breaks Cleanup Functions: React runs the function you return from  to clean up side effects (like clearing timers or unsubscribing from events). If you pass an  function, React receives a Promise instead of a cleanup function, which triggers a runtime error or memory leaks.
• Race Conditions: It makes it easier to accidentally introduce race conditions if components unmount before the asynchronous operation finishes. [12]  

The Recommended Solutions
To safely use  inside , you must define the asynchronous function inside the effect and then call it immediately. [13, 14]  
Option 1: Declaring and Calling an Internal FunctionOption 2: Using an Immediately Invoked Function Expression (IIFE) Handling Cleanups Safely
If your asynchronous operation needs a cleanup mechanism (such as ignoring the result if the component unmounts), use a boolean flag: [15, 16, 17]  
To help optimize your data fetching setup, let me know:

• Are you fetching data from a REST API or a GraphQL endpoint?
• Do you need to handle loading and error states?
• Are you open to using data-fetching libraries like TanStack Query (React Query) or SWR? [18, 19, 20, 21, 22]  

I can provide a robust template tailored to your project.

AI responses may include mistakes.

[1] <https://chudovo.com/react-useeffect-common-mistakes-and-how-to-avoid-them/>
[2] <https://mimo.org/tutorials/react/how-to-call-an-async-function-in-react>
[3] <https://blog.codeminer42.com/how-to-consume-apis-in-react-using-fetch-and-async-await/>
[4] <https://dev.to/sanjampreetsingh/why-async-callback-cannot-happen-in-react-useeffect-hook-ff>
[5] <https://dev.to/niketanwadaskar/why-cant-we-use-async-with-useeffect-but-can-with-componentdidmount-45be>
[6] <https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook>
[7] <https://dmitripavlutin.com/react-useeffect-explanation/>
[8] <https://blog.webdevsimplified.com/2020-04/use-effect/>
[9] <https://www.zipy.ai/blog/useeffect-hook-guide>
[10] <https://dev.to/francodalessio/understanding-react-s-useeffect-hook-lbg>
[11] <https://hygraph.com/blog/react-useeffect-a-complete-guide>
[12] <https://blogs.purecode.ai/blogs/react-useeffect>
[13] <https://www.upgrad.com/blog/react-useeffect-hook/>
[14] <https://www.zipy.ai/blog/react-useeffect-dependency-array>
[15] <https://www.dhiwise.com/post/solving-the-error-can't-perform-a-react-state-update>
[16] <https://medium.com/@sureshdotariya/race-conditions-in-useeffect-with-async-modern-patterns-for-reactjs-2025-9efe12d727b0>
[17] <https://unwiredlearning.com/blog/useeffect-race-conditions>
[18] <https://medium.com/@michal-worwag/handling-async-operations-in-redux-toolkit-with-createasyncthunk-b13b64bf659e>
[19] <https://www.greatfrontend.com/questions/quiz/how-do-you-handle-asynchronous-data-loading-in-react-applications>
[20] <https://medium.com/eureka-engineering/experimenting-react-suspense-with-swr-eaee02988e26>
[21] <https://dev.to/akhildas675/stop-using-useeffect-for-data-fetching-try-tanstack-query-instead-5ejd>
[22] <https://medium.com/@kode456/from-usestate-useeffect-hell-to-tanstack-heaven-your-api-calls-deserve-better-06d0d4d5ae75>
