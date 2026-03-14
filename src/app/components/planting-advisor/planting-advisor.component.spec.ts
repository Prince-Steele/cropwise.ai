import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantingAdvisorComponent } from './planting-advisor.component';

describe('PlantingAdvisorComponent', () => {
  let component: PlantingAdvisorComponent;
  let fixture: ComponentFixture<PlantingAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantingAdvisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantingAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
