import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AdvisorService } from '../../services/advisor.service';
import { ProfileService } from '../../services/profile.service';
import { WeatherService } from '../../services/weather.service';
import { Recommendation } from '../../models/recommendation.model';
import { CropHistory, FarmerProfile } from '../../models/profile.model';
import { WeatherSnapshot } from '../../models/weather.model';

type AlertLevel = 'low' | 'medium' | 'high';

interface DashboardForecast {
  label: string;
  temp: number;
  rain: string;
  risk: 'Low' | 'Medium' | 'High';
}

interface DashboardAlert {
  title: string;
  detail: string;
  level: AlertLevel;
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

  public weather: WeatherSnapshot | null = null;
  public recommendations: Recommendation[] = [];
  public totalAcres = 0;
  public currentSeason = '';
  public profile: FarmerProfile | null = null;
  public historyPreview: CropHistory[] = [];
  public forecast: DashboardForecast[] = [];
  public alerts: DashboardAlert[] = [];
  public selectedRecommendation: Recommendation | null = null;
  public recommendationExplanation: RecommendationExplanation | null = null;
  public isRecommendationExpanded = false;

  public isWeatherLoading = false;
  public isProfileLoading = false;
  public isRecommendationsLoading = false;

  public weatherError = '';
  public profileError = '';
  public recommendationsError = '';

  constructor(
    private weatherService: WeatherService,
    private advisorService: AdvisorService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.currentSeason = this.getCurrentSeason();
    this.loadWeather();
    this.loadProfile();
    this.loadRecommendations();
    this.buildDefaultForecast();
    this.buildDefaultAlerts();
  }

  public getCropIcon(crop: string): string {
    const normalized = crop.toLowerCase();
    if (normalized.includes('pepper')) return 'fa-pepper-hot';
    if (normalized.includes('yam')) return 'fa-carrot';
    if (normalized.includes('callaloo')) return 'fa-leaf';
    if (normalized.includes('tomato')) return 'fa-apple-whole';
    return 'fa-seedling';
  }

  public retryWeather(): void {
    this.loadWeather();
  }

  public retryProfile(): void {
    this.loadProfile();
  }

  public retryRecommendations(): void {
    this.loadRecommendations();
  }

  public selectRecommendation(item: Recommendation): void {
    this.selectedRecommendation = item;
    this.isRecommendationExpanded = false;
    this.refreshRecommendationExplanation();
  }

  public toggleRecommendationExpanded(): void {
    this.isRecommendationExpanded = !this.isRecommendationExpanded;
  }

  public isSelectedRecommendation(item: Recommendation): boolean {
    return this.selectedRecommendation === item;
  }

  public getRecommendationRiskClass(risk: string): string {
    const level = this.getAlertLevelFromRisk(risk);
    if (level === 'high') return 'badge-danger';
    if (level === 'medium') return 'badge-warning';
    return 'badge-success';
  }

  private loadWeather(): void {
    this.isWeatherLoading = true;
    this.weatherError = '';

    this.weatherService.getCurrentWeather('Kingston, Jamaica')
      .pipe(finalize(() => {
        this.isWeatherLoading = false;
      }))
      .subscribe({
        next: (weather) => {
          this.weather = weather;
          this.buildForecastFromWeather(weather.temperature);
          this.refreshRecommendationExplanation();
        },
        error: () => {
          this.weather = null;
          this.weatherError = 'Live weather is unavailable right now.';
          this.buildDefaultForecast();
          this.refreshRecommendationExplanation();
        }
      });
  }

