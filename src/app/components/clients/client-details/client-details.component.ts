import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { zip } from 'rxjs/internal/observable/zip';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Client } from 'src/app/models/client';
import { Project } from 'src/app/models/project';
import { Bug } from 'src/app/models/bug';

class ProjectDisplay extends Project {
  bugs: Bug[];
}
class ClientDisplay extends Client {
  projects: ProjectDisplay[];
}

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];
  

  isDataLoaded = false;
  isWrongClientId = false;

  columnsTable = ['projects', 'bugs'];

  client = new ClientDisplay();
  clientObs: Observable<{
    client: Client,
    projects: { project: Project, bugs: Bug[] }[] | Project[] }>;
  clientSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private dialogService: DialogService,
    private clientsService: ClientsService,
    private projectsService: ProjectsService,
    private bugsService: BugsService) { }
 

  ngOnInit(): void {
    this.clientsService.isClientsSection = true;

    const clientId = this.routingService.getRouteClientId(this.route);

    this.clientObs = this.clientsService.getOneClientById(clientId).pipe(
      mergeMap( client => zip(
        this.projectsService.getAllProjectsByClientId(client.clientid).pipe(
          mergeMap( projects =>
            projects.length === 0
            ? of(projects)
            : combineLatest( projects.map( project => zip(
              this.bugsService.getAllBugsByProjectId(project.projectid).pipe(
                map( bugs => bugs.filter( bug => bug.uid === client.uid)))
            ).pipe( map( data => ({ project, bugs: data[0] })))))
          )
        )
      ).pipe( map( data => ({ client, projects: data[0], bugs: data[1] }))))
    );

    this.clientSub = this.clientObs.subscribe( clientData => {
      if (!clientData) {
        this.isWrongClientId = true;
      } else {
        this.client = clientData.client as ClientDisplay;
 
        this.client.projects = [];
        this.client.projects.length = 0;
        if (clientData.projects.length !== 0 ) {
          clientData.projects.forEach( projectData => {
            const project = projectData.project as ProjectDisplay;
            project.bugs = projectData.bugs;
            this.client.projects.push(project);
          });
        }
      }
      this.isDataLoaded = true;
    });
  }

  
  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  onClientsList(): void {
    this.routingService.redirectClientsList();
  }

  onEditClient(client: Client): void {
    this.clientsService.setFormData(client);
    this.routingService.redirectClientForm();
  }

  onDeleteClient(client: Client): void {
    this.dialogService.openConfirmDialog(
      'Confirmer la suppression du client ?',
      'Son compte utilisateur sera également supprimé, ainsi que toutes les références à ce client (projet, bugs) seront supprimées.');
    
    this.dialogService.dialogConfirmResultSub.subscribe( isConfirmed => {
      if (isConfirmed) {
        this.clientsService.deleteClientById(client.clientid);
        this.routingService.redirectClientsList();
      }
    });
  }

  onBugDetails(bug: Bug): void {
    this.routingService.redirectBugDetails(bug);
  }


  ngOnDestroy(): void {
    this.clientsService.isClientsSection = false;

    this.clientSub.unsubscribe();
  }
}