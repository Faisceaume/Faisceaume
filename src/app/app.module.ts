import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule} from '@angular/forms';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { AuthentificationComponent } from './authentification/authentification.component';
import { HeaderComponent } from './header/header.component';
import { MembersModule } from './members/members.module';
import { SharedModule } from './shared/shared.module';
import { UsersComponent } from './users/users.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { ProjectsModule } from './projects/projects.module';
import { EditCategorieComponent } from './members/categories/edit-categorie/edit-categorie.component';

import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
//import { environment } from '../environments/environment.prod';


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
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MembersModule,
    ProjectsModule,
    AppRoutingModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TaskFormComponent, EditCategorieComponent]
})
export class AppModule { }
