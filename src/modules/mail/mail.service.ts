import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Config, MailConfig } from '../../config/config.type';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private mailConfig: MailConfig;

  constructor(private configService: ConfigService<Config>) {
    this.mailConfig = this.configService.get<MailConfig>('mail');
    this.transporter = nodemailer.createTransport({
      host: this.mailConfig.mailHost,
      port: this.mailConfig.mailPort,
      auth: {
        user: this.mailConfig.mailUser,
        pass: this.mailConfig.mailPassword,
      },
    });
  }

  public async sendWelcomeEmail(email: string): Promise<void> {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'mail',
      'templates',
      'welcome.hbs',
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    const html = template({
      name: email,
      year: new Date().getFullYear(),
    });

    await this.transporter.sendMail({
      from: this.mailConfig.mailFrom,
      to: email,
      subject: 'Ласкаво просимо',
      html,
    });
  }
}
