import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '@supabase/supabase-js';
import { FarmerProfile } from '../models/profile.model';
import { AuthService } from './auth.service';

const PROFILE_STORAGE_KEY_PREFIX = 'cropwise_farmer_profile:';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<FarmerProfile>(this.createEmptyProfile());

  constructor(private authService: AuthService) {
    this.syncProfile(this.authService.getCurrentUserValue());
    this.authService.getCurrentUser().subscribe((user) => {
      this.syncProfile(user);
    });
  }

  getFarmerProfile(): Observable<FarmerProfile> {
    return of(this.profileSubject.value).pipe(delay(200));
  }

  watchFarmerProfile(): Observable<FarmerProfile> {
    return this.profileSubject.asObservable();
  }

  saveFarmerProfile(profile: FarmerProfile): Observable<FarmerProfile> {
    const currentUser = this.authService.getCurrentUserValue();
    const normalizedProfile = this.normalizeProfile(profile, currentUser);
    const storageKey = this.getProfileStorageKey(currentUser);

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(normalizedProfile));
    }

    this.profileSubject.next(normalizedProfile);
    return of(normalizedProfile).pipe(delay(150));
  }

  private syncProfile(user: User | null): void {
    this.profileSubject.next(this.readProfile(user));
  }

  private readProfile(user: User | null): FarmerProfile {
    const starterProfile = this.createEmptyProfile(user);
    const storageKey = this.getProfileStorageKey(user);

    if (!storageKey) {
      return starterProfile;
    }

    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return starterProfile;
    }

    try {
      const parsed = JSON.parse(stored) as FarmerProfile;
      return this.normalizeProfile(parsed, user);
    } catch {
      return starterProfile;
    }
  }

  private normalizeProfile(profile: FarmerProfile, user: User | null): FarmerProfile {
    const starterProfile = this.createEmptyProfile(user);

    return {
      ...starterProfile,
      ...profile,
      name: profile.name?.trim() || starterProfile.name,
      location: profile.location?.trim() || '',
      activeSince: profile.activeSince || null,
      profileImage: profile.profileImage || '',
      certifications: profile.certifications?.filter(Boolean) || [],
      history: profile.history || []
    };
  }

  private createEmptyProfile(user?: User | null): FarmerProfile {
    return {
      name: this.resolveDisplayName(user),
      location: '',
      activeSince: null,
      profileImage: '',
      totalAcres: 0,
      certifications: [],
      lifetimeYield: 0,
      successfulHarvests: 0,
      primaryCrops: 0,
      history: []
    };
  }

  private getProfileStorageKey(user: User | null): string | null {
    const profileId = user?.id || user?.email;
    if (!profileId) {
      return null;
    }

    return `${PROFILE_STORAGE_KEY_PREFIX}${profileId}`;
  }

  private resolveDisplayName(user?: User | null): string {
    const metadata = user?.user_metadata as { full_name?: string; name?: string } | undefined;
    const fullName = metadata?.full_name || metadata?.name;
    if (fullName?.trim()) {
      return fullName.trim();
    }

    const emailLocalPart = user?.email?.split('@')[0];
    if (emailLocalPart) {
      return emailLocalPart
        .replace(/[._-]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }

    return 'Farmer';
  }
}
