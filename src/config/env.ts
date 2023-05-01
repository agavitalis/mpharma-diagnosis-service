import * as Joi from 'joi';
import * as dotenv from 'dotenv';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('dev', 'staging', 'production').required(),
  DB_URL: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`ENV Configuration error: \n${error.message}`);
}

export const config = {
  IS_DEVELOPMENT:
    envVars.NODE_ENV === 'dev' || envVars.NODE_ENV === 'staging' ? true : false,
  IS_LOCALHOST: envVars.NODE_ENV === 'dev' ? true : false,
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  DB_URL: envVars.DB_URL,

  // Rabbit MQ Env
  RABBITMQ_URL: envVars.RABBITMQ_URL,

  RABBITMQ_NOTIFICATION_CLIENT: envVars.RABBITMQ_NOTIFICATION_CLIENT,
  RABBITMQ_NOTIFICATION_QUEUE: envVars.RABBITMQ_NOTIFICATION_QUEUE,
};
