const fs = require('fs');
const path = require('path');

class CropRecommendationService {
  constructor() {
    this.datasetPath = path.resolve(__dirname, '../../data/Crop_recommendation.csv');
    this.records = this.loadDataset();
    this.featureRanges = this.computeFeatureRanges();
  }

  loadDataset() {
    const csv = fs.readFileSync(this.datasetPath, 'utf8').trim();
    const [headerLine, ...rows] = csv.split(/\r?\n/);
    const headers = headerLine.split(',');

    return rows
      .map((row) => row.split(','))
      .filter((columns) => columns.length === headers.length)
      .map((columns) => {
        const record = {};

        headers.forEach((header, index) => {
          record[header] = columns[index];
        });

        return {
          nitrogen: Number(record.N),
          phosphorus: Number(record.P),
          potassium: Number(record.K),
          temperature: Number(record.temperature),
          humidity: Number(record.humidity),
          ph: Number(record.ph),
          rainfall: Number(record.rainfall),
          label: record.label
        };
      });
  }

  computeFeatureRanges() {
    const features = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall'];

    return features.reduce((ranges, feature) => {
      const values = this.records.map((record) => record[feature]);
      const min = Math.min(...values);
      const max = Math.max(...values);

      ranges[feature] = {
        min,
        max,
        range: Math.max(max - min, 1)
      };

      return ranges;
    }, {});
  }

  predict(input, k = 9) {
    const neighbors = this.records
      .map((record) => ({
        record,
        distance: this.calculateDistance(input, record)
      }))
      .sort((left, right) => left.distance - right.distance)
      .slice(0, k);

    const weightedVotes = new Map();

    for (const neighbor of neighbors) {
      const weight = 1 / (neighbor.distance + 1e-6);
      weightedVotes.set(
        neighbor.record.label,
        (weightedVotes.get(neighbor.record.label) || 0) + weight
      );
    }

    const rankedCrops = Array.from(weightedVotes.entries())
      .map(([crop, weight]) => ({ crop, weight }))
      .sort((left, right) => right.weight - left.weight);

    const totalWeight = rankedCrops.reduce((sum, item) => sum + item.weight, 0) || 1;
    const topChoice = rankedCrops[0];
    const confidence = Number((topChoice.weight / totalWeight).toFixed(4));

    return {
      recommended_crop: topChoice.crop,
      confidence,
      notes: this.buildNotes(topChoice.crop, rankedCrops, neighbors),
      candidates: rankedCrops.slice(0, 3).map((item) => ({
        crop: item.crop,
        confidence: Number((item.weight / totalWeight).toFixed(4))
      }))
    };
  }

  calculateDistance(input, record) {
    const features = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall'];

    const squaredDistance = features.reduce((sum, feature) => {
      const range = this.featureRanges[feature].range;
      const normalizedDiff = (Number(input[feature]) - record[feature]) / range;
      return sum + normalizedDiff * normalizedDiff;
    }, 0);

    return Math.sqrt(squaredDistance);
  }

  buildNotes(recommendedCrop, rankedCrops, neighbors) {
    const alternatives = rankedCrops
      .slice(1, 3)
      .map((item) => item.crop)
      .join(', ');

    const averageDistance = neighbors.reduce((sum, neighbor) => sum + neighbor.distance, 0) / neighbors.length;
    const roundedDistance = averageDistance.toFixed(3);

    if (alternatives) {
      return `Based on the closest matches in Crop_recommendation.csv, ${recommendedCrop} is the strongest fit. Similar dataset matches also pointed to ${alternatives}. Average neighbor distance: ${roundedDistance}.`;
    }

    return `Based on the closest matches in Crop_recommendation.csv, ${recommendedCrop} is the strongest fit for the given soil and weather values. Average neighbor distance: ${roundedDistance}.`;
  }
}

module.exports = new CropRecommendationService();
