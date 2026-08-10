In front-end system design, **multi-language support** requires structuring an application to dynamically adapt its text, regional formats (dates, numbers, currencies), and layout (RTL vs. LTR) based on user preference.

Front-end engineers divide this into two core concepts:

1. **Internationalization (i18n):** Designing the application architecture so it can support multiple languages without changing core code.
2. **Localization (l10n):** Translating content and adapting regional formatting (e.g., USD vs. INR, MM/DD/YYYY vs. DD/MM/YYYY) for specific target locales.

---

## 1. Core Architecture: How Multi-Language Systems Work

The underlying architecture follows a **data-driven lookup model**:

```
                       [ Locale Detector ]
                  (URL / Cookie / Browser Header)
                                |
                                v
                      [ Current Locale: "hi" ]
                                |
                                v
               [ Dynamic Loader / CDN Fetch ]
                        (hi/translation.json)
                                |
                                v
                     [ i18n Context Store ]
                                |
                                v
+---------------------------------------------------------------+
| React View Engine                                             |
|                                                               |
|   t("welcome", { name: "Amit" })                              |
|               |                                               |
|               v                                               |
|   Looks up "welcome" key in "hi/translation.json"             |
|               |                                               |
|               v                                               |
|   Outputs: "वापसी पर आपका स्वागत है, अमित!"                     |
+---------------------------------------------------------------+

```

1. **Translation Dictionary:** Content is moved out of components into structured JSON files containing `key-value` pairs.
2. **Locale Detection:** The system determines the target language via URL path (e.g., `/hi/dashboard`), user settings, cookies, or `navigator.language`.
3. **i18n Context / Provider:** A global state wrapper holds the currently active locale and loaded dictionary keys.
4. **Dynamic Key Resolution:** Code templates replace raw strings with lookup functions like `t('key')`.

---

## 2. Complete Production Implementation in React (`react-i18next`)

The industry standard for React is **`react-i18next`** (built on `i18next`). It provides dynamic language switching, interpolation, pluralization, and fallback management via React Context.

### Step 1: Define Translation Dictionaries

**`src/locales/en/translation.json`**

```json
{
  "welcome": "Welcome back, {{name}}!",
  "items_count_one": "You have {{count}} item in your cart.",
  "items_count_other": "You have {{count}} items in your cart.",
  "button": {
    "submit": "Submit"
  }
}

```

**`src/locales/hi/translation.json`**

```json
{
  "welcome": "वापसी पर आपका स्वागत है, {{name}}!",
  "items_count_one": "आपकी कार्ट में {{count}} आइटम है।",
  "items_count_other": "आपकी कार्ट में {{count}} आइटम हैं।",
  "button": {
    "submit": "जमा करें"
  }
}

```

---

### Step 2: Configure `i18next` (`src/i18n.js`)

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';

i18n
  // Detects user language from URL, cookies, or browser settings
  .use(LanguageDetector)
  // Passes the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      hi: { translation: translationHI },
    },
    fallbackLng: 'en', // Default language if translation is missing
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
    detection: {
      order: ['path', 'cookie', 'navigator'],
      caches: ['cookie'],
    },
  });

export default i18n;

```

---

### Step 3: Implement Translation Hooks in Components (`App.jsx`)

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    
    // Automatically update the HTML root lang tag for accessibility
    document.documentElement.lang = lng;
  };

  const itemCount = 3;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {/* Language Switcher Controls */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => changeLanguage('en')} style={{ marginRight: '8px' }}>
          English
        </button>
        <button onClick={() => changeLanguage('hi')}>
          हिंदी
        </button>
      </div>

      {/* Dynamic Key Interpolation */}
      <h1>{t('welcome', { name: 'Amit' })}</h1>

      {/* Pluralization Handling */}
      <p>{t('items_count', { count: itemCount })}</p>

      {/* Nested Object Key Access */}
      <button>{t('button.submit')}</button>
    </div>
  );
}

```

