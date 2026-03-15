import { Component, OnInit } from '@angular/core';
import { AdvisorService } from '../../services/advisor.service';
import { ProfileService } from '../../services/profile.service';
import { WeatherService } from '../../services/weather.service';
import { Recommendation } from '../../models/recommendation.model';
import { WeatherSnapshot } from '../../models/weather.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  weather: WeatherSnapshot | null = null;
  recommendations: Recommendation[] = [];
  totalAcres = 0;
  currentSeason = '';

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
  }

  getCropIcon(crop: string): string {
    const normalized = crop.toLowerCase();
    if (normalized.includes('pepper')) return 'fa-pepper-hot';
    if (normalized.includes('yam')) return 'fa-carrot';
    if (normalized.includes('callaloo')) return 'fa-leaf';
    if (normalized.includes('tomato')) return 'fa-apple-whole';
    return 'fa-seedling';
  }

  private loadWeather(): void {
    this.weatherService.getCurrentWeather('St. Ann, Jamaica').subscribe({
      next: (weather) => {
        this.weather = weather;
      },
      error: () => {
        this.weather = null;
      }
    });
  }

  private loadProfile(): void {
    this.profileService.getFarmerProfile().subscribe({
      next: (profile) => {
        this.totalAcres = profile.totalAcres;
      },
      error: () => {
        this.totalAcres = 0;
      }
    });
  }

  private loadRecommendations(): void {
    this.advisorService.getRecentRecommendations().subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations;
      },
      error: () => {
        this.recommendations = [];
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

}
