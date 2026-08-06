```js
getDomain("https://www.google.com/"); // Output: 'google.com'
getDomain("https://www.facebook.com/reacterry/"); // Output: 'facebook.com'
getDomain("http://www.reddit.com/user/reacterry/"); // Output: 'reddit.com'
getDomain("http://www.reddit.co.uk/user/reacterry/"); // Output: 'reddit.co.uk'
getDomain("http://www.reddit.info/user/reacterry/"); // Output: 'reddit.info'
getDomain("https://www.example.com/"); // Output: 'example.com'

export const getDomain = (url) => {
  const protocolRemoved = url.replace(/(^\w+:|^)\/\//, "");

  const wwwRemoved = protocolRemoved.replace("www.", "");

  const domain = wwwRemoved.split("/")[0];

  return domain;
};

export const getDomain = (url) => {
  const protocolRemoved = url.slice(url.indexOf("://") + 3);

  const wwwRemoved = protocolRemoved.startsWith("www.")
    ? protocolRemoved.slice(4)
    : protocolRemoved;

  const domain = wwwRemoved.slice(0, wwwRemoved.indexOf("/"));

  return domain;
};
