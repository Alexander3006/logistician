import { Locales } from 'src/domain/notification/types';
import { Templates } from '../types';

export class SendMailDTO {
  recipient: string;
  template: Templates;
  locale: Locales;
  variables: any;
}
