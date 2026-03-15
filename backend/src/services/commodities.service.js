const marketPrices = require('../data/marketPrices');

class CommoditiesService {
  constructor() {
    this.currency = 'JMD';
    this.priceEntries = marketPrices.map((entry) => ({
      ...entry,
      suggested: entry.freq || Math.round((entry.low + entry.high) / 2),
    }));
  }

  async getLatestPrices(search = '') {
    return this._buildPriceResponse(this.findMatchingPrices(search));
  }

  async getHistoricalPrices(date, search = '') {
    return this._buildPriceResponse(this.findMatchingPrices(search), date);
  }

  findMatchingPrices(search = '') {
    const normalizedSearch = this._normalize(search);
    if (!normalizedSearch) {
      return this.priceEntries;
    }

    const tokens = normalizedSearch.split(' ').filter(Boolean);

    return this.priceEntries
      .map((entry) => ({
        entry,
        score: this._scoreEntry(entry, tokens, normalizedSearch),
      }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score || right.entry.suggested - left.entry.suggested)
      .map((item) => item.entry);
  }

  getPriceContext(search = '') {
    const matches = this.findMatchingPrices(search).slice(0, 6);
    return {
      currency: this.currency,
      matches,
      contextText: this._buildContextText(matches),
    };
  }

  _buildPriceResponse(prices, date = new Date().toISOString().split('T')[0]) {
    return {
      data: {
        success: true,
        currency: this.currency,
        date,
        count: prices.length,
        prices,
      }
    };
  }

  _buildContextText(matches) {
    if (!matches.length) {
      return 'No direct market price match was found in the local produce price table.';
    }

    return matches
      .map((entry) => `${entry.commodity} (${entry.variety}) low ${entry.low} ${this.currency}, high ${entry.high} ${this.currency}, frequent ${entry.freq} ${this.currency}`)
      .join('\n');
  }

  _scoreEntry(entry, tokens, normalizedSearch) {
    const commodityText = this._normalize(entry.commodity);
    const varietyText = this._normalize(entry.variety);
    const combined = `${commodityText} ${varietyText}`.trim();

    let score = 0;
    if (combined.includes(normalizedSearch)) {
      score += 6;
    }

    for (const token of tokens) {
      if (commodityText.includes(token)) {
        score += 3;
      }
      if (varietyText.includes(token)) {
        score += 2;
      }
    }

    return score;
  }

  _normalize(value = '') {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
}

module.exports = new CommoditiesService();
