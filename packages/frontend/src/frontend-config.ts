/**
 * Main configuration for frontend, read from .env
 * author: Ke An Nguyen
 */

type EnvironmentConfig = {
    NODE_ENV?: 'development' | 'production' | 'test',
    PUBLIC_URL?: string,
};

const env: EnvironmentConfig = import.meta.env as any;

export const CONFIG: typeof env= {
    // Default value, these variables can be overwritten by ...env
    NODE_ENV: 'development',
    PUBLIC_URL: 'https://localhost',
    ...env,
}