import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Page } from "../../shared/models/page";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Account } from "../model/account";

@Injectable()
export class AccountService {

  constructor(private httpClient: HttpClient) {}

  getAccounts(name: string, page: number, size: number): Observable<Page<Account>> {
    return this.httpClient.get<Page<Account>>(`${environment.apiUrl}/accounts?page=${page}&size=${size}&name=${name}`);
  }
}
