import { Component, OnInit } from '@angular/core';
import { ClientsService } from './clients.service';
import { Client } from './client';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { ClientFormComponent } from './client-form/client-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clientList: Client[];
  dataSource: MatTableDataSource<Client>;
  displayedColumns:string[] = ['nom', 'prenom', 'email', 'phone', 'actions'];

  constructor(
    private clientService: ClientsService,
    public matDialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.clientService.getAllClients();
    this.clientService.clientListSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.clientList = data;
    });
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    dialogConfig.disableClose = false;
    const dialogRef = this.matDialog.open(ClientFormComponent, dialogConfig);
  }

  onDelete(idClient: string) {
    if(confirm("Voulez vous vraiment supprimer ce client ?")) {
      this.clientService.deleteClient(idClient);
    }
  }

  goToClientDetail(id) {
    this.router.navigate(['clients', id]);
  }

}
