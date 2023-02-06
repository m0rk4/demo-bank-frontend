import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Client} from "../models/client";
import {Page} from "../../shared/models/page";
import {environment} from "../../../environments/environment";
import {UpdateClientDto} from "../models/update-client-dto";
import {City} from "../models/city";
import {Disability} from "../models/disability";
import {MaritalStatus} from "../models/marital-status";
import {Citizenship} from "../models/citizenship";

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

  addClient(dto: UpdateClientDto): Observable<Client> {
    return this.httpClient.post<Client>(`${environment.apiUrl}/clients`, dto);
  }

  updateClient(id: number, dto: UpdateClientDto): Observable<Client> {
    return this.httpClient.put<Client>(`${environment.apiUrl}/clients/${id}`, dto);
  }

  getCities(): Observable<City[]> {
    return this.httpClient.get<City[]>(`${environment.apiUrl}/cities`);
  }

  getDisabilities(): Observable<Disability[]> {
    return this.httpClient.get<Disability[]>(`${environment.apiUrl}/disabilities`);
  }

  getMaritalStatuses(): Observable<MaritalStatus[]> {
    return this.httpClient.get<MaritalStatus[]>(`${environment.apiUrl}/marital-statuses`);
  }

  getCitizenships(): Observable<Citizenship[]> {
    return this.httpClient.get<Citizenship[]>(`${environment.apiUrl}/citizenships`);
  }
}
