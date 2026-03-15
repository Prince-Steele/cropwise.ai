import { Component, OnInit } from '@angular/core';
import { Recommendation } from '../../models/recommendation.model';
import { FarmerProfile, CropHistory } from '../../models/profile.model';
import { WeatherSnapshot } from '../../models/weather.model';
import { AdvisorService } from '../../services/advisor.service';
import { ProfileService } from '../../services/profile.service';
import { WeatherService } from '../../services/weather.service';

interface ForecastItem {
  label: string;
  temp: number;
  rain: string;
  risk: 'Low' | 'Medium' | 'High';
}

interface AlertItem {
  title: string;
  detail: string;
  level: 'low' | 'medium' | 'high';
}

interface RecommendationExplanation {
  title: string;
  summary: string;
  reasons: string[];
  watchouts: string[];
  nextSteps: string[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  weather: WeatherSnapshot | null = null;
  weatherError = '';
  isWeatherLoading = true;

  profile: FarmerProfile | null = null;
  profileError = '';
  isProfileLoading = true;
  totalAcres = 0;
  historyPreview: CropHistory[] = [];

  recommendations: Recommendation[] = [];
  recommendationsError = '';
  isRecommendationsLoading = true;
  selectedRecommendation: Recommendation | null = null;
  recommendationExplanation: RecommendationExplanation | null = null;
  isRecommendationExpanded = false;

  currentSeason = this.getCurrentSeason();

  forecast: ForecastItem[] = [
    { label: 'Mon', temp: 30, rain: '20%', risk: 'Low' },
    { label: 'Tue', temp: 31, rain: '35%', risk: 'Medium' },
    { label: 'Wed', temp: 29, rain: '60%', risk: 'High' },
    { label: 'Thu', temp: 28, rain: '40%', risk: 'Medium' },
    { label: 'Fri', temp: 30, rain: '15%', risk: 'Low' }
  ];

  alerts: AlertItem[] = [
    {
      title: 'Irrigation Window Open',
      detail: 'Lower rainfall is expected over the next two days. This is a good period to water high-value beds.',
      level: 'low'
    },
    {
      title: 'Fungal Risk Rising',
      detail: 'Midweek humidity may increase disease pressure on pepper and tomato plots.',
      level: 'medium'
    },
    {
      title: 'Market Opportunity',
      detail: 'Sweet pepper and callaloo remain strong options based on recent pricing and profile history.',
      level: 'low'
    }
  ];

  constructor(
    private profileService: ProfileService,
    private weatherService: WeatherService,
    private advisorService: AdvisorService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadRecommendations();
  }

  retryWeather(): void {
    this.loadWeather(this.profile?.location || 'Jamaica');
  }

  retryRecommendations(): void {
    this.loadRecommendations();
  }

  retryProfile(): void {
    this.loadProfile();
  }

  selectRecommendation(item: Recommendation): void {
    this.selectedRecommendation = item;
    this.recommendationExplanation = this.buildRecommendationExplanation(item);
    this.isRecommendationExpanded = false;
  }

  isSelectedRecommendation(item: Recommendation): boolean {
    return this.selectedRecommendation?.crop === item.crop;
  }

  toggleRecommendationExpanded(): void {
    this.isRecommendationExpanded = !this.isRecommendationExpanded;
  }

  getRecommendationRiskClass(risk: string): string {
    const normalized = risk.toLowerCase();
    if (normalized.includes('low')) return 'badge-success';
    if (normalized.includes('medium')) return 'badge-warning';
    if (normalized.includes('high')) return 'badge-danger';
    return 'badge-outline';
  }

  getAlertClass(level: string): string {
    if (level === 'high') return 'alert-high';
    if (level === 'medium') return 'alert-medium';
    return 'alert-low';
  }

  getCropIcon(crop: string): string {
    const normalized = crop.toLowerCase();
    if (normalized.includes('pepper')) return 'fa-pepper-hot';
    if (normalized.includes('yam')) return 'fa-carrot';
    if (normalized.includes('callaloo')) return 'fa-leaf';
    if (normalized.includes('tomato')) return 'fa-apple-whole';
    if (normalized.includes('pumpkin')) return 'fa-seedling';
    return 'fa-seedling';
  }

  private loadProfile(): void {
    this.isProfileLoading = true;
    this.profileError = '';

    this.profileService.getFarmerProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.totalAcres = profile.totalAcres;
        this.historyPreview = profile.history.slice(0, 3);
        this.isProfileLoading = false;
        this.loadWeather(profile.location);
      },
      error: () => {
        this.profile = null;
        this.profileError = 'Unable to load farmer profile right now.';
        this.isProfileLoading = false;
        this.loadWeather('Jamaica');
      }
    });
  }

  private loadWeather(location: string): void {
    this.isWeatherLoading = true;
    this.weatherError = '';

    this.weatherService.getCurrentWeather(location).subscribe({
      next: (weather) => {
        this.weather = weather;
        this.isWeatherLoading = false;
      },
      error: () => {
        this.weather = null;
        this.weatherError = 'Weather data is unavailable.';
        this.isWeatherLoading = false;
      }
    });
  }

  private loadRecommendations(): void {
    this.isRecommendationsLoading = true;
    this.recommendationsError = '';

    this.advisorService.getRecentRecommendations().subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations;
        this.selectedRecommendation = recommendations[0] || null;
        this.recommendationExplanation = this.selectedRecommendation
          ? this.buildRecommendationExplanation(this.selectedRecommendation)
          : null;
        this.isRecommendationsLoading = false;
      },
      error: () => {
        this.recommendations = [];
        this.selectedRecommendation = null;
        this.recommendationExplanation = null;
        this.recommendationsError = 'Unable to load recommendation insights.';
        this.isRecommendationsLoading = false;
      }
    });
  }

  private buildRecommendationExplanation(item: Recommendation): RecommendationExplanation {
    return {
      title: `${item.crop} is a strong candidate`,
      summary: item.note,
      reasons: [
        `${item.crop} aligns well with the current season and field planning cycle.`,
        `Recent profile activity suggests the farm can support ${item.crop.toLowerCase()} efficiently.`,
        `Current dashboard signals place this option in a ${item.risk.toLowerCase()} risk band.`
      ],
      watchouts: [
        `Monitor rainfall swings before committing all acreage to ${item.crop.toLowerCase()}.`,
        `Review labour and input availability for the next planting window.`
      ],
      nextSteps: [
        `Reserve a test plot for ${item.crop.toLowerCase()} this cycle.`,
        'Confirm seed availability and expected market timing.',
        'Update the farmer profile after planting to keep dashboard insights current.'
      ]
    };
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();

    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  }
}
