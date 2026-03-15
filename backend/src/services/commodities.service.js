const axios = require('axios');
const env = require('../config/env');

class CommoditiesService {
  constructor() {
    this.baseUrl = env.commoditiesApi.baseUrl;
    this.apiKey = env.commoditiesApi.apiKey;
  }

  /**
   * Fetch the latest market prices for given symbols
   * @param {string} symbols - Comma separated symbols (e.g., 'WHEAT,CORN,RICE')
   * @param {string} base - Base currency (default: 'USD')
   */
  async getLatestPrices(symbols, base = 'USD') {
    if (!this.apiKey || this.apiKey === 'your_commodities_api_key_here') {
      console.warn('⚠️ Commodities API Key missing. Returning MOCK data.');
      return this._getMockLatestPrices(symbols);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/latest`, {
        params: {
          access_key: this.apiKey,
          base,
          symbols
        }
      });

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from Commodities API');
      }

      return response.data;
    } catch (error) {
      console.error('Commodities API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch latest market prices');
    }
  }

  /**
   * Fetch historical market prices for given symbols
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} symbols - Comma separated symbols
   */
  async getHistoricalPrices(date, symbols, base = 'USD') {
    if (!this.apiKey || this.apiKey === 'your_commodities_api_key_here') {
      console.warn('⚠️ Commodities API Key missing. Returning MOCK data.');
      return this._getMockHistoricalPrices(date, symbols);
    }

    try {
      // Some APIs use a different endpoint for historical data (e.g., /YYYY-MM-DD or /historical)
      const response = await axios.get(`${this.baseUrl}/${date}`, {
        params: {
          access_key: this.apiKey,
          base,
          symbols
        }
      });

      return response.data;
    } catch (error) {
      console.error('Commodities API Historical Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch historical market prices for ${date}`);
    }
  }

  // ==== Mock Data Generators for Hackathon MVP Usage ====
  
  _getMockLatestPrices(symbols) {
    const symbolList = symbols ? symbols.split(',') : ['WHEAT', 'CORN', 'COFFEE', 'SUGAR'];
    const rates = {};
    
    // Generate some deterministic but realistic mock prices based on symbol length
    symbolList.forEach(sym => {
      rates[sym] = (sym.length * 0.01) + (Math.random() * 0.05);
    });

    return {
      data: {
        success: true,
        timestamp: Math.floor(Date.now() / 1000),
        base: 'USD',
        date: new Date().toISOString().split('T')[0],
        rates
      }
    };
  }

  _getMockHistoricalPrices(date, symbols) {
    const data = this._getMockLatestPrices(symbols);
    data.data.date = date; // Set to the requested date
    return data;
  }
}

module.exports = new CommoditiesService();
