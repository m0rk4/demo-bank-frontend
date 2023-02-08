import { Currency } from "./currency";

export interface Account {
  id: number;
  number: string;
  code: string;
  activity: string;
  debit: number;
  credit: number;
  name: string;
  currencyType: Currency;
  expiredTs: string;
}
