import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Page from "../../components/Page";
import { OpenInNew, MoreVert, Add, Settings, HighlightOff, Search, Delete } from '@material-ui/icons';
import { Box, Button, Paper, IconButton, InputBase, Checkbox,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
    } from "@material-ui/core";
import DropdownSelect, { SelectOption } from '../../components/DropdownSelect';
import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../../shared/colors";
import fetchOrders from "../../api/fetchOrders";
import deleteOrder from "../../api/deleteOrder";
import { OrderType } from "../../types";

const useStyles = makeStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${colors.brandLightGray}`,
        marginRight: 16,
    },
    headerLeft: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    headerRight: {
        width: 125,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    headerRightInner: {
        display: "flex",
        width: 100,
        justifyContent: "space-between"
    },
    headerItem: {
        width: 200,
        margin: 15,
    },
    paperInput: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 200,
        height: 32,
        marginRight: 15,
        marginLeft: 15,
    },
    input: {
        marginLeft: 8,
        flex: 1,
        paddingTop: 3,
        color: 'black'
    },
    inputIcon: {
        padding: 10,
    },
    buttonIcon: {
        paddingRight: 10,
    },
    table: {
        marginRight: 16,
    }
});

type checkState = {
    orderId: number,
    checked: boolean
}


export default function Home(){
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [orderList, setOrderList] = useState<HTMLElement[]>([]);
    // set up initial drop down lists
    const [customerList, setCustomerList] = useState<SelectOption[]>([]);
    const [orderTypeList, setOrderTypeList] = useState<SelectOption[]>([]);
    // search fields
    const [searchOrderId, setSearchOrderId] = useState<string | undefined>("")
    const [searchCustomer, setSearchCustomer] = useState<SelectOption | undefined>(undefined);
    const [searchOrderType, setSearchOrderType] = useState<SelectOption | undefined>(undefined);

    // orders to delete
    const [checkbox, setCheckbox] = useState<checkState[]>([]); // controlled checkbox state
    const classes = useStyles();

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = () => {
        fetchOrders().then(result => {
            let orderListArr : HTMLElement[] = result.map((order: OrderType) => {
                return makeRow(order);
            });
            setOrderList(orderListArr);
            // TODO: refactor, too much pattern here.
            let cache : string[] = [];
            let customersArrFiltered : OrderType[] = result.filter((order: OrderType) => {
                let customerName : string = order.customerName;
                let CustomerName : string = customerName.slice(0, 1).toUpperCase() + customerName.slice(1).toLowerCase();
   
                if(!cache.includes(CustomerName)) {
                    cache.push(CustomerName);
                    return true;
                } else {
                    return false;
                }
            });

            let customersArr : SelectOption[] = customersArrFiltered.map((order: OrderType) => {
                return { label: order.customerName, value: order.customerName }
            });

            let orderTypeArrFiltered : OrderType[] = result.filter((order: OrderType) => {
                let orderType : string = order.orderType;
                let OrderType : string = orderType.slice(0, 1).toUpperCase() + orderType.slice(1).toLowerCase();
   
                if(!cache.includes(OrderType)) {
                    cache.push(OrderType);
                    return true;
                } else {
                    return false;
                }
            });
            
            let orderTypeArr : SelectOption[] = orderTypeArrFiltered.map((order: OrderType) => {
                return { label: order.orderType, value: order.orderType };
            });

            setOrderTypeList(orderTypeArr);
            setCustomerList(customersArr);
            setOrders(result);
        }).catch(error => {
            console.log(error);
        });
    }

    // {
    //     "orderId": 13,
    //     "orderType": "SaleOrder",
    //     "customerName": "RED",
    //     "createdDate": "Sunday, 02 January 2022",
    //     "createdByUserName": "Jake Jones"
    // }

    const handleClickDeleteOrder = (event: React.MouseEvent<HTMLButtonElement>) => {
        let orderId : number = Number(event.currentTarget.value);
        deleteOrder([orderId]).then(result => {
            fetchAllOrders();
        });
    }

    const handleIconButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        // there's two parts to handle the checked, the value from the IconButton
        // and the checked value from the Checkbox
        let orderId : number = Number(event.currentTarget.value);
        let input = event.target as HTMLInputElement;
        let checked = input.checked;
        let checkedState : checkState = {
            orderId,
            checked
        }

        setCheckbox((prevState : checkState[]) => {
            if(!prevState.find(element => element.orderId === checkedState.orderId)) {
                prevState.push(checkedState);
                return prevState;
            }

            let updatedChecked = prevState.map(item => {
                if(item.orderId === checkedState.orderId) {
                    item.checked = checkedState.checked;
                }
                return item;
            });

            return updatedChecked;
        });
    }  

    // all the calls use this to make the results table
    const makeRow = (order: OrderType) => {
        return (
            <TableRow>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.createdDate}</TableCell>
                <TableCell>{order.createdByUserName}</TableCell>
                <TableCell>{order.orderType}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                    <IconButton
                        onClick={handleClickDeleteOrder}
                        value={order.orderId}
                    >
                        <HighlightOff />
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <IconButton
                        onClick={handleIconButton}
                        value={order.orderId}
                    >
                        <Checkbox 
                            value={3}
                        />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }

    const resetRows = () => {
        let allOrders = orders.map((order: OrderType) => {
            let node = makeRow(order) as any;
            return node as HTMLElement;
        });
        setOrderList(allOrders);
        setSearchOrderType(undefined);
        setSearchCustomer(undefined);
    }

    const customerSelect = (value: SelectOption | undefined) => {
        if(!value) {
            resetRows();
            return;
        }

        let newCustomerList : OrderType[] = orders.filter((order: OrderType) => {
            let customerName = order.customerName[0].toUpperCase() + order.customerName.slice(1).toLowerCase();
            return value && customerName === value.label;
        });
        
        let customerOrderList = newCustomerList.map((order: OrderType) => {
            let node = makeRow(order) as any;
            return node as HTMLElement;
        })

        setOrderList(customerOrderList);
        setSearchCustomer(value);
        // sets the value of the other search fields to be cleared
        if(searchOrderType) {
            setSearchOrderType({ label: "", value: "" });
        }
    }

    const orderTypeSelect = (value: SelectOption | undefined) => {
        if(!value) {
            resetRows();
            return;
        }

        let newOrderTypeList : OrderType[] = orders.filter((order: OrderType) => {
            let orderType = order.orderType
            return value && orderType === value.label;
        });
        
        let orderTypeList = newOrderTypeList.map((order: OrderType) => {
            let node = makeRow(order) as any;
            return node as HTMLElement;
        });

        setOrderList(orderTypeList);
        setSearchOrderType(value);
        // sets the value of the other search fields to be cleared
        if(searchCustomer) {
            setSearchCustomer({ label: "", value: "" });
        }
    }

    const handleSearchOrderId = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value === "") {
            resetRows();
        }
        setSearchOrderId(event.target.value);
    }

    const searchOrderById = () => {
        if(!searchOrderId || searchOrderId.length === 0 || isNaN(Number(searchOrderId))) {
            return;
        }

        let newOrderIdList : OrderType[] = orders.filter((order: OrderType) => {
            let orderId = Number(searchOrderId);
            return order.orderId === orderId;
        });

        let orderIdList = newOrderIdList.map((order: OrderType) => {
            let node = makeRow(order) as any;
            return node as HTMLElement;
        });

        setOrderList(orderIdList);
    }

    const deleteMultOrders = () => {
        let itemsDelete : number[] = [];
        for(let item of checkbox) {
            if(item.checked) {
                itemsDelete.push(item.orderId);
            }
        }

        deleteOrder(itemsDelete).then(result => {
            fetchAllOrders();
        });

        setCheckbox((prevState : checkState[]) => {
            let newState = prevState.map(item => {
                if(item.checked) {
                    item.checked = false;
                }
                return item;
            });
            return newState;
        })
    }

    return <Page headerTitle={"Home"}>
        <>
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <Paper component="form" className={classes.paperInput}>
                        <InputBase
                            placeholder="Search By Order Id"
                            inputProps={{ 'aria-label': 'Search Order Id' }}
                            className={classes.input}
                            onChange={handleSearchOrderId}
                            value={searchOrderId}
                        />
                        <IconButton 
                            aria-label="search"
                            className={classes.inputIcon}
                            onClick={searchOrderById}
                        >
                            <Search />
                        </IconButton>
                    </Paper>
                    <Link to="/createorder">
                        <Button color="primary" variant="contained">
                            <Add className={classes.buttonIcon} />
                            Create Order
                        </Button>
                    </Link>
                    <div className={classes.headerItem}>
                        <DropdownSelect
                            options={customerList}
                            placeholder='Customer'
                            onSelectOption={(value : SelectOption | undefined) => {
                                customerSelect(value);
                            }}
                            value={searchCustomer}
                        />
                    </div>
                    <div className={classes.headerItem}>
                        <DropdownSelect
                            options={orderTypeList}
                            placeholder='Order Type'
                            onSelectOption={(value: SelectOption | undefined) => {
                                orderTypeSelect(value);
                            }}
                            value={searchOrderType}
                        />
                    </div>
                </div>

                <div className={classes.headerRight}>
                    <div className={classes.headerRightInner}>
                        <Settings />
                        <OpenInNew />
                        <MoreVert />
                    </div>
                </div>
            </div>
            <Box className={classes.table}>   
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order Id</TableCell>
                                <TableCell>Creation Date</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Order Type</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>&nbsp;</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={deleteMultOrders}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody id='tableBody'>
                            {orderList}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    </Page>
}