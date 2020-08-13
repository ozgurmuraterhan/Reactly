import React, { useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const { isAuthenticated, user } = useContext(AuthContext);

    const [t] = useTranslation();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const eqRoles = [];
    roles.forEach((element) => {
        if (user.username != "") {
            if (user.role[0][element]) {
                eqRoles.push(user.role[0][element]);
            }
        }
    });

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!isAuthenticated) {
                    history.push("/login");
                }

                if (eqRoles.length == 0) {
                    enqueueSnackbar(
                        t(
                            "You are not authorized to view this page, contact your administrator."
                        ),
                        { variant: "error" }
                    );
                    // navigate
                    history.goBack();
                }

                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
