const key : string = process.env.REACT_APP_API_KEY || "";
const nextOrderId = async () => {
    const orders = await fetch("https://red-candidate-web.azurewebsites.net/api/Orders", {
        method: "GET",
        headers: {
            "ApiKey": key
        }
    }).then((response) => {
        return response.json();
    }).then(result => {
        let bigOrderId = 0;
        for(let order of result) {
            if(order.orderId > bigOrderId) {
                bigOrderId = order.orderId;
            }
        }
        return bigOrderId ? ++bigOrderId : 0;
    }).catch(error => {
        console.log(error);
    });

    return orders;
}

export default nextOrderId;

// expected shape of data returned is an array of these objects
// {
//     "orderId": 13,
//     "orderType": "SaleOrder",
//     "customerName": "RED",
//     "createdDate": "Sunday, 02 January 2022",
//     "createdByUserName": "Jake Jones"
// }
