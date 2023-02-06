export class DateUtils {
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthString = month > 9 ? month.toString() : '0' + month;
    const day = date.getDate();
    const dayString = day > 9 ? day : '0' + day;
    return `${year}-${monthString}-${dayString}`;
  }
}
