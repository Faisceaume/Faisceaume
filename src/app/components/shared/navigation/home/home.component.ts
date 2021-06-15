import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { AuthUserService } from 'src/app/services/auth-user/auth-user.service';

import { AuthUser, User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isDataLoaded = false;

  authUser = new AuthUser();
  authUserObs: Observable<{ user: User, role: Role }>;
  authUserSub: Subscription;

  constructor(public authUserService: AuthUserService) { }


  ngOnInit(): void {
    this.authUserObs = this.authUserService.getAuthUser();

    this.authUserSub = this.authUserObs.subscribe( userData => {
      if (userData) {
        this.authUser = this.authUserService.setAuthUserData(userData);
      }
      this.isDataLoaded = true;
    });
  }


  ngOnDestroy(): void {
    this.authUserSub.unsubscribe();
  }
}
