const key : string = process.env.REACT_APP_API_KEY || "";
const createOrder = async (data: object) => {
    await fetch("https://red-candidate-web.azurewebsites.net/api/Orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ApiKey": key
        }, 
        body: JSON.stringify(data)
    }).catch(error => {
        console.log(error);
    });
}

export default createOrder;
// expected shape of data sent in body
// {
//     "orderId": 0,
//     "orderType": "string",
//     "customerName": "string",
//     "createdDate": "string",
//     "createdByUserName": "string"
//   }