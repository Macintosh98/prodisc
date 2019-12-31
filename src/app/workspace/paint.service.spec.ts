import { TestBed } from '@angular/core/testing';

import { PaintService } from './paint.service';

describe('PaintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaintService = TestBed.get(PaintService);
    expect(service).toBeTruthy();
  });
});
