import * as Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string().min(10).default('dev_secret_change_me'),
  JWT_EXPIRES_IN: Joi.string().default('1h'),

  PERSISTENCE_DRIVER: Joi.string().valid('in-memory', 'mysql').default('in-memory'),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().port().default(3306),
  DB_USER: Joi.string().default('root'),
  DB_PASSWORD: Joi.string().allow('').default(''),
  DB_NAME: Joi.string().default('ticketing_system'),
  DB_LOGGING: Joi.boolean().default(false),
}).unknown(true);

export function validateEnv(config: Record<string, unknown>) {
  const { value, error } = envSchema.validate(config);
  if (error) {
    throw new Error(`Env validation error: ${error.message}`);
  }
  return value;
}
