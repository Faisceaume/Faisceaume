import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Task } from '../../tasks/task';
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {MemberService} from '../../members/member.service';
import {TasksService} from '../../tasks/tasks.service';
import {UsersService} from '../../authentification/users.service';
import {Member} from '../../members/member';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

@Component({
  selector: 'app-tasks-view',
  templateUrl: './tasks-view.component.html',
  styleUrls: ['./tasks-view.component.css']
})
export class TasksViewComponent implements OnInit {

  @Input() tasksList: Task[];
  dataSource: MatTableDataSource<Task>;
  displayedColumns: string[] = ['created_at', 'title', 'description', 'time',
  'action', 'member', 'statut'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private membersService: MemberService,
              private router: Router,
              public usersService: UsersService,
              private matDialog: MatDialog,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Task>(this.tasksList);
    this.dataSource.sort = this.sort;
  }

  onEditMemberSection(task: Task) {
    this.membersService.getMemberById(task.memberid).then(
      (item: Member) => {
        this.membersService.setFormDataValue(item);
        this.membersService.setFileUrl(item.picture);
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
    dialogConfig.width = '60%';
    this.matDialog.open(TaskFormComponent, dialogConfig);
  }

}
