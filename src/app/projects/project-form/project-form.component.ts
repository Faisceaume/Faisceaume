
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { MemberService } from 'src/app/members/member.service';
import { NgForm } from '@angular/forms';
import { Project } from '../project';
import { Task } from 'src/app/tasks/task';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator'

export interface Classement {
   listeTasks: Task[];
   totalTimeSpent: number;
   year?: number;
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

  moisAffiches: string[] = [];

  indexs: number[] = [];

  panelOpenState = false;

  displayedColumns: string[] = ['title', 'description', 'timespent'];

  constructor(
    public projectsService: ProjectsService,
    public memberService: MemberService
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
        }
      });

      this.taskForOperation.forEach((item: Task) => {
          this.tasksFilter[new Date(item.timestamp).getMonth()] = {
            listeTasks: [],
            totalTimeSpent: 0
          };
      });

      this.taskForOperation.forEach((item: Task) => {
        let year = new Date(item.timestamp).getFullYear();
        if( !this.years.includes(year) ) this.years.push(year)
        this.tasksFilter[new Date(item.timestamp).getMonth()].listeTasks.push(item);

        this.tasksFilter[new Date(item.timestamp).getMonth()].year = year;

        this.indexs.push( new Date(item.timestamp).getMonth() );
        this.tasksFilter[new Date(item.timestamp).getMonth()].totalTimeSpent += parseInt(item.timespent);
      });
      this.tasksFilter.forEach((element: Classement) => {
        //console.log(this.tasksFilter.indexOf(element), element.year)
        this.indexMois.push(this.tasksFilter.indexOf(element));
      });
    }

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

}
