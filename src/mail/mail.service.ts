import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Configuration,
  EmailsApi
} from '@elasticemail/elasticemail-client-ts-axios';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  private EMAIL_API_KEY = this.configService.get<string>('ELASTIC_EMAIL_KEY');
  private config = new Configuration({
    apiKey: this.EMAIL_API_KEY,
  });
  private emailsApi = new EmailsApi(this.config);

  async sendBulkEmails(
    template: any,
    recipient?: string,
    emailMessageData?: any,
    subject?: string,
  ) {
    emailMessageData = {
      Recipients: [
        {
          Email: recipient,
          Fields: emailMessageData,
        },
      ],
      Content: {
        Body: [
          {
            ContentType: 'HTML',
            Charset: 'utf-8',
            Content: template,
          },
        ],
        From: 'noreply@em.streemr.io',
        Subject: subject,
      },
    };
    this.emailsApi
      .emailsPost(emailMessageData)
      .then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
