import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { AuthUserService } from 'src/app/services/auth-user/auth-user.service';
import { RoutingService } from 'src/app/services/routing/routing.service';

import { AuthUser, User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css']
})
export class AuthUserComponent implements OnInit, OnDestroy {

  @Input() rolesGranted: string[];

  @Output() isGrantedEvent = new EventEmitter<boolean>();

  isGranted = false;

  isDataLoaded = false;

  authUser = new AuthUser();
  authUserObs: Observable<{ user: User, role: Role }>;
  authUserSub: Subscription;

  constructor(
    private authUserService: AuthUserService,
    private routingService: RoutingService) { }

  ngOnInit(): void {
    this.authUserObs = this.authUserService.getAuthUser();
    this.authUserSub = this.authUserObs.subscribe( userData => {
      if (userData) {
        this.authUser = this.authUserService.setAuthUserData(userData);
        this.isGranted = this.authUserService.isAuthUserGranted(this.authUser, this.rolesGranted);
        this.emitIsGranted();
      }
      this.isDataLoaded = true;
    });
  }


  emitIsGranted(): void {
    this.isGrantedEvent.emit(this.isGranted);
  }

  
  onRedirectHome(): void {
    this.routingService.redirectHome();
  }
  
  onRedirectBack(): void {
    this.routingService.redirectBack();
  }


  ngOnDestroy(): void {
    this.authUserSub.unsubscribe();
  }
}
