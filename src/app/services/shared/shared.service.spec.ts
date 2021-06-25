import { TestBed, waitForAsync } from '@angular/core/testing';

import { SharedService } from './shared.service';


describe('SERVICE: SharedService', () => {
  let service: SharedService;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({});
    
    service = TestBed.inject(SharedService);
  }));


  it('Create the service', () => {
    expect(service).toBeTruthy();
  });


  const emptyArray = [];
  const randomArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  /* ---------- setTotalPages() ---------- */

  it('setTotalPages() - Empty Array', () => {
    const expected = 0;
    const result = service.setTotalPages(emptyArray, 1);
    expect(result).toEqual(expected);
  });

  it('setTotalPages() - ItemsPerPage = 0', () => {
    const expected = 1;
    const result = service.setTotalPages(randomArray, 0);
    expect(result).toEqual(expected);
  });

  it('setTotalPages() - Round perfectly', () => {
    const expected = 1;
    let result = service.setTotalPages(randomArray, randomArray.length);
    expect(result).toEqual(expected);
  });

  it('setTotalPages() - Round up', () => {
    const expected = 4;
    let result = service.setTotalPages(randomArray, 3);
    expect(result).toEqual(expected);
  });

  it('setTotalPages() - Round down', () => {
    const expected = 3;
    let result = service.setTotalPages(randomArray, 4);
    expect(result).toEqual(expected);
  });


  /* ---------- displayCurrentPage() ---------- */

  it('displayCurrentPage() - Empty Array', () => {
    const expected = [];
    let result = service.displayCurrentPage(emptyArray, 2, 3);
    expect(result).toEqual(expected);
  });

  it('displayCurrentPage() - Negative current page', () => {
    const expected = [];
    let result = service.displayCurrentPage(randomArray, -2, 5);
    expect(result).toEqual(expected);
  });

  it('displayCurrentPage() - Negative number of items', () => {
    const expected = [];
    let result = service.displayCurrentPage(randomArray, 2, -5);
    expect(result).toEqual(expected);
  });


  it('displayCurrentPage() - Items per page > array length', () => {
    const array = [0];
    const expected = [0];
    let result = service.displayCurrentPage(array, 1, 3);
    expect(result).toEqual(expected);
  });

  it('displayCurrentPage() - Current page too big', () => {
    const expected = [];
    let result = service.displayCurrentPage(randomArray, 11, 3);
    expect(result).toEqual(expected);
  });


  it('displayCurrentPage() - Whole array', () => {
    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let result = service.displayCurrentPage(randomArray, 1, expected.length);
    expect(result).toEqual(expected);
  });


  it('displayCurrentPage() - Start of the array', () => {
    const expected = [0, 1, 2];
    let result = service.displayCurrentPage(randomArray, 1, 3);
    expect(result).toEqual(expected);
  });

  it('displayCurrentPage() - Middle of the array', () => {
    const expected = [3, 4, 5];
    let result = service.displayCurrentPage(randomArray, 2, 3);
    expect(result).toEqual(expected);
  });

  it('displayCurrentPage() - End of the array', () => {
    const expected = [9];
    let result = service.displayCurrentPage(randomArray, 4, 3);
    expect(result).toEqual(expected);
  });


  /* ---------- generateLocation() ---------- */
  
  it('generateLocation() - Empty Array', () => {
    const expected = 1;
    let result = service.generateLocation(emptyArray);
    expect(result).toEqual(expected);
  });

  it('generateLocation() - Normal Array', () => {
    const expected = 11;
    let result = service.generateLocation(randomArray);
    expect(result).toEqual(expected);
  });


  /* ---------- getInitials() ---------- */
  
  it('getInitials() - Empty name', () => {
    const emptyName = '';
    const expected = '';
    let result = service.getInitials(emptyName);
    expect(result).toEqual(expected);
  });

  it('getInitials() - Normal name', () => {
    const name = 'faisceaume';
    const expected = 'F';
    let result = service.getInitials(name);
    expect(result).toEqual(expected);
  });


  const emptyId = '';
  const objectId = 'rt5h6458nhytr4516';

  /* ---------- getOperationType() ---------- */
  
  it('getOperationType() - Empty object ID', () => {
    const emptyId = '';
    const expected = 'Ajouter';
    let result = service.getOperationType(emptyId);
    expect(result).toEqual(expected);
  });

  it('getOperationType() - Normal object ID', () => {
    const expected = 'Modifier';
    let result = service.getOperationType(objectId);
    expect(result).toEqual(expected);
  });


  /* ---------- getIsFormEdit() ---------- */

  it('getIsFormEdit() - Empty object ID', () => {
    let result = service.getIsFormEdit(emptyId);
    expect(result).toBeFalse();
  });

  it('getIsFormEdit() - Normal object ID', () => {
    let result = service.getIsFormEdit(objectId);
    expect(result).toBeTrue();
  });
});
