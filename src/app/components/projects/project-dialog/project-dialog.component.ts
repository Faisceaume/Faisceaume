import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations'

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { zip } from 'rxjs/internal/observable/zip';
import { of } from 'rxjs/internal/observable/of';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { BugsService } from 'src/app/services/bugs/bugs.service'
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { MembersService } from 'src/app/services/members/members.service';

import { Project } from 'src/app/models/project';
import { Bug, BUG_STATUS_EN } from 'src/app/models/bug';
import { Task, TASK_STATUS_EN } from 'src/app/models/task';
import { Member } from 'src/app/models/member';

class Day {
  name: string;
  index: number;
}
class Month {
  name: string;
  index: number;
  numberdays: number;
}
class Time {
  day: Day;
  month: Month;
  year: number;
}

class BugDisplay extends Bug {
  time: Time
  member: Member;
}
class TaskDisplay extends Task {
  time: Time
  member: Member;
}
class MemberDayDisplay extends Member {
  timespent: number;
  firstnameinitials: string;
  lastnameinitials: string;
}
class MemberMonthDisplay extends Member {
  bugs: Bug[];
  tasks: Task[];
  ishidden: boolean;
  bugsnumber: number;
  tasksnumber: number;
  timespentbugs: number;
  timespenttasks: number;
}

