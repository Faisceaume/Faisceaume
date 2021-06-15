import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';


describe('SharedService', () => {
  let service: SharedService;
  let randomArray = ['1', '2', '3'];

  beforeEach( () => {
    TestBed.configureTestingModule({});
    
    service = TestBed.get(SharedService);
  });


  it('TEST should create the service', () => {
    expect(service).toBeTruthy();
  });


  /* ---------- setTotalPages() ---------- */

  it('TEST 1 setTotalPages() - Empty Array', () => {
    const emptyArray = [];
    let result = service.setTotalPages(emptyArray, 1);
    expect(result).toBe(0);
  });

  it('TEST 2 setTotalPages() - ItemsPerPage = 0', () => {
    let result = service.setTotalPages(randomArray, 0);
    expect(result).toBe(1);
  });

  it('TEST 3 setTotalPages() - Round perfectly', () => {
    let result = service.setTotalPages(randomArray, randomArray.length);
    expect(result).toBe(1);
  });

  it('TEST 4 setTotalPages() - Round up', () => {
    let result = service.setTotalPages(randomArray, 2);
    expect(result).toBe(2);
  });

  it('TEST 5 setTotalPages() - Round down', () => {
    let result = service.setTotalPages(randomArray, 4);
    expect(result).toBe(1);
  });
});
