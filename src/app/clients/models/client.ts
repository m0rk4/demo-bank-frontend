export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  patronymic: string;
  address: string;
  cityName: string;
  disabilityName: string;
  maritalStatusName: string;
  citizenshipName: string;
  email?: string;
}
