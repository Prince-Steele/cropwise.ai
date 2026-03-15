const { success, error } = require('../utils/apiResponse');
const commoditiesService = require('../services/commodities.service');

const getLatestPrices = async (req, res, next) => {
  try {
    const search = req.query.search || req.query.symbols || '';
    const data = await commoditiesService.getLatestPrices(search);
    return success(res, data.data, 'Latest market prices fetched successfully');
  } catch (err) {
    next(err);
  }
};

const getHistoricalPrices = async (req, res, next) => {
  try {
    const { date } = req.query;
    const search = req.query.search || req.query.symbols || '';

    if (!date) {
      return error(res, 'Date query parameter is required', 400);
    }

    const data = await commoditiesService.getHistoricalPrices(date, search);
    return success(res, data.data, `Historical prices for ${date} fetched successfully`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLatestPrices,
  getHistoricalPrices
};