---

## 3. High-Scale System Design Considerations

For enterprise front-end applications, consider these crucial production optimizations:

### A. Lazy Loading Translation Bundles

Loading all language files in the initial JS bundle causes severe performance degradation. Use `i18next-http-backend` to dynamically fetch dictionary chunks from a CDN **only when the language is activated**.

```javascript
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    backend: {
      // Fetches locales/en/translation.json on demand from CDN
      loadPath: 'https://cdn.yourdomain.com/locales/{{lng}}/{{ns}}.json',
    },
  });

```

### B. Right-To-Left (RTL) Layout Handling

For languages like Arabic (`ar`) or Hebrew (`he`), modern interfaces must mirror the entire visual layout:

```javascript
i18n.on('languageChanged', (lng) => {
  const isRtl = ['ar', 'he', 'fa', 'ur'].includes(lng);
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
});

```

*In CSS/Tailwind, use **CSS Logical Properties** (e.g., `margin-inline-start` instead of `margin-left`) so spatial layout mirrors automatically.*

### C. Formatting Dates, Numbers & Currencies (`Intl` API)

Avoid hardcoding formats inside JSON files. Rely on the browser's native `Intl` API for locale-aware formatting:

```javascript
// Currency Formatting
new Intl.NumberFormat('hi-IN', { style: 'currency', currency: 'INR' }).format(1500);
// Output: "₹1,500.00"

// Relative Time Formatting
new Intl.RelativeTimeFormat('hi', { numeric: 'auto' }).format(-1, 'day');
// Output: "कल"

```

How do you set up localized routing with URL prefixes like /en/about and /hi/about in React Router?

Setting up localized routing with URL prefixes (e.g., `/en/about`, `/hi/about`) in React Router requires syncing the **React Router location**, **i18next active language**, and **HTML metadata**.

This structure improves SEO by allowing search engines to index language-specific pages separately via distinct URLs.

---

## 1. Architecture Flow

```
User accesses: /hi/about
        |
        v
[ LocalizedLayout Wrapper ]
  1. Parses `:lng` param ("hi")
  2. Validates against supported languages ['en', 'hi']
  3. Updates i18n active locale & HTML <html lang="hi">
  4. Renders nested route (<Outlet />)
        |
        v
[ About Page Components ] -> Renders translated content for "hi"

```

---

## 2. Complete Implementation in React Router (v6/v7)

### Step 1: Define Constants & Helper Utilities (`i18n-config.js`)

```javascript
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'es'];
export const DEFAULT_LANGUAGE = 'en';

export const isValidLanguage = (lng) => SUPPORTED_LANGUAGES.includes(lng);

```

---

### Step 2: Build Localized Layout Wrapper (`LocalizedLayout.jsx`)

This component acts as a layout guard that intercepts URL language prefixes, synchronizes i18next, updates document metadata, and redirects invalid language codes to the default fallback locale.

```jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, isValidLanguage } from './i18n-config';

export const LocalizedLayout = () => {
  const { lng } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Validate if URL language parameter is supported
  if (!isValidLanguage(lng)) {
    // Retain path rest (e.g., /fr/about -> /en/about)
    const newPath = location.pathname.replace(`/${lng}`, `/${DEFAULT_LANGUAGE}`);
    return <Navigate to={newPath} replace />;
  }

  // 2. Synchronize i18n instance and HTML attributes with URL language param
  useEffect(() => {
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }

    // Update root HTML attributes for SEO & Accessibility
    document.documentElement.lang = lng;
    document.documentElement.dir = ['ar', 'he', 'fa', 'ur'].includes(lng) ? 'rtl' : 'ltr';
  }, [lng, i18n]);

  return <Outlet />;
};

```

---

### Step 3: Create Localized Navigation Link & Language Switcher

Standard React Router `<Link to="/about">` will strip the language prefix. Build a wrapped **`LocalizedLink`** and a **`LanguageSwitcher`** that preserves path structures during route transitions.

