import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { ClientsService } from '../clients.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/projects/projects.service';
import { Project } from 'src/app/projects/project';
import { AuthentificationService } from 'src/app/authentification/authentification.service';
import { AngularFireFunctions } from '@angular/fire/functions';

export interface ProjectClient {
  title: string;
  projectid: string;
}

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  formData: Client;
  idClient: string;
  projects: Project[];
  display = false;

  constructor(
    private clientService: ClientsService,
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.idClient = this.route.snapshot.paramMap.get('id');
    this.clientService.getOneClient(this.idClient);
    const prom = new Promise((resolve, reject) => {
      this.clientService.clientSubject.subscribe(data => {
        this.formData = data;
        console.log(this.formData.projects);
        this.display = true;
      });
      resolve('');
    });
    prom.then(() => {
      this.projectsService.getAllProjects();
      this.projectsService.projectsSubject.subscribe(data => {
      this.projects = data;
    });
    });



  }

  initForm() {
    this.formData = {
      $id: null,
      nom: '',
      prenom: '',
      phone: '',
      email: '',
      projects: null
    }
  }

  updateField(champ, valeurChamp: any) {
    let projectValue: ProjectClient = {
      title: '',
      projectid: ''
    };
    let projectWithTwoAttribute: any[] = [];
    if (champ === "projects") {
      console.log(projectWithTwoAttribute);
      valeurChamp.forEach(element => {
        projectValue.title = element.title;
        projectValue.projectid = element.projectid;
        projectWithTwoAttribute.push(projectValue);
      });
      this.clientService.updateFieldClient(champ, projectWithTwoAttribute, this.idClient);
    } else {
      this.clientService.updateFieldClient(champ, valeurChamp, this.idClient);
    }
  }

  backToClientList() {
    this.router.navigate(['/clients']);
  }

}
