import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { share, Subscription } from 'rxjs';
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
export class TasksStatsComponent implements OnInit, OnChanges {

  @Input() member: Member;
  @Input() taskCompleteCurrentMonth: number;
  @Input() taskCompletePrecMonth: number;
  @Input() taskCompleteTimeCurrentMonth: number;
  currentMonth: number;
  @Input() precMonth: number;
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


  subscription: Subscription = new Subscription();
  data: Task[];

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
      //const date = Date.now();
      //this.currentMonth = new Date(date).getMonth();
      //this.precMonth = new Date(date).getMonth()-1;
      //this.load(this.member.memberid);
    }
  }

  // load(id) {
  //     this.tasksService.getTasksForMember(id);
  //     this.subscription = this.tasksService.tasksSubject.subscribe({
  //       next: (data: Task[]) => {
  //         this.data = data;
  //         this.taskCompleteCurrentMonth = 0;
  //         this.taskCompletePrecMonth = 0;
  //         this.taskCompleteTimeCurrentMonth = 0;
  //         for (let i = 0; i < this.data.length; i++) {
  //           if(new Date(this.data[i].timestamp).getMonth() === this.currentMonth && this.data[i].status === 'done') {
  //             this.taskCompleteCurrentMonth = this.taskCompleteCurrentMonth + 1;
  //             this.taskCompleteTimeCurrentMonth += this.data[i].timespent;
  //           } else if ((new Date(this.data[i].timestamp).getMonth()-1 === this.precMonth) && this.data[i].status === 'done') {
  //             this.taskCompletePrecMonth++;
  //           }
  //         }
  //       }
  //     });
  // }

  ngOnChanges(change: SimpleChanges) {
    //this.subscription.unsubscribe();
    //console.log(change.member.currentValue.name)
    //this.load(change.member.currentValue.memberid);
    //console.log(this.taskCompleteCurrentMonth);
  }
}
