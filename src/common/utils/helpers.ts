import moment from "moment-timezone";

const toLocaleDate = (date:string|Date, isMoment = false) : Date => {
  let parseDate = date;
  if (typeof date == "string") {
    date = date.length > 10 ? date.substring(0, 10) : date;
    let currentDate = date.split("-")?.map((part) => parseInt(part));
    parseDate = new Date(currentDate[0], currentDate[1] - 1, currentDate[2]);
  }else{
    parseDate = parseDate as Date
  }

  let localeDate = isMoment
    ? moment(parseDate).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).toDate()
    : parseDate;

  return localeDate;
};

/**
 * get all months in an array per language
 *
 * @param lang lang for months
 * @returns string[] array of months
 */
const allMonths = (lang: string = "es-CO"): string[] => {
  return Array.from({ length: 12 }, (item, i) => {
    return new Date(0, i).toLocaleString(lang, { month: "long" });
  });
};

/**
 * Capitalize text
 *
 * @param str text to capitalize format
 * @returns string
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export { toLocaleDate, allMonths, capitalize };
