import { Component, Input, OnInit } from '@angular/core';
import { share } from 'rxjs';
import { Categorie } from 'src/app/members/categories/categorie';
import { CategoriesService } from 'src/app/members/categories/categories.service';
import { Member } from 'src/app/members/member';
import { Task } from '../task';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-tasks-stats',
  templateUrl: './tasks-stats.component.html',
  styleUrls: ['./tasks-stats.component.css']
})
export class TasksStatsComponent implements OnInit {

  @Input() member?: Member;
  currentMonth: number;
  precMonth: number;
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
  display = false;
  category: string;
  taskCompleteCurrentMonth = 0
  taskCompletePrecMonth = 0
  taskCompleteTimeCurrentMonth = 0

  constructor(
    private tasksService: TasksService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    if(this.member !== null) {

      this.categoriesService.getAllCategories();
      this.categoriesService.categoriesSubject.subscribe((data: Categorie[]) => {
        this.category = data.find(el => el.id == this.member.categoryid).libelle;
      });

      this.display = true;
      const date = Date.now();
      console.log();
      this.currentMonth = new Date(date).getMonth();
      this.precMonth = new Date(date).getMonth()-1;
      this.tasksService.getTasksForMember(this.member.memberid);
      this.tasksService.tasksSubject.pipe(share()).subscribe((data: Task[]) => {
        data.forEach(task => {
          if(new Date(task.timestamp).getMonth() === this.currentMonth && task.status === 'done') {
            this.taskCompleteCurrentMonth++;
            this.taskCompleteTimeCurrentMonth += task.timespent
          } else if ((new Date(task.timestamp).getMonth()-1 === this.precMonth) && task.status === 'done') {
            this.taskCompletePrecMonth++;
          }
        })
      });

    }
  }

}
