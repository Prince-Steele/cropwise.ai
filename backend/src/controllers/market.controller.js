const { success, error } = require('../utils/apiResponse');
const commoditiesService = require('../services/commodities.service');

const getLatestPrices = async (req, res, next) => {
  try {
    const { symbols, base } = req.query;
    if (!symbols) {
      return error(res, 'Symbols query parameter is required (e.g. ?symbols=WHEAT,CORN)', 400);
    }

    const data = await commoditiesService.getLatestPrices(symbols, base);
    return success(res, data.data, 'Latest market prices fetched successfully');
  } catch (err) {
    next(err);
  }
};

const getHistoricalPrices = async (req, res, next) => {
  try {
    const { date, symbols, base } = req.query;
    if (!date || !symbols) {
      return error(res, 'Date and symbols query parameters are required', 400);
    }

    const data = await commoditiesService.getHistoricalPrices(date, symbols, base);
    return success(res, data.data, `Historical prices for ${date} fetched successfully`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLatestPrices,
  getHistoricalPrices
};
