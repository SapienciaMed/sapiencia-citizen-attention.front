import moment from "moment-timezone";

const toLocaleDate = (date: string, isMoment = false) => {
  date = date.length > 10 ? date.substring(0, 10) : date;
  let currentDate = date.split("-").map((part) => parseInt(part));
  console.log(currentDate);

  let parseDate = new Date(currentDate[0], currentDate[1] - 1, currentDate[2]);
  let localeDate = isMoment
    ? moment(parseDate).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).toDate()
    : parseDate;

  return localeDate;
};

const allMonths = Array.from({ length: 12 }, (item, i) => {
  return new Date(0, i).toLocaleString("es-CO", { month: "long" });
});

export { toLocaleDate, allMonths };
