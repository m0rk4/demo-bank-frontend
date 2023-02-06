import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DepositType } from "../model/deposit-type";
import { DepositCurrency } from "../model/deposit-currency";
import { Page } from "../../shared/models/page";
import { AddDepositAgreementDto } from "../model/add-deposit-agreement-dto";

@Injectable()
export class DepositService {

  constructor(private httpClient: HttpClient) { }

  getDepositTypes(page: number, size: number): Observable<Page<DepositType>> {
    return this.httpClient.get<Page<DepositType>>(`${environment.apiUrl}/deposit-types?page=${page}&size=${size}`);
  }

  getDepositCurrenciesByType(depositTypeId: number): Observable<DepositCurrency[]> {
    return this.httpClient.get<DepositCurrency[]>(
      `${environment.apiUrl}/deposit-currencies/by-deposit-type?depositTypeId=${depositTypeId}`);
  }

  createAgreement(dto: AddDepositAgreementDto): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/deposit-agreements`, dto);
  }
}
