const supabaseClient = require('../config/supabaseClient');

class SupabaseService {
  /**
   * Save a crop recommendation entry to the database
   */
  async saveRecommendation(userId, inputData, recommendedCrop, confidence, notes) {
    try {
      const response = await supabaseClient.rest.post('/crop_recommendations', [
        {
          user_id: userId,
          input_data: inputData,
          recommended_crop: recommendedCrop,
          confidence,
          notes
        }
      ], {
        headers: {
          Prefer: 'return=representation',
        },
      });

      return response.data[0];
    } catch (error) {
      console.error('Supabase saveRecommendation Error:', error);
      throw new Error('Could not save recommendation to database');
    }
  }

  /**
   * Fetch a user's recommendation history
   */
  async getUserRecommendations(userId) {
    try {
      const response = await supabaseClient.rest.get('/crop_recommendations', {
        params: {
          select: '*',
          user_id: `eq.${userId}`,
          order: 'created_at.desc',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Supabase getUserRecommendations Error:', error);
      throw new Error('Could not fetch recommendations history');
    }
  }
}

module.exports = new SupabaseService();
