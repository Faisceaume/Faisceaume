import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule} from '@angular/forms';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AuthentificationComponent } from './authentification/authentification.component';
import { HeaderComponent } from './header/header.component';
import { MembersModule } from './members/members.module';
import { SharedModule } from './shared/shared.module';
import { UsersComponent } from './users/users.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { ProjectsModule } from './projects/projects.module';

import { environment } from '../environments/environment';
// import { environment } from '../environments/environment.prod';

import * as firebase from 'firebase/app';
import { EditCategorieComponent } from './members/categories/edit-categorie/edit-categorie.component';
firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    AuthentificationComponent,
    HeaderComponent,
    UsersComponent,
    TaskFormComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MembersModule,
    ProjectsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TaskFormComponent, EditCategorieComponent]
})
export class AppModule { }
