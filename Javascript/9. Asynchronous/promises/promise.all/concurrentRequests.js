import axios from 'axios';

async function makeRequests(urls) {
  console.log("Starting concurrent requests...");

  const fetchUrl = (url) => axios.get(url, { timeout: 5000 }); // 5 second timeout
  const promises = urls.map(fetchUrl);

  try {
    let responses = await Promise.all(promises);

    responses.forEach((resp) => {
      let msg = `${resp.config.url} -> ${resp.headers.server || 'Unknown'}: ${resp.status}`;
      console.log(msg);
    });
  } catch (error) {
    if (error.response) {
      console.error(`Error with ${error.config.url}: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      console.error(`No response received from ${error.config.url}: ${error.message}`);
    } else {
      console.error(`Error setting up request: ${error.message}`);
    }
  }

  console.log("All requests completed.");
}

let urls = [
  "http://webcode.me",
  "https://example.com",
  "http://httpbin.org",
  "https://clojure.org",
  "https://fsharp.org",
  "https://symfony.com",
  "https://www.perl.org",
  "https://www.php.net",
  "https://www.python.org",
  "https://code.visualstudio.com",
  "https://github.com",
];

makeRequests(urls);