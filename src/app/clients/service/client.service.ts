import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Client } from "../models/client";
import { Page } from "../models/page";
import { environment } from "../../../environments/environment";

@Injectable()
export class ClientService {

  constructor(private httpClient: HttpClient) {
  }

  getClients(page: number, size: number): Observable<Page<Client>> {
    return this.httpClient.get<Page<Client>>(`${environment.apiUrl}/clients?page=${page}&size=${size}&sort=lastname`);
  }

  deleteClient(clientId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/clients/${clientId}`);
  }
}
