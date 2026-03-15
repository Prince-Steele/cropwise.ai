const { success, error } = require('../utils/apiResponse');
const geminiService = require('../services/gemini.service');
const commoditiesService = require('../services/commodities.service');

const getCropRecommendation = async (req, res, next) => {
  try {
    const soilParams = req.body;

    // Basic validation
    if (!soilParams.temperature || !soilParams.rainfall || !soilParams.nitrogen) {
      return error(res, 'Missing required soil/weather parameters', 400);
    }

    const recommendation = await geminiService.generateCropRecommendation(soilParams);
    return success(res, recommendation, 'Gemini AI crop recommendation generated successfully');
  } catch (err) {
    next(err);
  }
};

const getGeneralAdvice = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return error(res, 'Query parameter is required', 400);
    }

    const marketContext = commoditiesService.getPriceContext(query);
    const advice = await geminiService.generateGeneralAdvice(query, marketContext);
    return success(
      res,
      {
        advice,
        marketMatches: marketContext.matches,
        currency: marketContext.currency
      },
      'General advice generated successfully'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCropRecommendation,
  getGeneralAdvice
};
