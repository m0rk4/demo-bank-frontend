import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AddDepositDialogComponent } from "../add-deposit-dialog/add-deposit-dialog.component";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { BehaviorSubject, combineLatest, debounceTime, filter, startWith, switchMap } from "rxjs";
import { Page } from "../../shared/models/page";
import { Account } from "../model/account";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { AccountService } from "../service/account.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DepositService } from "../service/deposit.service";
import { DepositAgreementsDialogComponent } from "../deposit-agreements-dialog/deposit-agreements-dialog.component";
import { DateUtils } from "../../shared/utils/date-utils";

@UntilDestroy()
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  providers: [MatSnackBar, MatDialog, AccountService, MatSnackBar, DepositService],
  standalone: true
})
export class AccountsComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  readonly pageSizeOptions = [5, 10, 20];
  readonly displayedColumns: string[] = [
    'name',
    'number',
    'code',
    'activity',
    'debit',
    'credit',
    'currency',
    'expired'
  ];
  readonly page$: BehaviorSubject<Page<Account>> = new BehaviorSubject<Page<Account>>({
    content: [],
    number: 0,
    totalElements: 0
  });
  readonly nameForm = this.formBuilder.group({
    name: this.formBuilder.control('', { nonNullable: true })
  });
  readonly dateForm = this.formBuilder.group({
    date: this.formBuilder.control(new Date(), { nonNullable: true, validators: [Validators.required] })
  });
  readonly TODAY = new Date();

  private reloadAccounts$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null);

  constructor(private dialog: MatDialog,
              private accountService: AccountService,
              private depositService: DepositService,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder) {}

  ngAfterViewInit(): void {
    if (this.paginator === undefined) throw new Error("Paginator wasn't initialized!");

    combineLatest([
      this.reloadAccounts$,
      this.nameForm.controls.name.valueChanges.pipe(startWith(''), debounceTime(500)),
      this.paginator.page.pipe(startWith({ pageIndex: 0, pageSize: this.pageSizeOptions[0] }))
    ]).pipe(
      switchMap(([, name, event]) => this.accountService.getAccounts(name, event.pageIndex, event.pageSize)),
      untilDestroyed(this)
    ).subscribe(page => this.page$.next(page));
  }

  trackAccounts(index: number, account: Account): number {
    return account.id;
  }

  addDeposit(): void {
    this.dialog.open<AddDepositDialogComponent, unknown, unknown>(AddDepositDialogComponent, { width: '860px' })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => this.reloadAccounts$.next(null));
  }

  finishWorkingDay(): void {
    const date = this.dateForm.controls.date.value;
    this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogModel, boolean>(
      ConfirmationDialogComponent,
      {
        data: {
          title: 'Confirm action',
          message: 'Are you sure you want to finish working day at ' + DateUtils.formatDate(date) + '.'
        }
      }
    ).afterClosed()
      .pipe(
        filter(confirmed => !!confirmed),
        switchMap(() => this.depositService.finishDayAt(date)),
        untilDestroyed(this)
      )
      .subscribe({
        next: () => this.reloadAccounts$.next(null),
        error: err => this.snackBar.open(err.error.message, 'Ok', { duration: 3000 })
      });
  }

  viewDeposits(): void {
    this.dialog.open(DepositAgreementsDialogComponent).afterClosed().pipe(untilDestroyed(this))
      .subscribe(() => this.reloadAccounts$.next(null));
  }
}
