import { TestBed } from '@angular/core/testing';

import { DialogTemplateService } from './dialog-template.service';

describe('DialogTemplateService', () => {
  let service: DialogTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
