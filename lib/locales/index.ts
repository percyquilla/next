export const allLangs = [
  { value: 'es', label: 'Español', countryCode: 'ES' },
  { value: 'en', label: 'English', countryCode: 'US' },
];

export function useTranslate() {
  return {
    t: (key: string) => key,
    i18n: { language: 'es' },
    currentLang: allLangs[0],
    onChangeLang: (_lang: string) => {},
  };
}
