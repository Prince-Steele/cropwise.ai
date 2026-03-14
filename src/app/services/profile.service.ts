import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  getFarmerProfile(): Observable<any> {
    return of({
      name: 'Marcus Johnson',
      location: 'St. Ann, Jamaica',
      totalAcres: 12,
      certifications: ['Organic Certified'],
      lifetimeYield: 42500,
      successfulHarvests: 8,
      primaryCrops: 3,
      history: [
        { crop: 'Tomato', season: 'Spring 2023', acres: 2.5, yield: 8500, status: 'Optimal Yield Achieved', type: 'success' },
        { crop: 'Sweet Pepper', season: 'Winter 2022', acres: 1.5, yield: 3200, status: 'Drought impacted yield', type: 'warning' },
        { crop: 'Yam', season: 'Spring 2022', acres: 3.0, yield: 12000, status: 'Excellent Harvest', type: 'success' }
      ]
    });
  }
}
