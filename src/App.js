import React, { useState, useContext, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    useHistory,
} from 'react-router-dom';

import PrivateRoute from './Hocs/PrivateRoute';
import UnPrivateRoute from './Hocs/UnPrivateRoute';

import AuthService from './Services/AuthService';
import { AuthContext } from './Context/AuthContext';

import { useTranslation } from 'react-i18next';
import SideNav, {
    Toggle,
    Nav,
    NavItem,
    NavIcon,
    NavText,
} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './assets/css/style.css';

import {
    SupervisedUserCircle,
    Receipt,
    MonetizationOn,
    Ballot,
    InsertChart,
    ArrowDropDownCircle,
    PowerSettingsNew,
    Dashboard,
} from '@material-ui/icons';
import i18n from './i18n';

/* import UserEdit from './components/users/edit.component';
import UsersList from './components/users/list.component';
import UserCreate from './components/users/create.component';


*/

import CustomersEdit from './components/customers/edit.component';
import CustomersCreate from './components/customers/create.component';
import CustomersList from './components/customers/list.component';

import InvoicesList from './components/invoices/list.component';
import InvoicesCreate from './components/invoices/create.component';
import InvoicesEdit from './components/invoices/edit.component';

import ProductsList from './components/products/list.component';
import ProductsCreate from './components/products/create.component';
import ProductsEdit from './components/products/edit.component';

import Register from './components/register/register';
import Login from './components/register/login';

/*
import CreateExercise from './components/exercises/create.component';
import EditExercise from './components/exercises/edit.component';
import ExercisesList from './components/exercises/list.component';
*/

import PPimage from './assets/images/pp2.jpeg';

export default function App() {
    const { t } = useTranslation();

    const [nowDate, seTnowDate] = useState(new Date());
    const [open, seTopen] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(
        AuthContext
    );

    const onClickLogoutHandler = () => {
        AuthService.logout().then((data) => {
            if (data.success) {
                setUser(data.user);
                setIsAuthenticated(false);
            }
        });
    };

    const unauthenticatedNavBar = () => {
        return (
            <>
                <Route
                    render={({ location, history }) => {
                        if (!isAuthenticated) {
                            if (location.pathname !== '/login') {
                                history.push('/login');
                            }
                        }
                    }}
                />

                <Route
                    render={({ location, history }) => (
                        <>
                            {location.pathname === '/'
                                ? history.push('/login')
                                : ''}
                            <main>
                                <div>
                                    <UnPrivateRoute
                                        path="/login"
                                        component={Login}
                                    />
                                    <UnPrivateRoute
                                        path="/register"
                                        component={Register}
                                    />
                                </div>
                            </main>
                        </>
                    )}
                />
            </>
        );
    };

    const authenticatedNavBar = () => {
        return (
            <>
                <Route
                    render={({ location, history }) => (
                        <>
                            <SideNav
                                onMouseOver={() => seTopen(true)}
                                onMouseOut={() => seTopen(false)}
                                onToggle={() => {}}
                                expanded={open}
                                onSelect={(selected) => {
                                    const to = `/${selected}`;
                                    if (location.pathname !== to) {
                                        history.push(to);
                                    }
                                }}
                            >
                                <SideNav.Toggle />

                                <SideNav.Nav defaultSelected="customerslist">
                                    <NavItem eventKey="invoiceslist">
                                        <NavIcon>
                                            <Receipt
                                                fontSize="large"
                                                style={{ marginTop: '7px' }}
                                            />
                                        </NavIcon>
                                        <NavText>Invoices</NavText>
                                    </NavItem>

                                    <NavItem eventKey="customerslist">
                                        <NavIcon>
                                            <SupervisedUserCircle
                                                fontSize="large"
                                                style={{ marginTop: '7px' }}
                                            />
                                        </NavIcon>
                                        <NavText>Customers</NavText>
                                    </NavItem>

                                    <NavItem eventKey="productslist">
                                        <NavIcon>
                                            <Ballot
                                                fontSize="large"
                                                style={{ marginTop: '7px' }}
                                            />
                                        </NavIcon>
                                        <NavText>Products</NavText>
                                    </NavItem>

                                    <NavItem eventKey="expenses">
                                        <NavIcon>
                                            <MonetizationOn
                                                fontSize="large"
                                                style={{ marginTop: '7px' }}
                                            />
                                        </NavIcon>
                                        <NavText>Expenses</NavText>
                                    </NavItem>
                                    <NavItem eventKey="reports">
                                        <NavIcon>
                                            <InsertChart
                                                fontSize="large"
                                                style={{ marginTop: '7px' }}
                                            />
                                        </NavIcon>
                                        <NavText>Reports</NavText>
                                    </NavItem>

                                    <NavItem eventKey="charts">
                                        <NavIcon>
                                            <ArrowDropDownCircle
                                                fontSize="large"
                                                style={{ marginTop: '7px' }}
                                            />
                                        </NavIcon>
                                        <NavText>Drowdown</NavText>
                                        <NavItem eventKey="chartssad">
                                            <NavText>Line Chart</NavText>
                                        </NavItem>
                                        <NavItem eventKey="charts/barchart">
                                            <NavText>Bar Chart</NavText>
                                        </NavItem>
                                    </NavItem>

                                    <NavItem
                                        eventKey="login"
                                        onClick={onClickLogoutHandler}
                                    >
                                        <NavIcon>
                                            <PowerSettingsNew
                                                fontSize="large"
                                                style={{ marginTop: '7px' }}
                                            />
                                        </NavIcon>
                                        <NavText>Logout</NavText>
                                    </NavItem>
                                </SideNav.Nav>
                            </SideNav>
                            <main style={{ marginLeft: '63px' }}>
                                <div>
                                    Lang:
                                    <button
                                        onClick={() => changeLanguage('tr')}
                                    >
                                        tr
                                    </button>
                                    <button
                                        onClick={() => changeLanguage('en')}
                                    >
                                        en
                                    </button>
                                    <span />
                                </div>
                                <div>
                                    <PrivateRoute
                                        roles={['user', 'admin']}
                                        path="/CustomersList"
                                        component={CustomersList}
                                    />
                                    <PrivateRoute
                                        roles={['user', 'admin']}
                                        path="/CustomerCreate"
                                        component={CustomersCreate}
                                    />
                                    <PrivateRoute
                                        roles={['user', 'admin']}
                                        path="/Customers/edit/:id"
                                        component={CustomersEdit}
                                    />

                                    <PrivateRoute
                                        roles={['user', 'admin']}
                                        path="/invoicecreate"
                                        component={InvoicesCreate}
                                    />
                                    <PrivateRoute
                                        roles={['user', 'admin']}
                                        path="/invoiceslist"
                                        component={InvoicesList}
                                    />
                                    <PrivateRoute
                                        roles={['user', 'admin']}
                                        path="/invoices/edit/:id"
                                        component={InvoicesEdit}
                                    />

                                    <PrivateRoute
                                        roles={['user', 'admin']}
                                        path="/productslist"
                                        component={ProductsList}
                                    />
                                    <PrivateRoute
                                        path="/productcreate"
                                        component={ProductsCreate}
                                    />
                                    <PrivateRoute
                                        roles={['user', 'admin']}
                                        path="/products/edit/:id"
                                        component={ProductsEdit}
                                    />

                                    <UnPrivateRoute
                                        path="/login"
                                        component={Login}
                                    />
                                    <UnPrivateRoute
                                        path="/register"
                                        component={Register}
                                    />
                                </div>
                            </main>
                        </>
                    )}
                />
            </>
        );
    };
    return (
        <Router>
            {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
        </Router>
    );
}
