import * as Joi from '@hapi/joi';
import { ConfigModule as CM } from '@nestjs/config';

export const ConfigModule = CM.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  validationSchema: Joi.object({
    //env
    MODE: Joi.allow('development', 'production').required(),
    //database postgres
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().port().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    //auth
    GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
    GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_OAUTH_REDIRECT: Joi.string().required(),
    FACEBOOK_AUTH_CLIENT_ID: Joi.string().required(),
    FACEBOOK_AUTH_CLIENT_SECRET: Joi.string().required(),
    FACEBOOK_OAUTH_REDIRECT: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().integer().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().integer().required(),
    TWO_FACTOR_AUTHENTICATION_APP_NAME: Joi.string().required(),
    //redis
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().port().required(),
    // rabbitmq
    RABBITMQ_HOST: Joi.string().required(),
    RABBITMQ_PORT: Joi.number().port().required(),
    RABBITMQ_USER: Joi.string().required(),
    RABBITMQ_PASSWORD: Joi.string().required(),
    //mailgun
    MAILGUN_USERNAME: Joi.string().required(),
    MAILGUN_API_KEY: Joi.string().required(),
    MAILGUN_API_URL: Joi.string().required(),
    MAILGUN_EMAIL_SENDER: Joi.string().email().required(),
    MAILGUN_DOMAIN: Joi.string().required(),
    //captcha
    GEETEST_ID: Joi.string().allow(''),
    GEETEST_KEY: Joi.string().allow(''),
    DISABLE_CAPTCHA: Joi.boolean().required(),
    //websockets
    WS_HOST: Joi.string().hostname(),
    WS_PORT: Joi.number().port(),
    DISABLE_PING_PONG: Joi.boolean().default(false),
    // s3
    AWS_S3_ENDPOINT: Joi.string().required(),
    AWS_S3_REGION: Joi.string().required(),
    AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
    AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
    // local file storage
    LOCAL_FILE_STORAGE_BASE_PATH: Joi.string().required(),
    LOCAL_FILE_SIGN_URL_KEY: Joi.string().required(),
    // Telemetry
    ZIPKIN_URL: Joi.string().uri().required(),
  }),
});
