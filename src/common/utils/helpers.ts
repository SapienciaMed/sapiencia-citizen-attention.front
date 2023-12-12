import moment from "moment-timezone";

export type inputMode = "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined;

const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const toLocaleDate = (date: string | Date, isMoment = false): Date => {
  let parseDate = date;
  if (typeof date == "string") {
    date = date.length > 10 ? date.substring(0, 10) : date;
    let currentDate = date.split("-")?.map((part) => parseInt(part));
    parseDate = new Date(currentDate[0], currentDate[1] - 1, currentDate[2]);
  } else {
    parseDate = parseDate as Date;
  }

  let localeDate = isMoment
    ? moment(parseDate).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).toDate()
    : parseDate;

  return localeDate;
};

const splitUrl = (url: string) => {
  const split = url.split("/");
  const urlSplit = split.slice(0, -1);
  const fileName = urlSplit.pop();
  const namepath = `${urlSplit[0]}/${urlSplit[1]}/${fileName}`;

  return { fileName, namepath };
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

export { toLocaleDate, allMonths, capitalize, emailPattern, splitUrl };
