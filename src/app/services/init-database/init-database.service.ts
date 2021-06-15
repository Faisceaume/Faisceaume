import { Injectable } from '@angular/core';

import { RolesService } from 'src/app/services/roles/roles.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';


@Injectable({
  providedIn: 'root'
})
export class InitDatabaseService {

  private rolesTypes = Object.values(ROLE_TYPES_EN);

  constructor(private rolesService: RolesService) { }

  
  initDatabase(): void {
    this.initRolesCollection();
  }

  initRolesCollection(): void {
    this.rolesService.getAllRoles();
    this.rolesService.rolesArraySub.subscribe( roles => {
      // Only init the collection only if there is no data
      if (roles.length === 0) {
        this.rolesTypes.forEach( role => {
          this.rolesService.createNewRoleByType(role);
        });
      } else {
        console.log('Roles collection already filled.');
      }
    });
  }
}
