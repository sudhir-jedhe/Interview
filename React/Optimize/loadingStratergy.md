https://learnersbucket.com/examples/interview/different-loading-strategies-to-increase-the-website-speed/

In this article we will learn different loading strategies to increase the website speed through different case studies.

“Speed by a thousand cuts” - Different loading strategies to optimize the website speed

“Speed by thousand cuts” a phrase that I can across while reading an article by Ebay on what all practices they had followed for the performance optimization.

After going through 100s of frontend engineer articles from the different tech giants while creating the frontend system design articles for different types of applications, I realized that the most important thing for any business is the speed of the application. Speed affects the user experience, which directly affects the business.

Thus, working at an internet based company that can be accessed globally, it is our primary responsibility as engineers to make apps accessible to as many users as possible with different device capabilities and network coverage.

You build for all, the ones with the least possible resources, which will eventually function better on the higher end.

With all these learnings and knowledge that I had gathered by designing the frontend of the 15 different web apps, I decided to give a talk on React-Bangalore.

I am articulating all the points in this article so that it will be good revision material that you can go through before your frontend system design and optimization interview rounds.

There is a phrase “Death by thousand cuts” that refers to the idea that a series of small faults results in catastrophic failure.

When an application grows, we keep on adding many things, which slowly affect its performance during the initial load and while it is functioning.

“Speed by thousand cuts” is an inverse of “death by thousand cuts,” where we make small improvements in the performance at various levels, which have a snowball effect on the complete application and make it optimized.

Why does speed matter?
Here are some research and findings done by the Google and Amazon that demonstrate the effect of the speed on the business.

According to a survey by Amazon -,

a 1 second improvement in load time has resulted in a $100 million increase in revenue.

Similary, According to Google-,

the probability of bouncing a website increases by 32% as page load time goes from 1 second to 3 seconds.

These clearly indicate that if a website loads faster, more people are likely to visit, which could lead to a purchase or business.

A standard practice that is followed across the industry is to target loading websites under 2s on a slow 3G network, this meets all the core web vitals that affect the search ranking, or SERP.

What is a web page composed of?
To make any optimization, we will first need to understand what a webpage is made up of so that each can be individually targeted.

The HTML code that comprises the page
The page contains embedded images and other media, such as audio and video.
Cascading Style Sheets (CSS) are used for styling the page.
Fonts used for typography
JavaScript to provide user interactivity
Third-party resource containing one or more of the above
According to a recent study by Web Almanac, the size of the webpage has drastically increased over the years. In 2022, the median size of the page that includes all the above mentioned resources was:

Mobile – 2,020 KB
Desktop – 2,315 KB
While a full-fledged application on the high end with lots of media, animations, and styling would be of size:

Mobile – 8MB
Desktop – 9MB
Website page weight distribution as of 2022

Website page weight distribution: Source Web Almanac

How do you do step-wise optimization?
Website performance can be distinguished in two ways:

Make the website load faster: The website should load as fast as possible so that the users do not abandon it or bounce back.
Make the website function faster: The user should have a smooth experience while browsing the website, it should end up crashing or being in a glitch.
To achieve these 2, I have categorized the loading optimization into 3 different parts.

Minimal loading: We should load the website “as early as possible, as little as possible.” to show users that they have been served.
Predictive loading: By predicting what the user’s next action could be, we can pre-load and pre-generate many contents so that the user gets them instantly and doesn’t have to wait longer for them.
Adaptive loading: We serve users the best by adapting to their current device capability and network efficiency, users with higher resources will get full-fledged functionality, while those with fewer resources will get what suits them best in that range.
These can be practically put into practice by following a series of tricks:

Do less up front
Be really lazy
Prepare in the background
Be one step ahead of the user
Minimal loading
“As early as possible, as little as possible.” This term was coined at META, where while re-architecting Facebook and Instagram, they followed this principle to boost the initial load of the page.

This works by splitting the website’s JavaScript into three bundles according to their usage and loading them. To provide exactly what we need, when we need it, they referred to it as “incremental code download.”

