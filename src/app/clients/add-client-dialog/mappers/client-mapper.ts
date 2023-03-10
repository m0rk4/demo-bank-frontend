import { UpdateClientDto } from "../../models/update-client-dto";
import { UpdateClientFormValue } from "../add-client-dialog.component";
import { Client } from "../../models/client";
import { DateUtils } from "../../../shared/utils/date-utils";

export class ClientMapper {

  static toDto(formValue: UpdateClientFormValue): UpdateClientDto {
    return {
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      patronymic: formValue.patronymic,
      dateOfBirth: DateUtils.formatDate(formValue.dateOfBirth),
      phoneNumber: formValue.phoneNumber,
      phoneNumberHome: formValue.phoneNumberHome,
      citizenshipId: formValue.citizenshipId,
      cityActualId: formValue.cityActualId,
      sex: formValue.sex,
      maritalStatusId: formValue.maritalStatusId,
      address: formValue.address,
      disabilityId: formValue.disabilityId,
      email: formValue.email?.trim()?.length === 0 ? null : formValue.email?.trim() ?? null,
      retired: formValue.retired,
      monthlyIncome: formValue.monthlyIncome,
      passport: {
        passportIssuedDate: DateUtils.formatDate(formValue.passportIssuedDate),
        passportId: formValue.passportId,
        passportNumber: formValue.passportNumber,
        placeOfBirth: formValue.placeOfBirth,
        passportAddress: formValue.passportAddress,
        passportSeries: formValue.passportSeries,
        passportIssuer: formValue.passportIssuer
      }
    };
  }

  static toForm(client: Client): UpdateClientFormValue {
    return {
      firstname: client.firstname,
      lastname: client.lastname,
      patronymic: client.patronymic,
      dateOfBirth: new Date(client.dateOfBirth),
      phoneNumber: client.phoneNumber,
      phoneNumberHome: client.phoneNumberHome,
      citizenshipId: client.citizenship.id,
      cityActualId: client.cityActual.id,
      sex: client.sex,
      maritalStatusId: client.maritalStatus.id,
      address: client.address,
      disabilityId: client.disability.id,
      email: client.email,
      retired: client.retired,
      monthlyIncome: client.monthlyIncome,
      passportIssuedDate: new Date(client.passport.passportIssuedDate),
      passportId: client.passport.passportId,
      passportNumber: client.passport.passportNumber,
      placeOfBirth: client.passport.placeOfBirth,
      passportAddress: client.passport.passportNumber,
      passportSeries: client.passport.passportSeries,
      passportIssuer: client.passport.passportIssuer
    };
  }
}
