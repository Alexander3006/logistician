import { Templates, Locales } from '../types';

export class SendMailDTO {
  recipient: string;
  template: Templates;
  locale: Locales;
  variables: any;
}
