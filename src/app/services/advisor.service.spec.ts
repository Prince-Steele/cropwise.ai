import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdvisorService } from './advisor.service';

describe('AdvisorService', () => {
  let service: AdvisorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdvisorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
