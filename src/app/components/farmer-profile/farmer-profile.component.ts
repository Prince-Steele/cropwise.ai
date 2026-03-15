import { Component, OnInit } from '@angular/core';
import { FarmerProfile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-farmer-profile',
  templateUrl: './farmer-profile.component.html',
  styleUrls: ['./farmer-profile.component.css']
})
export class FarmerProfileComponent implements OnInit {
  readonly maxProfileImageBytes = 2 * 1024 * 1024;
  profile: FarmerProfile | null = null;
  editableProfile: FarmerProfile | null = null;
  certificationsInput = '';
  isEditing = false;
  isSaving = false;
  error = '';
  statusMessage = '';

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  startEditing(): void {
    if (!this.profile) {
      return;
    }

    this.editableProfile = JSON.parse(JSON.stringify(this.profile)) as FarmerProfile;
    this.certificationsInput = this.editableProfile.certifications.join(', ');
    this.isEditing = true;
    this.statusMessage = '';
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editableProfile = null;
    this.certificationsInput = '';
    this.error = '';
  }

  saveProfile(): void {
    if (!this.editableProfile) {
      return;
    }

    this.isSaving = true;
    this.error = '';

    const nextProfile: FarmerProfile = {
      ...this.editableProfile,
      certifications: this.certificationsInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };

    this.profileService.saveFarmerProfile(nextProfile).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isSaving = false;
        this.isEditing = false;
        this.statusMessage = 'Profile updated successfully.';
      },
      error: () => {
        this.isSaving = false;
        this.error = 'Unable to save profile right now.';
      }
    });
  }

  onProfileImageSelected(event: Event): void {
    if (!this.editableProfile) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.error = 'Select a valid image file for the profile photo.';
      input.value = '';
      return;
    }

    if (file.size > this.maxProfileImageBytes) {
      this.error = 'Profile photo must be 2 MB or smaller.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.editableProfile = {
        ...this.editableProfile!,
        profileImage: typeof reader.result === 'string' ? reader.result : ''
      };
      this.error = '';
      this.statusMessage = '';
      input.value = '';
    };
    reader.onerror = () => {
      this.error = 'Unable to read that image file.';
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  removeProfileImage(): void {
    if (!this.editableProfile) {
      return;
    }

    this.editableProfile = {
      ...this.editableProfile,
      profileImage: ''
    };
    this.error = '';
    this.statusMessage = '';
  }

  getCropIcon(crop: string): string {
    const normalized = crop.toLowerCase();
    if (normalized.includes('pepper')) return 'fa-pepper-hot';
    if (normalized.includes('yam')) return 'fa-carrot';
    if (normalized.includes('callaloo')) return 'fa-leaf';
    if (normalized.includes('tomato')) return 'fa-apple-whole';
    return 'fa-seedling';
  }

  private loadProfile(): void {
    this.profileService.getFarmerProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.error = '';
      },
      error: () => {
        this.profile = null;
        this.error = 'Unable to load profile data.';
      }
    });
  }
}
