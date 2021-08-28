import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';
import { MemberService } from '../members/member.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Member} from '../members/member';
import { Categorie } from '../members/categories/categorie';
import { CategoriesService } from '../members/categories/categories.service';
import { UsersService } from '../authentification/users.service';
import {Users} from '../authentification/users';
import { TasksService } from '../tasks/tasks.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../tasks/task-form/task-form.component';
import { ProjectsService } from '../projects/projects.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Project } from '../projects/project';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy  {

  myControl = new FormControl();
  options: Member[] = [];
  filteredOptions: Observable<Member[]>;
  libelleSearch: string;
  categories: Categorie[];
  projects: Project[];
  categorieSelected: string;
  isAuthentification: boolean;
  showSearchTool = false;

  user: Users;
  userMember: Member;
  subscriptionCategorie: Subscription;
  subscriptionMember: Subscription;
  subscriptionProject: Subscription;

  constructor(private authentificationService: AuthentificationService,
              public memberService: MemberService,
              private router: Router,
              private categorieService: CategoriesService,
              public usersService: UsersService,
              public tasksService: TasksService,
              private matDialog: MatDialog,
              public projectsService: ProjectsService,
              private afauth: AngularFireAuth) { }

  ngOnInit() {
    this.categorieService.getAllCategories();
    this.memberService.getAllMembers();
    this.projectsService.getAllProjects();

    this.subscriptionCategorie = this.categorieService.categoriesSubject.subscribe(data => {
      this.categories = data;

      this.subscriptionMember = this.memberService.membersSubject.subscribe(data => {
        this.options = data;
      });

      this.subscriptionProject = this.projectsService.projectsSubject.subscribe(data => {
        this.projects = data;
      });

      this.afauth.onAuthStateChanged((user) => {
        if (user) {
          this.isAuthentification = true;
          this.usersService.getSingleUser(user.email).then((item: Users) => {
              this.user = item;
              if (this.user.memberid) {
                this.userMember = this.options.find(member => member.memberid === item.memberid);
                this.memberService.setSessionMemberValue(this.userMember);
                if (this.categories.find(cat => cat.id === this.userMember.categoryid).isadmin) {
                    this.usersService.setIsAdministrateur(true);
                  } else {
                    this.usersService.setIsAdministrateur(false);
                  }
              } else {
                this.usersService.setIsAdministrateur(false);
              }
           });
        } else {
          this.isAuthentification = false;
        }
      });

    });





    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  displayFn(member?: Member): string | undefined {
    return member ? member.name : undefined;
  }

  private _filter(name: string): Member[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }


  onKeyUp(value: string) {
    this.memberService.setSearchByCategorie(false);
    this.router.navigate(['members', value]);
  }

  clickMe() {
    this.memberService.setSearchByCategorie(false);
    this.router.navigate(['members', this.myControl.value.name]);
  }

  onSearch() {
    this.memberService.setSearchByCategorie(true);
    this.router.navigate(['members', this.categorieSelected]);
}

  seDeconnecter() {
    this.usersService.setIsAdministrateur(false);
    this.memberService.setSessionMemberValue(null);
    this.authentificationService.signOutUser();
  }


  onCreateMember() {
    this.memberService.resetSingleUser();
    this.memberService.resetForm();
    this.router.navigate(['edit']);
  }

  openDialog() {
    this.tasksService.resetForm();
    this.projectsService.setCurrentProject();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.backdropClass = 'dialogcss';
    this.matDialog.open(TaskFormComponent, dialogConfig);
  }

  onShowGrille() {
    this.tasksService.setOnShowGrille(true);
  }

  onShowTable() {
    this.tasksService.setOnShowGrille(false);
  }

  closeFilterByMember(): void {
    this.tasksService.setFilterByMemberValue(false);
  }

  openFilterByMember(): void {
    this.tasksService.setFilterByMemberValue(true);
  }

  ngOnDestroy(): void {
    this.subscriptionCategorie.unsubscribe();
    this.subscriptionMember.unsubscribe();
    this.subscriptionProject.unsubscribe();
  }

}