Tier 1 – Skeleton UI
Tier 1 comprises the skeletons of the user interface for the initial loading states and is the fundamental layout required to show the first paint for the content above the fold.

Tier-1: Skeleton UI

Image source: Rebuilding our tech stack for the new Facebook.com

It mitigates the CLS (cumulative layout shift), which is one of the six important core web vitals that affect the SEO.

Tier 2 – Complete rendering
All of the JavaScript required to render every piece of content above the fold is included in Tier 2. Nothing on the screen should continue to visually change as a result of the code loading after Tier 2.

Tier 2: Complete re-rendering

Image source: Rebuilding our tech stack for the new Facebook.com

Tier 3 – Lazy load on interaction
Everything that comes after the display and doesn’t change the pixels that are currently on the screen is included in Tier 3. component that loads slowly when a user interacts with it, such as the profile viewer.

Tier 3: Bundle after interaction

Image source: Rebuilding our tech stack for the new Facebook.com

This way, they were able to break their 500 KB JavaScript page into 50 KB in Tier 1, 150 KB in Tier 2, and 300 KB in Tier 3. Because bundles are smaller, they are downloaded and parsed faster.

This is what META experienced after this optimization –

“Because we are able to download less code in order to meet each milestone, splitting our code in this way allows us to improve both the time to first paint and the time to visual completion”.

Predictive loading
Speeding up at Tier 1 on the initial load. At Tier 1, once the HTML is loaded, we know what we will need for the next step, so we can start getting started on fetching it.

Thus, we can use preload, prefetch, and preconnect to boost the discovery of critical resources upfront.

Preconnect: Informs the browser that your page intends to establish a connection to another origin and that you’d like the process to start as soon as possible, reducing round-trip. This is used to reduce the DNS roundtrip by resolving the DNS upfront.
Preloading: The process of giving the browser an early fetch command to obtain resources (such as web fonts, hero images, and key scripts) that are required for the current page.
Prefetch: Provides support for a slightly different use case: a future user navigation (for example, switching between views or pages) in which requests and resources that have been fetched must remain persistent. The key resource and navigation requests can be fulfilled concurrently if Page A starts the prefetch request for the essential resources required for Page B. In this use scenario, preload would be instantly canceled during Page A’s unload.
Reducing the server round trip
In a normal web page flow, the HTML is rendered first, and then JavaScript is parsed, which makes the API calls and requests the data from the server, and then the client hydrates this data on the UI.

Normal webpage request flow

Image source: Making Instagram faster – Part 2

What if we can reduce the roundtrip rather than the client requesting the data through an API call after the JavaScript is parsed? The server starts preparing the data immediately after the HTML is generated, as it can predict what the client will request immediately.

Reducing the roundtrip as server returns the data predicting clients next action

Image source: Making Instagram faster – Part 2

This is done by passing the data in the JSON format and storing it in the script tag.

```js
<script type="text/javascript">
  // the server will write out the paths of any API calls it plans to
  // run server-side so the client knows to wait for the server, rather
  // than doing its own XHR request for the data
  window.__data = {
    '/my/api/path': {
        waiting: [],
    }
  };

  window.__dataLoaded = function(path, data) {
    const cacheEntry = window.__data[path];
    if (cacheEntry) {
      cacheEntry.data = data;
      for (var i = 0;i < cacheEntry.waiting.length; ++i) {
        cacheEntry.waiting[i].resolve(cacheEntry.data);
      }
      cacheEntry.waiting = [];
    }
  };
</script>
```

Copy
Code source: Making Instagram faster – Part 2

As the data is stored through JavaScript, before making an API call, we can check if the data is present in the cache or not. If it is, then pull from the cache or else make the API call.

The server and client can now work more in parallel than they could with the naive loading approach, which cuts down on idle times when they are waiting on one another.

This is what Instagram has experienced in performance using this –

“The impact of this was significant: desktop users experienced a 14% improvement in page display completion time, while mobile users (with higher network latencies) experienced a more pronounced 23% improvement.”

Streaming Server-Side Rendering
Using the “Streaming Server-Side Rendering” protocol, which transfers the HTML in chunks, made it possible to reduce the roundtrip.

