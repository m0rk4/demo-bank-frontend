import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DepositService } from "../service/deposit.service";
import { ClientService } from "../../clients/service/client.service";
import { MatSelectInfiniteScrollModule } from "ng-mat-select-infinite-scroll";
import { Client } from "../../clients/models/client";
import { BehaviorSubject, Observable, scan, switchMap, tap } from "rxjs";
import { Page } from "../../shared/models/page";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DepositType } from "../model/deposit-type";
import { DepositCurrency } from "../model/deposit-currency";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatTableModule } from "@angular/material/table";
import { AccountMapper } from "../mappers/account-mapper";
import { DateUtils } from "../../shared/utils/date-utils";

export type AddDepositFormValue = {
  clientId: number;
  depositType: DepositType;
  depositCurrency: DepositCurrency;
  balance: string;
  number: string;
  startDate: Date;
}

@UntilDestroy()
@Component({
  selector: 'app-add-deposit-dialog',
  templateUrl: './add-deposit-dialog.component.html',
  styleUrls: ['./add-deposit-dialog.component.css'],
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
    MatDividerModule,
    MatTooltipModule,
    MatSelectInfiniteScrollModule,
    MatTableModule
  ],
  providers: [
    provideNgxMask(),
    MatSnackBar,
    DepositService,
    ClientService
  ]
})
export class AddDepositDialogComponent implements OnInit {

  private readonly clientsPage$ = new BehaviorSubject<number>(0);
  private readonly depositTypesPage$ = new BehaviorSubject<number>(0);
  private readonly depositCurrency$ = new BehaviorSubject<DepositCurrency | null>(null);

  readonly form = this.formBuilder.group({
    clientId: this.formBuilder.control(null as unknown as number, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    depositType: this.formBuilder.control(null as unknown as DepositType, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    depositCurrency: this.formBuilder.control(null as unknown as DepositCurrency, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    balance: this.formBuilder.control({ value: null as unknown as string, disabled: true }, {
      nonNullable: true,
      validators: [Validators.required, control => this.validateBalance(control)],
    }),
    number: this.formBuilder.control(null as unknown as string, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(9), Validators.maxLength(9)]
    }),
    startDate: this.formBuilder.control({ value: null as unknown as Date, disabled: true }, {
      nonNullable: true,
      validators: [Validators.required]
    })
  });
  readonly depositTypes$: Observable<{ types: DepositType[], total: number }>;
  readonly clients$: Observable<{ clients: Client[], total: number }>;
  readonly depositCurrencies$: Observable<DepositCurrency[]>;
  readonly MAX_BALANCE = BigInt('9223372036854775807');
  readonly MIN_DATE = new Date();
  readonly MAX_DATE = new Date(this.MIN_DATE.getTime() + 30 * 86400000);
  readonly DEPOSIT_CURRENCY_COLUMNS = ['currency', 'capitalization', 'period', 'minDepositSize', 'percent', 'revocable'];

  constructor(private depositService: DepositService,
              private clientService: ClientService,
              private formBuilder: FormBuilder) {
    this.clients$ = this.clientsPage$.pipe(
      switchMap(page => this.clientService.getClients(page, 6)),
      scan<Page<Client>, { clients: Client[], total: number }>((acc, curr) =>
        ({ clients: [...acc.clients, ...curr.content], total: curr.totalElements }), {
        clients: [],
        total: 0
      }));
    this.depositTypes$ = this.depositTypesPage$.pipe(
      switchMap(page => this.depositService.getDepositTypes(page, 6)),
      scan<Page<DepositType>, { types: DepositType[], total: number }>((acc, curr) =>
        ({ types: [...acc.types, ...curr.content], total: curr.totalElements }), {
        types: [],
        total: 0
      }));
    this.depositCurrencies$ = this.form.controls.depositType.valueChanges.pipe(
      tap(() => {
        this.form.controls.number.reset();
        this.form.controls.balance.reset();
        this.form.controls.startDate.reset();
        this.form.controls.startDate.disable();
        this.form.controls.balance.disable();
      }),
      switchMap(type => this.depositService.getDepositCurrenciesByType(type.id)));
  }

  ngOnInit(): void {
    this.form.controls.depositCurrency.valueChanges.pipe(untilDestroyed(this))
      .subscribe(currency => {
        this.depositCurrency$.next(currency)
        this.form.controls.balance.enable();
        this.form.controls.startDate.enable();
      });
  }

  fetchNextClients(): void {
    this.clientsPage$.next(this.clientsPage$.getValue() + 1);
  }

  fetchNextDepositTypes(): void {
    this.depositTypesPage$.next(this.depositTypesPage$.getValue() + 1);
  }

  private validateBalance(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { min: true };
    }
    const minBalance = this.depositCurrency$.getValue()?.minDepositSize ?? 0;
    const currentBalance = BigInt(control.value);
    if (currentBalance < minBalance) {
      return { min: true };
    }
    if (currentBalance > this.MAX_BALANCE) {
      return { max: true };
    }
    return null;
  }

  getEndDateFormatted(): string | null {
    const value: Date | null = this.form.controls.startDate.value;
    if (!value) {
      return null;
    }
    const periodInDays = this.depositCurrency$.getValue()?.periodInDays;
    if (!periodInDays) {
      return null;
    }
    const endDate = new Date(value.getTime());
    endDate.setDate(endDate.getDate() + periodInDays);
    return DateUtils.formatDate(endDate);
  }

  save(): void {
    const formValue: AddDepositFormValue = this.form.getRawValue();
    this.depositService.createAgreement(AccountMapper.toAgreementDto(formValue)).pipe(untilDestroyed(this))
      .subscribe({
        next: agreement => console.log(agreement),
        error: err => console.error(err)
      });
  }
}
