import sgMail from '@sendgrid/mail';
import { sendGridConfig } from '../config/sendgrid.config';

sgMail.setApiKey(sendGridConfig.apiKey);

class EmailService {
  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<{ success: boolean; message: any }> {
    const message = {
      to,
      from: sendGridConfig.senderEmail,
      subject,
      html,
    };

    try {
      const response = await sgMail.send(message);
      console.log('Email sent successfully:', response);
      return { success: true, message: response };
    } catch (error: any) {
      console.error('Error sending email:', error);
      let errorMessage = 'Failed to send email';
      if (error.response && error.response.body && error.response.body.errors) {
        errorMessage = error.response.body.errors
          .map((err: any) => err.message)
          .join(', ');
      }
      return { success: false, message: errorMessage };
    }
  }
}

export const emailService = new EmailService();
