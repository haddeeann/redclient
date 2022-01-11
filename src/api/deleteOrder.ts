const key : string = process.env.REACT_APP_API_KEY || "";
const deleteOrder = async (idArr: number[]) => {
    console.log(idArr);
    await fetch("https://red-candidate-web.azurewebsites.net/api/Orders/delete", {
        method: "POST",
        headers: {
            "ApiKey": key,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idArr)
    }).then(result => {
        // console.log(result);
    }).catch(error => {
        console.log(error);
    });
}

export default deleteOrder;