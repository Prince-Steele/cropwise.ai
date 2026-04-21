const express = require('express');
const { success } = require('../utils/apiResponse');
const env = require('../config/env');
const supabaseClient = require('../config/supabaseClient');

const router = express.Router();

router.get('/', (req, res) => {
  return success(res, null, 'CropWise Backend API is running');
});

router.get('/keepalive', async (req, res) => {
  if (!env.supabase.url || !env.supabase.serviceRoleKey) {
    return res.status(500).json({
      status: 'error',
      message: 'Supabase keepalive is not configured on the server.',
    });
  }

  try {
    const response = await supabaseClient.rest.get(`/${env.supabase.keepAliveTable}`, {
      params: {
        select: 'id',
        limit: 1,
      },
    });

    return success(
      res,
      null,
      'Supabase keepalive check passed'
    );
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Supabase keepalive check failed.',
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
