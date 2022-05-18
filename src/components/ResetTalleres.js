
import React, {Component} from 'react'
import {render} from 'react-dom'
import Navigation from '../components/Navigation';
import axios from 'axios'
import Swal from 'sweetalert'
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import { faFileAlt, faEdit, faRetweet, faTrash, faFile, faUser, faSave, faSyncAlt, faCheckCircle, faSkull, faClock, faRedo, faSearch }from '@fortawesome/free-solid-svg-icons'
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


export default  class ResetTalleres extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ci_user: '',
            usuario: '',
            lista_taller_user: [],
            lista_user: [],
            lista_areas: [],
            lista_taller_es:[],
            area_id:'-1'
        }
        this.handleChange = this.handleChange.bind(this);


    }
    componentDidMount() {
        if (!cookies.get('nombre')) {
            window.location.href = '/';
        }
//        this.get_usuarios();
    }

    async get_usuarios() {
        var response = await axios.get(`${REACT_APP_HOST}/api/users`);
        if (response.data) {
            this.setState({lista_user: response.data})
        } else {
            Swal({
                title: 'Atención',
                text: 'No se encontraron resultados de usuarios ',
                icon: 'warning',
                timer: 3000,
                button: false
            });

        }
        this.get_areas();
    }
    async get_areas() {
        var response = await axios.get(`${REACT_APP_HOST}/api/areas`);
        if (response.data) {
            this.setState({lista_areas: response.data})
        } else {
            Swal({
                title: 'Atención',
                text: 'No se encontraron resultados de áreas ',
                icon: 'warning',
                timer: 3000,
                button: false
            });
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
    
    get_taller_es() {
            axios.post(`${REACT_APP_HOST}/api/talleres/get_taller_ess`).then((response) => {
                if (response.data != '') {
                    this.setState({lista_taller_es: response.data})
                } else {
                    Swal({
                        title: 'Atención',
                        text: 'No se encontraron resultados con este CI:',
                        icon: 'warning',
                        timer: 3000,
                        button: false
                    });
                }
            })
        


    }


    resetearTaller(row_id, id_taller) {
        var id_us_taller = cookies.get('id');
        Swal({
            title: '! Atención, Esta seguro de continuar',
            text: ' Este Proceso restaurara todo el taller incluido sus resltados',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.put(`${REACT_APP_HOST}/api/user_taller/reset_talleres/` + row_id + '/' + id_us_taller + '/' + id_taller).then((response) => {
                    if (response) {
                        Swal({
                            title: ' OK',
                            text: ' El taller se han reseteado exitosamente, Los resultados del taller han sido eliminados',
                            icon: 'success',
                        })
                    }

                })
            }
        })
    }
    resetearTaller_user_area(row_id) {
        Swal({
            title: '! Atención, Esta seguro de continuar',
            text: ' Este Proceso restaurara todo el taller incluido sus resltados',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.put(`${REACT_APP_HOST}/api/user_taller/reset_talleres_us_ar/` + row_id +'/'+this.state.area_id).then((response) => {
                    if (response.data==='ok') {
                        Swal({
                            title: ' OK',
                            text: ' El taller se han reseteado exitosamente, Los resultados del taller han sido eliminados',
                            icon: 'success',
                        })
                    }else{
                         Swal({
                            title: ' Atención',
                            text: response.data,
                            icon: 'warning',
                        })
                       
                    }

                })
            }
        })
    }
    resetearTaller_taller(row_id) {
        Swal({
            title: '! Atención, Esta seguro de continuar',
            text: ' Este Proceso restaurara el taller a todos los usuarios',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.put(`${REACT_APP_HOST}/api/user_taller/reset_talleres_tall/` + row_id ).then((response) => {
                    if (response.data) {
                        Swal({
                            title: ' OK',
                            text: ' El taller se han reseteado exitosamente, Los resultados del taller han sido eliminados',
                            icon: 'success',
                        })
                    }

                })
            }
        })
    }
    reget_general(row_id) {
        Swal({
            title: '! Atención, Esta seguro de continuar',
            text: ' Este Proceso restaurara todos los talleres de cada uno de los usuarios',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.post(`${REACT_APP_HOST}/api/user_taller/reset_general` ).then((response) => {
                    if (response.data) {
                        Swal({
                            title: ' OK',
                            text: ' Todos los talleres han sido restaurados a estado EN CURSO',
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
                                <h4>RETABLECER TALLERES</h4>
                            </div>
                        </div>
                        <div className="containerSetting">
                            <DataTable
                
                
                                data={this.state.lista_taller_user}
                                title={this.state.usuario}
                                actions={[
//                                   
                                    {
                                        icon: () => <a className="btn btn-warning btn-sm" size="sm"><FontAwesomeIcon icon={faRetweet}/></a>,
                                            tooltip: 'Resetear Taller',
                                            onClick: (event, rowData) => {
                                                if (rowData.estado === '1') {
                                                    this.resetearTaller(rowData._id, rowData.id_taller)
                                                }
                                            }
                                        },
                                ]}
                
                                columns={[
                                    {title: 'Taller', field: 'taller_user.title'},
                                    {title: 'Área', field: 'area_taller.title'},

                                    {title: 'Estado del Taller', field: 'estado',
                                        render: (rowData) => rowData.estado === '0' ? <span size="sm" className='badge text-white bg-warning'>En curso <FontAwesomeIcon icon={faFileAlt} /></span>
                                                    : <span size="sm" className='badge bg-success text-white'>Aprobado <FontAwesomeIcon icon={faCheckCircle}/></span>

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
                    <hr/>
                    <Container>
                        <div className="row col-md-12 my-3 ml-3 container-fluid">
                            <div className="col-md-5">
                                <Button color="dark" size="sm" onClick={() => {
                                        this.get_taller_es()
                                            }}><FontAwesomeIcon icon={ faFileAlt}/> Show Talleres</Button>                                                                
                            </div>
                
                        </div>
                        <div className="containerSetting">
                            <DataTable
                
                
                                data={this.state.lista_taller_es}
                                title='RESETEAR TODOS LOS TALLERES POR NOMBRE DE TALLER'
                                actions={[
//                                   
                                    {
                                        icon: () => <a className="btn btn-warning btn-sm" size="sm"><FontAwesomeIcon icon={faRetweet}/></a>,
                                            tooltip: 'Resetear Talleres por Taller',
                                            onClick: (event, rowData) => {
                                                if (rowData.estado === '1') {
                                                    this.resetearTaller_taller(rowData._id)
                                                }
                                            }
                                        },
                                ]}
                
                                columns={[
                                    {title: 'Taller', field: 'title'},
                                    {title: 'Área', field: 'talleres_area.title'},

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
                    <hr/>
                    <Container>
                        <div className="row col-md-12 my-3 ml-3 container-fluid">
                            <div className="col-md-5">
                                <Button color="dark" size="sm" onClick={() => {
                                        this.get_usuarios()
                                            }}><FontAwesomeIcon icon={ faUser}/> Show Users</Button>                                                                
                            </div>
                
                        </div>
                        <div className="containerSetting">
                            <DataTable
                
                
                                data={this.state.lista_user}
                                title='RESETEAR TODOS LOS TALLERES POR USUARIO Y ÁREAS'
                                actions={[
//                                   
                                    {
                                        icon: () => <a className="btn btn-warning btn-sm" size="sm"><FontAwesomeIcon icon={faRetweet}/></a>,
                                            tooltip: 'Resetear Taller',
                                            onClick: (event, rowData) => {
                                                    this.resetearTaller_user_area(rowData._id)                                                
                                            }
                                        },
                                ]}
                
                                columns={[
                                    {title: 'Nombre', field: 'nombre'},
                                    {title: 'Apellido', field: 'apellido'},

                                    {title: 'Area',
                                        render: (rowData) =><select size="sm" className='badge text-white bg-info' onChange={this.handleChange} name="area_id" value={this.state.area_id}>
                                                                <option value="-1" >Todas las Áreas</option>
                                                                {
                                                                        this.state.lista_areas.map((data) => (
                                                                <option key={data._id}  value={data._id}>{data.title}</option>
                                                                                    ))
                                                                }
                                                            </select>

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
                    <hr/>
                     <Container>
                        <div className="row col-md-12 my-5 container-fluid">
                            <button className='form-control btn btn-danger' onClick={()=>{this.reget_general()}}>RESETEAR TODO (ESTE PROCESO PASARA HA ESTADO EN CURSO A TODOS LOS TALLERES DE CADA USUARIO)</button>
                        </div>
                     </Container>
                
                </div>

                );
    }
}
