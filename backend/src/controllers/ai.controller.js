const { success, error } = require('../utils/apiResponse');
const geminiService = require('../services/gemini.service');

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
  
      const advice = await geminiService.generateGeneralAdvice(query);
      return success(res, { advice }, 'General advice generated successfully');
    } catch (err) {
      next(err);
    }
  };

module.exports = {
  getCropRecommendation,
  getGeneralAdvice
};
