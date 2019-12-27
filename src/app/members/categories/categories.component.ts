import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriesService } from './categories.service';
import { Categorie} from './categorie';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

categories: Categorie[];
subscriptionCategorie: Subscription;

  constructor(private categoriesService: CategoriesService,
              private router: Router) { }

  ngOnInit() {
    this.resetForm();
    this.categoriesService.getAllCategories();
    this.subscriptionCategorie = this.categoriesService.categoriesSubject.subscribe(data => {
      this.categories = data;
    });
  }

  resetForm(form?: NgForm) {
    this.categoriesService.resetForm();
  }

  onSubmit(form: NgForm) {
    this.categoriesService.onSubmit(form);
  }

  onCreate() {
    this.categoriesService.resetForm();
    this.router.navigate(['categories_edit']);
  }

  onUpdate(categorie: Categorie) {
    this.categoriesService.setFormDataValue(categorie);
    this.router.navigate(['categories_edit']);
  }

  onDelete(id: string) {
      if (confirm('vraiment supprimer ???')) {
          this.categoriesService.removeCategorie(id);
         }
      }

      ngOnDestroy(): void {
        this.subscriptionCategorie.unsubscribe();
      }
  }

