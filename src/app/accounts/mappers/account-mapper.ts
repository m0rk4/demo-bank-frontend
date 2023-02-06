import { AddDepositFormValue } from "../add-deposit-dialog/add-deposit-dialog.component";
import { DateUtils } from "../../shared/utils/date-utils";
import { AddDepositAgreementDto } from "../model/add-deposit-agreement-dto";

export class AccountMapper {
  static toAgreementDto(formValue: AddDepositFormValue): AddDepositAgreementDto {
    return {
      number: formValue.number,
      startDate: DateUtils.formatDate(formValue.startDate),
      depositBalance: formValue.balance,
      depositCurrencyId: formValue.depositCurrency.id,
      clientId: formValue.clientId
    };
  }
}
