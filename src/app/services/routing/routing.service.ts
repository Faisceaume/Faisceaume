import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Bug } from 'src/app/models/bug';
import { Client } from 'src/app/models/client';
import { Member } from 'src/app/models/member';
import { Project } from 'src/app/models/project';
import { Task } from 'src/app/models/task';


@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(
    private location: Location,
    private router: Router) { }


  /** Force to reload the page. */
  private reload(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }


  /* ---------- ROUTES PARAMS  ---------- */

  /**
   * Get the ID of the bug passed in the URL.
   * @param {ActivatedRoute} route The route.
   * @returns {string} The ID of the bug.
   */
   getRouteBugId(route: ActivatedRoute): string {
    return route.snapshot.paramMap.get('bugid');
  }

  /**
   * Get the ID of the client passed in the URL.
   * @param {ActivatedRoute} route The route.
   * @returns {string} The ID of the client.
   */
   getRouteClientId(route: ActivatedRoute): string {
    return route.snapshot.paramMap.get('clientid');
  }

  /**
   * Get the ID of the member passed in the URL.
   * @param {ActivatedRoute} route The route.
   * @returns {string} The ID of the member.
   */
  getRouteMemberId(route: ActivatedRoute): string {
    return route.snapshot.paramMap.get('memberid');
  }

  /**
   * Get the ID of the project passed in the URL.
   * @param {ActivatedRoute} route The route.
   * @returns {string} The ID of the project.
   */
  getRouteProjectId(route: ActivatedRoute): string {
    return route.snapshot.paramMap.get('projectid');
  }

  /**
   * Get the ID of the task passed in the URL.
   * @param {ActivatedRoute} route The route.
   * @returns {string} The ID of the task.
   */
   getRouteTaskId(route: ActivatedRoute): string {
    return route.snapshot.paramMap.get('taskid');
  }
  

  /* ---------- ROUTES REDIRECTIONS ---------- */

  /** Redirect to the previous visited page. */
  redirectBack(): void {
    this.location.back();
  }

  /** Redirect to the home page. */
  redirectHome(): void {
    this.router.navigate(['']);
  }


  /* CLIENT SIDE */

  /** Redirect to the personal page of projects list of the connected client. */
  redirectClientProjectsList(): void {
    this.router.navigate(['client', 'my-projects']);
  }

  /**
   * Redirect to the personal page of bugs list of the connected client.
   * @param {Project} project The project.
  */
  redirectClientBugsList(project: Project): void {
    this.router.navigate(['client', 'my-bugs', 'project', project.projectid]);
  }

  /**
   * Redirect to the personal page of bug details of the connected client.
   * @param {Bug} bug The project.
  */
  redirectClientBugDetails(bug: Bug): void {
    this.router.navigate(['client', 'my-bugs', 'bug-details', bug.bugid]);
  }

  /**
   * Redirect to the personal bug form page of the connected client.
   * @param {Project} project The project.
  */
  redirectClientBugForm(project: Project): void {
    this.router.navigate(['client', 'my-bugs', 'bug-form', 'project', project.projectid]);
  }

  /* DEV SIDE */

  /** Redirect to the page of projects list for the connected dev. */
  redirectDevProjectsList(): void {
    this.router.navigate(['dev', 'projects']);
  }

  
  /** Redirect to the personal page of bugs list of the connected dev. */
  redirectDevBugsList(): void {
    this.router.navigate(['dev', 'my-bugs']);
  }

  /**
   * Redirect to the personal page of bug details of the connected dev.
   * @param {Bug} bug The project.
  */
  redirectDevBugDetails(bug: Bug): void {
    this.router.navigate(['dev', 'my-bugs', 'bug-details', bug.bugid]);
  }

  /** Redirect to the personal bug form page of the connected dev. */
  redirectDevBugForm(): void {
    this.router.navigate(['dev', 'my-bugs', 'bug-form']);
  }
  

  /** Redirect to the personal page of tasks list of the connected dev. */
  redirectDevTasksList(): void {
    this.router.navigate(['dev', 'my-tasks']);
  }

  /**
   * Redirect to the personal page of task details of the connected dev.
   * @param {Task} task The task.
  */
  redirectDevTaskDetails(task: Task): void {
    this.router.navigate(['dev', 'my-tasks', 'task-details', task.taskid]);
  }


  /* BUGS */

  /** Redirect to the personal page of the bugs list. */
  redirectAdminBugsList(): void {
    this.router.navigate(['bugs', 'my-bugs']);
  }

  /**
   * Redirect to the page of the bugs list.
   * @param {Project} project The project.
   */
  redirectBugsList(project: Project): void {
    this.reload();
    this.router.navigate(['bugs', 'list', 'project', project.projectid]);
  }

  /**
   * Redirect to the page of the bug details.
   * @param {Bug} bug The bug.
   */
  redirectBugDetails(bug: Bug): void {
    this.router.navigate(['bugs', 'bug-details', bug.bugid]);
  }

  /**
   * Redirect to the page of the bug form.
   * @param {Project} project OPTIONAL The project.
   */
  redirectBugForm(project?: Project): void {
    this.reload();
    project
    ? this.router.navigate(['bugs', 'bug-form', 'project', project.projectid])
    : this.router.navigate(['bugs', 'bug-form']);
  }

  /* CLIENTS */
  
  /** Redirect to the page of the clients list. */
  redirectClientsList(): void {
    this.router.navigate(['clients', 'list']);
  }

  /**
   * Redirect to the page of the client details.
   * @param {Client} client The client.
   */
  redirectClientDetails(client: Client): void {
    this.router.navigate(['clients', 'client-details', client.clientid]);
  }

  /** Redirect to the page of the client form. */
  redirectClientForm(): void {
    this.router.navigate(['clients', 'client-form']);
  }

  /* MEMBERS */

  /** Redirect to the page of the members list. */
  redirectMembersList(): void {
    this.router.navigate(['members', 'list']);
  }

  /**
   * Redirect to the page of the member details.
   * @param {Member} member The client.
   */
  redirectMemberDetails(member: Member): void {
    this.router.navigate(['members', 'member-details', member.memberid]);
  }

  /** Redirect to the page of the member form. */
  redirectMemberForm(): void {
    this.router.navigate(['members', 'member-form']);
  }

  /* PROJECTS */

  /** Redirect to the page of the projects list. */
  redirectProjectsList(): void {
    this.router.navigate(['projects', 'list']);
  }

  /** Redirect to the page of the client form. */
  redirectProjectForm(): void {
    this.router.navigate(['projects', 'project-form']);
  }

  /* TASKS */

  /**
   * Redirect to the page of the tasks list.
   * @param {Project} project The project.
   */
  redirectTasksList(project: Project): void {
    this.reload();
    this.router.navigate(['tasks', 'list', 'project', project.projectid]);
  }

  /**
   * Redirect to the page of the task details.
   * @param {Task} task The task.
   */
  redirectTaskDetails(task: Task): void {
    this.router.navigate(['tasks', 'task-details', task.taskid]);
  }

  /**
   * Redirect to the page of the task form.
   * @param {Project} project The project.
   */
  redirectTaskForm(project?: Project): void {
    this.reload();
    project
    ? this.router.navigate(['tasks', 'task-form', 'project', project.projectid])
    : this.router.navigate(['tasks', 'task-form']);
  }

  /* USERS */

  /** Redirect to the page of the users list. */
   redirectUsersList(): void {
    this.router.navigate(['users', 'list']);
  }

  /** Redirect to the page of the user form. */
  redirectUserForm(): void {
    this.router.navigate(['users', 'user-form']);
  }
}
