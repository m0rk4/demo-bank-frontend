import { Currency } from "./currency";

export interface DepositCurrency {
  id: number;
  currencyType: Currency;
  hasCapitalization: boolean;
  periodInDays: number;
  minDepositSize: number;
  revocable: boolean;
  percent: number;
}
