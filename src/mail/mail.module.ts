import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobSchema } from 'src/jobs/schemas/job.schemas';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASS'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        //preview: true
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }]),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    SubscribersModule, JobsModule
  ],

  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }
