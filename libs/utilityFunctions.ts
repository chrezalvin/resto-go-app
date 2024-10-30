/**
 * turns date into string form with format DD MMM YYY, HH:MM
 * ex: 20 Des 2023, 09:42
 * @param date the date to be converted
 * @returns the formatted string
 */
export function convertDateToString(date: Date){
    const monthLookup = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const day = date.getDate();
    const month = monthLookup[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${day} ${month} ${year}, ${hour < 10 ? `0${hour}`: hour}:${minute < 10 ? `0${minute}`: minute}`;
}