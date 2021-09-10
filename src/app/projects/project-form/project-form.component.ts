
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { MemberService } from 'src/app/members/member.service';
import { NgForm } from '@angular/forms';
import { Project } from '../project';
import { Task } from 'src/app/tasks/task';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator'
import { NgxPrinterService } from 'ngx-printer';
import { MatAccordion } from '@angular/material/expansion';

export interface Classement {
   listeTasks: Task[];
   totalTimeSpent: number;
   year?: number;
}

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
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  currentProject: Project;
  taskForOperation: Task[] = [];
  tasksFilter: Classement[] = [];
  indexMois: number[] = [];
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

  tasksYears = [] as TasksYear[];

  panelOpenState = false;
  displayedColumns: string[] = ['title', 'description', 'timespent'];
  expanded = false;
  expandedYear = false;

  //@ViewChild('accordeon1', {read: ElementRef}) accordeon1: ElementRef;
  //@ViewChild('monthTable', {read: ElementRef}) monthTable: ElementRef;
  multi = false;

  constructor(
    public projectsService: ProjectsService,
    public memberService: MemberService,
    private printerService: NgxPrinterService
              ) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    if (!this.projectsService.formData) {
      this.projectsService.resetForm();
    } else {
      this.currentProject = this.projectsService.formData;
      this.currentProject.tasks.forEach((item: Task) => {
        if (item.status === 'done') {
          item.description = item.description.slice(0, 300) + '...';
          this.taskForOperation.push(item);

          // Get different year from all tasks: [2020, 2021]
          let year = new Date(item.timestamp).getFullYear();
          if( !this.years.includes(year) ) this.years.push(year);
        }
      });

      // Set year
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
    }

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

  onSubmit(form: NgForm) {
    if (form.value.projectid) {
      this.projectsService.updateProject(form);
    } else {
      this.projectsService.createNewProject(form);
    }
  }

  onDeleteDrapImage() {
    this.memberService.deletePhoto(this.memberService.fileUrl);
    this.memberService.fileUrl = null;
  }

  onPrint(year: number) {
    this.multi = true;
    this.expanded = true;
    setTimeout(() => {
      this.printerService.printDiv('yearTable' + year);
      this.multi = false;
      this.expanded = false;
    }, 1000);
  }

  onPrintMonth(month: number, year: number) {
    this.expanded = true;
    this.printerService.printDiv('monthTable' + month + year);
    this.expanded = false;
    this.multi = false;
  }

}
