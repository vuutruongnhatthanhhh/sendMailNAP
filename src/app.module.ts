import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransformInterceptor } from '@/core/transform.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';

import * as path from 'path';

@Module({
  imports: [
    // UsersModule,
    AuthModule,
    // SourcecodeModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGODB_URI'),
    //   }),
    //   inject: [ConfigService],
    // }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"Snake Chain" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    // ServeStaticModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: () => [
    //     {
    //       rootPath: path.join(__dirname, '..', 'uploadSourceCode'),
    //       serveRoot: '/uploadSourceCode',
    //     },
    //     {
    //       rootPath: path.join(__dirname, '..', 'uploadBlog'),
    //       serveRoot: '/uploadBlog',
    //     },
    //   ],
    // }),
    // BlogsModule,
  ],
  controllers: [AppController],
  // protect all routes with JwtAuthGuard
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
