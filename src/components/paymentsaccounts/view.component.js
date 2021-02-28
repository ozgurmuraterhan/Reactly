import React, { forwardRef, useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

import { useTranslation } from "react-i18next";

import {
    Card,
    Typography,
    Grid,
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
import MaterialTable from "material-table";

export default function PaymentsAccountsView(props) {
    const [t] = useTranslation();
    const history = useHistory();
    const { user } = useContext(AuthContext);

    const { enqueueSnackbar } = useSnackbar();
    const [state, seTstate] = useState({});
    const [data, seTdata] = useState([]);


    const columns = [


        {
            title: t("created"),
            field: "created",
        },

        {
            title: t("paid_date"),
            field: "paid_date",
        },

        {
            title: t("amount"),
            field: "amount",
        },

        {
            title: t("type"),
            field: "type",
        },

    ];

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => (<DeleteOutline {...props} ref={ref} />)),
        DetailPanel: forwardRef((props, ref) => (<ChevronRight {...props} ref={ref} />)),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => (<FirstPage {...props} ref={ref} />)),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => (<ChevronRight {...props} ref={ref} />)),
        PreviousPage: forwardRef((props, ref) => (<ChevronLeft {...props} ref={ref} />)),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => (<ArrowUpward {...props} ref={ref} />)),
        ThirdStateCheck: forwardRef((props, ref) => (<Remove {...props} ref={ref} />)),
        ViewColumn: forwardRef((props, ref) => (<ViewColumn {...props} ref={ref} />)),
    };


    // componentDidMount = useEffect 
    const getData = () => {
        axios.get("/paymentsaccounts/view/" + props.match.params.id).then((response) => {
            if (response.data) {
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
        <div className="containerP">
            <Grid item container spacing={3}>
                <Grid item container md={12} className="panelGridRelative">
                    <Card className="panelLargeIcon">
                        <GroupAdd fontSize="large" />
                    </Card>
                    <Card className="listViewPaper">
                        <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: "100%" }} className="typography">
                            {t("Account Activities")}
                        </Typography>
                        <Grid item container sm={12} style={{ background: "#fff", float: "left" }}>
                            <MaterialTable
                                title="Editable Preview"
                                columns={columns}
                                data={data}
                                icons={tableIcons}
                                style={{
                                    width: "100%",
                                    boxShadow: "1px -2px 5px 0px #0000000f",
                                }}
                                components={{
                                    Toolbar: (props) => <div />,
                                }}
                                options={{
                                    actionsColumnIndex: -1,
                                    paging: false,
                                }}

                            />
                        </Grid>
                    </Card>
                </Grid>
            </Grid>

        </div >
    );
}
