every React app starts facing performance issues. One major reason is the bundle size. It quietly slows down your app, and many teams don’t notice it early.

After doing a proper performance check, I reduced the bundle size from 4.2MB to 1.6MB. At the same time, the page load speed (LCP) improved from 6.8 seconds to 1.9 seconds.

Here are the key things that helped:

1. I used a bundle analyzer to see which files and libraries were making the app heavy. This gave me a clear direction on what to fix.

2. I applied tree shaking by using proper imports. This removed a lot of unused code from the final build.

3. I added code splitting using React.lazy() and Suspense, so heavy components like charts and modals load only when needed.

4. I enabled Gzip and Brotli compression on the server, which reduced file size during transfer without changing any code.

5. I reviewed dependencies and replaced heavy libraries like moment.js and lodash with lighter options and native JavaScript.

The result was very clear — faster loading, better performance scores, and a smoother user experience.
