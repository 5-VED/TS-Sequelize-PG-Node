/**************************************
 *  Purpose: Date Time Utilities      *
 *  NOTE: Based on MOMENTJS           *
 **************************************/

import Moment from 'moment-timezone';

/**
 * 1. Return Current DateTime
 * @param {string} format - Format to return.
 * @param {boolean} isUTC - If need UTC or Server's local time.
 * @param {string} timeZone - Convert Date Time as per Time zone provided.
 * @returns {string}
 */
export async function getCurrentDateTime(format: string, isUTC: boolean, timeZone: string) {
    if (!format) format = '';
    let resultDate = isUTC ? Moment().utc().format(format) : Moment().format(format);
    if (timeZone != '') resultDate = await transformDateToTimezone(resultDate, timeZone, format);
    return resultDate;
}

/**
 * 2. Return DateTime after addition or subtraction
 * @param {string} dateTime - DateTime/Date/Time.
 * @param {string} format - Format to return.
 * @param {string} operation - add/subtract.
 * @param {string} operateOn - year/month/day/hour/min.
 * @param {number} value - Value to increament/decreament.
 * @returns {string}
 */
export async function operateDateTime(dateTime: Moment.MomentInput, format: string, operation: string, value: Moment.DurationInputArg1, operateOn: Moment.DurationInputArg2) {
    if (operation == 'add') return Moment(dateTime).add(value, operateOn).format(format);
    else return Moment(dateTime).subtract(value, operateOn).format(format);
}

/**
 * 3. Return Value after converting to Specified Format
 * @param {string} dateTime - DateTime/Date/Time.
 * @param {string} toFormat - Format to return.
 * @param {string} fromFormat - Transformation from format.
 * @returns {string}
 */
export async function transformDate(dateTime: Moment.MomentInput, toFormat: string, fromFormat: string, isUTC = false) {
    if (!toFormat) toFormat = 'DD-MM-YYYY';
    if (!dateTime || dateTime == '') dateTime = await getCurrentDateTime('', false, '');
    return isUTC ? Moment(dateTime, fromFormat).utc().format(toFormat) : Moment(dateTime, fromFormat).format(toFormat);
}

/**
 * 4. Return Value to Specified Time Zone
 * @param {string} dateTime - DateTime/Date/Time.
 * @param {string} timezone - to transform date as per Time Zone provided.
 * @param {string} format - Format to return.
 * @returns {string}
 */
export async function transformDateToTimezone(dateTime: Moment.MomentInput, timezone: string, format: string) {
    if (!timezone) timezone = 'Pacific/Auckland';
    return Moment(dateTime).tz(timezone).format(format);
}

/**
 * 5. Return Difference between Datetimes provided in a specified format
 * @param {string} startDateTime - DateTime/Date/Time.
 * @param {string} endDateTime - DateTime/Date/Time.
 * @param {string} differenceType - years/months/weeks/days/hours/minutes/seconds.
 * @param {string} providedFormat - Format of startDateTime & endDateTime.
 * @returns {number}
 */
export async function timeDifference(startDateTime: Moment.MomentInput, endDateTime: Moment.MomentInput, differenceType: Moment.DurationInputArg2, providedFormat: string) {
    if (!differenceType) {
        differenceType = 'days';
    }
    return Moment(endDateTime, providedFormat).diff(Moment(startDateTime, providedFormat), differenceType);
}

/**
 * 6. Returns If Date is Valid or Invalid
 * @param {string} dateTime - DateTime/Date/Time.
 * @returns {boolean}
 */
export async function isStandardDateTime(dateTime: string) {
    return Moment(dateTime).isValid();
}

/**
 * 7. Returns Datetime to Milliseconds
 * @param {string} dateTime - DateTime/Date/Time.
 * @returns {number}
 */
export async function toMilliseconds(dateTime: string): Promise<number> {
    function reduceFunction(prev: string, curr: string, i: number) {
        const result = parseFloat(prev) + parseFloat(curr) * Math.pow(60, i);
        return result.toString();
    }
    return +dateTime.split(':').reverse().reduce(reduceFunction, '0');
}

/**
 * 8. Returns Provided Seconds to Specified Format
 * @param {string} seconds - Seconds.
 * @param {string} format - Format to return.
 * @returns {string}
 */
