
import React, {Component} from 'react'
import {render} from 'react-dom'
import Navigation from '../components/Navigation';
import axios from 'axios'
import Swal from 'sweetalert'
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import { faFileAlt, faEdit, faRetweet, faTrash, faFile, faSave, faSyncAlt, faCheckCircle, faSkull, faClock, faRedo, faSearch }from '@fortawesome/free-solid-svg-icons'
import DataTable from "@material-table/core";
import {Grid, Avatar} from "@material-ui/core";

import {Table, Container, InputGroup, Input, Button } from 'reactstrap'

import Cookies from 'universal-cookie';

const cookies = new Cookies();
const{REACT_APP_HOST, REACT_APP_PATCH} = process.env;

const paginacion = {
    labelRowsSelect: 'Filas',
    labelRowsPerPage: 'Filas por Pagina',
    previousAriaLabel: 'Pagina Anterior',
    previousTooltip: 'Pagina Anterior',
    nextAriaLabel: 'Siguiente Página',
    nextTooltip: 'Siguiente Página',
    lastAriaLabel: 'Ultima page',
    lastTooltip: 'Ultima page',
    firstAriaLabel: 'Primera Página',
    firstTooltip: 'Primera Página'
}

const toolbar = {
    exportTitle: 'Exportar',
    exportAriaLabel: 'Exportar',
    exportName: 'Exportar a',
    searchTooltip: 'Buscar',
    searchPlaceholder: 'Buscar'
}


export default  class ResetIntentos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ci_user: '',
            usuario: '',
            lista_taller_user: []
        }
        this.handleChange = this.handleChange.bind(this);


    }
    componentDidMount() {
        if (!cookies.get('nombre')) {
            window.location.href = '/';
        }
    }

    get_taller_usuario(ci) {
        if (ci != '') {
            axios.get(`${REACT_APP_HOST}/api/user_taller/get_taller_ci/` + ci).then((response) => {
                if (response.data != '') {
                    this.setState({lista_taller_user: response.data})
                    this.get_user(ci);
                } else {
                    Swal({
                        title: 'Atención',
                        text: 'No se encontraron resultados con este CI:' + ci + ' ',
                        icon: 'warning',
                        timer: 3000,
                        button: false
                    });
                }
            })
        } else {
            Swal({
                title: 'Atención',
                text: 'El campo cedula esta vacio',
                icon: 'warning',
                timer: 2000,
                button: false
            });
        }

    }
    get_user(ci) {
        const datos = {ci: ci}
        axios.post(`${REACT_APP_HOST}/api/users/user_ci`, datos).then((response) => {
            if (response) {
                this.setState({usuario: response.data.nombre + response.data.apellido})
            }
        })
    }

    resetearIntentos(row_id) {

        Swal({
            title: '! Atención',
            text: ' Esta seguro de resetear los intentos',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.put(`${REACT_APP_HOST}/api/user_taller/` + row_id).then((response) => {
                    if (response) {
                        Swal({
                            title: ' OK',
                            text: ' Los intentos se han reseteado para este taller',
                            icon: 'success',
                        })
                    }
                })
            }
        })

    }

    handleChange(e) {
//        console.log(e.target.value);
        if (e.target.type === 'checkbox') {
            var value = e.target.checked;
            var name = e.target.name;
        } else {
            var {name, value} = e.target;
        }

        this.setState({[name]: value});
    }

    render() {
        return(
                <div className="container-fluid">
                    <Navigation />
                    <Container>
                        <div className="row col-md-12 my-3 ml-3 container-fluid">
                            <div className="col-md-5">
                                <InputGroup size="sm">
                                    <Input name='ci_user' onChange={this.handleChange} value={this.state.ci_user} placeholder='Ingrese el número de cédula'/>
                                    <Button color="dark" size="sm" onClick={() => {
                                            this.get_taller_usuario(this.state.ci_user)
                                                }}> Buscar Usuario <FontAwesomeIcon icon={ faSearch}/></Button>                                                                
                                </InputGroup>
                            </div>
                            <div className='col-md-6 text-center'>
                                <h3>Restablecer Intentos Por Taller</h3>
                            </div>
                        </div>
                        <div className="containerSetting">
                            <DataTable
                
                                columns={[
                                    {title: 'Taller', field: 'taller_user.title'},
                                    {title: 'Intentos Permitidos', field: 'taller_user.intentos', render: (rowData) => <Grid><Avatar>{rowData.taller_user.intentos}</Avatar></Grid>},
                                    {title: 'Total de Intentos', field: 'intentos', render: (rowData) => <Grid><Avatar>{rowData.intentos}</Avatar></Grid>}
                                ]}
                
                                data={this.state.lista_taller_user}
                                title={this.state.usuario}
                                actions={[
//                                   
                                    {
                                        icon: () => <a className="btn btn-warning btn-sm" size="sm"><FontAwesomeIcon icon={faRetweet}/></a>,
                                        tooltip: 'Resetear Intentos',
                                        onClick: (event, rowData) => {
                                            this.resetearIntentos(rowData._id)
                                        }
                                    },
                                ]}
                                options={{
                                        actionsColumnIndex: -1,
                                        exportButton: true,
                                        headerStyle: {
                                            backgroundColor: '#343a40',
                                            color: '#FFF'
                                        },
                                        padding: 'dense', //dense
                                        pageSize: 8,
                                        pageSizeOptions: [8, 15, 30],
                                        paginationType: 'stepped'
                                    }}
                                localization={{
                                        pagination: paginacion,
                                        toolbar: toolbar,
                                        header: {
                                            actions: 'Reset'
                                        }
                                    }}
                                />
                        </div>
                
                    </Container>
                
                </div>

                );
    }
}
