const key : string = process.env.REACT_APP_API_KEY || "";
const fetchOrders = async () => {
    const orders = await fetch("https://red-candidate-web.azurewebsites.net/api/Orders", {
        method: "GET",
        headers: {
            "ApiKey": key
        }
    }).then((response) => {
        return response.json();
    }).then(result => {
        return result;
    }).catch(error => {
        console.log(error);
    });

    return orders;
}

export default fetchOrders;

// expected shape of data returned
// {
//     "orderId": 13,
//     "orderType": "SaleOrder",
//     "customerName": "RED",
//     "createdDate": "Sunday, 02 January 2022",
//     "createdByUserName": "Jake Jones"
// }
