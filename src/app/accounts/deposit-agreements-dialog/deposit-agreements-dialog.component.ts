import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { NgxMaskDirective } from "ngx-mask";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DepositService } from "../service/deposit.service";
import { MatIconModule } from "@angular/material/icon";
import { BehaviorSubject, filter, startWith, switchMap } from "rxjs";
import { Page } from "../../shared/models/page";
import { DepositAgreement } from "../model/deposit-agreement";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";

@UntilDestroy()
@Component({
  selector: 'app-deposit-agreements-dialog',
  templateUrl: './deposit-agreements-dialog.component.html',
  styleUrls: ['./deposit-agreements-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    NgxMaskDirective,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule
  ],
  providers: [
    MatSnackBar,
    DepositService
  ]
})
export class DepositAgreementsDialogComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  readonly pageSizeOptions = [5, 10, 20];
  readonly DEPOSIT_AGREEMENT_COLUMNS = [
    'number',
    'startDate',
    'endDate',
    'currency',
    'deposit',
    'client',
    'actions'
  ];
  readonly page$: BehaviorSubject<Page<DepositAgreement>> = new BehaviorSubject<Page<DepositAgreement>>({
    content: [],
    number: 0,
    totalElements: 0
  });

  constructor(private snackBar: MatSnackBar, private depositService: DepositService, private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    if (this.paginator === undefined) throw new Error("Paginator wasn't initialized!");

    this.paginator.page.pipe(
      startWith({ pageIndex: 0, pageSize: this.pageSizeOptions[0] }),
      switchMap(event => this.depositService.getActiveDepositAgreements(event.pageIndex, event.pageSize)),
      untilDestroyed(this)
    ).subscribe(page => this.page$.next(page));
  }

  trackAgreements(index: number, agreement: DepositAgreement): number {
    return agreement.id;
  }

  closeAgreement(id: number): void {
    this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogModel, boolean>(ConfirmationDialogComponent, {
      data: {
        title: "Confirm Action",
        message: 'Are you sure you want to do this?\nRelated accounts are going to be closed.'
      }
    }).afterClosed()
      .pipe(
        filter(it => !!it),
        switchMap(() => this.depositService.closeDepositAgreements(id)),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.snackBar.open('Agreement was closed successfully.');
        this.paginator?.page?.emit({ pageIndex: 0, pageSize: this.pageSizeOptions[0], length: 0 });
      });
  }
}
