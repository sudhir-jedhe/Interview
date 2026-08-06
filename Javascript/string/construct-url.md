```js
const query = "Where's Waldø?";
const locale = "en-US";
const campaign = "promo_email";

const url = `https://examp.le
  ?q=${encodeURIComponent(query)}&lang=${encodeURIComponent(
    locale,
  )}&from=${encodeURIComponent(campaign)}`;
// "https://examp.le\n ?q=Where's%20Wald%C3%B8%3F&lang=en-US&from=promo_emai

const query = "Where's Waldø?";
const locale = "en-US";
const campaign = "promo_email";

// Good
const url = new URL("https://examp.le");

url.searchParams.set("q", query);
url.searchParams.set("lang", locale);
url.searchParams.set("from", campaign);

url.toString();
// 'https://examp.le/?q=Where%27s+Wald%C3%B8%3F&lang=en-US&from=promo_email'
```