Working of streaming server-side rendered

Image source: Patterns.dev

This way, at the end of the HTML chunk, we can include a script that will hold the JSON data processed on the server-side, removing the need for the client to request the data on the initial load.

After which, we can lazy-load the data as a normal flow.

Incremental static regeneration
Another important optimization technique that is very popular now is incremental static regeneration.

With Next.js, you can update static pages during runtime without having to reload the entire website, thanks to a technology called incremental static regeneration. This feature, which revalidates and regenerates pages in the background, presents a smooth method of serving both static and dynamic information.

By adopting this, even the dynamic pages can be pre-generated, and only the parts that change, for example, on the eCommerce site where the pricing and the product availability change often and other product details remain static, can be regenerated.

Simply put, rather than generating the content entirely, we can pre-generate it and even update some of it at runtime.

How this works is: “Next.js sends a request to your data source to check for updates. If updates are found, the page is re-generated with the new data.”

This update can take place at “interval,” “new request,”, or “as defined.”.

Case study: Ebay
Ebay pre-generates the top 10 search results, as the user is most likely to click on them. This works the best as the search results are cached for 1 day, so they do not change for the user. In the event of any change, like pricing or availability, that particular part can be regenerated.

Similarly, many popular hotel booking sites, like Airbnb, pre-generate the top searched results, For example, if there is an IPL match in Mumbai, all the accommodation result pages around the stadium in a defined radius (20km) will be pregenerated.

This results in faster serving and minimizes latency as these pre-generated pages will be served by CDN.

Optimizing every bit, reducing the size wherever possible
Boot time has to be fast, and loading unnecessary data will only result in delays in processing (server), fetching (network), parsing (browser), and rendering (browser).

Thus, optimizing every byte matters, especially for the devices with the slower network connections.

HTML document: keep it as small as possible (recommended: 1200 nodes).
JSON payload: the smaller the result set, the less processing it requires on the server, and the faster it can be delivered.
CSS, JavaScript: load only what is necessary and lazy load remaining on interaction.
Minimize network calls: Try to load the required data upfront.
Case study: Slack
Load enough upfront only what the user can see on the viewport and a little extra and the remaining can be lazy loaded.

Slack used to initially load 200 messages for each channel in the first call, but later they experimented a little, and settled on the ever-magical 42 for a page of history.

“42 messages covers a reasonable amount of conversation without going overboard, and is enough to fill the view on a large monitor. Additionally, most users have less than a full page of unreads on a per-channel basis when connecting or reconnecting. Whether browsing or catching up on a busy channel, older messages can always be fetched as the user scrolls back through history.”

– Slack.

Preparing upfront
After the initial load, it is great to prepare beforehand, predicting the user’s next course of action.

Ecommerce App - User flow

Ecommerce App – User flow

E-commerce: Let’s say the user is in the cart. The most predictable action of the user is that they will move to the checkout page, thus pre-generating the cart page and then partly updating it with items to make it serve faster.

News feed: once the home page and the initial feed are loaded, the server can start preparing the next set of results based on the next cursor (cursor-based pagination). The request is made before the current batch of feeds is about to end, assume (n – 2), and the server returns the response and prepares for the next batch.

Case study: Airbnb

Airbnb cleverly preloads the images by predicting what the users next actions could be. They have optimized the image carousel for each listed hotel.

By default, on the carousels, they load only one image.
Then, using the interaction observer, they detect if the hotel or the card is half-scrolling or not, if it has scrolled, they preload the next image of the carousel.
They used the PostTask API, which helps to schedule actions on priority and provides control over whether to terminate or abort them.
After that, once the user has hovered over any card or is about to perform any CTA, they load the next 3 images, and similarly, on the second scroll, they load next in the sequence of (n + 3).
In case the user navigates, they abort all the ongoing requests.
Airbnb predictive image loading

Airbnb predictive image loading

Limited DOM nodes
DOM re-rendering is one of the most expensive operations. Similar to loading as little as possible JavaScript and other resources, we should also render as little as possible on the DOM nodes.

