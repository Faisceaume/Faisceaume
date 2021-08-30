import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { ClientsService } from '../clients.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  formData: Client;

  constructor(
    public dialogRef: MatDialogRef<ClientFormComponent>,
    private clientService: ClientsService
  ) { }

  ngOnInit() {
    this.initForm();
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

  onSubmit() {
    this.clientService.createNewClient(this.formData);
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
