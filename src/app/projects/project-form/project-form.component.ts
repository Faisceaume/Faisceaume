import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { MemberService } from 'src/app/members/member.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  constructor(public projectsService: ProjectsService,
              public memberService: MemberService) { }

  ngOnInit() {
    if (!this.projectsService.formData) {
      this.projectsService.resetForm();
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
