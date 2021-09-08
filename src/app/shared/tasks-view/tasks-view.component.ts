import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Task } from '../../tasks/task';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MemberService} from '../../members/member.service';
import {TasksService} from '../../tasks/tasks.service';
import {UsersService} from '../../authentification/users.service';
import {Member} from '../../members/member';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';
import { ProjectsService } from 'src/app/projects/projects.service';
import { Project } from 'src/app/projects/project';


export interface TasksMonth {
  month: number,
  listTasks: Task[],
  totalTimeSpent: number
}

export interface TasksYear {
  year: number,
  tasksMonth: TasksMonth[],
  totalTimeSpentYear?: number
}

@Component({
  selector: 'app-tasks-view',
  templateUrl: './tasks-view.component.html',
  styleUrls: ['./tasks-view.component.css']
})
export class TasksViewComponent implements OnInit {

  @Input() member?: Member;
  dataSource: Task[];
  displayedColumns: string[] = ['title', 'description', 'timespent' ,'action'];
  members: Member[];
  projects: Project[];
  projectPick: Project;
  years: number[] = [];
  mois = [
    'Janvier',
    'Fevrier',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];
  taskForOperation: Task[] = [];


  tasksYears = [] as TasksYear[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public membersService: MemberService,
              private router: Router,
              public usersService: UsersService,
              private matDialog: MatDialog,
              public tasksService: TasksService,
              private projectService: ProjectsService) { }

  ngOnInit() {
    this.projectService.getAllProjects();
    this.projectService.projectsSubject.subscribe(data => {
      this.projects = data;
    })
    this.tasksService.getTasksForMember(this.member.memberid);
    this.tasksService.tasksSubject.subscribe(data => {
      this.dataSource = data
      this.operationFilterTask(this.dataSource);
    });
  }


  operationFilterTask(data: Task[]) {
    console.log(data);
    data.forEach((item: Task) => {
      if (item.status === 'done') {
        item.description = item.description.slice(0, 300) + '...';
        this.taskForOperation.push(item);
        // Get different year from all tasks: [2020, 2021]
        let year = new Date(item.timestamp).getFullYear();
        if( !this.years.includes(year) ) this.years.push(year);
      }
    });

    this.years.forEach(year => {
      this.tasksYears.push({
        year: year,
        tasksMonth: [],
        totalTimeSpentYear: 0
      });
    })

    this.taskForOperation.forEach((item: Task) => {
      let year = new Date(item.timestamp).getFullYear();
      let month = new Date(item.timestamp).getMonth();
      // get index of tasks filter with year of item
      let index = this.tasksYears.findIndex(el => el.year === year);
      let indexMonth = this.tasksYears[index].tasksMonth.findIndex(m => m.month === month);

      if(indexMonth !== -1) {
        this.tasksYears[index].tasksMonth[indexMonth].listTasks.push(item);
        this.tasksYears[index].tasksMonth[indexMonth].totalTimeSpent += parseInt(item.timespent);
      } else {
        this.tasksYears[index].tasksMonth.push({month: month, listTasks: [item], totalTimeSpent: parseInt(item.timespent)});
      }
    })
    console.log(this.tasksYears);

    // Timespent by year
    this.tasksYears.forEach(tY => {
      tY.tasksMonth.forEach(tM => {
        tY.totalTimeSpentYear += tM.totalTimeSpent
      })
    })

    // sort descendant
    this.tasksYears = this.tasksYears.sort((a,b) => b.year-a.year);
    this.tasksYears.forEach(taskYear => {
      taskYear.tasksMonth.sort((a, b) => b.month - a.month);
    });
  }

  onEditMemberSection(task: Task) {
    this.membersService.getMemberById(task.memberid).then(
      (item: Member) => {
        this.membersService.setFormDataValue(item);
        this.membersService.setFileUrl(item.picture);
        this.membersService.setSessionMemberValue(item);
        this.router.navigate(['edit']);
      }
    );
  }

  onUpdateTaskStatut(task: Task) {
    this.tasksService.setToUpdateTaskStatut(true);
    this.tasksService.setFormDataValue(task);
    this.openMatDialog();
  }

  openMatDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.backdropClass = 'dialogcss',
    dialogConfig.width = '60%';
    this.matDialog.open(TaskFormComponent, dialogConfig);
  }

  displayOnProject(project: Project,index: number) {
    this.projectPick = project;
    if(this.projectPick !== null) {
      this.dataSource.filter(el => el.projectid === this.projectPick.projectid);
    }
    this.changeMemberSelectedCss(index);
  }

  changeMemberSelectedCss(index: number): void {
    const pElt = document.querySelectorAll('img');
    pElt.forEach(item => {
      item.classList.remove('tab-thumbSelected');
    });
    pElt[index + 2].classList.add('tab-thumbSelected');
  }
}
