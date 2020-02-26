
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { MemberService } from 'src/app/members/member.service';
import { NgForm } from '@angular/forms';
import { Project } from '../project';
import { Task } from 'src/app/tasks/task';

export interface Classement {
   listeTasks: Task[];
   totalTimeSpent: number;
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
  mois = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mais'];

  panelOpenState = false;

  displayedColumns: string[] = ['title', 'timespent'];

  constructor(public projectsService: ProjectsService,
              public memberService: MemberService) { }

  ngOnInit() {
    if (!this.projectsService.formData) {
      this.projectsService.resetForm();
    } else {
      this.currentProject = this.projectsService.formData;
      this.currentProject.tasks.forEach((item: Task) => {
        if (item.statut) {
          this.taskForOperation.push(item);
        }
      });

      this.taskForOperation.forEach((item: Task) => {
        this.tasksFilter[new Date(item.timestamp).getMonth()] = {listeTasks: [], totalTimeSpent: 0};
      });

      this.taskForOperation.forEach((item: Task) => {
        this.tasksFilter[new Date(item.timestamp).getMonth()].listeTasks.push(item);
        // tslint:disable-next-line: radix
        this.tasksFilter[new Date(item.timestamp).getMonth()].totalTimeSpent += parseInt(item.timespent);
      });

      console.log(this.tasksFilter);
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
