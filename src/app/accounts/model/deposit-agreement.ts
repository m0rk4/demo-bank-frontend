import { DepositCurrency } from "./deposit-currency";
import { Client } from "../../clients/models/client";

export interface DepositAgreement {
  id: number;
  number: string;
  startDate: string;
  endDate: string;
  depositCurrency: DepositCurrency;
  client: Client;
}
