import { Locale } from './config';

type Messages = {
  [key: string]: string | Messages;
};

let messagesCache: Record<Locale, Messages> = {} as Record<Locale, Messages>;

export async function getMessages(locale: Locale): Promise<Messages> {
  if (!messagesCache[locale]) {
    try {
      const messages = await import(`../../../messages/${locale}.json`);
      messagesCache[locale] = messages.default;
    } catch (error) {
      console.error(`Failed to load messages for locale ${locale}:`, error);
      messagesCache[locale] = {};
    }
  }
  return messagesCache[locale];
}

export function getNestedValue(obj: Messages, path: string): string {
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return the path if not found
    }
  }
  
  return typeof current === 'string' ? current : path;
}