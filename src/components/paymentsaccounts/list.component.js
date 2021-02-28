import React, { Component, forwardRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import MaterialTable, { MTableToolbar } from "material-table";
import { useTranslation } from "react-i18next";

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
    Visibility
} from "@material-ui/icons";

import "../../assets/css/style.css";

export default function PaymentsAccountsList() {
    const [t] = useTranslation();
    const history = useHistory();

    const [customergroups, seTcustomergroups] = useState([]);
    const [open, seTopen] = useState(false);
    const [details_value, seTdetails_value] = useState("");
    const [data, seTdata] = useState([]);
    const [details_label, seTdetails_label] = useState("");
    const customergroups_label = [{ title: t("groupName"), field: "name" }];
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

    const columns = [
        {
            title: t("Account Name"),
            field: "account_name",

        },

        {
            title: t("Status"),
            field: "status",
            render: (rowData) => (
                <div>
                    {rowData.status ? "ACTIVE" : "DEACTIVE"}
                </div>
            ),
        },
        {
            title: t("In"),
            field: "in",
        },
        {
            title: t("Out"),
            field: "out",
        },

        {
            title: t("Total"),
            field: "total",
        },
        {
            title: t("actions"),
            field: "_id",
            render: (rowData) => (
                <div>
                    <Link style={{ float: "left", marginRight: "15px" }} to={`/paymentsaccounts/view/${rowData._id}`}>
                        <Visibility />
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

    const getData = () => {
        axios.get("/bankaccounts").then((response) => {
            if (response.data.length > 0) {
                console.log(response.data)
                seTdata(response.data);
                // console.log(data)
                // console.log(columns)
            }
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className="containerP">
                <Grid item container spacing={3}>
                    <Grid container item md={9} className="panelGridRelative">
                        <Card className="panelLargeIcon">
                            <GroupAdd fontSize="large" />
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
                                                {t("Accounts")}
                                            </Typography>
                                            <Link
                                                to="/paymentsaccountscreate"
                                                className="addButtonPlace"
                                            >
                                                <Tooltip
                                                    title={t("Create Account")}
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
                    <Grid item container md={3} className="panelGridRelative">
                        sds
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
