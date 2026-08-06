// A cookie is a piece of data that is stored on your computer to be accessed by your browser. Cookies are saved as key/value pairs.
// For example, you can create a cookie named username as below,

document.cookie = "username=John";

// Why do you need a Cookie

// Cookies are used to remember information about the user profile(such as username). It basically involves two steps,

// 1. When a user visits a web page, the user profile can be stored in a cookie.
// 2. Next time the user visits the page, the cookie remembers the user profile.

// What are the options in a cookie

// There are few below options available for a cookie,

// 1. By default, the cookie is deleted when the browser is closed but you can change this behavior by setting expiry date (in UTC time).

document.cookie = "username=John; expires=Sat, 8 Jun 2019 12:00:00 UTC";

// 2. By default, the cookie belongs to a current page. But you can tell the browser what path the cookie belongs to using a path parameter.

document.cookie = "username=John; path=/services";

// How do you delete a cookie

// You can delete a cookie by setting the expiry date as a passed date. You don't need to specify a cookie value in this case.
// For example, you can delete a username cookie in the current page as below.

document.cookie = "username=; expires=Fri, 07 Jun 2019 00:00:00 UTC; path=/;";

// **Note:** You should define the cookie path option to ensure that you delete the right cookie. Some browsers doesn't allow to delete a cookie unless you specify a path parameter.
