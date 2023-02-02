import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { BehaviorSubject, startWith, switchMap } from "rxjs";
import { CommonModule } from "@angular/common";
import { Client } from "../models/client";
import { ClientService } from "../service/client.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Page } from "../models/page";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Sex } from "../models/sex.enum";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";

@UntilDestroy()
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  providers: [ClientService, MatSnackBar],
  standalone: true
})
export class ClientsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  readonly pageSizeOptions = [5, 10, 20];
  readonly displayedColumns: string[] = [
    'passportId',
    'name',
    'dateOfBirth',
    'sex',
    'citizenship',
    'disability',
    'maritalStatus',
    'isRetired',
    'actions'
  ];
  readonly page$: BehaviorSubject<Page<Client>> = new BehaviorSubject<Page<Client>>({
    content: [],
    number: 0,
    totalElements: 0
  });
  readonly SEX = Sex;

  constructor(private clientService: ClientService, private snackBar: MatSnackBar) {}

  ngAfterViewInit(): void {
    if (this.paginator === undefined) throw new Error("Paginator wasn't initialized!");

    this.paginator.page.pipe(
      startWith({ pageIndex: 0, pageSize: this.pageSizeOptions[0] }),
      switchMap(event => this.clientService.getClients(event.pageIndex, event.pageSize)),
      untilDestroyed(this)
    ).subscribe(page => this.page$.next(page));
  }

  trackClients(index: number, client: Client): number {
    return client.id;
  }

  deleteClient(clientId: number): void {
    this.clientService.deleteClient(clientId).pipe(untilDestroyed(this)).subscribe(() => {
      this.snackBar.open('Client was deleted successfully.')
      this.paginator?.page?.emit()
    });
  }
}
