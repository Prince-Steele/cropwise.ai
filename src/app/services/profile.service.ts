import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FarmerProfile } from '../models/profile.model';

const PROFILE_STORAGE_KEY = 'cropwise_farmer_profile';

const DEFAULT_PROFILE: FarmerProfile = {
  name: 'Alicia Brown',
  location: 'St. Elizabeth, Jamaica',
  activeSince: 2021,
  profileImage: '',
  totalAcres: 12,
  certifications: ['GAP Certified', 'Organic Practices'],
  lifetimeYield: 18450,
  successfulHarvests: 14,
  primaryCrops: 4,
  history: [
    {
      crop: 'Callaloo',
      season: 'Spring 2025',
      acres: 3,
      yield: 2400,
      status: 'Strong demand at market',
      type: 'success',
      harvested: 'June 2025'
    },
    {
      crop: 'Sweet Pepper',
      season: 'Winter 2024',
      acres: 2,
      yield: 1650,
      status: 'Monitor fungal pressure',
      type: 'warning',
      harvested: 'February 2025'
    },
    {
      crop: 'Yam',
      season: 'Summer 2024',
      acres: 4,
      yield: 5200,
      status: 'Excellent harvest quality',
      type: 'success',
      harvested: 'November 2024'
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<FarmerProfile>(this.readProfile());

  getFarmerProfile(): Observable<FarmerProfile> {
    return of(this.profileSubject.value).pipe(delay(200));
  }

  watchFarmerProfile(): Observable<FarmerProfile> {
    return this.profileSubject.asObservable();
  }

  saveFarmerProfile(profile: FarmerProfile): Observable<FarmerProfile> {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    this.profileSubject.next(profile);
    return of(profile).pipe(delay(150));
  }

  private readProfile(): FarmerProfile {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PROFILE;
    }

    try {
      const parsed = JSON.parse(stored) as FarmerProfile;
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        profileImage: parsed.profileImage || DEFAULT_PROFILE.profileImage,
        certifications: parsed.certifications?.length ? parsed.certifications : DEFAULT_PROFILE.certifications,
        history: parsed.history?.length ? parsed.history : DEFAULT_PROFILE.history
      };
    } catch {
      return DEFAULT_PROFILE;
    }
  }
}
