import moment from "moment-timezone";

export default function toLocaleDate(date) {
    let localeDate = moment(date).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).toDate();
    return localeDate;
}