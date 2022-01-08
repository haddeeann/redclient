const key : string = process.env.REACT_APP_API_KEY || "";
const deleteOrder = async (idArr: number[]) => {
    await fetch("https://red-candidate-web.azurewebsites.net/api/Orders/delete", {
        method: "DELETE",
        headers: {
            "ApiKey": key
        },
        body: JSON.stringify(idArr)
    }).catch(error => {
        console.log(error);
    });
}

export default deleteOrder;