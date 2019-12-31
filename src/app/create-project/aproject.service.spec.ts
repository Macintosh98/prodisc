import { TestBed } from '@angular/core/testing';

import { AprojectService } from './aproject.service';

describe('AprojectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AprojectService = TestBed.get(AprojectService);
    expect(service).toBeTruthy();
  });
});
