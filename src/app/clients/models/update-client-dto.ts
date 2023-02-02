import {Sex} from "./sex.enum";
import {AddPassportDto} from "./add-passport-dto";

export interface UpdateClientDto {
  firstname: string;
  lastname: string;
  patronymic: string;
  dateOfBirth: string;
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
  passport: AddPassportDto;
}