```jsx
import React from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './i18n-config';

/**
 * Custom Link wrapper that automatically prepends current language prefix
 */
export const LocalizedLink = ({ to, children, ...props }) => {
  const { lng } = useParams();
  const currentLng = lng || DEFAULT_LANGUAGE;

  // Ensure leading slash and prepend language prefix
  const targetPath = to.startsWith('/') ? to : `/${to}`;
  const localizedTo = `/${currentLng}${targetPath}`;

  return (
    <Link to={localizedTo} {...props}>
      {children}
    </Link>
  );
};

/**
 * Language selector that changes language without resetting current page
 */
export const LanguageSwitcher = () => {
  const { lng } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLanguageChange = (newLng) => {
    if (newLng === lng) return;

    // Replace current language prefix with new target language in current path
    const currentPath = location.pathname;
    const newPath = currentPath.replace(`/${lng}`, `/${newLng}`);

    navigate(newPath);
  };

  return (
    <select value={lng} onChange={(e) => handleLanguageChange(e.target.value)}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

```

---

### Step 4: Root Route Redirect Controller (`RootRedirect.jsx`)

When a user visits the bare root path (`/`), detect their preferred language (via browser settings or cookies) and redirect them to their localized homepage (e.g., `/hi` or `/en`).

```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE, isValidLanguage } from './i18n-config';

export const RootRedirect = () => {
  const { i18n } = useTranslation();

  // Detect preferred language from i18next detector or fallback
  const detectedLng = i18n.language?.split('-')[0];
  const targetLng = isValidLanguage(detectedLng) ? detectedLng : DEFAULT_LANGUAGE;

  return <Navigate to={`/${targetLng}`} replace />;
};

```

---

### Step 5: Configure Master Router (`App.jsx`)

Assemble the routing hierarchy with React Router `Routes`. Nest all page views inside the `:lng` parameter layout node.

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocalizedLayout } from './LocalizedLayout';
import { LocalizedLink, LanguageSwitcher } from './LocalizedLink';
import { RootRedirect } from './RootRedirect';
import './i18n'; // Initialize i18next configuration

const NavigationBar = () => {
  const { t } = useTranslation();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f1f5f9' }}>
      <LocalizedLink to="/">{t('nav.home', 'Home')}</LocalizedLink>
      <LocalizedLink to="/about">{t('nav.about', 'About')}</LocalizedLink>
      <LocalizedLink to="/dashboard">{t('nav.dashboard', 'Dashboard')}</LocalizedLink>
      <LanguageSwitcher />
    </nav>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  return <h1>{t('home.title', 'Welcome to the Homepage!')}</h1>;
};

const AboutPage = () => {
  const { t } = useTranslation();
  return <h1>{t('about.title', 'About Us')}</h1>;
};

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <main style={{ padding: '2rem' }}>
        <Routes>
          {/* Bare Root Path "/" -> Redirects to preferred language (e.g., "/en") */}
          <Route path="/" element={<RootRedirect />} />

          {/* Localized Parent Route Catching "/:lng/*" */}
          <Route path="/:lng" element={<LocalizedLocalizedWrapper />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="dashboard" element={<div>Dashboard View</div>} />
            <Route path="*" element={<div>404 - Localized Page Not Found</div>} />
          </Route>

          {/* Global Catch-all for invalid top-level URLs */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

// Wrapper component to pass down layout
function LocalizedLocalizedWrapper() {
  return <LocalizedLayout />;
}

```

---

## 3. SEO Optimization Checklist

1. **Alternate `hreflang` Head Tags:** Inject `<link rel="alternate" hrefLang="hi" href="[https://site.com/hi/about](https://site.com/hi/about)" />` into the HTML `<head>` using `react-helmet-async` so search engines understand multilingual page mappings.
2. **Canonical Links:** Set canonical URLs explicitly to prevent duplicate content flags across default language fallbacks.