class DayDisplay extends Day {
  bugs: BugDisplay[];
  tasks: TaskDisplay[];
  members: MemberDayDisplay[];
  bugsnumber: number;
  tasksnumber: number;
  timespentbugs: number;
  timespenttasks: number;
}
class MonthDisplay extends Month {
  days: DayDisplay[];
  members: MemberMonthDisplay[];
  isexpanded: boolean;
  isCalendarHidden: boolean;
  bugsnumber: number;
  tasksnumber: number;
  timespentbugs: number;
  timespenttasks: number;
}
class YearDisplay {
  year: number;
  months: MonthDisplay[];
  bugsnumber: number;
  tasksnumber: number;
  timespentbugs: number;
  timespenttasks: number;
}

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css'],
  animations: [
    trigger('expandedRow', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectDialogComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: false })
  set paginator(paginator: MatPaginator) {
    if (this.monthsTable) {
      this.monthsTable.paginator = paginator;
    }
  }

  isDataLoaded = false;


  dataObs: Observable<{
    bugs: { bug: Bug, member: Member }[] | Bug[],
    tasks: { task: Task, member: Member }[] | Task[],
  }>;
  dataSub: Subscription;

  currentYear = new YearDisplay();
  selectedYear: number; 
  yearsArray: YearDisplay[] = [];

  monthsTable: MatTableDataSource<MonthDisplay>;

  columnsTable = ['month', 'elements'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public project: Project,
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    private routingService: RoutingService,
    private sharedService: SharedService,
    private bugsService: BugsService,
    private tasksService: TasksService,
    private membersService: MembersService) { }

  
  ngOnInit(): void {
    this.dataObs = zip(
      this.bugsService.getAllBugsByProjectId(this.project.projectid).pipe(
        mergeMap( bugs =>
          bugs.length === 0
          ? of(bugs)
          : combineLatest(
            bugs.map( bug => zip(
              this.membersService.getOneMemberById(bug.memberid).pipe(
                find( member => member.memberid === bug.memberid )
              )
            ).pipe( map( data => ({ bug, member: data[0] }))))
          )
        )
      ),
      this.tasksService.getAllTasksByProjectId(this.project.projectid).pipe(
        mergeMap( tasks =>
          tasks.length === 0
          ? of(tasks)
          : combineLatest(
            tasks.map( task => zip(
              this.membersService.getOneMemberById(task.memberid).pipe(
                find( member => member.memberid === task.memberid )
              )
            ).pipe( map( data => ({ task, member: data[0] }))))
          )
        )
      )
    ).pipe( map( data => ({ bugs: data[0], tasks: data[1] })));
    
    this.dataSub = this.dataObs.subscribe( getData => {
      // First get the resolved bugs and completed tasks with their member
      const bugs: BugDisplay[] = [];
      if (getData.bugs.length !== 0) {
        getData.bugs.forEach( bugData => {
          const bug = bugData.bug as BugDisplay;
          if (bug.status === BUG_STATUS_EN.RESOLVED) {
            bug.member = bugData.member;
            bug.time = this.getElementTime(bug.timestamp);
            bugs.push(bug);
          }
        });
      }
      const tasks: TaskDisplay[] = [];
      if (getData.tasks.length !== 0) {
        getData.tasks.forEach( taskData => {
          const task = taskData.task as TaskDisplay;
          if (task.status === TASK_STATUS_EN.DONE) {
            task.member = taskData.member;
            task.time = this.getElementTime(task.timestamp);
            tasks.push(task);
          }
        });
      }


      // Second set the concerned years with months and days
      const yearsData = this.setYears(bugs, tasks);

      // Third set the data per years, months and days (doesn't consider bugs & tasks created during weekends)
      bugs.forEach( bug => {
        const bugYear = bug.time.year;
        const bugMonthIndex = bug.time.month.index;
        const bugDayIndex = bug.time.day.index;
        
        const yearIndex = yearsData.findIndex( yearData => yearData.year === bugYear);
        const monthIndex = yearsData[yearIndex].months.findIndex( montData => montData.index === bugMonthIndex);
        const dayIndex = yearsData[yearIndex].months[monthIndex].days.findIndex( dayData => dayData.index == bugDayIndex);

        // Indexes can be not found (when findIndex() fails, returns -1)
        if (yearIndex !== -1 && monthIndex !== -1 && dayIndex !== -1) {
          yearsData[yearIndex].months[monthIndex].days[dayIndex].bugs.push(bug);

          yearsData[yearIndex].months[monthIndex].days[dayIndex].bugsnumber++;
          yearsData[yearIndex].months[monthIndex].bugsnumber++;
          yearsData[yearIndex].bugsnumber++;
          if (bug.timespent) {
            yearsData[yearIndex].months[monthIndex].days[dayIndex].timespentbugs += bug.timespent;
            yearsData[yearIndex].months[monthIndex].timespentbugs += bug.timespent;
            yearsData[yearIndex].timespentbugs += bug.timespent;
          }
        }
      });

      tasks.forEach( task => {
        const taskYear = task.time.year;
        const taskMonthIndex = task.time.month.index;
        const taskDayIndex = task.time.day.index;
        
        const yearIndex = yearsData.findIndex( yearData => yearData.year === taskYear);
        const monthIndex = yearsData[yearIndex].months.findIndex( montData => montData.index === taskMonthIndex);
        const dayIndex = yearsData[yearIndex].months[monthIndex].days.findIndex( dayData => dayData.index == taskDayIndex);

        // Indexes can be not found (when findIndex() fails, returns -1)
        if (yearIndex !== -1 && monthIndex !== -1 && dayIndex !== -1) {
          yearsData[yearIndex].months[monthIndex].days[dayIndex].tasks.push(task);

          yearsData[yearIndex].months[monthIndex].days[dayIndex].tasksnumber++;
          yearsData[yearIndex].months[monthIndex].tasksnumber++;
          yearsData[yearIndex].tasksnumber++;
          if (task.timespent) {
            yearsData[yearIndex].months[monthIndex].days[dayIndex].timespenttasks += task.timespent;
            yearsData[yearIndex].months[monthIndex].timespenttasks += task.timespent;
            yearsData[yearIndex].timespenttasks += task.timespent;
          }
        }
      });


      // Fourth set the data by members, by months and by days
      yearsData.forEach( yearData => {
        yearData.months.forEach( monthData => {
          monthData.days.forEach( dayData => {

            // Bugs part
            dayData.bugs.forEach( bug => {
              // Per months
              const bugMemberMonth = Object.assign({}, bug.member) as MemberMonthDisplay;
              const monthMemberIndex = monthData.members.findIndex( member => member.memberid === bugMemberMonth.memberid);
              // Member doesn't exist
              if (monthMemberIndex === -1) {
                bugMemberMonth.ishidden = true;
                bugMemberMonth.tasksnumber = 0;
                bugMemberMonth.timespenttasks = 0;
                bugMemberMonth.bugsnumber = 1;
                bug.timespent
                ? bugMemberMonth.timespenttasks = bug.timespent
                : bugMemberMonth.timespenttasks = 0;
                bugMemberMonth.bugs = [];
                bugMemberMonth.bugs.push(bug);
                monthData.members.push(bugMemberMonth);
              // Member already exist
              } else {
                const memberData = monthData.members[monthMemberIndex];
                memberData.bugs.push(bug);
                memberData.bugsnumber++;
                if (bug.timespent) {
                  memberData.timespentbugs += bug.timespent;
                }
              }
              // Per days
              const bugMemberDay = Object.assign({}, bug.member) as MemberDayDisplay;
              const memberDayIndex = dayData.members.findIndex( member => member.memberid === bugMemberDay.memberid);
              // Member doesn't exist
              if (memberDayIndex === -1) {
                bugMemberDay.firstnameinitials = this.sharedService.getInitials(bugMemberDay.firstname);
                bugMemberDay.lastnameinitials = this.sharedService.getInitials(bugMemberDay.lastname);
                bugMemberDay
                ? bugMemberDay.timespent = bug.timespent
                : bugMemberDay.timespent = 0;
                dayData.members.push(bugMemberDay);
              // Member already exist
              } else {
                const memberData = dayData.members[memberDayIndex];
                if (bug.timespent) {
                  memberData.timespent += bug.timespent;
                }
              }
            });

            // Tasks part
            dayData.tasks.forEach( task => {
              // Per months
              const taskMemberMonth = Object.assign({}, task.member) as MemberMonthDisplay;
              const memberMonthIndex = monthData.members.findIndex( member => member.memberid === taskMemberMonth.memberid);
              // Member doesn't exist
              if (memberMonthIndex === -1) {
                taskMemberMonth.ishidden = true;
                taskMemberMonth.bugsnumber = 0;
                taskMemberMonth.timespentbugs = 0;
                taskMemberMonth.tasksnumber = 1;
                task.timespent
                ? taskMemberMonth.timespenttasks = task.timespent
                : taskMemberMonth.timespenttasks = 0;
                taskMemberMonth.tasks = [];
                taskMemberMonth.tasks.push(task);
                monthData.members.push(taskMemberMonth);
              // Member already exist
              } else {
                const memberData = monthData.members[memberMonthIndex];
                memberData.tasks.push(task);
                memberData.tasksnumber++;
                if (task.timespent) {
                  memberData.timespenttasks += task.timespent;
                }
              }
              // Per days
              const taskMemberDay = Object.assign({}, task.member) as MemberDayDisplay;
              const memberDayIndex = dayData.members.findIndex( member => member.memberid === taskMemberDay.memberid);
              // Member doesn't exist
              if (memberDayIndex === -1) {
                taskMemberDay.firstnameinitials = this.sharedService.getInitials(taskMemberDay.firstname);
                taskMemberDay.lastnameinitials = this.sharedService.getInitials(taskMemberDay.lastname);
                taskMemberDay
                ? taskMemberDay.timespent = task.timespent
                : taskMemberDay.timespent = 0;
                dayData.members.push(taskMemberDay);
              // Member already exist
              } else {
                const memberData = dayData.members[memberDayIndex];
                if (task.timespent) {
                  memberData.timespent += task.timespent;
                }
              }
            });
          });
        });
      });
      this.yearsArray = yearsData;

      // 0: most recent year
      this.selectedYear = this.yearsArray[0].year
      this.currentYear = this.yearsArray[0];
            
      this.monthsTable = new MatTableDataSource<MonthDisplay>(this.currentYear.months);
      this.monthsTable.paginator = this.paginator;

      this.isDataLoaded = true;
    });
  }


  getElementTime(milliseconds: number): Time {
    const date = new Date(milliseconds);

    const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
    const dayIndex = date.getDate(); // getDay() return the day number of the week, not of the month
    const day = { name: dayName, index: dayIndex } as Day;

    const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date);
    const monthIndex = date.getMonth();
    const month = { name: monthName, index: monthIndex } as Month;

    const year = date.getFullYear();

    return { day, month, year };
  }


  setYears(bugs: BugDisplay[], tasks: TaskDisplay[]): YearDisplay[] {
    const years: number[] = [];
    bugs.forEach( bug => {
      const bugYear = bug.time.year;
      if (!years.includes(bugYear)) {
        years.push(bugYear);
      }
    });
    tasks.forEach( task => {
      const taskYear = task.time.year;
      if (!years.includes(taskYear)) {
        years.push(taskYear);
      }
    });
    
    const yearsData: YearDisplay[] = [];
    years.forEach( year => {
      const yearData = {
        year,
        bugsnumber: 0,
        timespentbugs: 0,
        tasksnumber: 0,
        timespenttasks: 0,
        months: this.setMonths(year)
      } as YearDisplay;
      yearsData.push(yearData);
    });
    return yearsData;
  }

  setMonths(currentYear: number): MonthDisplay[] {
    const currentDate = {
      year: new Date().getFullYear(),
      monthindex: new Date().getMonth()
    };
    const monthsData: MonthDisplay[] = [];
    // Begin to the end -> anti-chronological order
    for (let monthIndex = 11; monthIndex >= 0; monthIndex-- ) {
      // Stop the process when it's the present date -> doesn't make sense to consider future months
      if (!(currentYear === currentDate.year && monthIndex > currentDate.monthindex)) {
        // (monthIndex+1): when set the date with new Date(), it should be the 'true' month index (January: 1 and not 0)
        // 0 for day: always the last day of the month -> get the number of days in month
        const date = new Date(currentYear, (monthIndex+1), 0);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'long' }); // Return in lowercase letters
        const monthData = {
          name: monthName.charAt(0).toUpperCase() + monthName.slice(1), // Return with the first uppercase letter
          index: date.getMonth(),
          numberdays: date.getDate(), // Return the number of days in month in this (consider leap years)
          members: [],
          isexpanded: false,
          isCalendarHidden: false,
          bugsnumber: 0,
          timespentbugs: 0,
          tasksnumber: 0,
          timespenttasks: 0
        } as MonthDisplay;
        monthData.days = this.setDays(currentYear, monthData);
        monthsData.push(monthData);
      }
    }
    return monthsData;
  }
  
  setDays(currentYear: number, currentMonth: Month): DayDisplay[] {
    const daysData: DayDisplay[] = [];
    // getDate(): return [1; 31]
    for (let dayIndex = 1; dayIndex <= currentMonth.numberdays; dayIndex++) {
      const date = new Date(currentYear, currentMonth.index, dayIndex);
      let dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1); // Return with the first uppercase letter
      // Reject week-end (doesn't consider public holidays)
      if (dayName !== 'Samedi' && dayName !== 'Dimanche') {
        const dayData = {
          name: dayName,
          index: date.getDate(),
          members: [],
          bugs: [],
          tasks: [],
          bugsnumber: 0,
          tasksnumber: 0,
          timespentbugs: 0,
          timespenttasks: 0,
        } as DayDisplay;
        daysData.push(dayData);
      }
    }
    return daysData;
  }

  applyTableFilter(filter: string): void {
    this.monthsTable.filter = filter.trim().toLowerCase();
    this.monthsTable.paginator.firstPage();
  }


  onClickRow(index: number): void {
    // DataIndex: return the index of the CURRENT page, not of the whole array
    index += this.monthsTable.paginator.pageIndex * this.monthsTable.paginator.pageSize;
    const clickedMonth = this.monthsTable.data[index];
    // Useless to set the expanded row if there are no bugs or tasks
    if (clickedMonth.bugsnumber !== 0 || clickedMonth.tasksnumber !== 0) {
      clickedMonth.isexpanded = !clickedMonth.isexpanded;
    }
  }

  onChangeYear(selectedYear: number): void {
    const yearIndex = this.yearsArray.findIndex( year => year.year === selectedYear);
    this.currentYear = this.yearsArray[yearIndex];
    this.monthsTable.data = this.currentYear.months;
    this.monthsTable.paginator.firstPage();
  }


  onDetailsMember(member: Member): void {
    this.routingService.redirectMemberDetails(member);
  }
  onBugDetails(bug: Bug): void {
    this.dialogRef.close();
    this.routingService.redirectBugDetails(bug);
  }
  onTaskDetails(task: Task): void {
    this.dialogRef.close();
    this.routingService.redirectTaskDetails(task);
  }


  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }
}
