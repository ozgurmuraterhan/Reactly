import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

const Exercise = (props) => (
    <tr>
        <td>{props.exercise.username}</td>
        <td>{props.exercise.description}</td>
        <td>{props.exercise.duration}</td>
        <td>{props.exercise.date.substring(0, 10)}</td>
        <td>
            <Link to={`/edit/${props.exercise._id}`}>Edit</Link>
            ||
            <a
                href="#/"
                onClick={() => {
                    props.deleteExercise(props.exercise._id);
                }}
            >
                Delete
            </a>
        </td>
    </tr>
);

export default class ExercisesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
        };
    }

    componentDidMount() {
        axios
            .get('/exercises')
            .then((response) => {
                if (response.data.length > 0) {
                    this.setState({
                        exercises: response.data,
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    deleteExercise = (id) => {
        axios.delete(`/exercises/${id}`).then((res) => console.log(res.data));

        this.setState({
            exercises: this.state.exercises.filter((del) => del._id !== id),
        });
    };

    exercisesList = () =>
        this.state.exercises.map((currentexercise) => (
            <Exercise
                exercise={currentexercise}
                deleteExercise={this.deleteExercise}
                key={currentexercise._id}
            />
        ));

    render() {
        return (
            <div className="container" style={{ margin: '50px' }}>
                <Paper className="rootTable">
                    <Table className="tableSimple">
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell align="right">Description</TableCell>
                                <TableCell align="right">Duration</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right"> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.exercises.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell component="th" scope="row">
                                        {row.username}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.description}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.duration}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.date}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link to={`/edit/${row._id}`}>
                                            <Edit />
                                        </Link>
                                        <a
                                            href="#/"
                                            onClick={() => {
                                                this.deleteExercise(row._id);
                                            }}
                                        >
                                            <Delete />
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}
