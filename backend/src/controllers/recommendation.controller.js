const { success, error } = require('../utils/apiResponse');
const supabaseService = require('../services/supabase.service');
const cropRecommendationService = require('../services/cropRecommendation.service');

const predictRecommendation = async (req, res, next) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;

    // Validate inputs
    if (nitrogen == null || phosphorus == null || potassium == null || 
        temperature == null || humidity == null || ph == null || rainfall == null) {
      return error(res, 'All soil and weather parameters are required', 400);
    }

    const recommendation = cropRecommendationService.predict({
      nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall
    });

    return success(res, recommendation, 'Crop recommendation generated successfully from dataset');

  } catch (err) {
    next(err);
  }
};

const saveRecommendation = async (req, res, next) => {
  try {
    // req.user is guaranteed by requireAuth midleware
    const userId = req.user.id;
    const { input_data, recommended_crop, confidence, notes } = req.body;

    if (!input_data || !recommended_crop) {
      return error(res, 'Input data and recommended crop are required', 400);
    }

    const savedRecord = await supabaseService.saveRecommendation(
      userId, input_data, recommended_crop, confidence, notes
    );

    return success(res, savedRecord, 'Recommendation saved successfully');
  } catch (err) {
    next(err);
  }
};

const getMyRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await supabaseService.getUserRecommendations(userId);
    
    return success(res, history, 'Recommendation history fetched successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  predictRecommendation,
  saveRecommendation,
  getMyRecommendations
};
