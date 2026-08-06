Emojis in HTML are not actually images — they are text characters, just like the letters `A`, `B`, or `C`. Because they are part of the Unicode character set, your browser renders them using the built-in emoji font of the user's operating system (iOS, Windows, Android, etc.).

There are two ways to add them to your HTML.

## 1. The Prerequisite: UTF-8

Before using emojis, you must ensure your HTML file tells the browser to use the UTF-8 character encoding. Without this, browsers might render your emojis as broken boxes or weird symbols.

As covered in the previous answer, you do this in the `<head>`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <!-- Emojis go here -->
  </body>
</html>
```

## 2. Method A: Direct Copy and Paste (Recommended)

Because modern code editors (like VS Code) and browsers fully support UTF-8, the easiest way to use an emoji is to simply copy and paste it directly into your HTML text.

```html
<h1>Welcome to my website! 👋</h1>
<p>I love coding in HTML 💻 and CSS 🎨.</p>
```

- **Mac shortcut:** `Cmd` + `Ctrl` + `Space`
- **Windows shortcut:** `Windows key` + `.` (period)

## 3. Method B: HTML Entities (Decimals or Hex Codes)

If you are working in an environment that restricts special characters or doesn't support UTF-8 natively, you can use the exact Unicode number for the emoji.

You write this by using an ampersand (`&`), a hash (`#`), the entity number, and a semicolon (`;`).

```html
<!-- Decimal Entity -->
<p>I am smiling: &#128512;</p>
<!-- Renders as: 😀 -->

<!-- Hexadecimal Entity (starts with an 'x') -->
<p>I am smiling: &#x1F600;</p>
<!-- Renders as: 😀 -->
```

_(You can look up the HTML entity code for any emoji on sites like Emojipedia or W3Schools)._

## Styling Emojis with CSS

Because emojis are text characters and not images, you cannot resize them using `width` or `height`. Instead, you use standard typography CSS, specifically `font-size`.

```html
<p style="font-size: 48px;">🚀</p>
```

> **Accessibility Tip:** Screen readers (used by blind users) will read emojis out loud (e.g., reading "🚀" as "rocket"). However, if you are using an emoji as a standalone icon, it is best practice to wrap it in a `<span>` with an `aria-label` so the screen reader interprets it perfectly:
> `<span role="img" aria-label="rocket">🚀</span>`
