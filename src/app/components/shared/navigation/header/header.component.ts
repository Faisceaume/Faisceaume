import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { AuthUserService } from 'src/app/services/auth-user/auth-user.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { UsersService } from 'src/app/services/users/users.service';
import { MembersService } from 'src/app/services/members/members.service';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';

import { AuthUser, User } from 'src/app/models/user';
import { Project } from 'src/app/models/project';
import { Member } from 'src/app/models/member';
import { Role } from 'src/app/models/role';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy  {

  isAdmin = false;
  isDev = false;
  isClient = false;
  isAnonym = false;

  isAuth = false;

  authUser = new AuthUser();
  authUserObs: Observable<{ user: User, role: Role }>;
  authUserSub: Subscription;

  myControl = new FormControl();
  filteredOptions: Observable<Member[]>;
  libelleSearch: string;
  categorieSelected: string;

  showSearchTool = false;
  
  options: Member[] = [];
  memberSub: Subscription;


  projectsTable: Project[] = [];
  projectsObs: Observable<Project[]>;
  projectSub: Subscription;


  @Output() public sidenavToggle = new EventEmitter();

  constructor(
    private routingService: RoutingService,
    private authUserService: AuthUserService,
    public sharedService: SharedService,
    public usersService: UsersService,
    public membersService: MembersService,
    public clientsService: ClientsService,
    public tasksService: TasksService,
    public projectsService: ProjectsService,
    public bugsService: BugsService) { }

  
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
    

    this.membersService.getAllMembers();
    this.memberSub = this.membersService.membersArraySub.subscribe( members => {
      this.options = members;
    });

    this.projectsObs = this.projectsService.getAllProjects();
    this.projectSub = this.projectsObs.subscribe( projects => {
      this.projectsTable = projects;
    });
    
    /*
    this.usersService.getCurrentUser().then( user => {
      this.user = user;
      this.isAuth = true;             
                
      if (this.user.memberid) {
        this.userMember = this.options.find(member => member.memberid === item.memberid);
        this.membersService.setSessionMemberValue(this.userMember);
                      
        if (this.categories.find(cat => cat.id === this.userMember.categoryid).isadmin) {
          this.usersService.setIsAdministrateur(true);
        } else {
          this.usersService.setIsAdministrateur(false);
        }
        } else {
          this.usersService.setIsAdministrateur(false);
        }
      }
      */
     
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );
  }


  displayFn(member?: Member): string | undefined {
    return member ? member.lastname : undefined;
  }

  private _filter(name: string): Member[] {
    const filter = name.toLowerCase();
    return this.options.filter(option => option.lastname.toLowerCase().indexOf(filter) === 0);
  }


  onChangeProject(projectTitle: string): void {
    // Retrieve the selected project
    const selectedProject = this.projectsTable.find( project => project.title === projectTitle);
    
    if (this.bugsService.isBugsSection) {
      if (this.bugsService.isBugsList) {
        this.routingService.redirectBugsList(selectedProject);
      } else {
        this.bugsService.setFormData();
        this.routingService.redirectBugForm(selectedProject);
      }
    }

    if (this.tasksService.isTasksSection) {
      if (this.tasksService.isTasksList) {
        this.routingService.redirectTasksList(selectedProject);
      } else {
        this.tasksService.setFormData();
        this.routingService.redirectTaskForm(selectedProject);
      }
    }
  }


  /*
  onKeyUp(value: string): void {
    this.membersService.setSearchByCategorie(false);
    this.router.navigate(['members', value]);
  }

  clickMe(): void {
    this.membersService.setSearchByCategorie(false);
    this.router.navigate(['members', this.myControl.value.name]);
  }

  onSearch(): void {
    this.membersService.setSearchByCategorie(true);
    this.router.navigate(['members', this.categorieSelected]);
  }
  */


  onAddUser(): void {
    this.usersService.resetForm();
    this.routingService.redirectUserForm();
  }

  onAddMember(): void {
    this.membersService.resetForm();
    this.routingService.redirectMemberForm();
  }

  onAddClient(): void {
    this.clientsService.resetForm();
    this.routingService.redirectClientForm();
  }
  
  onAddProject(): void {
    this.projectsService.resetForm();
    this.routingService.redirectProjectForm();
  }

  onAddBug(project: Project): void {
    this.bugsService.resetForm();
    this.routingService.redirectBugForm(project);
  }

  onAddTask(project: Project): void {
    this.tasksService.resetForm();
    this.routingService.redirectTaskForm(project);
  }


  onShowGrid(): void {
    this.sharedService.isGridShown = true;
  }

  onShowTable(): void {
    this.sharedService.isGridShown = false;
  }

  closeFilterByMember(): void {
    this.tasksService.onDisplayFilterByMember = false;
  }

  openFilterByMember(): void {
    this.tasksService.onDisplayFilterByMember = true;
  }


  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  signOutUser(): void {
    this.isAuth = false;
    this.authUserService.signOutAuthUser();
  }

  ngOnDestroy(): void {
    this.authUserSub.unsubscribe();
    this.projectSub.unsubscribe();
    this.memberSub.unsubscribe();
  }
}
