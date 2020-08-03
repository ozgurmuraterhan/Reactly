import React, { useContext } from "react";
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
    const eqRoles = [roles, user.role].reduce((a, c) =>
        a.filter((i) => c.includes(i))
    );

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
