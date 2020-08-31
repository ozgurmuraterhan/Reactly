import React, { Component, forwardRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import MaterialTable, { MTableToolbar } from "material-table";
import { useTranslation } from "react-i18next";
import Moment from "moment";

import { Doughnut } from "react-chartjs-2";

import {
    DialogActions,
    DialogContent,
    Button,
    Dialog,
    Card,
    Tooltip,
    Grid,
    Typography,
} from "@material-ui/core";

import {
    Settings,
    Edit,
    GroupAdd,
    AddBox,
    ArrowUpward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    FilterList,
    FirstPage,
    LastPage,
    Remove,
    SaveAlt,
    Search,
    ViewColumn,
    Receipt,
} from "@material-ui/icons";

import "../../assets/css/style.css";

export default function InvoicesList(props) {
    const [t] = useTranslation();
    const history = useHistory();
    const pieColors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#cc65fe",
        "#445ce2",
        "#e244b1",
        "#0c3836",
        "#51e4b5",
        "#ff0000",
        "#6eff00",
        "#00ffe7",
        "#28a743",
        "#ff00c8",
        "#063361",
        "#1f77b4",
        "#e377c2",
        "#ff7f0e",
        "#2ca02c",
        "#bcbd22",
        "#d62728",
        "#17becf",
        "#9467bd",
        "#7f7f7f",
        "#8c564b",
        "#3366cc",
    ];
    const customergroups_label = [{ title: t("groupName"), field: "name" }];
    const [state, seTstate] = useState({});
    const [open, seTopen] = useState(false);
    const [customergroups, seTcustomergroups] = useState([]);
    const [data, seTdata] = useState([]);
    const [payments, seTpayments] = useState([]);
    const [payment_id, seTpayment_id] = useState(0);

    const payments_label = [
        { title: t("Amount"), field: "amount" },
        {
            title: t("Paid Date"),
            field: "paid_date",
            render: (rowData) => {
                return (
                    <div>
                        {Moment(rowData.paid_date).format("DD/MM/YYYY HH:MM")}
                    </div>
                );
            },
        },
    ];
    const columns = [
        {
            title: t("no"),
            field: "no",
        },
        {
            title: t("customer"),
            field: "created_user.name",
        },
        {
            title: t("Billing Date"),
            field: "created",
            render: (rowData) => {
                return (
                    <div>{Moment(rowData.due_date).format("DD/MM/YYYY")}</div>
                );
            },
        },
        {
            title: t("Due Date"),
            field: "due_date",
            render: (rowData) => {
                return (
                    <div>{Moment(rowData.due_date).format("DD/MM/YYYY")}</div>
                );
            },
        },
        {
            title: t("Add Payments"),
            render: (rowData) => {
                return (
                    <div onClick={() => getPaymentsData(rowData._id)}>
                        Add Payments
                    </div>
                );
            },
        },

        {
            title: t("Status"),
            render: (rowData) => {
                if (rowData.payments.length > 0) {
                    let payment_amount = 0;
                    for (const i in rowData.payments) {
                        payment_amount =
                            parseFloat(payment_amount) +
                            parseFloat(rowData.payments[i].amount);
                    }

                    let duadate = Date.parse(rowData.due_date);
                    let nowdate = parseFloat(Date.now());

                    if (rowData.total == payment_amount) {
                        return (
                            <span className="invoice_paid">{t("PAID")}</span>
                        );
                    } else if (
                        rowData.total > payment_amount &&
                        duadate < nowdate
                    ) {
                        return (
                            <span className="invoice_unpaid">
                                {t("UNPAID")}
                            </span>
                        );
                    } else if (rowData.total > payment_amount > 0) {
                        return (
                            <span className="invoice_partical">
                                {t("PARTICAL")}
                            </span>
                        );
                    }
                }
            },
        },

        {
            title: t("actions"),
            field: "_id",
            render: (rowData) => (
                <div>
                    <Link to={`/invoices/edit/${rowData._id}`}>
                        <Edit />
                    </Link>
                </div>
            ),
        },
    ];

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => (
            <DeleteOutline {...props} ref={ref} />
        )),
        DetailPanel: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref} />
        )),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => (
            <FirstPage {...props} ref={ref} />
        )),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref} />
        )),
        PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft {...props} ref={ref} />
        )),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => (
            <ArrowUpward {...props} ref={ref} />
        )),
        ThirdStateCheck: forwardRef((props, ref) => (
            <Remove {...props} ref={ref} />
        )),
        ViewColumn: forwardRef((props, ref) => (
            <ViewColumn {...props} ref={ref} />
        )),
    };

    const getPaymentsData = (id) => {
        seTpayment_id(id);
        handleClickOpen();
        axios.get("/invoices/payments/" + id).then((response) => {
            console.log(response.data);
            seTpayments(response.data[0].payments);
        });
    };

    const getInvoicesData = () => {
        axios.get("/invoices").then((response) => {
            if (response.data.length > 0) {
                seTdata(response.data);
                // console.log(data)
                // console.log(columns)
            }
        });
    };

    // componentDidMount = useEffect
    useEffect(() => {
        getInvoicesData();
    }, []);

    const handleClickOpen = () => {
        seTopen(true);
    };

    const handleClose = () => {
        getInvoicesData();
        seTopen(false);
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogContent style={{ padding: "0" }}>
                    <MaterialTable
                        title={t("Payments")}
                        icons={tableIcons}
                        columns={payments_label}
                        data={payments}
                        options={{
                            exportButton: true,
                        }}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise((resolve, reject) => {
                                    axios.post(
                                        `/invoices/addpayments/${payment_id}`,
                                        {
                                            amount: newData.amount,
                                        }
                                    );

                                    payments.push(newData);
                                    console.log(payments);
                                    seTpayments(payments);
                                    getInvoicesData();

                                    resolve();
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    axios.post(
                                        `/invoices/editpayments/${newData._id}`,
                                        { amount: newData.amount }
                                    );

                                    const index = payments.indexOf(oldData);
                                    payments[index] = newData;
                                    console.log(payments);
                                    seTpayments(payments);
                                    getInvoicesData();

                                    resolve();
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve, reject) => {
                                    axios.get(
                                        `/invoices/deletepayments/${oldData._id}`
                                    );

                                    const index = payments.indexOf(oldData);
                                    payments.splice(index, 1);
                                    console.log(payments);
                                    seTpayments(payments);
                                    getInvoicesData();

                                    resolve();
                                }),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {t("okey")}
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="containerP">
                <Grid item container spacing={3}>
                    <Grid container item md={12} className="panelGridRelative">
                        <Card className="panelLargeIcon">
                            <Receipt fontSize="large" />
                        </Card>
                        <Card className="listViewPaper">
                            <MaterialTable
                                title=""
                                icons={tableIcons}
                                columns={columns}
                                data={data}
                                options={{
                                    exportButton: true,
                                    pageSize: 10,
                                    grouping: true,
                                }}
                                components={{
                                    Toolbar: (props) => (
                                        <div>
                                            <Typography
                                                component="h5"
                                                variant="h6"
                                                color="inherit"
                                                noWrap
                                                className="typography"
                                            >
                                                {t("invoicesList")}
                                            </Typography>
                                            <Link
                                                to="/invoicecreate"
                                                className="addButtonPlace"
                                            >
                                                <Tooltip
                                                    title={t("createInvoice")}
                                                >
                                                    <AddBox
                                                        fontSize="large"
                                                        className="addButtonIcon"
                                                    />
                                                </Tooltip>
                                            </Link>
                                            <MTableToolbar {...props} />
                                            <div style={{ clear: "both" }} />
                                        </div>
                                    ),
                                }}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
