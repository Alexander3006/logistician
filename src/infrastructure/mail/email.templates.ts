import { Locales, Templates } from './types';

export const MailerSubject = {
  [Templates.EMAIL_VERIFICATION]: {
    [Locales.EN]: (...args: any[]) => 'Email verification',
    [Locales.UA]: (...args: any[]) => 'Email verification',
    [Locales.RU]: (...args: any[]) => 'Email verification',
  },
  [Templates.UPDATE_PASSWORD_CODE]: {
    [Locales.EN]: (...args: any[]) => 'Password change confirmation',
    [Locales.UA]: (...args: any[]) => 'Password change confirmation',
    [Locales.RU]: (...args: any[]) => 'Password change confirmation',
  },
};

export const MailerTextRenderers = {
  [Templates.EMAIL_VERIFICATION]: {
    [Locales.EN]: ({ code }) => `Code: ${code}`,
    [Locales.UA]: ({ code }) => `Code: ${code}`,
    [Locales.RU]: ({ code }) => `Code: ${code}`,
  },
  [Templates.UPDATE_PASSWORD_CODE]: {
    [Locales.EN]: ({ code }) => `Code: ${code}`,
    [Locales.UA]: ({ code }) => `Code: ${code}`,
    [Locales.RU]: ({ code }) => `Code: ${code}`,
  },
};
