import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { BehaviorSubject, filter, startWith, switchMap } from "rxjs";
import { CommonModule } from "@angular/common";
import { Client } from "../models/client";
import { ClientService } from "../service/client.service";
import { Page } from "../../shared/models/page";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Sex } from "../models/sex.enum";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddClientDialogComponent } from "../add-client-dialog/add-client-dialog.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";

@UntilDestroy()
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [ClientService, MatSnackBar, MatDialog],
  standalone: true
})
export class ClientsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  readonly pageSizeOptions = [5, 10, 20];
  readonly displayedColumns: string[] = [
    'passportId',
    'name',
    'dateOfBirth',
    'address',
    'phoneNumber',
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

  constructor(private clientService: ClientService, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

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
    this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogModel, boolean>(ConfirmationDialogComponent, {
      data: { title: "Confirm Action", message: 'Are you sure you want to do this?' }
    }).afterClosed()
      .pipe(
        filter(it => !!it),
        switchMap(() => this.clientService.deleteClient(clientId)),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.snackBar.open('Client was deleted successfully.');
        this.paginator?.page?.emit({ pageIndex: 0, pageSize: this.pageSizeOptions[0], length: 0 });
      });
  }

  addClient(): void {
    this.dialog.open<AddClientDialogComponent, undefined, any | null>(AddClientDialogComponent)
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.paginator?.page?.emit({ pageIndex: 0, pageSize: this.pageSizeOptions[0], length: 0 }),
        error: errorMessage => this.snackBar.open(errorMessage, 'Ok', { duration: 3000 })
      });
  }

  editClient(client: Client): void {
    this.dialog.open<AddClientDialogComponent, Client, any | null>(AddClientDialogComponent, { data: client })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.paginator?.page?.emit({ pageIndex: 0, pageSize: this.pageSizeOptions[0], length: 0 }),
        error: errorMessage => this.snackBar.open(errorMessage, 'Ok', { duration: 3000 })
      });
  }
}
