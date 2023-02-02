import {AbstractControl, ValidationErrors} from "@angular/forms";

export class MobilePhoneNumberValidator {
  private static readonly TOWN_CODES = [
    "162",
    "212",
    "232",
    "163",
    "2131",
    "2344",
    "1643",
    "2153",
    "2336",
    "1646",
    "2151",
    "2330",
    "1644",
    "2156",
    "2333",
    "1641",
    "2139",
    "2354",
    "1652",
    "2157",
    "2353",
    "1645",
    "2137",
    "2334",
    "1631",
    "2132",
    "2345",
    "1642",
    "2138",
    "2337",
    "1647",
    "2152",
    "2356",
    "1633",
    "214",
    "2347",
    "1651",
    "216",
    "236",
    "165",
    "214",
    "2355",
    "1632",
    "2155",
    "2357",
    "1655",
    "2159",
    "2350",
    "2135",
    "2340",
    "2136",
    "2339",
    "2158",
    "2342",
    "2133",
    "2346",
    "2154",
    "2332",
    "2130",
    "152",
    "17",
    "222",
    "1511",
    "17",
    "2232",
    "1512",
    "1715",
    "225",
    "1594",
    "177",
    "2231",
    "1563",
    "1771",
    "2230",
    "1564",
    "1772",
    "2233",
    "1595",
    "1716",
    "2248",
    "1596",
    "1775",
    "2237",
    "154",
    "1793",
    "2244",
    "1515",
    "1719",
    "2236",
    "1597",
    "1796",
    "2245",
    "1591",
    "1774",
    "2238",
    "1593",
    "1794",
    "2241",
    "1513",
    "1713",
    "2234",
    "1562",
    "176",
    "1767",
    "2240",
    "1592",
    "1797",
    "2235",
    "1514",
    "1770",
    "2246",
    "1795",
    "2247",
    "1776",
    "2242",
    "174",
    "2243",
    "1792",
    "2239",
    "1717",
    "1718",
    "1714"
  ];

  static isValid(control: AbstractControl): ValidationErrors | null {
    const value: string | null = control.value;
    if (!value || value.length !== 9) {
      return {length: true};
    }
    if (!MobilePhoneNumberValidator.isValidCode(value)) {
      return {code: true};
    }
    return null;
  }

  static isValidHome(control: AbstractControl): ValidationErrors | null {
    const text: string | null = control.value;
    if (!text || text.length !== 9) {
      return {length: true};
    }
    return MobilePhoneNumberValidator.TOWN_CODES.some(code => text.startsWith(code)) ? null : {format: true};
  }

  private static isValidCode(value: string) {
    const code = Number(value.slice(0, 2));
    const limitationsFor29 = [1, 2, 3, 5, 6, 7, 8, 9];
    const validCodes = [25, 29, 33, 44];
    if (!validCodes.some(it => it === code)) {
      return false;
    }
    return code !== 29 || limitationsFor29.some(limit => limit === Number(value[2]));
  }
}
