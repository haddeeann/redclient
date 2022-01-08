import dayjs from "dayjs";

const createDate = () : string => {
    let dateBuild : string = "";
    const daysArr : string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const monthsArr : string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
    const today = dayjs().day(); // gets day in number format
    dateBuild += `${daysArr[today]}, `;

    const date = dayjs().date().toString();  // gets number day of month
    dateBuild += `${date} `;

    const month = dayjs().month(); // gets month in number format
    dateBuild += `${monthsArr[month]} `;

    const year = dayjs().year().toString();
    dateBuild += year;
    return dateBuild;
}

export default createDate;