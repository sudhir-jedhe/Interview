HTML character entities are special codes used to display characters that the browser might otherwise misinterpret, or characters that don't exist on a standard keyboard.

They always follow the same structure: they begin with an ampersand (`&`) and end with a semicolon (`;`).

## 1. Why Do We Need Them? (Reserved Characters)

Certain characters are "reserved" in HTML because they are part of the code itself.

For example, if you want to write the mathematical equation `5 < 10` on your webpage, you cannot just type the `<` symbol. The browser will think you are trying to open an HTML tag and might hide the rest of your text.

To fix this, you replace the `<` with its character entity: `5 &lt; 10`.

Here are the essential reserved characters you must replace with entities:

| Character | Description               | Entity Name | Entity Number |
| --------- | ------------------------- | ----------- | ------------- |
| `<`       | Less than                 | `&lt;`      | `&#60;`       |
| `>`       | Greater than              | `&gt;`      | `&#62;`       |
| `&`       | Ampersand                 | `&amp;`     | `&#38;`       |
| `"`       | Double quote              | `&quot;`    | `&#34;`       |
| `'`       | Single quote / Apostrophe | `&apos;`    | `&#39;`       |

_(Note: Entity names are easier to remember, but entity numbers are supported by all browsers, even ancient ones. Entity names are also strictly case-sensitive)._

## 2. The Non-Breaking Space ( )

This is the most frequently used character entity in HTML. It serves two distinct purposes:

1. **Preventing line breaks:** If you have a phrase like `10 km`, you don't want "10" at the end of one line and "km" starting the next. Writing `10&nbsp;km` glues them together so they never separate.
2. **Forcing multiple spaces:** Browsers ignore extra spaces in your code. If you type 10 spaces between two words, the browser will collapse them into a single space. If you want to force multiple spaces, you use `&nbsp;`.

## 3. Common Typographical Symbols

Entities are also used to insert legal symbols, currency, and punctuation that might not easily type out on your keyboard.

| Character | Description          | Entity Name |
| --------- | -------------------- | ----------- |
| `©`       | Copyright            | `&copy;`    |
| `®`       | Registered Trademark | `&reg;`     |
| `™`       | Trademark            | `&trade;`   |
| `€`       | Euro                 | `&euro;`    |
| `£`       | Pound                | `&pound;`   |
| `¢`       | Cent                 | `&cent;`    |
| `×`       | Multiplication sign  | `&times;`   |
| `÷`       | Division sign        | `&divide;`  |
