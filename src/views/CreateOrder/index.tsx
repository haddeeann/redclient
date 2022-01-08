import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import { Link } from "react-router-dom";
import { Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../../shared/colors";
import createDate from "../../shared/createDate";
import nextOrderId from "../../api/nextOrderId";
import { OrderType } from "../../types";
import createOrder from "../../api/createOrder";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles({
    form: {
        border: `2px solid ${colors.brandLightGray}`,
        borderRadius: 5,
        padding: 35,
        display: "flex",
        flexDirection: "column",
        marginBottom: 25,
        alignItems: "center",
        minHeight: "50vh",
        justifyContent: "space-between",
    },
    submitOrderForm: {
        marginTop: 25,
        display: "flex",
        justifyContent: "center",
    },
    standardPrimary: {
        width: "75%",
    }
});

export default function CreateOrder(props : any) {
    const [createdBy, setCreatedBy] = useState<string>("");
    const [orderType, setOrderType] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [orderId, setOrderId] = useState<number>(0);
    const [todaysDate, setTodaysDate] = useState<string>("");
    let navigate = useNavigate();

    const classes = useStyles();
    useEffect(() => {
        // Thursday, 30 December 2021
        let today : string = createDate();
        setTodaysDate(today);
        nextOrderId().then((orderId) => {
            orderId ? setOrderId(orderId) : setOrderId(0);
        }).catch(error => {
            console.log("error obtaining order id");
        });
    }, []);

    const submitOrderForm = () => {
        // expected shape of data sent in body
        // {
        //     "orderId": 0,
        //     "orderType": "string",
        //     "customerName": "string",
        //     "createdDate": "string",
        //     "createdByUserName": "string"
        //   }
        let newOrder : OrderType = {
            orderId: orderId,
            orderType: orderType,
            customerName: customerName,
            createdDate: todaysDate,
            createdByUserName: createdBy
        }

        createOrder(newOrder);
        navigate("/");
    }

    const handleCreatedByChange =(event: React.ChangeEvent<HTMLInputElement>) => {
        setCreatedBy(event.target.value);
    }

    const handleOrderTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrderType(event.target.value);
    }

    const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerName(event.target.value);
    }

    return (
        <Page headerTitle="Create Order">
            <>
                <Typography variant="h5">Today's Date: {todaysDate}</Typography>
                <Typography variant="h5">Order Id: {orderId}</Typography>
                <form className={classes.form} >
                    <TextField 
                        className={classes.standardPrimary} 
                        label="created by" 
                        color="primary" 
                        onChange={handleCreatedByChange}
                        value={createdBy}
                    />
                    <TextField 
                        className={classes.standardPrimary} 
                        label="order type" 
                        color="primary" 
                        onChange={handleOrderTypeChange}
                        value={orderType}
                    />
                    <TextField 
                        className={classes.standardPrimary} 
                        label="customer name" 
                        color="primary" 
                        onChange={handleCustomerNameChange}
                        value={customerName}
                    />
                    <div className={classes.submitOrderForm} >
                        <Button color="primary" variant="contained" onClick={submitOrderForm}>
                            Create New Order
                        </Button>
                    </div>
                </form>
                <Link to="/">
                    <Button color="primary" variant="contained">
                        Return to Home Page
                    </Button>
                </Link>
            </>
        </Page>
    );
}