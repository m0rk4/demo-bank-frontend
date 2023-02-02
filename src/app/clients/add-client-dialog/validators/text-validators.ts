import {AbstractControl, ValidationErrors} from "@angular/forms";

export class TextValidators {

  static notBlank(control: AbstractControl): ValidationErrors | null {
    const text: string | null = control.value;
    if (!text || text.trim().length === 0) {
      return {blank: true};
    }
    return null;
  }
}
