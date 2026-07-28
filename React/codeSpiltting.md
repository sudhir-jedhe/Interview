It is the time of Single Page Applications. We bundle our code, send it to the client and live happily ever after. However, as soon as our app grows, our bundle will grow in size and happiness will turn into nightmares. Users with weak connections will have to wait forever for our app to get up and running. This is not a good user experience at all.

What are we going to build?
So, we discussed the problem statement above. Before going to the solution, let's see what are we going to build in this blog post.

As we can see in the video, we are going to examine an app that serves different Login Page UIs to different users depending upon their network connection type. It means that users with a strong connection will see a full heavy animated login UI else users with a weak connection will see a bare-bones login form. We are not going to send all the code at the initial load rather we lazy load the components as per different conditions.

To see the live demo click here.
To see the code, check out this Github Repo.

What is Code Splitting?
Coming back to the above-mentioned problem statement, it can be solved in many ways. One of them is Code Splitting. As the name suggests, it is a way to create smaller chunks of the code that can be lazy-loaded on demand. It can dramatically improve the user experience and performance of our app. We won't be reducing the overall code but we would be reducing the initial code sent to the client and load more as the user navigates to different parts of our application.

Code Splitting is provided by various bundlers like Webpack, Rollup and Browersify. However, in this blog post, we are going to talk about code splitting provided by React out of the box. We are not going to look into Route based Code Splitting, we would be more interested in Component-based Code Splitting.

React.lazy and Suspense
React 16.6 brought many new features like React.lazy and Suspense. They together provide native support for the lazy loading of the components. Before this, there were third party libraries like React Loadable for a situation like this. It is important to note that React.lazy and Suspense are not yet available for server-side rendering so react-loadable might be a better option if you want SSR.

React.lazy is a function that takes another function as an argument that must call a dynamic import. It returns a promise which resolves to a module with a default export containing the React component we want to lazy load.

const LoginAdvanced = React.lazy(() => import("./LoginAvanced"));
As you can see above, we are passing a function that dynamically imports LoginAdvanced. Now, we can use this component inside Suspense.

function App() => {
return (
<Suspense fallback={<Loader />}>
<LoginAdvanced />
</Suspense>
);
}
Suspense takes a fallback component which allows us to display any React element while waiting for the component to load. In our case, Loader will be shown while we wait for LoginAdvanced to finish loading.

We would have different bundles now -

vendor.js - Containing all the third-party library code. Part of initial load.
bundle.js - Containing critical code for the initial render of the app.
loginAdvanced.js - Fetched on demand.
Different Renders

Usecase
Using the technique discussed so far, we can improve the performance of our apps and provide a better user experience. Let's see one example where we can apply this to dynamically fetch bundles and adaptively render UI.

Suppose, we want some sort of mechanism where we show different UIs to different users based on triggers like their internet speed and likes. Google Chrome Labs team recently published a collection of React hooks that can be used for adaptive loading of the UI based on certain triggers. Check out the announcement here and hooks here.

import React, { Suspense, lazy } from 'react';
import { useNetworkStatus } from 'react-adaptive-hooks/network';

const LoginBasic = lazy(() => import(/_ webpackChunkName: "loginBasic" _/ './LoginBasic'));
const LoginAdvanced = lazy(() => import(/_ webpackChunkName: "loginAdvanced" _/ './LoginAdvanced'));

function App() {
const { effectiveConnectionType } = useNetworkStatus();

return (
<Suspense fallback={<Loader />}>
{effectiveConnectionType === '4g' ? <LoginAdvanced /> : <LoginBase />}
</Suspense>
);
}
...
We are importing the useNetworkStatus hook which will provide us with the type of user's internet connection. If it is a strong connection then we would render a full-fledged login page else a bare-bones login form. We are putting all this into Suspense and lazy loading our components which will allow us to create different bundles for different UIs and fetch them dynamically.

Since we are showing a lighter version to weak connection users, it will lead to lower page load times, better performance and experience. This can be applied to any part of your app. Maybe you want different versions of the listing page, user feed or can be even applied for A/B testing. However, there are cons to this approach too. Any change or addition in functionality needs to be replicated across different versions.

To see the live demo click here.

Go to demo and open devtools.
Go to the Network tab.
Try using the web app with throttling the network speed and without it.
You will see different bundles being loaded as per demand and different UI being rendered.
