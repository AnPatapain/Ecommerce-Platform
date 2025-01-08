/**
 * Main configuration for frontend, read from .env
 * author: Ke An Nguyen
 */

const env: ImportMetaEnv = import.meta.env;

export const CONFIG: any= {
    PUBLIC_URL: env.MODE === 'production' ? 'https://vps-3131144f.vps.ovh.net' : 'https://localhost'
}