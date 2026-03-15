const express = require('express');
const { success } = require('../utils/apiResponse');

const router = express.Router();

router.get('/', (req, res) => {
  return success(res, null, 'CropWise Backend API is running');
});

module.exports = router;
