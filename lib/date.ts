import dayjs from 'dayjs';

require('dayjs/locale/ja');

export class DateObject implements IDateObject {
  private value: dayjs.Dayjs;
  private constructor(
    date: string,
    format?: string,
    locale?: string,
    strict?: boolean
  ) {
    this.value = dayjs(date, format, locale, strict);
  }

  public static create(
    date: string,
    format?: string,
    locale?: string,
    strict?: boolean
  ): DateObject {
    return new DateObject(date, format, locale, strict);
  }

  /**
   * This returns a boolean indicating whether this object contains a valid date or not.
   */
  public isValid(): boolean {
    return this.value.isValid();
  }

  /**
   * Get the year.
   */
  public year(): number {
    return this.value.year();
  }

  /**
   * This indicates whether the Day.js object is before the other supplied date-time.
   * @param date - date for comparison.
   */
  public isBefore(date: DateObject): boolean {
    return this.value.isBefore(date.value);
  }

  /**
   * This indicates whether the Day.js object is after the other supplied date-time.
   * @param date - date for comparison.
   */
  public isAfter(date: DateObject): boolean {
    return this.value.isAfter(date.value);
  }

  /**
   * This indicates whether the Day.js object is the same as the other supplied date-time.
   * @param date - date for comparison.
   */
  public isSame(date: DateObject): boolean {
    return this.value.isSame(date.value);
  }

  /**
   * To format as an ISO 8601 string.
   */
  public toISOString(): string {
    return this.value.toISOString();
  }
}

export interface IDateObject {
  isValid(): boolean;
  isBefore(date: DateObject): boolean;
  isAfter(date: DateObject): boolean;
  isSame(date: DateObject): boolean;
  year(): number;
  toISOString(): string;
}
