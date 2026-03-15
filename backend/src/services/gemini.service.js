const axios = require('axios');
const env = require('../config/env');

class GeminiService {
  constructor() {
    this.apiKey = env.gemini.apiKey;
    this.model = 'gemini-1.5-flash';

    if (!this.apiKey) {
      console.warn('Gemini API key missing. Service will return mock data.');
    }
  }

  async generateCropRecommendation(soilParams) {
    if (!this.apiKey) {
      return {
        recommended_crop: 'wheat (mock)',
        confidence: 0.88,
        notes: 'Gemini API key not configured. Showing mock data.'
      };
    }

    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = soilParams;

    const prompt = `
      You are an expert agricultural AI assistant. Given the following soil and weather parameters:
      - Nitrogen (mg/kg): ${nitrogen}
      - Phosphorus (mg/kg): ${phosphorus}
      - Potassium (mg/kg): ${potassium}
      - Temperature (C): ${temperature}
      - Humidity (%): ${humidity}
      - pH: ${ph}
      - Rainfall (mm): ${rainfall}

      Suggest the most suitable crop to plant. Provide the response as a valid JSON object EXCLUSIVELY with three fields:
      - recommended_crop (string, lowercase)
      - confidence (number between 0 and 1)
      - notes (string, a brief 1-2 sentence explanation why)

      Do not include any other markdown formatting outside of the JSON block.
    `;

    try {
      const responseText = await this.generateText(prompt);
      const cleanedJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const recommendation = JSON.parse(cleanedJsonStr);

      return recommendation;
    } catch (error) {
      console.error('Gemini Service Error:', error.stack || error);
      throw new Error('Failed to generate AI recommendation using Gemini');
    }
  }

  async generateGeneralAdvice(query) {
    if (!this.apiKey) {
      return 'Gemini API key not configured. This is a placeholder farming advice.';
    }

    try {
      const prompt = `You are a helpful expert agronomist. Answer the following question from a farmer: ${query}`;
      return await this.generateText(prompt);
    } catch (error) {
      console.error('Gemini Service Advice Error:', error);
      throw new Error('Failed to generate AI advice');
    }
  }

  async generateText(prompt) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}

module.exports = new GeminiService();
