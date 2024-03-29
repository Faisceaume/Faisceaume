import { Component, OnInit, OnDestroy } from '@angular/core';
import { MemberService } from 'src/app/members/member.service';
import { CategoriesService } from 'src/app/members/categories/categories.service';
import { Categorie } from '../categories/categorie';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TasksService } from 'src/app/tasks/tasks.service';
import { Task } from 'src/app/tasks/task';
import { Subscription } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { EditCategorieComponent } from '../categories/edit-categorie/edit-categorie.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit/*, OnDestroy*/ {

  categories: Categorie[];
  tasks: Task[];
  /*subscriptionTask: Subscription;*/


  constructor(public memberService: MemberService,
              private categorieService: CategoriesService,
              private tasksService: TasksService,
              private router: Router,
              private matDialog: MatDialog) { }

  ngOnInit() {
    if (!this.memberService.formData) {
        this.memberService.initFormData();
    }
    this.categorieService.getAllCategories();
    this.categorieService.categoriesSubject.subscribe(data => {
      this.categories = data.filter(d => d.libelle !== 'blocked');
    });
  }

  onSubmit(form: NgForm) {
    if (form.value.memberid) {
      this.memberService.updatePersonnageData(form);
      console.log(form.value);
    } else {
      this.memberService.createNewMember(form);
    }
    this.router.navigate(['']);
  }

  onDeleteDrapImage() {
    this.memberService.deletePhoto(this.memberService.fileUrl);
    this.memberService.fileUrl = null;
  }

  onCreateCategorie() {
    this.openDialog();
  }

  openDialog() {
    this.categorieService.resetForm();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.matDialog.open(EditCategorieComponent, dialogConfig);
  }

  /*ngOnDestroy(): void {
    if (this.subscriptionTask) {
      this.subscriptionTask.unsubscribe();
    }
    this.memberService.setFormDataValue();
  }*/

}
