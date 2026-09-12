/**
 * Language.
 *
 * The old toggle wrote a preference to localStorage and nothing read it — a
 * switch wired to nothing. This is the layer that was missing.
 *
 * Three things it does beyond swapping strings:
 *
 *   1. Sets `document.documentElement.lang`, so screen readers switch
 *      pronunciation and the browser offers the right spellcheck dictionary.
 *      A translated page still announced as English is barely translated.
 *   2. Exposes the matching BCP-47 LOCALE, so numbers and dates follow the
 *      language. French uses a narrow no-break space for thousands and
 *      DD/MM ordering — "1,234" and "9/13/2026" are wrong in French, not
 *      merely untranslated.
 *   3. Falls back to English when a key is missing, and warns in development.
 *      A raw key on screen is never acceptable.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';

import { DICTIONARIES, en, type Lang, type TranslationKey } from './dictionary';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const LOCALES: Record<Lang, string> = { en: 'en-GB', fr: 'fr-FR' };

interface I18nValue {
  lang: Lang;
  locale: string;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** `vars` fills `{name}` placeholders. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setStoredLang] = useLocalStorage<Lang>('lang', 'en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const dictionary: Partial<Record<TranslationKey, string>> = DICTIONARIES[lang] ?? en;
      let text: string = dictionary[key] ?? en[key] ?? key;

      if (import.meta.env.DEV && dictionary[key] === undefined) {
        console.warn(`[i18n] missing "${lang}" translation for "${key}"`);
      }

      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.split(`{${name}}`).join(String(value));
        }
      }

      return text;
    },
    [lang]
  );

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      locale: LOCALES[lang],
      setLang: setStoredLang,
      toggle: () => setStoredLang((current) => (current === 'en' ? 'fr' : 'en')),
      t,
    }),
    [lang, setStoredLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}

/**
 * Number and date formatters bound to the current language.
 *
 * Prefer these over the raw helpers in `lib/utils/format` anywhere the value
 * is shown to a person: those default to en-US and will not follow the
 * toggle.
 */
export function useFormatters() {
  const { locale } = useI18n();

  return useMemo(
    () => ({
      number: (n: number) => new Intl.NumberFormat(locale).format(n),
      compact: (n: number) =>
        new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n),
      decimal: (n: number, places = 2) =>
        new Intl.NumberFormat(locale, {
          minimumFractionDigits: places,
          maximumFractionDigits: places,
        }).format(n),
      dateTime: (ts: number) =>
        new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(ts),
      date: (ts: number) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(ts),
      time: (ts: number) =>
        new Intl.DateTimeFormat(locale, { timeStyle: 'medium' }).format(ts),
    }),
    [locale]
  );
}