  private loadProfile(): void {
    this.isProfileLoading = true;
    this.profileError = '';

    this.profileService.getFarmerProfile()
      .pipe(finalize(() => {
        this.isProfileLoading = false;
      }))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.totalAcres = profile.totalAcres;
          this.historyPreview = profile.history.slice(0, 3);
          this.refreshRecommendationExplanation();
        },
        error: () => {
          this.profile = null;
          this.profileError = 'Farmer profile could not be loaded.';
          this.totalAcres = 0;
          this.historyPreview = [];
          this.refreshRecommendationExplanation();
        }
      });
  }

  private loadRecommendations(): void {
    this.isRecommendationsLoading = true;
    this.recommendationsError = '';

    this.advisorService.getRecentRecommendations()
      .pipe(finalize(() => {
        this.isRecommendationsLoading = false;
      }))
      .subscribe({
        next: (recommendations) => {
          this.recommendations = recommendations;
          this.selectedRecommendation = recommendations[0] ?? null;
          this.isRecommendationExpanded = false;
          this.refreshRecommendationExplanation();
        },
        error: () => {
          this.recommendations = [];
          this.selectedRecommendation = null;
          this.isRecommendationExpanded = false;
          this.recommendationsError = 'Recent recommendations could not be loaded.';
          this.refreshRecommendationExplanation();
        }
      });
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  }

  private buildDefaultForecast(): void {
    this.forecast = [
      { label: 'Today', temp: 28, rain: 'Low', risk: 'Low' },
      { label: 'Tomorrow', temp: 29, rain: 'Moderate', risk: 'Medium' },
      { label: 'Wed', temp: 27, rain: 'Low', risk: 'Low' },
      { label: 'Thu', temp: 30, rain: 'High', risk: 'High' },
      { label: 'Fri', temp: 28, rain: 'Moderate', risk: 'Medium' }
    ];
  }

  private buildForecastFromWeather(baseTemp: number): void {
    if (!Number.isFinite(baseTemp)) {
      return;
    }
    this.forecast = [
      { label: 'Today', temp: Math.round(baseTemp), rain: 'Low', risk: 'Low' },
      { label: 'Tomorrow', temp: Math.round(baseTemp + 1), rain: 'Moderate', risk: 'Medium' },
      { label: 'Wed', temp: Math.round(baseTemp - 1), rain: 'Low', risk: 'Low' },
      { label: 'Thu', temp: Math.round(baseTemp + 2), rain: 'High', risk: 'High' },
      { label: 'Fri', temp: Math.round(baseTemp), rain: 'Moderate', risk: 'Medium' }
    ];
  }

  private buildDefaultAlerts(): void {
    this.alerts = [
      { title: 'Rainfall Watch', detail: 'Moderate rainfall expected midweek. Consider drainage prep.', level: 'medium' },
      { title: 'Heat Window', detail: 'High temperatures on Thursday. Increase irrigation if needed.', level: 'high' },
      { title: 'Planting Window', detail: 'Low-risk window for leafy crops over the next 3 days.', level: 'low' }
    ];
  }

  public getAlertClass(level: AlertLevel): string {
    if (level === 'high') return 'alert-high';
    if (level === 'medium') return 'alert-medium';
    return 'alert-low';
  }

  private refreshRecommendationExplanation(): void {
    this.recommendationExplanation = this.selectedRecommendation
      ? this.buildRecommendationExplanation(this.selectedRecommendation)
      : null;
  }

  private buildRecommendationExplanation(item: Recommendation): RecommendationExplanation {
    const pilotAcres = this.totalAcres > 0 ? Math.max(1, Math.round(this.totalAcres * 0.25)) : 1;
    const recentCrops = this.historyPreview.map((entry) => entry.crop).slice(0, 2);
    const weatherContext = this.weather
      ? `${Math.round(this.weather.temperature)}°C ${this.weather.condition.toLowerCase()} weather in ${this.weather.location}`
      : `the current ${this.currentSeason.toLowerCase()} planning window`;
    const note = item.note?.trim() || `${item.crop} is currently marked with ${item.risk.toLowerCase()} field risk.`;
    const rotationContext = recentCrops.length > 0
      ? `Recent crop history includes ${recentCrops.join(' and ')}, which helps frame rotation and spacing decisions.`
      : `No recent crop history is loaded yet, so this is best treated as a planning starting point.`;
    const priorityAlert = this.alerts.find((alert) => alert.level === 'high') ?? this.alerts[0];
    const cropName = item.crop.toLowerCase();

    return {
      title: item.recommended
        ? `${item.crop} has the strongest fit right now`
        : `${item.crop} is a viable compare option`,
      summary: note,
      reasons: [
        `Current conditions point to ${weatherContext}, which supports near-term ${cropName} planning.`,
        rotationContext,
        this.totalAcres > 0
          ? `Your ${this.totalAcres}-acre profile gives enough room to stage a pilot block before committing the full field.`
          : 'Start with a small pilot block first, then scale once establishment looks healthy.'
      ],
      watchouts: [
        `${item.risk} risk means soil moisture, drainage, and pest pressure should be checked before scaling.`,
        priorityAlert
          ? priorityAlert.detail
          : 'Review the 5-day outlook before fixing the planting date.'
      ],
      nextSteps: [
        `Reserve about ${pilotAcres} acre${pilotAcres === 1 ? '' : 's'} for a first pass and track early establishment.`,
        `Use the full advisor to compare ${cropName} against alternatives before locking seed and input costs.`,
        this.weather
          ? `Time field prep around today's ${Math.round(this.weather.humidity)}% humidity and the next low-risk weather window.`
          : 'Check the local forecast before choosing the planting day.'
      ]
    };
  }

  private getAlertLevelFromRisk(risk: string): AlertLevel {
    const normalized = risk.toLowerCase();
    if (normalized.includes('high')) return 'high';
    if (normalized.includes('medium') || normalized.includes('moderate')) return 'medium';
    return 'low';
  }

}
