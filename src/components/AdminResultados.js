import React, {Component} from 'react';
import{Link} from'react-router-dom';
import {render}from'react-dom';
import {Container, Table}from 'reactstrap';
import Navigation from '../components/Navigation';
import axios from 'axios';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faCheckCircle, faExclamationCircle}from '@fortawesome/free-solid-svg-icons'

        const{REACT_APP_HOST} = process.env;
var t_c = [];
var talleres_comp = [];


class AdminResultados extends Component {

    constructor() {
        super();
        this.state = {
            talleres: [],
            usuarios: [],
            user_talleres: [],
        }



    }
    componentDidMount() {
        this.getTalleres();
    }

    getTalleres() {
        axios.get(`${REACT_APP_HOST}/api/talleres`).then((response) => {
            this.setState({talleres: response.data})
            this.getUsuarios();
        })
    }

    getUsuarios() {
        axios.get(`${REACT_APP_HOST}/api/users`).then((response) => {
            this.setState({usuarios: response.data});
            this.getUserTaller();
        })
    }

    getUserTaller() {
        axios.get(`${REACT_APP_HOST}/api/user_taller/`).then((response) => {
            this.setState({user_talleres: response.data})
//            console.log(response.data)
        })

    }


    marcarCompletado(user, index) {
        var taller_completado = [];
        var returnedobj = [];
        this.state.talleres.map((taller, i) => {
            var estado = '0';
            this.state.user_talleres.map((user_taller, j) => {
                if (user === user_taller.id_user) {
                    if (taller._id === user_taller.id_taller) {
                        estado = '1';
                    }
                }
            })
            if (estado === '1') {
                returnedobj = Object.assign(taller, {estado: '1'});
//                console.log(returnedobj)
            } else {
                returnedobj = Object.assign(taller, {estado: '0'});
            }
            taller_completado.push(returnedobj);

        })
//        console.log(taller_completado);

        talleres_comp = taller_completado;
        console.log(talleres_comp)
    }

    render() {

        return(
                <div>
                    <Navigation />
                    <div className="containerList my-3"> 
                        <h1>Resultados</h1>
                
                        <Table>
                            <thead>
                
                                <tr>
                
                                    <th>USUARIO</th>
                                    <th>CEDULA</th>
                                    {
                                        this.state.talleres.map((data, index) => (
                                        <th key={data._id}>{data.title}</th>
                                                    ))
                                    }
                
                                </tr>
                            </thead>
                            <tbody>
                
                                {
                                    this.state.usuarios.map((data, index) => (
                                        <tr key={data._id}>
                                            <td>{data.nombre}{' '}{data.apellido}</td>
                                            <td>{data.cedula}</td>
                                            {this.marcarCompletado(data._id, index)}
                                            {
                                              talleres_comp.map((data) => (
                                                                     
                                                <td key={data._id}>
                                                    {data.estado==='1'?<span className='badge text-success'>Completo <FontAwesomeIcon icon={faCheckCircle} /></span>
                                                                       :<span className='text-warning badge'>En curso <FontAwesomeIcon icon={faExclamationCircle} /></span>}
                                                 </td>
                                                            
                                            ))
                                    }
                                    </tr>
                                            ))
                            }
                
                            </tbody>
                        </Table>
                    </div>
                </div>

                );
    }
}

export default AdminResultados;