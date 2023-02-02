import {AbstractControl, ValidationErrors} from "@angular/forms";

export class PassportIdValidator {
  static isValid(control: AbstractControl): ValidationErrors | null {
    const value: string | null = control.value;
    if (!value || value.length != 14) {
      return {length: true};
    }
    if (!PassportIdValidator.isValidDateOfBirth(value)) {
      return {dob: true};
    }
    if (!PassportIdValidator.isValidCitizenShip(value)) {
      return {citizenship: true};
    }
    return null;
  }

  private static isValidCitizenShip(passportId: string) {
    const citizenshipCode = passportId.slice(11, 13);
    const validCodes = ['PB', 'BA', 'BI'];
    return validCodes.some(code => code === citizenshipCode);
  }


  private static isValidDateOfBirth(passportId: string) {
    const centuryToYears = new Map([
      [1, 1800],
      [2, 1800],
      [3, 1900],
      [4, 1900],
      [5, 2000],
      [6, 2000],
    ]);
    const centuryYears = centuryToYears.get(Number(passportId[0]))!!;
    const day = Number(passportId.slice(1, 3))!!;
    const month = Number(passportId.slice(3, 5))!! - 1;
    const year = Number(passportId.slice(5, 7))!! + centuryYears;
    return PassportIdValidator.isValidDate(day, month, year);
  }

  private static isValidDate(d: number, m: number, y: number): boolean {
    return m >= 0 && m < 12 && d > 0 && d <= PassportIdValidator.daysInMonth(m, y);
  }

  private static daysInMonth(m: number, y: number): number {
    switch (m) {
      case 1 :
        return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
      case 8 :
      case 3 :
      case 5 :
      case 10 :
        return 30;
      default :
        return 31
    }
  }
}