If you go through the flow of how a webpage is rendered in the browser, you will understand how expensive it is to have a large DOM rendered again on updates.

Making use of the list virtualization to load what will be visible in the viewport and a little extra and the further can be loaded on user action.

List-virtualization in Action

List-virtualization in Action

Adaptive loading
In tech, creating a “one size fits all” solution could be a foolish decision, the wise decision will be to provide the user with their current capabilities.

Delivering distinct experiences to various users according to their hardware and network limitations is known as adaptive loading. Specifically, this includes:

A swift core experience for all users, even with devices with lower specs.
introducing high-end capabilities gradually, provided that a user’s hardware and network can support it.
Through optimization for certain hardware and network limitations, you allow each user to receive the optimal experience on their device. Adapting the experience to the limitations of the users can involve:

Simply requiring a quick CPU to load non-essential JavaScript for interaction.
Delivering acceptable photos and videos across sluggish networks.
Avoid using low-end devices for computationally demanding tasks.
Limiting the animations’ frame rate for devices with low specs.
Preventing third-party scripts on devices that are slower.
Adaptive loading in action
Utilize adapting loading to decide how to render the features and the page based on the available network, device performance, and user choice.

Google provides a list of React hooks (also available in other frameworks such as Angular and Vue) that can be used to make decisions in run-time based on the user’s resource availability to optimize the rendering.

Adapting based on network status (slow-2g, 2g, 3g, or 4g) is possible with the useNetworkStatus() hook.
To adjust according to the user’s Data Saver options, utilize the useSaveData() hook.
Adapting according to the number of logical CPU processor cores on the user’s device is done via the useHardwareConcurrency() hook.
The purpose of the useMemoryStatus() hook is to adjust according to the user’s RAM (device memory).
For example, if the user is on a flaky network with lower speed, we can replace the video with an image placeholder, auto-play the video only when the network is strong, or show the lower quality images.

```js
import React from "react";

import { useNetworkStatus } from "react-adaptive-hooks/network";

const MyComponent = () => {
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
```

Copy
Case study: Ebay
EBay conditionally turns on and off features like zooming when a user’s hardware or network conditions don’t support them well.

Adaptive loading on Ecommerce

Image source: Adaptive loading on Ecommerce

“We can achieve this through adaptive code-splitting and code loading—a way to conditionally load more highly interactive components or run more computationally heavy operations on high-end devices, while not sending those scripts down to users on slower devices.”

– Ebay

Case study: Instagram
Instagram has two different builds for the modern (ES2017) and the legacy browsers. As I stated earlier, “one size fits all” is not a good solution.

Polyfills to support the newer features in the older browser increase the bundle size, serving the same bundle to the browsers that don’t require them increases the downloading, parsing, and execution time for them.

“Instagram ran the numbers and determined that 56% of users to instagram.com are able to be served the ES2017 build without any transpiling or runtime polyfills, and considering that this percentage is only going to go up over time, it seems like it’s worth supporting two builds considering the number of users able to utilize it.”

– Instagram

Case study: Airbnb
The content on the page helps the search engines determine the results, and that will result in a higher ranking of the pages.

But generating the same pages for the lower end devices, especially the mobile devices with a limited network where AMP (accelerated mobile pages) would be preferred, is not good.

To solve this, Airbnb utilizes “dynamic rendering,” where they have configured their application server to detect requests coming from a bot (search engine) and an actual user and accordingly server the pages.

A full-fledged page to the search engine, while the AMP pages to the mobile devices and limited content pages for faster loading on the desktop.

Conclusion
There are many techniques that we are never aware of, it is that we read through how others, especially the industry pioneers, have done it to understand things and then make our own decision.

This is a small article about my learnings from designing the frontend of the 15 different web applications. I have aggregated all the important resources that you need to become an ALPHA frontend engineer and prepare for any job interview.

Check out my course and preview the question “Designing the frontend of a video streaming platform like Netflix and Youtube.”

Enroll in the course to get lifetime access

Share on :
Twitter
LinkedIn
Facebook
Reddit
