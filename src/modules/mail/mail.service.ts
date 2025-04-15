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

  public async compileTemplate(
    templateName: string,
    variables: any,
  ): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'mail',
      'templates',
      `${templateName}.hbs`,
    );

    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    return template(variables);
  }

  public async sendWelcomeEmail(
    email: string,
    name: string,
    activationToken: string,
  ): Promise<void> {
    const activationLink = `${this.mailConfig.mailUrl}/auth/activate/${activationToken}`;

    const html = await this.compileTemplate('welcome', {
      name: name,
      year: new Date().getFullYear(),
      activationLink,
    });

    await this.transporter.sendMail({
      from: this.mailConfig.mailFrom,
      to: email,
      subject: 'Welcome',
      html,
    });
  }

  public async sendForgotEmail(
    email: string,
    name: string,
    forgotToken: string,
  ): Promise<void> {
    const forgotLink = `${this.mailConfig.mailUrl}/auth/forgotPassword/${forgotToken}`;

    const html = await this.compileTemplate('forgot', {
      name: name,
      year: new Date().getFullYear(),
      forgotLink,
    });

    await this.transporter.sendMail({
      from: this.mailConfig.mailFrom,
      to: email,
      subject: 'Forgot Password',
      html,
    });
  }
}
