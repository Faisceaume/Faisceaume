import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ClientsService } from 'src/app/services/clients/clients.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Client } from 'src/app/models/client';

import { ClientUserFormComponent } from '../forms/client-user-form/client-user-form.component';


class ClientDisplay extends Client {
  statusbackgroundcolor: string;
  statustextcolor: string;
}

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: false })
  set paginator(paginator: MatPaginator) {
    if(this.clientsTable) {
      this.clientsTable.paginator = paginator;
    }
  }
  @ViewChild(MatSort, { static: false })
  set sort(sort: MatSort) {
    if(this.clientsTable) {
      this.clientsTable.sort = sort;
    }
  }

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];
  

  isDataLoaded = false;

  columnsTable = ['firstname', 'lastname', 'email', 'phone', 'operations'];

  clients: ClientDisplay[] = [];
  clientsTable: MatTableDataSource<ClientDisplay>;
  clientsObs: Observable<Client[]>;
  clientsSub: Subscription;

  constructor(
    private routingService: RoutingService,
    public sharedService: SharedService,
    private dialogService: DialogService,
    private clientsService: ClientsService) { }


  ngOnInit(): void {
    this.clientsService.isClientsSection = true;
    this.clientsService.isClientsList = true;

    this.clientsObs = this.clientsService.getAllClients();
    this.clientsSub = this.clientsObs.subscribe( clients => {
      this.clients = clients as ClientDisplay[];

      this.clients.forEach( client => {
        client.statusbackgroundcolor = this.clientsService.setBackgroundColor(client.uid);
        client.statustextcolor = this.clientsService.setTextColor(client.uid);
      });

      this.clientsTable = new MatTableDataSource<ClientDisplay>(this.clients);
      this.clientsTable.paginator = this.paginator;
      this.clientsTable.sort = this.sort;

      this.isDataLoaded = true;
    });
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  applyTableFilter(filter: string): void {
    this.clientsTable.filter = filter.trim().toLowerCase();
    this.clientsTable.paginator.firstPage();
  }


  onDetailsClient(client: Client): void {
    this.routingService.redirectClientDetails(client);
  }
  
  onAddClient(): void {
    this.clientsService.setFormData();
    this.routingService.redirectClientForm();
  }

  onEditClient(client: Client): void {
    this.clientsService.setFormData(client);
    this.routingService.redirectClientForm();
  }

  onUpdateClientUser(client: Client): void {
    this.clientsService.setFormData(client);
    this.dialogService.openDialog(ClientUserFormComponent);
  }


  ngOnDestroy(): void {
    this.clientsService.isClientsSection = false;
    this.clientsService.isClientsList = false;

    this.clientsSub.unsubscribe();
  }
}
