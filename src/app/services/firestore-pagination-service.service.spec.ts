import { TestBed } from '@angular/core/testing';

import { FirestorePaginationServiceService } from './firestore-pagination-service.service';

describe('FirestorePaginationServiceService', () => {
  let service: FirestorePaginationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestorePaginationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
