import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { SharedModule } from './components/shared/shared.module';
import { BugsModule } from './components/bugs/bugs.module';
import { MembersModule } from './components/members/members.module';
import { ProjectsModule } from './components/projects/projects.module';
import { TasksModule } from './components/tasks/tasks.module';
import { UsersModule } from './components/users/users.module';

import { InitDatabaseService } from './services/init-database/init-database.service';

import { AuthComponent } from './components/auth/auth.component';
import { HeaderComponent } from './components/shared/navigation/header/header.component';
import { SidenavComponent } from './components/shared/navigation/sidenav/sidenav.component';
import { HomeComponent } from './components/shared/navigation/home/home.component';
import { NotFoundComponent } from './components/shared/navigation/not-found/not-found.component';

import { environment } from 'src/environments/environment';
//import { environment } from 'src/environments/environment.prod';

export function initDatabase(initDatabaseService: InitDatabaseService) {
  return () => initDatabaseService.initDatabase();
}

const MODULES = [
  SharedModule,
  BrowserModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule,
  AngularFireAuthModule,
  AngularFireStorageModule,
  BrowserAnimationsModule,
  FormsModule,
  ReactiveFormsModule,
  UsersModule,
  MembersModule,
  ProjectsModule,
  TasksModule,
  BugsModule,
  AppRoutingModule
];

const COMPONENTS = [
  AppComponent,
  AuthComponent,
  HeaderComponent,
  SidenavComponent,
  HomeComponent,
  NotFoundComponent
];


@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...MODULES
  ],
  providers: [
    InitDatabaseService, {
      provide: APP_INITIALIZER,
      useFactory: initDatabase,
      deps: [InitDatabaseService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
