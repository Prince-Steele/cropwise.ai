import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planting-advisor',
  templateUrl: './planting-advisor.component.html',
  styleUrls: ['./planting-advisor.component.css']
})
export class PlantingAdvisorComponent implements OnInit {

  formData = {
    location: '',
    landSize: null,
    season: 'Spring',
    history: ''
  };

  isAnalyzing = false;
  hasResults = false;

  constructor() { }

  ngOnInit(): void {
  }

  analyze() {
    if (!this.formData.location || !this.formData.landSize) {
      return;
    }
    
    this.isAnalyzing = true;
    this.hasResults = false;

    // Simulate AI Processing Latency
    setTimeout(() => {
      this.isAnalyzing = false;
      this.hasResults = true;
    }, 2500);
  }

}
