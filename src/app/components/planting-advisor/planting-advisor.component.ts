import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AdvisorRequest, AdvisorResponse } from '../../models/advisor.model';
import { AdvisorService } from '../../services/advisor.service';

@Component({
  selector: 'app-planting-advisor',
  templateUrl: './planting-advisor.component.html',
  styleUrls: ['./planting-advisor.component.css']
})
export class PlantingAdvisorComponent implements OnInit {

  formData: AdvisorRequest = {
    location: '',
    landSize: null,
    season: 'Spring',
    history: '',
    soilType: '',
    soilEvidenceName: ''
  };

  isAnalyzing = false;
  hasResults = false;
  recommendations: AdvisorResponse | null = null;
  soilSampleFile: File | null = null;

  constructor(private advisorService: AdvisorService) { }

  ngOnInit(): void {
  }

  analyze() {
    if (!this.formData.location || !this.formData.landSize) {
      return;
    }
    
    this.isAnalyzing = true;
    this.hasResults = false;
    this.recommendations = null;

    this.advisorService.getRecommendations(this.formData)
      .pipe(finalize(() => {
        this.isAnalyzing = false;
      }))
      .subscribe({
        next: (response) => {
          this.recommendations = response;
          this.hasResults = true;
        },
        error: () => {
          this.hasResults = false;
          this.recommendations = null;
        }
      });
  }

  onSoilFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;

    this.soilSampleFile = file;
    this.formData.soilEvidenceName = file ? file.name : '';
  }

  clearSoilFile(input: HTMLInputElement): void {
    this.soilSampleFile = null;
    this.formData.soilEvidenceName = '';
    input.value = '';
  }

  getCropIcon(crop: string): string {
    const normalized = crop.toLowerCase();
    if (normalized.includes('pepper')) return 'fa-pepper-hot';
    if (normalized.includes('yam')) return 'fa-carrot';
    if (normalized.includes('callaloo')) return 'fa-leaf';
    if (normalized.includes('tomato')) return 'fa-apple-whole';
    return 'fa-seedling';
  }

}
