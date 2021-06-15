import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { AuthUserService } from 'src/app/services/auth-user/auth-user.service';

import { AuthUser, User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  @Output() sidenavClose = new EventEmitter();

  isAdmin = false;
  isDev = false;
  isClient = false;
  isAnonym = false;

  isAuth = false;

  authUser = new AuthUser();
  authUserObs: Observable<{ user: User, role: Role }>;
  authUserSub: Subscription;

  constructor(private authUserService: AuthUserService) { }
  

  ngOnInit(): void {
    this.authUserObs = this.authUserService.getAuthUser();

    this.authUserSub = this.authUserObs.subscribe( userData => {
      if (userData) {
        this.isAuth = true;
        this.authUser = this.authUserService.setAuthUserData(userData);
        this.isAdmin = this.authUserService.isAuthUserAdmin(this.authUser);
        this.isDev = this.authUserService.isAuthUserDev(this.authUser);
        this.isClient = this.authUserService.isAuthUserClient(this.authUser);
        this.isAnonym = this.authUserService.isAuthUserAnonym(this.authUser);
      }
    });
  }


  onSidenavClose(): void {
    this.sidenavClose.emit();
  }

  signOutUser(): void {
    this.authUserService.signOutAuthUser();
  }


  ngOnDestroy(): void {
    this.authUserSub.unsubscribe();
  }
}
