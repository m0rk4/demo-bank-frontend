import { FormControl } from "@angular/forms";
import { asyncScheduler } from "rxjs";

export class FormUtils {
  static scheduleElementFocus(elementId: string, control: FormControl<unknown>): void {
    asyncScheduler.schedule(() => {
      document.getElementById(elementId)?.focus();
      control.markAsPristine();
    });
  }
}
