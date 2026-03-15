const axios = require('axios');
const env = require('./env');

if (!env.supabase.url || !env.supabase.serviceRoleKey) {
  console.warn('Supabase credentials not found in environment variables.');
  console.warn('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable database features.');
}

const baseHeaders = {
  apikey: env.supabase.serviceRoleKey || 'placeholder_key',
  Authorization: `Bearer ${env.supabase.serviceRoleKey || 'placeholder_key'}`,
};

module.exports = {
  auth: axios.create({
    baseURL: `${env.supabase.url || 'http://placeholder.supabase.co'}/auth/v1`,
    headers: baseHeaders,
  }),
  rest: axios.create({
    baseURL: `${env.supabase.url || 'http://placeholder.supabase.co'}/rest/v1`,
    headers: {
      ...baseHeaders,
      'Content-Type': 'application/json',
    },
  }),
};
