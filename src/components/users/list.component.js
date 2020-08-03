import React, { Component, forwardRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import MaterialTable, { MTableToolbar } from "material-table";
import { withNamespaces, useTranslation } from "react-i18next";

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
} from "@material-ui/icons";

import "../../assets/css/style.css";

export default function ProductsList() {
    const [t] = useTranslation();
    const history = useHistory();

    const [data, seTdata] = useState([]);

    const columns = [
        {
            title: t("E-mail"),
            field: "username",
        },
        {
            title: t("actions"),
            field: "_id",
            render: (rowData) => (
                <div>
                    <Link to={`/staff/edit/${rowData._id}`}>
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

    const getUserssData = () => {
        axios.get("/staff").then((response) => {
            if (response.data.length > 0) {
                seTdata(response.data);
            }
        });
    };

    useEffect(() => {
        getUserssData();
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
                                                {t("productList")}
                                            </Typography>
                                            <Link
                                                to="/staffcreate"
                                                className="addButtonPlace"
                                            >
                                                <Tooltip
                                                    title={t("createProduct")}
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
