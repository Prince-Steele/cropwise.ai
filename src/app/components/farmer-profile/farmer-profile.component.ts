import { Component, OnInit } from '@angular/core';
import { FarmerProfile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-farmer-profile',
  templateUrl: './farmer-profile.component.html',
  styleUrls: ['./farmer-profile.component.css']
})
export class FarmerProfileComponent implements OnInit {

  profile: FarmerProfile | null = null;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getFarmerProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: () => {
        this.profile = null;
      }
    });
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
