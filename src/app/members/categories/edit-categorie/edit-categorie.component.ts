import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriesService } from '../categories.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.css']
})
export class EditCategorieComponent implements OnInit {

  constructor(public categoriesService: CategoriesService,
              public matDialogRef: MatDialogRef<EditCategorieComponent>) { }

  ngOnInit() {
  }

  resetForm(form?: NgForm) {
    this.categoriesService.resetForm();
  }

  onSubmit(form: NgForm) {
    if (form.value.id) {
      this.categoriesService.onSubmitUpdate(form);
    } else {
      this.categoriesService.onSubmit(form);
    }
    this.matDialogRef.close();
  }

}
