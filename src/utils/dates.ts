import julian from 'julian';

const J2000_EPOCH = 2451545;
const JULIAN_CENTURY_IN_DAYS = 36525;

/**
 * Converts a date in the Gregorian calendar to a Julian day in J2000 format.
 * https://thecynster.home.blog/2019/11/08/calculating-the-julian-date-and-j2000/
 */
export const dateToJ2000 = (date: Date) => {
    return Math.floor(julian(date)) - J2000_EPOCH;
};

 export const centuriesFromJ2000 = (date: number) => {
    return date / JULIAN_CENTURY_IN_DAYS;
};