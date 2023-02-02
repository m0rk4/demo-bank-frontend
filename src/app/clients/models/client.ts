import {Sex} from "./sex.enum";
import {Passport} from "./passport";
import {City} from "./city";
import {MaritalStatus} from "./marital-status";
import {Disability} from "./disability";
import {Citizenship} from "./citizenship";

export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  patronymic: string;
  dateOfBirth: string;
  email: string | null;
  sex: Sex;
  phoneNumberHome: string;
  phoneNumber: string;
  retired: boolean;
  address: string;
  monthlyIncome: number | null;
  cityActual: City;
  maritalStatus: MaritalStatus;
  disability: Disability;
  citizenship: Citizenship;
  passport: Passport;
}