export async function transformSeconds(seconds: number): Promise<string> {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    let hourString = hours.toString();
    let minuteString = minutes.toString();

    if (hours < 10) {
        hourString = '0' + hours.toString();
    }
    if (minutes < 10) {
        minuteString = '0' + minutes.toString();
    }
    return hourString + ':' + minuteString;
}

/**
 * 9. Returns Date isBefore/isAfter
 * @param {string} firstDate - Date to Compare.
 * @param {string} secondDate - Date to compare with.
 * @param {string} queryType - Comparison Type i.e. isBefore/isSame/isAfter/isSameOrBefore/isSameOrAfter.
 * @param {string} compareType - Comparison Type i.e. day/month/year.
 * @param {boolean} isSame - To include Second date in Equality.
 * @returns {boolean}
 */
export async function compareDateTime(firstDate: Moment.MomentInput, secondDate: Moment.MomentInput, queryType: string, compareType: Moment.DurationInputArg2) {
    if (queryType == 'isBefore') return Moment(firstDate).isBefore(secondDate, compareType);
    else if (queryType == 'isSame') return Moment(firstDate).isSame(secondDate, compareType);
    else if (queryType == 'isAfter') return Moment(firstDate).isAfter(secondDate, compareType);
    else if (queryType == 'isSameOrBefore') return Moment(firstDate).isSameOrBefore(secondDate, compareType);
    else if (queryType == 'isSameOrAfter') return Moment(firstDate).isSameOrAfter(secondDate, compareType);
}

/**
 * 10. Returns Day of the Week in Number
 * 0= Sunday, ..., 6= Saturday
 * @param {string} date - Date.
 * @param {string} format - Date Format.
 * @returns {number}
 */
export async function getWeekDay(date: string, format = '') {
    return Moment(date, format).day();
}

/**
 * 11. Return Current DateTime
 * @param {string} format - Format to return.
 * @param {boolean} isUTC - If need UTC or Server's local time.
 * @param {string} timeZone - Convert Date Time as per Time zone provided.
 * @returns {string}
 */
export async function getCurrentDateTimeHome(formats: string, timeZone: string) {
    if (!formats) formats = '';
    const resultDate = Moment().tz(timeZone).format(formats);
    return resultDate;
}

/**
 * 12/ Return number of hours (to two decimal places)
 * @param {string} timecode - timecode of the forms 'hh:mm' or 'hh:mm:ss'
 * @returns {number}
 */

export async function convertTimecodeToHours(timecode: string): Promise<number> {
    if (!checkForZeroTime(timecode)) {
        const a = timecode.split(':');
        let hours = +a[0] + +a[1] / 60 + (a.length == 3 ? +a[2] / 3600 : 0);
        hours = +hours.toFixed(2);
        return hours;
    } else {
        return 0;
    }
}

export function checkForZeroTime(time: Date | string | undefined): boolean {
    return !time || time == undefined || time == null || time == '00:00:00' || time == '00:00' || time == '0:0:00' || time == '0' || time == '00:00:0';
}

export function formatTimeToString(time: Date, format: string): string {
    if (format == 'HHmm') return ('0' + time.getHours()).slice(-2) + ('0' + time.getMinutes()).slice(-2);
    if (format == 'HH:mm') return ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2);
    return '';
}

export async function getWeekStartEnd(weekNumber: number, format: string): Promise<object> {
    if (!weekNumber) weekNumber = 0;
    if (!format) format = '';
    let toProcessDay = 0;
    if (weekNumber) {
        toProcessDay = weekNumber * 7;
    }
    const dateToCheck = await operateDateTime(Moment(), '', 'add', toProcessDay, 'day');
    return { startDate: Moment(dateToCheck).startOf('week').format(format), endDate: Moment(dateToCheck).endOf('week').format(format) };
}

export async function transformToISO(dateTime: Moment.MomentInput, fromFormat: string) {
    return Moment(dateTime, fromFormat).format();
}

export function isDateInRange(inp: Date, start: Date, end: Date): boolean {
    return inp.getTime() >= start.getTime() && inp.getTime() <= end.getTime();
}

export function getCurrentYear(): number {
    return Moment().year();
}

export function getCurrentMonth(): number {
    return new Date().getMonth();
}

export function getSubtractYear(noOfYear: number): number {
    return Moment(new Date()).subtract(noOfYear, 'year').year();
}

export function isValidDate(dateString: string): Boolean {
    return Moment(dateString, 'YYYY-MM-DD', true).isValid();
}
