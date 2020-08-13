import React, { forwardRef, useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useTranslation } from "react-i18next";

import Moment from "moment";

import MaterialTable from "material-table";
import Select2 from "@material-ui/core/Select";

import {
    FormControl,
    FormGroup,
    FormHelperText,
    Card,
    Button,
    Typography,
    TextField,
    Tooltip,
    FormLabel,
    Switch,
    FormControlLabel,
    InputAdornment,
    RadioGroup,
    Radio,
    TableRow,
    TableCell,
    TableBody,
    Table,
    MenuItem,
    Grid,
} from "@material-ui/core";

import {
    AddBox,
    PlaylistAddCheck,
    ContactMail,
    Edit,
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
    Save,
} from "@material-ui/icons";

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import "../../assets/css/style.css";

export default function InvoiceEdit(props) {
    const [t] = useTranslation();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const [dataCustomers, seTdataCustomers] = useState([]);
    const [dataProducts, seTdataProducts] = useState([]);
    const [dataCountry, seTdataCountry] = useState([]);
    const [
        selectedbillingAddressStateArray,
        seTselectedbillingAddressStateArray,
    ] = useState([]);
    const [
        selectedshippingAddressStateArray,
        seTselectedshippingAddressStateArray,
    ] = useState([]);
    const [dataBankAccount, seTdataBankAccount] = useState("");
    const [paid, seTpaid] = useState(false);
    const [focus, seTfocus] = useState({
        focus1: true,
        focus2: false,
        focus3: false,
        focus4: false,
    });

    const [selectedDefaultProduct, seTselectedDefaultProduct] = useState([]);
    const [selectedDefaultCustomer, seTselectedDefaultCustomer] = useState([]);
    const [dataPayments, seTdataPayments] = useState("");

    const [product, seTproduct] = useState({
        product_description: "",
        product_name: "",
        sale_price: 0,
        product_vat: 0,
        product_discount: 0,
        amount: 0,
    });

    const [quantity, seTquantity] = useState(1);
    const [unit, seTunit] = useState("");
    const [quantity_name, seTquantity_name] = useState(t("Qty"));
    const [items, seTitems] = useState([]);
    const [anyAmount, seTanyAmount] = useState(0);

    const [totalAll, seTtotalAll] = useState({
        total: 0,
        subtotal: 0,
        taxtotal: 0,
        discountType: "%",
        discount: 0,
        discountValue: 0,
    });

    const [state, seTstate] = useState({
        serie: "A",
        no: "",
        created: Date.now(),
        bank_account: "",
        due_note: "",
        due_date: Date.now(),
        paid_date: Date.now(),

        selectedbillingAddressState: [{ label: "", value: "" }],
        selectedbillingAddressCountry: [{ label: "", value: "" }],
        selectedshippingAddressState: [{ label: "", value: "" }],
        selectedshippingAddressCountry: [{ label: "", value: "" }],
        selected2Address: "",
        selected2Town: "",
        selected2Zipcode: "",
        selected3Address: "",
        selected3Town: "",
        selected3Zipcode: "",
        default_payment_method: "",
    });

    const [edit1Address, seTedit1Address] = useState(true);
    const [edit2Address, seTedit2Address] = useState(true);

    const columns = [
        {
            title: t("productName"),
            field: "product_name",
            editComponent: (props) => (
                <TextValidator
                    multiline
                    required
                    margin="dense"
                    type="text"
                    value={props.value}
                    onChange={(e) => {
                        props.onChange(e.target.value);
                    }}
                />
            ),
        },
        {
            title: t("productDescription"),
            field: "product_description",
            editComponent: (props) => (
                <TextValidator
                    multiline
                    required
                    margin="dense"
                    type="text"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                />
            ),
        },
        {
            title: t("quantity"),
            field: "quantity",
            type: "numeric",
            render: (rowData) => (
                <div>
                    {`${rowData.quantity} ${rowData.quantity_name} ${rowData.unit}`}
                </div>
            ),
            editComponent: (props) => (
                <TextValidator
                    margin="dense"
                    type="number"
                    value={props.value}
                    autoFocus={focus.focus1}
                    onChange={(e) => {
                        props.onChange(e.target.value);
                        seTanyAmount(
                            props.rowData.price *
                                e.target.value *
                                (1 + props.rowData.tax / 100) -
                                props.rowData.price *
                                    e.target.value *
                                    (0 + props.rowData.discount / 100) *
                                    (1 + props.rowData.tax / 100)
                        );
                        seTfocus({
                            focus1: true,
                            focus2: false,
                            focus3: false,
                            focus4: false,
                        });
                    }}
                    validators={["isNumber"]}
                    errorMessages={[t("thisIsNotNumber")]}
                />
            ),
        },
        {
            title: t("salePrice"),
            field: "price",
            type: "numeric",
            editComponent: (props) => (
                <TextValidator
                    margin="dense"
                    type="number"
                    value={props.value}
                    autoFocus={focus.focus2}
                    onChange={(e) => {
                        props.onChange(e.target.value);
                        seTanyAmount(
                            e.target.value *
                                props.rowData.quantity *
                                (1 + props.rowData.tax / 100) -
                                e.target.value *
                                    props.rowData.quantity *
                                    (0 + props.rowData.discount / 100) *
                                    (1 + props.rowData.tax / 100)
                        );
                        seTfocus({
                            focus1: false,
                            focus2: true,
                            focus3: false,
                            focus4: false,
                        });
                    }}
                    validators={["isNumber"]}
                    errorMessages={[t("thisIsNotNumber")]}
                />
            ),
        },
        {
            title: t("Discount"),
            field: "discount",
            type: "numeric",
            render: (rowData) => <div>{`${rowData.discount} %`}</div>,
            editComponent: (props) => (
                <TextValidator
                    margin="dense"
                    type="number"
                    value={props.value}
                    autoFocus={focus.focus3}
                    onChange={(e) => {
                        props.onChange(e.target.value);
                        seTanyAmount(
                            props.rowData.price *
                                props.rowData.quantity *
                                (1 + props.rowData.tax / 100) -
                                props.rowData.price *
                                    props.rowData.quantity *
                                    (0 + e.target.value / 100) *
                                    (1 + props.rowData.tax / 100)
                        );

                        seTfocus({
                            focus1: false,
                            focus2: false,
                            focus3: true,
                            focus4: false,
                        });
                    }}
                    validators={["isNumber"]}
                    errorMessages={[t("thisIsNotNumber")]}
                />
            ),
        },
        {
            title: t("productVat"),
            field: "tax",
            type: "numeric",
            render: (rowData) => <div>{`${rowData.tax} %`}</div>,
            editComponent: (props) => (
                <TextValidator
                    margin="dense"
                    type="number"
                    value={props.value}
                    autoFocus={focus.focus4}
                    onChange={(e) => {
                        props.onChange(e.target.value);
                        seTanyAmount(
                            props.rowData.price *
                                props.rowData.quantity *
                                (1 + e.target.value / 100) -
                                props.rowData.price *
                                    props.rowData.quantity *
                                    (0 + props.rowData.discount / 100) *
                                    (1 + e.target.value / 100)
                        );

                        seTfocus({
                            focus1: false,
                            focus2: false,
                            focus3: false,
                            focus4: true,
                        });
                    }}
                    validators={["isNumber"]}
                    errorMessages={[t("thisIsNotNumber")]}
                />
            ),
        },
        {
            title: t("amount"),
            field: "amount",
            type: "numeric",
            editComponent: (props) => (
                <TextValidator
                    margin="dense"
                    type="text"
                    disabled
                    value={anyAmount ? anyAmount.toFixed(0) : props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    validators={["isNumber"]}
                    errorMessages={[t("thisIsNotNumber")]}
                />
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

    function getCustomersF() {
        axios
            .get("/customers")
            .then((response) => {
                if (response.data.length > 0) {
                    const details = [];
                    for (const i in response.data) {
                        details.push({
                            label: response.data[i].company,
                            value: response.data[i]._id,
                        });
                    }
                    seTdataCustomers(details);
                }
            })
            .catch((err) => console.log(err));
    }

    const handleChangeCustomer = (selectedOption) => {
        axios
            .get(`/customers/${selectedOption.value}`)
            .then((response) => {
                seTstate({
                    ...state,
                    selectedbillingAddressState: [
                        {
                            label: response.data.billingAddress_state_id || "",
                            value: response.data.billingAddress_state_id || "",
                        },
                    ],
                    selectedbillingAddressCountry: [
                        {
                            label:
                                response.data.billingAddress_country_id || "",
                            value:
                                response.data.billingAddress_country_id || "",
                        },
                    ],
                    selected2Address:
                        response.data.billingAddress_address || "",
                    selected2Town: response.data.billingAddress_town || "",
                    selected2Zipcode: response.data.billingAddress_zipcode || 0,
                    selectedshippingAddressState: [
                        {
                            label: response.data.shippingAddress_state_id,
                            value: response.data.shippingAddress_state_id,
                        },
                    ],
                    selectedshippingAddressCountry: [
                        {
                            label: response.data.shippingAddress_country_id,
                            value: response.data.shippingAddress_country_id,
                        },
                    ],
                    selected3Address:
                        response.data.shippingAddress_address || "",
                    selected3Town: response.data.shippingAddress_town || "",
                    selected3Zipcode:
                        response.data.shippingAddress_zipcode || 0,
                    default_payment_method:
                        response.data.default_payment_method,
                });

                getStatesF1(response.data.billingAddress_country_id);
                getStatesF2(response.data.shippingAddress_country_id);
            })
            .catch((err) => console.log(err));
        seTselectedDefaultCustomer({
            label: selectedOption.label,
            value: selectedOption.value,
        });
    };

    const handleChangeDiscountType = (selectedOption) => {
        if (selectedOption.target.value === "%") {
            seTtotalAll({
                ...totalAll,
                discountValue:
                    (totalAll.taxtotal + totalAll.subtotal) *
                        (1 + totalAll.discount / 100) -
                    (totalAll.taxtotal + totalAll.subtotal),
                total:
                    totalAll.taxtotal +
                    totalAll.subtotal -
                    ((totalAll.taxtotal + totalAll.subtotal) *
                        (1 + totalAll.discount / 100) -
                        (totalAll.taxtotal + totalAll.subtotal)),
                discountType: selectedOption.target.value,
            });
        } else {
            seTtotalAll({
                ...totalAll,
                discountValue: totalAll.discount,
                total:
                    totalAll.taxtotal + totalAll.subtotal - totalAll.discount,
                discountType: selectedOption.target.value,
            });
        }
    };

    const onChangeFquantity = (e) => {
        const amount = (
            (product.sale_price * e.target.value -
                product.sale_price *
                    e.target.value *
                    (0 + product.product_discount / 100)) *
            (1 + product.product_vat / 100)
        ).toFixed(0);
        seTquantity(e.target.value);
        seTproduct({ ...product, amount: amount });
    };

    const onChangeFprice = (e) => {
        const amount = (
            (e.target.value * quantity -
                e.target.value *
                    quantity *
                    (0 + product.product_discount / 100)) *
            (1 + product.product_vat / 100)
        ).toFixed(0);
        seTproduct({ ...product, sale_price: e.target.value, amount: amount });
    };

    const onChangeFproduct_vat = (e) => {
        const amount = (
            (product.sale_price * quantity -
                product.sale_price *
                    quantity *
                    (0 + product.product_discount / 100)) *
            (1 + e.target.value / 100)
        ).toFixed(0);
        seTproduct({ ...product, product_vat: e.target.value, amount: amount });
    };

    const onChangeFproduct_discount = (e) => {
        const amount = (
            (product.sale_price * quantity -
                product.sale_price * quantity * (0 + e.target.value / 100)) *
            (1 + product.product_vat / 100)
        ).toFixed(0);
        seTproduct({
            ...product,
            product_discount: e.target.value,
            amount: amount,
        });
    };

    function getPaymentsF() {
        axios
            .get("/payments")
            .then((response) => {
                if (response.data.length > 0) {
                    const details = [];
                    for (const i in response.data) {
                        details.push({
                            label: response.data[i].name,
                            value: response.data[i]._id,
                        });
                    }
                    seTdataPayments(details);
                }
            })
            .catch((err) => console.log(err));
    }

    function getBankAccountF() {
        axios
            .get("/bankaccounts")
            .then((response) => {
                if (response.data.length > 0) {
                    const details = [];
                    for (const i in response.data) {
                        details.push({
                            label: response.data[i].name,
                            value: response.data[i]._id,
                        });
                    }
                    seTdataBankAccount(details);
                }
            })
            .catch((err) => console.log(err));
    }

    const handleChangeProduct = (selectedOption) => {
        axios
            .get(`/products/${selectedOption.value}`)
            .then((response) => {
                const productData = response.data;
                const amount =
                    productData.sale_price *
                    quantity *
                    (1 + productData.product_vat / 100);
                seTproduct({
                    ...product,
                    product_description: productData.product_description,
                    product_name: productData.product_name,
                    sale_price: productData.sale_price,
                    product_vat: productData.product_vat,
                    amount: amount,
                });
            })
            .catch((err) => console.log(err));
        seTselectedDefaultProduct({
            label: selectedOption.label,
            value: selectedOption.value,
        });
    };

    function getProductsF() {
        axios
            .get("/products")
            .then((response) => {
                if (response.data.length > 0) {
                    const details = [];
                    for (const i in response.data) {
                        details.push({
                            label: response.data[i].product_name,
                            value: response.data[i]._id,
                        });
                    }
                    seTdataProducts(details);
                }
            })
            .catch((err) => console.log(err));
    }

    const onClickAddItem = (e) => {
        e.preventDefault();
        items.push({
            product_name: product.product_name,
            product_description: product.product_description,
            quantity_name,
            quantity,
            unit,
            price: product.sale_price,
            tax: product.product_vat,
            discount: product.product_discount,
            amount: product.amount,
        });

        seTitems(items);

        items.map((item) =>
            seTtotalAll({
                ...totalAll,
                total: totalAll.total + item.amount,
                subtotal:
                    totalAll.subtotal +
                    (item.price * item.quantity -
                        item.price * item.quantity * (0 + item.discount / 100)),
                taxtotal:
                    (item.price * item.quantity -
                        item.price *
                            item.quantity *
                            (0 + item.discount / 100)) *
                        (1 + item.tax / 100) -
                    (item.price * item.quantity -
                        item.price * item.quantity * (0 + item.discount / 100)),
            })
        );
        totalCebirItems();
    };

    const onChangeFdiscount = (e) => {
        totalCebirItems();

        if (totalAll.discountType === "%") {
            seTtotalAll({
                ...totalAll,
                discountValue:
                    (totalAll.taxtotal + totalAll.subtotal) *
                        (1 + e.target.value / 100) -
                    (totalAll.taxtotal + totalAll.subtotal),
                total:
                    totalAll.taxtotal +
                    totalAll.subtotal -
                    ((totalAll.taxtotal + totalAll.subtotal) *
                        (1 + e.target.value / 100) -
                        (totalAll.taxtotal + totalAll.subtotal)),
                discount: e.target.value,
            });
        } else {
            seTtotalAll({
                ...totalAll,
                discountValue: e.target.value,
                total: totalAll.taxtotal + totalAll.subtotal - e.target.value,
                discount: e.target.value,
            });
        }
    };

    function totalCebirItems() {
        let total2 = 0;
        let subtotal2 = 0;
        let taxtotal2 = 0;
        const items2 = [];

        seTtotalAll({
            ...totalAll,
            taxtotal: 0,
        });

        items.map((item) => {
            total2 = total2 + item.amount;
            subtotal2 =
                subtotal2 +
                (item.price * item.quantity -
                    item.price * item.quantity * (0 + item.discount / 100));
            taxtotal2 =
                taxtotal2 +
                ((item.price * item.quantity -
                    item.price * item.quantity * (0 + item.discount / 100)) *
                    (1 + item.tax / 100) -
                    (item.price * item.quantity -
                        item.price *
                            item.quantity *
                            (0 + item.discount / 100)));

            items2.push({
                product_name: item.product_name,
                product_description: item.product_description,
                quantity_name: item.quantity_name,
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                discount: item.discount,
                tax: item.tax,
                amount:
                    item.price * item.quantity * (1 + item.tax / 100) -
                    (
                        item.price *
                        item.quantity *
                        (0 + item.discount / 100) *
                        (1 + item.tax / 100)
                    ).toFixed(0),
            });
        });

        seTitems(items2);

        if (totalAll.discountType === "%") {
            seTtotalAll({
                ...totalAll,
                taxtotal: taxtotal2,
                subtotal: subtotal2,
                discountValue:
                    (taxtotal2 + subtotal2) * (1 + totalAll.discount / 100) -
                    (taxtotal2 + subtotal2),
                total:
                    taxtotal2 +
                    subtotal2 -
                    ((taxtotal2 + subtotal2) * (1 + totalAll.discount / 100) -
                        (taxtotal2 + subtotal2)),
                discount: totalAll.discount,
            });
        } else {
            seTtotalAll({
                ...totalAll,
                taxtotal: taxtotal2,
                subtotal: subtotal2,
                discountValue: totalAll.discountValue,
                total: taxtotal2 + subtotal2 - totalAll.discountValue,
                discount: totalAll.discount,
            });
        }
        console.log(totalAll.subtotal);
    }

    function getCountryF() {
        axios
            .get("/country")
            .then((response) => {
                if (response.data.length > 0) {
                    const details = [];
                    for (const i in response.data) {
                        details.push({
                            label: response.data[i].name,
                            value: [
                                response.data[i].name,
                                response.data[i].states,
                            ],
                        });
                    }
                    seTdataCountry(details);
                }
            })
            .catch((err) => console.log(err));
    }

    function getStatesF1(id) {
        axios
            .get(`/country/${id}`)
            .then((response) => {
                if (response.data[0].states.length > 0) {
                    const details = [];
                    for (const i in response.data[0].states) {
                        details.push({
                            label: response.data[0].states[i].name,
                            value: response.data[0].states[i].name,
                        });
                    }
                    seTselectedbillingAddressStateArray(details);
                }
            })
            .catch((err) => console.log(err));
    }

    function getStatesF2(id) {
        axios
            .get(`/country/${id}`)
            .then((response) => {
                if (response.data[0].states.length > 0) {
                    const details = [];
                    for (const i in response.data[0].states) {
                        details.push({
                            label: response.data[0].states[i].name,
                            value: response.data[0].states[i].name,
                        });
                    }
                    seTselectedshippingAddressStateArray(details);
                }
            })
            .catch((err) => console.log(err));
    }

    const onChangeFbillingAddressCountry = (selectedOption) => {
        const details = [];
        for (const i in selectedOption.value[1]) {
            details.push({
                label: selectedOption.value[1][i].name,
                value: selectedOption.value[1][i].name,
            });
        }
        seTselectedbillingAddressStateArray(details);
        seTstate({
            ...state,
            selectedbillingAddressCountry: [
                { label: selectedOption.label, value: selectedOption.label },
            ],
        });
    };

    const onChangeFshippingAddressCountry = (selectedOption) => {
        const details = [];
        for (const i in selectedOption.value[1]) {
            details.push({
                label: selectedOption.value[1][i].name,
                value: selectedOption.value[1][i].name,
            });
        }
        seTselectedshippingAddressStateArray(details);
        seTstate({
            ...state,
            selectedshippingAddressCountry: [
                { label: selectedOption.label, value: selectedOption.label },
            ],
        });
    };

    function getInvoices() {
        axios.get(`/invoices/${props.match.params.id}`).then((response) => {
            seTstate({
                no: response.data.no,
                serie: response.data.serie,
                created: response.data.created,
                due_date: response.data.due_date,
                due_note: response.data.due_note,
                default_payment_method: response.data.default_payment_method,
                selectedbillingAddressCountry: [
                    {
                        label: response.data.billingAddress_country_id,
                        value: response.data.billingAddress_country_id,
                    },
                ],
                selectedbillingAddressState: [
                    {
                        label: response.data.billingAddress_state_id,
                        value: response.data.billingAddress_state_id,
                    },
                ],
                selected2Town: response.data.billingAddress_town,
                selected2Zipcode: response.data.billingAddress_zipcode,
                selected2Address: response.data.billingAddress_address,
                selectedshippingAddressCountry: [
                    {
                        label: response.data.shippingAddress_country_id,
                        value: response.data.shippingAddress_country_id,
                    },
                ],
                selectedshippingAddressState: [
                    {
                        label: response.data.shippingAddress_state_id,
                        value: response.data.shippingAddress_state_id,
                    },
                ],
                selected3Town: response.data.shippingAddress_town,
                selected3Zipcode: response.data.shippingAddress_zipcode,
                selected3Address: response.data.shippingAddress_address,
            });

            seTselectedDefaultCustomer(response.data.customer_id);

            seTtotalAll({
                subtotal: response.data.subtotal,
                taxtotal: response.data.taxtotal,
                total: response.data.total,

                discount: response.data.discount,
                discountType: response.data.discountType,
                discountValue: response.data.discountValue,
            });

            seTitems(response.data.items);
        });
    }
    // componentDidMount = useEffect
    useEffect(() => {
        getCustomersF();
        getPaymentsF();
        getBankAccountF();
        getProductsF();
        getCountryF();
        getInvoices();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        if (paid === true) {
            var paymentsArray = [
                {
                    amount: totalAll.total.toFixed(2),
                    paid_date: Moment(state.paid_date)._d,
                    bank_account: state.bank_account,
                },
            ];
        }

        const Invoices = {
            draft: 0,
            no: state.no,
            serie: state.serie,
            created: Moment(state.created)._d,
            due_date: Moment(state.due_date)._d,
            date_send: 0,
            customer_id: selectedDefaultCustomer,
            due_note: state.due_note,
            subtotal: totalAll.subtotal.toFixed(2),
            taxtotal: totalAll.taxtotal.toFixed(2),
            total: totalAll.total.toFixed(2),
            discount: totalAll.discount,
            discountType: totalAll.discountType,
            discountValue: totalAll.discountValue,
            items: items,
            default_payment_method: state.default_payment_method,
            quantity,
            quantity_name,

            payments: paymentsArray,

            billingAddress_country_id:
                state.selectedbillingAddressCountry[0].label,
            billingAddress_state_id: state.selectedbillingAddressState[0].label,
            billingAddress_town: state.selected2Town,
            billingAddress_zipcode: state.selected2Zipcode,
            billingAddress_address: state.selected2Address,

            shippingAddress_country_id:
                state.selectedshippingAddressCountry[0].label,
            shippingAddress_state_id:
                state.selectedshippingAddressState[0].label,
            shippingAddress_town: state.selected3Town,
            shippingAddress_zipcode: state.selected3Zipcode,
            shippingAddress_address: state.selected3Address,
        };

        axios
            .post(`/invoices/${props.match.params.id}`, Invoices)
            .then((res) => {
                if (res.data.variant === "error") {
                    enqueueSnackbar(t("invoiceNotAdded") + res.data.messagge, {
                        variant: res.data.variant,
                    });
                } else {
                    enqueueSnackbar(t("invoiceAdded") + res.data.messagge, {
                        variant: res.data.variant,
                    });
                    // navigate
                    history.push("/invoiceslist");
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="containerP">
            <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
                <Grid item container spacing={3}>
                    <Grid item container md={10} className="panelGridRelative">
                        <Card className="panelLargeIcon">
                            <Receipt fontSize="large" />
                        </Card>
                        <Card className="listViewPaper">
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                className="typography"
                            >
                                {t("invoiceCreate")}
                            </Typography>
                            <FormControlLabel
                                style={{ float: "right" }}
                                control={
                                    <Switch
                                        checked={paid}
                                        onChange={() => {
                                            seTpaid(!paid);
                                        }}
                                        color="primary"
                                    />
                                }
                                label={t("paid")}
                            />

                            <Grid item container sm={12}>
                                <Grid container item sm={4} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <label className="selectLabel">
                                                {t("customer")}
                                            </label>
                                            <Select
                                                required
                                                placeholder={t(
                                                    "selectCustomer"
                                                )}
                                                value={selectedDefaultCustomer}
                                                options={dataCustomers}
                                                onChange={handleChangeCustomer}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaCustomerName")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid container item sm={2} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                required
                                                label={t("serie")}
                                                variant="outlined"
                                                margin="dense"
                                                value={state.serie}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        serie: e.target.value,
                                                    });
                                                }}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaSerieName")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                required
                                                label={t("invoiceNumber")}
                                                variant="outlined"
                                                margin="dense"
                                                value={state.no}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        no: e.target.value,
                                                    });
                                                }}
                                                validators={["isNumber"]}
                                                errorMessages={[
                                                    t("thisIsNotNumber"),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaInvoiceNumber")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <MuiPickersUtilsProvider
                                                utils={DateFnsUtils}
                                            >
                                                <KeyboardDatePicker
                                                    inputVariant="outlined"
                                                    margin="dense"
                                                    id="date-picker-dialog"
                                                    label={t("createdDate")}
                                                    format="dd/MM/yyyy"
                                                    value={state.created}
                                                    onChange={(date) =>
                                                        seTstate({
                                                            ...state,
                                                            created: date,
                                                        })
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label":
                                                            "change date",
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                            <FormHelperText>
                                                {t("youNeedaCreatedDate")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid
                                    container
                                    item
                                    sm={6}
                                    spacing={0}
                                    style={{ display: paid ? "none" : "flex" }}
                                >
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                multiline
                                                label={t("duenote")}
                                                variant="outlined"
                                                margin="dense"
                                                value={state.due_note}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        due_note:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaDueNote")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    sm={3}
                                    spacing={0}
                                    style={{ display: paid ? "none" : "flex" }}
                                >
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <label className="selectLabel">
                                                {t("defaultPaymentMethod")}
                                            </label>
                                            <Select
                                                placeholder={t(
                                                    "defaultPaymentMethod"
                                                )}
                                                value={
                                                    state.default_payment_method
                                                }
                                                options={dataPayments}
                                                onChange={(selectedOption) => {
                                                    seTstate({
                                                        ...state,
                                                        default_payment_method: selectedOption,
                                                    });
                                                }}
                                            />
                                            <FormHelperText>
                                                {t(
                                                    "youNeedaDefaultPaymentMethod"
                                                )}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    sm={3}
                                    spacing={0}
                                    style={{ display: paid ? "none" : "flex" }}
                                >
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <MuiPickersUtilsProvider
                                                utils={DateFnsUtils}
                                            >
                                                <KeyboardDatePicker
                                                    inputVariant="outlined"
                                                    margin="dense"
                                                    id="date-picker-dialog"
                                                    label={t("dueDate")}
                                                    format="dd/MM/yyyy"
                                                    value={state.due_date}
                                                    onChange={(date) => {
                                                        seTstate({
                                                            ...state,
                                                            due_date: date,
                                                        });
                                                    }}
                                                    KeyboardButtonProps={{
                                                        "aria-label":
                                                            "change date",
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                            <FormHelperText>
                                                {t("youNeedaDueDate")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    sm={6}
                                    spacing={0}
                                    style={{ display: paid ? "flex" : "none" }}
                                >
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <label className="selectLabel">
                                                {t("selectBankAccount")}
                                            </label>
                                            <Select
                                                placeholder={t(
                                                    "selectBankAccount"
                                                )}
                                                value={state.bank_account}
                                                style={{
                                                    width: "100%",
                                                    marginTop: "-6px",
                                                }}
                                                options={dataBankAccount}
                                                onChange={(selectedOption) => {
                                                    seTstate({
                                                        ...state,
                                                        bank_account: selectedOption,
                                                    });
                                                }}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaselectBankAccount")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    sm={6}
                                    spacing={0}
                                    style={{ display: paid ? "flex" : "none" }}
                                >
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <MuiPickersUtilsProvider
                                                utils={DateFnsUtils}
                                            >
                                                <KeyboardDatePicker
                                                    inputVariant="outlined"
                                                    margin="dense"
                                                    id="date-picker-dialog"
                                                    label={t("paidDate")}
                                                    format="dd/MM/yyyy"
                                                    value={state.paid_date}
                                                    onChange={(date) => {
                                                        seTstate({
                                                            ...state,
                                                            paid_date: date,
                                                        });
                                                    }}
                                                    KeyboardButtonProps={{
                                                        "aria-label":
                                                            "change date",
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                            <FormHelperText>
                                                {t("youNeedaDueDate")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid
                                    item
                                    container
                                    sm={12}
                                    spacing={0}
                                    style={{
                                        borderTop: "1px solid #ddd",
                                        margin: "15px 0",
                                    }}
                                >
                                    <Grid item container sm={3} spacing={0}>
                                        <FormGroup className="FormGroup">
                                            <FormControl>
                                                <Select
                                                    placeholder={t(
                                                        "addProduct"
                                                    )}
                                                    value={
                                                        selectedDefaultProduct
                                                    }
                                                    options={dataProducts}
                                                    onChange={
                                                        handleChangeProduct
                                                    }
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            color: "white",
                                                            width: "100%",
                                                            border: 0,
                                                            borderBottom:
                                                                "1px solid #949494",
                                                            borderRadius: 0,
                                                            marginTop: "10px",
                                                        }),
                                                    }}
                                                />
                                                <FormHelperText>
                                                    {t("youNeedaProductName")}
                                                </FormHelperText>
                                            </FormControl>
                                        </FormGroup>
                                    </Grid>
                                    <Grid item container sm={4} spacing={0} />

                                    <Grid item container sm={5} spacing={0}>
                                        <RadioGroup
                                            value={quantity_name}
                                            onChange={(event) => {
                                                seTquantity_name(
                                                    event.target.value
                                                );
                                            }}
                                            row
                                        >
                                            <label
                                                style={{
                                                    marginTop: "31px",
                                                    marginRight: "10px",
                                                }}
                                            >
                                                {" "}
                                                {t("showQuantityAs")} :{" "}
                                            </label>
                                            <FormControlLabel
                                                value="Qty"
                                                control={<Radio />}
                                                label="Qty"
                                            />
                                            <FormControlLabel
                                                value="Hours"
                                                control={<Radio />}
                                                label="Hours"
                                            />
                                            <FormControlLabel
                                                value="Qty/Hours"
                                                control={<Radio />}
                                                label="Qty/Hours"
                                            />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid
                                        container
                                        item
                                        sm={12}
                                        spacing={0}
                                        style={{
                                            borderTop: "1px solid #ddd",
                                            marginBottom: "25px",
                                        }}
                                    />
                                    <Grid container item sm={3} spacing={0}>
                                        <FormControl
                                            style={{
                                                width: "90%",
                                                paddingLeft: "25px",
                                            }}
                                        >
                                            <TextValidator
                                                multiline
                                                label={t("productName")}
                                                value={product.product_name}
                                                onChange={(e) => {
                                                    seTproduct({
                                                        ...product,
                                                        product_name:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item sm={2} spacing={0}>
                                        <FormControl style={{ width: "90%" }}>
                                            <TextValidator
                                                multiline
                                                label={t("description")}
                                                value={
                                                    product.product_description
                                                }
                                                onChange={(e) => {
                                                    seTproduct({
                                                        ...product,
                                                        product_description:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item sm={1} spacing={0}>
                                        <FormControl style={{ width: "90%" }}>
                                            <TextValidator
                                                type="number"
                                                label={t(quantity_name)}
                                                value={quantity}
                                                onChange={onChangeFquantity}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item sm={1} spacing={0}>
                                        <FormControl style={{ width: "90%" }}>
                                            <TextValidator
                                                label={t("unit")}
                                                value={unit}
                                                onChange={(e) => {
                                                    seTunit(e.target.value);
                                                }}
                                                /*InputLabelProps={{
                                  shrink: true,
                                }}*/
                                            />
                                            <FormHelperText>
                                                {t("youNeedaProductUnit")}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid container item sm={1} spacing={0}>
                                        <FormControl style={{ width: "90%" }}>
                                            <TextValidator
                                                type="number"
                                                label={t("price")}
                                                value={product.sale_price}
                                                onChange={onChangeFprice}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item sm={1} spacing={0}>
                                        <FormControl style={{ width: "90%" }}>
                                            <TextValidator
                                                type="number"
                                                label={t("Discount")}
                                                value={product.product_discount}
                                                onChange={
                                                    onChangeFproduct_discount
                                                }
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            %
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <FormHelperText>
                                                {t("Before Tax")}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>

                                    <Grid container item sm={1} spacing={0}>
                                        <FormControl style={{ width: "90%" }}>
                                            <TextValidator
                                                type="number"
                                                label={t("tax")}
                                                value={product.product_vat}
                                                onChange={onChangeFproduct_vat}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            %
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item sm={1} spacing={0}>
                                        <FormControl style={{ width: "90%" }}>
                                            <TextValidator
                                                disabled
                                                type="number"
                                                label={t("amount")}
                                                value={product.amount}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item sm={1} spacing={0}>
                                        <FormControl>
                                            <Button
                                                color="primary"
                                                onClick={onClickAddItem}
                                                disabled={!product.amount}
                                            >
                                                <Tooltip
                                                    title={t("Add Product")}
                                                >
                                                    <PlaylistAddCheck fontSize="large" />
                                                </Tooltip>
                                            </Button>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container item sm={12} spacing={0}>
                                    <MaterialTable
                                        title="Editable Preview"
                                        columns={columns}
                                        data={items}
                                        icons={tableIcons}
                                        style={{
                                            width: "100%",
                                            boxShadow:
                                                "1px -2px 5px 0px #0000000f",
                                        }}
                                        components={{
                                            Toolbar: (props) => <div />,
                                        }}
                                        options={{
                                            actionsColumnIndex: -1,
                                            paging: false,
                                        }}
                                        editable={{
                                            onRowUpdate: (newData, oldData) =>
                                                new Promise(
                                                    (resolve, reject) => {
                                                        {
                                                            const index = items.indexOf(
                                                                oldData
                                                            );
                                                            items[
                                                                index
                                                            ] = newData;
                                                            seTitems(items);
                                                            totalCebirItems();
                                                        }
                                                        resolve();
                                                    }
                                                ),
                                            onRowDelete: (oldData) =>
                                                new Promise(
                                                    (resolve, reject) => {
                                                        {
                                                            const index = items.indexOf(
                                                                oldData
                                                            );
                                                            items.splice(
                                                                index,
                                                                1
                                                            );
                                                            seTitems(items);
                                                            totalCebirItems();
                                                        }
                                                        resolve();
                                                    }
                                                ),
                                        }}
                                    />
                                </Grid>
                                <Grid container item sm={6} spacing={0} />
                                <Grid container item sm={6} spacing={0}>
                                    <Table
                                        style={{ marginTop: "20px" }}
                                        aria-label="spanning table"
                                    >
                                        <TableBody>
                                            <TableRow>
                                                <TableCell rowSpan={4} />
                                                <TableCell colSpan={2}>
                                                    Subtotal
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className="textRight"
                                                >
                                                    {totalAll.subtotal.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    Tax
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className="textRight"
                                                >
                                                    {" "}
                                                    {totalAll.taxtotal.toFixed(
                                                        2
                                                    )}{" "}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Discount (After Tax){" "}
                                                </TableCell>
                                                <TableCell>
                                                    <TextValidator
                                                        margin="dense"
                                                        type="number"
                                                        style={{
                                                            width: "100px",
                                                            marginLeft: "70px",
                                                        }}
                                                        value={
                                                            totalAll.discount
                                                        }
                                                        onChange={
                                                            onChangeFdiscount
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />

                                                    <Select2
                                                        value={
                                                            totalAll.discountType
                                                        }
                                                        onChange={
                                                            handleChangeDiscountType
                                                        }
                                                        style={{
                                                            marginTop: "5px",
                                                        }}
                                                    >
                                                        <MenuItem value="%">
                                                            %
                                                        </MenuItem>
                                                        <MenuItem value="eksi">
                                                            {t("fixedAmount")}
                                                        </MenuItem>
                                                    </Select2>
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className="textRight"
                                                >
                                                    {" "}
                                                    {Number(
                                                        totalAll.discountValue
                                                    ).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    {t("Total")}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className="textRight"
                                                >
                                                    {" "}
                                                    {Number(
                                                        totalAll.total
                                                    ).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </Card>
                        <div className="saveButtonPlace">
                            <Button type="submit" className="glow-on-hover">
                                <Save
                                    fontSize="small"
                                    style={{ marginRight: "15px" }}
                                />
                                {t("save")}
                            </Button>
                        </div>
                    </Grid>
                    <Grid container item md={2} className="panelGridRelative">
                        <Card className="panelLargeIcon">
                            <ContactMail fontSize="large" />
                        </Card>
                        <Card
                            className="listViewPaper"
                            style={{ marginBottom: "0" }}
                        >
                            <Typography
                                component="h5"
                                variant="h6"
                                color="inherit"
                                noWrap
                                className="typography"
                            >
                                {t("addresses")}
                            </Typography>
                            <Grid
                                item
                                container
                                sm={12}
                                className="gridRightPlace"
                            >
                                <FormControl
                                    component="fieldset"
                                    className="addressFormControll"
                                >
                                    <FormLabel
                                        component="legend"
                                        style={{ width: "100%" }}
                                    >
                                        {t("billingAddress")}
                                        <Button
                                            style={{
                                                float: "right",
                                                padding: "5px",
                                                minWidth: "0",
                                            }}
                                            onClick={() => {
                                                seTedit1Address(!edit1Address);
                                            }}
                                        >
                                            <Edit fontSize="small" />
                                        </Button>
                                    </FormLabel>
                                    <div
                                        style={{
                                            fontSize: "9pt",
                                            marginTop: "15px",
                                        }}
                                    >
                                        {state.selected2Address ||
                                            " ------------------------------------------------------------------------ "}
                                        {` ${state.selected2Zipcode} ` ||
                                            " ------------ "}
                                        {state.selected2Town ||
                                            " ------------ "}
                                        <br />
                                        {state.selectedbillingAddressState[0]
                                            .label || " ------------ "}{" "}
                                        /{" "}
                                        {state.selectedbillingAddressCountry[0]
                                            .label || " ------------ "}
                                    </div>
                                    <div
                                        style={{
                                            display: edit1Address
                                                ? "none"
                                                : "flex",
                                        }}
                                    >
                                        <FormLabel component="legend" />
                                        <FormGroup>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                id="outlined-textarea"
                                                label={t("address")}
                                                multiline
                                                margin="normal"
                                                variant="outlined"
                                                style={{
                                                    width: "100%",
                                                    float: "left",
                                                }}
                                                value={state.selected2Address}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        selected2Address:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaBillingAddress")}
                                            </FormHelperText>
                                            <FormGroup className="FormGroupAddress">
                                                <FormControl>
                                                    <label className="selectLabel">
                                                        {t("country")}
                                                    </label>
                                                    <Select
                                                        placeholder={t(
                                                            "selectCountry"
                                                        )}
                                                        value={
                                                            state.selectedbillingAddressCountry
                                                        }
                                                        options={dataCountry}
                                                        onChange={
                                                            onChangeFbillingAddressCountry
                                                        }
                                                    />
                                                    <FormHelperText>
                                                        {t(
                                                            "youNeedaCountryName"
                                                        )}
                                                    </FormHelperText>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup className="FormGroupAddress">
                                                <FormControl>
                                                    <label className="selectLabel">
                                                        {t("state")}
                                                    </label>
                                                    <Select
                                                        placeholder={t(
                                                            "selectState"
                                                        )}
                                                        value={
                                                            state.selectedbillingAddressState
                                                        }
                                                        options={
                                                            selectedbillingAddressStateArray
                                                        }
                                                        onChange={(
                                                            selectedOption
                                                        ) => {
                                                            seTstate({
                                                                ...state,
                                                                selectedbillingAddressState: [
                                                                    selectedOption,
                                                                ],
                                                            });
                                                        }}
                                                    />
                                                    <FormHelperText>
                                                        {t("youNeedaStateName")}
                                                    </FormHelperText>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup className="FormGroupAddress">
                                                <FormControl>
                                                    <TextValidator
                                                        label={t("zipcode")}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        margin="dense"
                                                        variant="outlined"
                                                        value={
                                                            state.selected2Zipcode
                                                        }
                                                        onChange={(e) => {
                                                            seTstate({
                                                                ...state,
                                                                selected2Zipcode:
                                                                    e.target
                                                                        .value,
                                                            });
                                                        }}
                                                        validators={[
                                                            "isNumber",
                                                        ]}
                                                        errorMessages={[
                                                            t(
                                                                "thisIsNotNumber"
                                                            ),
                                                        ]}
                                                    />
                                                    <FormHelperText>
                                                        {t("youNeedaZipcode")}
                                                    </FormHelperText>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup className="FormGroupAddress">
                                                <FormControl>
                                                    <TextField
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        label={t("town")}
                                                        id="town"
                                                        value={
                                                            state.selected2Town
                                                        }
                                                        onChange={(e) => {
                                                            seTstate({
                                                                ...state,
                                                                selected2Town:
                                                                    e.target
                                                                        .value,
                                                            });
                                                        }}
                                                    />
                                                    <FormHelperText>
                                                        {t("youNeedaTownName")}
                                                    </FormHelperText>
                                                </FormControl>
                                            </FormGroup>
                                        </FormGroup>
                                    </div>
                                </FormControl>
                                <FormControl
                                    component="fieldset"
                                    style={{ width: "100%", marginTop: "25px" }}
                                >
                                    <FormLabel
                                        component="legend"
                                        style={{ width: "100%" }}
                                    >
                                        {t("shippingAddress")}
                                        <Button
                                            style={{
                                                float: "right",
                                                padding: "5px",
                                                minWidth: "0",
                                            }}
                                            onClick={() => {
                                                seTedit2Address(!edit2Address);
                                            }}
                                        >
                                            <Edit fontSize="small" />
                                        </Button>
                                    </FormLabel>
                                    <div
                                        style={{
                                            fontSize: "9pt",
                                            marginTop: "15px",
                                        }}
                                    >
                                        {state.selected3Address ||
                                            " ------------------------------------------------------------------------ "}
                                        {` ${state.selected3Zipcode} ` ||
                                            " ------------ "}{" "}
                                        {state.selected3Town ||
                                            " ------------ "}
                                        <br />
                                        {state.selectedshippingAddressState[0]
                                            .label || " ------------ "}{" "}
                                        /{" "}
                                        {state.selectedshippingAddressCountry[0]
                                            .label || " ------------ "}
                                    </div>
                                    <div
                                        style={{
                                            display: edit2Address
                                                ? "none"
                                                : "flex",
                                        }}
                                    >
                                        <FormGroup>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                id="outlined-textarea"
                                                label={t("address")}
                                                multiline
                                                margin="normal"
                                                variant="outlined"
                                                style={{
                                                    width: "100%",
                                                    float: "left",
                                                }}
                                                value={state.selected3Address}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        selected3Address:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaShippingAddress")}
                                            </FormHelperText>
                                            <FormGroup className="FormGroupAddress">
                                                <FormControl>
                                                    <label className="selectLabel">
                                                        {t("country")}
                                                    </label>
                                                    <Select
                                                        placeholder={t(
                                                            "selectCountry"
                                                        )}
                                                        value={
                                                            state.selectedshippingAddressCountry
                                                        }
                                                        options={dataCountry}
                                                        onChange={
                                                            onChangeFshippingAddressCountry
                                                        }
                                                    />
                                                    <FormHelperText>
                                                        {t(
                                                            "youNeedaCauntryName"
                                                        )}
                                                    </FormHelperText>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup className="FormGroupAddress">
                                                <FormControl>
                                                    <label className="selectLabel">
                                                        {t("state")}
                                                    </label>
                                                    <Select
                                                        placeholder={t(
                                                            "selectState"
                                                        )}
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        value={
                                                            state.selectedshippingAddressState
                                                        }
                                                        options={
                                                            selectedshippingAddressStateArray
                                                        }
                                                        onChange={(
                                                            selectedOption
                                                        ) => {
                                                            seTstate({
                                                                ...state,
                                                                selectedshippingAddressState: [
                                                                    selectedOption,
                                                                ],
                                                            });
                                                        }}
                                                    />
                                                    <FormHelperText>
                                                        {t("youNeedaStateName")}
                                                    </FormHelperText>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup className="FormGroupAddress">
                                                <FormControl>
                                                    <TextValidator
                                                        label={t("zipcode")}
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={
                                                            state.selected3Zipcode
                                                        }
                                                        onChange={(e) => {
                                                            seTstate({
                                                                ...state,
                                                                selected3Zipcode:
                                                                    e.target
                                                                        .value,
                                                            });
                                                        }}
                                                        validators={[
                                                            "isNumber",
                                                        ]}
                                                        errorMessages={[
                                                            t(
                                                                "thisIsNotNumber"
                                                            ),
                                                        ]}
                                                    />
                                                    <FormHelperText>
                                                        {t("youNeedaZipcode")}
                                                    </FormHelperText>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup className="FormGroupAddress">
                                                <FormControl>
                                                    <TextField
                                                        id="town"
                                                        label={t("town")}
                                                        margin="dense"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={
                                                            state.selected3Town
                                                        }
                                                        onChange={(e) => {
                                                            seTstate({
                                                                ...state,
                                                                selected3Town:
                                                                    e.target
                                                                        .value,
                                                            });
                                                        }}
                                                    />
                                                    <FormHelperText>
                                                        {t("youNeedaTownName")}
                                                    </FormHelperText>
                                                </FormControl>
                                            </FormGroup>
                                        </FormGroup>
                                    </div>
                                </FormControl>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </ValidatorForm>
        </div>
    );
}
