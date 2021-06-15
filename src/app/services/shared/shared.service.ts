import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  isGridShown = false;

  constructor() { }


  /**
   * Set the total number of pages according to the array length and the number of items to display on the same page.
   * @param {any[]} array The array of items.
   * @param {number} itemsPerPage The number of items to display on the same page.
   * @returns {number} The total number of pages.
   */
  setTotalPages(array: any[], itemsPerPage: number): number {
    return  itemsPerPage !== 0
    ? Math.ceil(array.length / itemsPerPage)
    : 1;  // default value
  }

  /**
   * Return the array of the elements between the given limits (determined by currentPage and itemsPerPage) of the original array.
   * @param {any[]} array The array of items.
   * @param {number} currentPage The current page number.
   * @param {number} itemsPerPage The number of items to display on the same page.
   */
  displayCurrentPage(array: any[], currentPage: number, itemsPerPage: number): any[] {
    const newArray = [];

    let indexStart = (currentPage-1) * itemsPerPage; // -1: array start at 0; pages begin at 1
    const loopEnd = currentPage * itemsPerPage;

    while (array[indexStart] && indexStart !== loopEnd) {
      newArray.push(array[indexStart]);
      indexStart++;
    }
    return newArray;
  }


  /**
   * Set the location according to the size of the array.
   * @param {any[]} array The array.
   * @returns {number} The location.
   */
  generateLocation(array: any[]): number {
    return array.length + 1;
  }


  /**
   * Conserve and uppercase the first letter of the name.
   * @param {string} name The name of the member.
   * @returns {string} the formatted name.
   */
  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }


  /**
   * Determine the form operation type according to the existence of the ID.
   * @returns {string} The ID.
   * @returns {string} The operation type.
   */
  getOperationType(id: string): string {
    return id ? 'Modifier' : 'Ajouter'; 
  }
  
  /**
   * Determine the form operation type according to the existence of the ID.
   * @returns {string} The ID.
   * @returns {boolean} The operation type.
   */
  getIsFormEdit(id: string): boolean {
    return id ? true : false;
  }
}
