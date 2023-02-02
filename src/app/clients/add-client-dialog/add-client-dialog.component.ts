import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {Sex} from "../models/sex.enum";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {MatDividerModule} from "@angular/material/divider";
import {PassportIdValidator} from "./validators/passport-id.validator";
import {MobilePhoneNumberValidator} from "./validators/mobile-phone-number-validator";
import {UpdateClientDto} from "../models/update-client-dto";
import {Client} from "../models/client";
import {ClientMapper} from "./mappers/client-mapper";
import {TextValidators} from "./validators/text-validators";
import {ClientService} from "../service/client.service";
import {forkJoin, map, Observable} from "rxjs";
import {City} from "../models/city";
import {Disability} from "../models/disability";
import {Citizenship} from "../models/citizenship";
import {MaritalStatus} from "../models/marital-status";

export type UpdateClientFormValue = {
  firstname: string;
  lastname: string;
  patronymic: string;
  dateOfBirth: Date;
  email: string | null;
  sex: Sex;
  phoneNumberHome: string;
  phoneNumber: string;
  retired: boolean;
  cityActualId: number;
  address: string;
  monthlyIncome: number | null;
  disabilityId: number;
  maritalStatusId: number;
  citizenshipId: number;
  passportId: string;
  passportSeries: string;
  passportNumber: string;
  passportIssuer: string;
  passportIssuedDate: Date;
  passportAddress: string;
  placeOfBirth: string;
};

@Component({
  selector: 'app-add-client-dialog',
  templateUrl: './add-client-dialog.component.html',
  styleUrls: ['./add-client-dialog.component.css'],
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
    MatDividerModule
  ],
  providers: [
    provideNgxMask(),
    ClientService
  ]
})
export class AddClientDialogComponent {
  readonly MAX_MONTHLY_INCOME = 2147483647;
  readonly MAX_DATE = new Date();
  readonly MIN_DATE = new Date(1900, 0, 1);
  readonly SEX = Sex;
  readonly PASSPORT_REGIONS = ['AB', 'BM', 'HB', 'KH', 'MP', 'MC', 'KB', 'PP', 'SP', 'DP'];
  readonly PASSPORT_ID_PATTERNS = {
    'f': {pattern: new RegExp('\[1-6\]')},
    '0': {pattern: new RegExp('\\d')},
    'o': {pattern: new RegExp('\[ABCKEMH\]')},
    'x': {pattern: new RegExp('\[PBAI\]')}
  };
  readonly NAME_PATTERNS = {
    'n': {pattern: new RegExp('\[a-zA-Zа-яА-ЯёЁ\]+')}
  };

  form = this.formBuilder.group({
    firstname: this.formBuilder.control('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(255),
        TextValidators.notBlank,
        Validators.pattern("[a-zA-Zа-яА-ЯёЁ]+")]
    }),
    lastname: this.formBuilder.control('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(255),
        TextValidators.notBlank,
        Validators.pattern("[a-zA-Zа-яА-ЯёЁ]+")
      ]
    }),
    patronymic: this.formBuilder.control('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(255),
        TextValidators.notBlank,
        Validators.pattern("[a-zA-Zа-яА-ЯёЁ]+")
      ]
    }),
    dateOfBirth: this.formBuilder.control(null as unknown as Date, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: this.formBuilder.control('', {validators: [Validators.email]}),
    sex: this.formBuilder.control(Sex.MALE, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    phoneNumberHome: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, MobilePhoneNumberValidator.isValidHome]
    }),
    phoneNumber: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, MobilePhoneNumberValidator.isValid]
    }),
    retired: this.formBuilder.control(false, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    cityActualId: this.formBuilder.control(0, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    address: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255), TextValidators.notBlank]
    }),
    monthlyIncome: this.formBuilder.control(null as number | null, {
      validators: [Validators.min(0), Validators.max(this.MAX_MONTHLY_INCOME)]
    }),
    disabilityId: this.formBuilder.control(null as unknown as number, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    maritalStatusId: this.formBuilder.control(null as unknown as number, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    citizenshipId: this.formBuilder.control(null as unknown as number, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    passportId: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, PassportIdValidator.isValid]
    }),
    passportSeries: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(this.PASSPORT_REGIONS.join("|"))]
    }),
    passportNumber: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(7), Validators.maxLength(7)]
    }),
    passportIssuer: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255), TextValidators.notBlank]
    }),
    passportIssuedDate: this.formBuilder.control(null as unknown as Date, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    passportAddress: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255), TextValidators.notBlank]
    }),
    placeOfBirth: this.formBuilder.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255), TextValidators.notBlank]
    }),
  });

  readonly initialValue: UpdateClientFormValue | undefined;
  readonly citiesDisabilitiesCitizenshipsMaritalStatuses$: Observable<{
    cities: City[]
    disabilities: Disability[]
    citizenships: Citizenship[]
    maritalStatuses: MaritalStatus[]
  }> = forkJoin([
    this.clientService.getCities(),
    this.clientService.getDisabilities(),
    this.clientService.getCitizenships(),
    this.clientService.getMaritalStatuses()
  ]).pipe(
    map(([cities, disabilities, citizenships, maritalStatuses]) => ({
      cities,
      disabilities,
      citizenships,
      maritalStatuses
    }))
  );

  constructor(private clientService: ClientService,
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<AddClientDialogComponent, UpdateClientDto | null>,
              @Inject(MAT_DIALOG_DATA) private client: Client | undefined) {
    if (client) {
      this.form.setValue(ClientMapper.toForm(client));
      this.initialValue = ClientMapper.toForm(client);
    }
  }

  save(): void {
    this.dialogRef.close(ClientMapper.toDto(this.form.getRawValue()));
  }
}
