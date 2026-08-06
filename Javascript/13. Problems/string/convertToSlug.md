```js
convertToSlug("This is an example string"); // Output: "this-is-an-example-string"
convertToSlug("This is another string"); // Output: "this-is-another-string"
convertToSlug(""); // Output: ""

export const convertToSlug = (str) => {
  if (str === "") {
    return "";
  }

  const words = str.split(" ");
  const slug = words.join("-").toLowerCase();

  return slug;
};
