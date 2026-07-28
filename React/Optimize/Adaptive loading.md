https://learnersbucket.com/examples/javascript/adaptive-loading-progressively-improve-web-performance/

Adaptive loading: progressively improve web performance
Posted on March 12, 2024 | by Prashant Yadav

Posted in Javascript, Web | Tagged web

The world is an inconsistent place; not everyone holds the same things, and this holds true for the devices they operate, the configuration of the devices, and the network access they have.

We are talking about device and network inconsistencies because we are trying to improve web performance by using a pattern called adaptive loading.

Providing a “one fit for all” solution can be the wrong decision that you can make, especially if you are targeting developing countries like India and Indonesia, where the majority of the young population with internet access resides.

Thus, the focus should be on serving the user best based on their current network condition and device capabilities.

Addy Osmani from Google and Nate Schloss from Facebook discuss a pattern for delivering pages that better accommodate a range of user constraints as a potential solution to that issue in their Chrome Dev Summit talk. They summarized this pattern with the term “adaptive loading.”

What is adaptive loading?
Adaptive loading: Progressively improve web performance

Adaptive loading is the loading of resources or features based on the user device capabilities and the network condition. For example:

For users on the slower network, serve low-quality images, do not autoplay the videos, etc.
For users with limited processing capacity on the devices, do not provide large animations.
Progressively add on the features as and when the network condition improves. For the device, we can do progressive enhancements.

Curating the feature delivery as per the user’s current capabilities and progressively enhancing it can be the best way to serve a wide range of users.

You may notice that when the network speed is affected, YouTube downgrades the video quality. This allows users to continue using the application, though it is not the best experience. They can still browse the application, and the stream adjusts automatically once the network condition improves.

The following are things that can be worked on for adaptive loading:

Serve low-quality media (video and images) for the smaller devices.
Avoid heavy client-side computation on lower end devices.
Lazy load scripts on the user interaction.
Providing data-saver options to the user based on device capability and serving the AMP (Accelerated Mobile Pages).
Predictively preload the resources; for example, if you know where the user will navigate next, preload that page or script.
Block third-party scripts on lower end devices.
Adaptive loading in React
In React, we can use the hooks and utilities package provided by Google to implement adaptive loading.

To adapt based on the network speed and status (4g, 3g, 2g, or slow-2g), use useNetworkStatus().
The useSaveData() hook is for adapting based on the user’s Data Saver preferences, if the user has opted for the data-saver mode.
The useHardwareConcurrency() hook can be used to improve the performance based on the available CPU processor.
The useMemoryStatus() hook is for adapting based on the user’s device memory (RAM).
The majority of these capabilities work on Chromium browsers such as Chrome and Edge.

All of these hooks accept an optional initial value that helps in scenarios where the browser does not support the properties or while doing server-side rendering. This value can be used as a default case. It will be updated with the current value in the browsers where it is supported.

For example, useNetworkStatus() uses the navigator.connection.effectiveType property.

Adaptive loading examples in React
We can use the useNetworkStatus() hook to serve the desired quality of images based on the current network condition.

```js
import React from "react";

import { useNetworkStatus } from "react-adaptive-hooks/network";

const AdaptiveComponent = () => {
  const { effectiveConnectionType } = useNetworkStatus();

  let media;
  switch (effectiveConnectionType) {
    case "slow-2g":
      media = <img src="..." alt="low resolution" />;
      break;
    case "2g":
      media = <img src="..." alt="medium resolution" />;
      break;
    case "3g":
      media = <img src="..." alt="high resolution" />;
      break;
    case "4g":
      media = (
        <video muted controls>
          ...
        </video>
      );
      break;
    default:
      media = (
        <video muted controls>
          ...
        </video>
      );
      break;
  }

  return <div>{media}</div>;
};

export default AdaptiveComponent;
```

Copy
For more comprehensive enhancement, we can combine these hooks with other common performance improvement techniques like code splitting and load an entirely different component and its bundle based on the network condition.

For example, on slower networks, we will serve AMP pages or components without large media, and on faster networks (4g), we will serve the full page.

```js
import React, { Suspense, lazy } from "react";

import { useNetworkStatus } from "react-adaptive-hooks/network";

const Full = lazy(() => import(/* webpackChunkName: "full" */ "./Full.js"));
const AMP = lazy(() => import(/* webpackChunkName: "light" */ "./AMP.js"));

const AdaptiveComponent = () => {
  const { effectiveConnectionType } = useNetworkStatus();
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {effectiveConnectionType === "4g" ? <Full /> : <AMP />}
      </Suspense>
    </div>
  );
};

export default AdaptiveComponent;
```

Copy
We can separate this, go further, and serve more optimized components on the different network types.

```js
import React, { Suspense } from "react";

const AdaptiveComponent = React.lazy(() => {
  const effectiveType = navigator.connection
    ? navigator.connection.effectiveType
    : null;

  let module;
  switch (effectiveType) {
    case "3g":
      module = import(/* webpackChunkName: "light" */ "./AMP.js");
      break;
    case "4g":
      module = import(/* webpackChunkName: "full" */ "./Full.js");
      break;
    default:
      module = import(/* webpackChunkName: "full" */ "./Full.js");
      break;
  }

  return module;
});

const App = () => {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <AdaptiveComponent />
      </Suspense>
    </div>
  );
};

export default App;
```

Copy
Examples of adaptive loading: progressively improving web performance
Twitter provides a data-saver option for lower end devices, which, when enabled, serves the AMP pages..
Ebay disables the image zooming feature for devices with slower network connections.
Tinder on slower networks and in its lite app serves a single image rather than a carousel.
