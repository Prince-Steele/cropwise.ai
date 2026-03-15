const axios = require('axios');
const env = require('../config/env');

class GeminiService {
  constructor() {
    this.apiKey = env.gemini.apiKey;
    this.model = 'gemini-1.5-flash';

    if (!this.apiKey) {
      console.warn('Gemini API key missing. Service will return market-based fallback advice.');
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
      return JSON.parse(cleanedJsonStr);
    } catch (error) {
      console.error('Gemini Service Error:', error.stack || error);
      throw new Error('Failed to generate AI recommendation using Gemini');
    }
  }

  async generateGeneralAdvice(query, marketContext = { matches: [], currency: 'JMD', contextText: '' }) {
    if (!this.apiKey) {
      return this.buildPriceFallback(query, marketContext);
    }

    try {
      const prompt = `
        You are a helpful expert agronomist and market advisor for Jamaican farmers.
        Answer the farmer's question using the supplied produce prices when relevant.

        Farmer question:
        ${query}

        Available market price references in ${marketContext.currency}:
        ${marketContext.contextText}

        Pricing rules:
        - If the farmer is asking about a listed commodity, cite the matching low, high, and frequent price points.
        - Use the frequent price as the default anchor when suggesting a selling price.
        - If multiple matches exist, explain the difference by variety.
        - If no exact match exists, say that clearly and avoid inventing a price.
        - Keep the answer concise and practical.
      `;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Gemini Service Advice Error:', error);
      throw new Error('Failed to generate AI advice');
    }
  }

  buildPriceFallback(query, marketContext) {
    if (!marketContext.matches.length) {
      return `I could not find a direct price match in the local produce list for "${query}". Ask about a listed crop like cabbage, callaloo, pepper, yam, or tomatoes and I can suggest a price band.`;
    }

    const [topMatch, ...alternatives] = marketContext.matches;
    const adviceLines = [
      `For ${topMatch.commodity} (${topMatch.variety}), the market range is ${topMatch.low}-${topMatch.high} ${marketContext.currency}, with ${topMatch.freq} ${marketContext.currency} as the most common price.`,
      `A practical asking price is around ${topMatch.freq} ${marketContext.currency}, then move closer to ${topMatch.high} ${marketContext.currency} only if quality, freshness, or demand is strong.`
    ];

    if (alternatives.length) {
      const comparison = alternatives
        .slice(0, 2)
        .map((entry) => `${entry.commodity} (${entry.variety}) at ${entry.freq} ${marketContext.currency}`)
        .join('; ');
      adviceLines.push(`Related market references: ${comparison}.`);
    }

    return adviceLines.join(' ');
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
