import React, {Component}from'react';
import {render}from'react-dom';
import {Table, Button, Container, CustomInput,InputGroup,InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter, formGroup} from 'reactstrap';
import Swal from 'sweetalert';
import axios from 'axios'
import P from '../components/P';
import Styles from '../index.css'
import md5 from 'md5';
import DataTable from "@material-table/core";
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import { faFileAlt, faEdit, faTrash, faFile, faSave, faSyncAlt, faCheckCircle, faBan,faSkull, faClock, faRedo, faFileExcel, faUser, faUnlockAlt }from '@fortawesome/free-solid-svg-icons'
//import DataTable from 'material-table';
import XLSX from 'xlsx'
import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';
import Cookies from 'universal-cookie';

import firebase from '../../src/setting/server_firebase';



const cookies = new Cookies();

const {REACT_APP_HOST, REACT_APP_STORAGE} = process.env;

var storage = firebase.app().storage(`${REACT_APP_STORAGE}`);

const validation = data => {
    const errors = {};
    if (!data.nombre) {
        errors.nombre = 'El campo nombres es obligatorio';
    }
    if (!data.apellido) {
        errors.apellido = 'El campo apellidos es obligatorio';
    }
    if (!data.cedula) {
        errors.cedula = 'El campo cédula es obligatorio';
    }
    if (!data.user) {
        errors.user = 'El campo user es obligatorio';
    }
    if (!data.pass) {
        errors.pass = 'El campo password es obligatorio';
    }
    if (!data.rol) {
        errors.rol = 'El rol es un campo obligatorio';
    }
    return errors;
}

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



class AdminUsers extends Component {
    constructor() {
        super();
        this.state = {
            nombre: '',
            apellido: '',
            cedula: '',
            user: '',
            pass: '',
            correo: '',
            telefono: '',
            rol: 'USUARIO',
            _id: '',
            users: [],
            textButton: 'REGISTRAR',
            header: 'Insertar Usuario',
            modalOpen: false,
            image: '...',
            errors: {},
            img_temp: '',
            aux: '',
            estado_update: false,
            modalOpenPass: false,
            newpassconfirm: '',
            newpass: ''

        }

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showModalPass = this.showModalPass.bind(this);
        this.hideModalPass = this.hideModalPass.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.addUser = this.addUser.bind(this)
    }
    componentDidMount() {//Es como el initComponents
        this.getUsers();//Para que inicie la pantalla de tareas
    }
    getUsers() {
        axios.get(`${REACT_APP_HOST}/api/users`).then((response) => {
            this.setState({users: response.data});
//            console.log(response.data);
        })
    }

    addUser(e) {
        e.preventDefault();

        const {errors, ...sinErrors} = this.state;
        const result = validation(sinErrors);
        this.setState({errors: result});

        if (!Object.keys(result).length) {
            let datos = new FormData();
            datos.append('nombre', this.state.nombre);
            datos.append('apellido', this.state.apellido);
            datos.append('cedula', this.state.cedula);
            datos.append('user', this.state.user);
            datos.append('pass', this.state.pass);
            datos.append('correo', this.state.correo);
            datos.append('telefono', this.state.telefono);
            datos.append('rol', this.state.rol);
//            datos.append('image', this.state.image.name);

            if (this.state._id && this.state.aux === '') {
//                console.log('modifico');
                datos.append('image', this.state.image);
            } else if (this.state._id && this.state.aux.name) {
//                 console.log('modifico imagen');
                datos.append('image', this.state.image.name);
            } else {
//                 console.log('guardo');
                if (this.state.aux !== '') {
                    datos.append('image', this.state.image.name);
                } else {
                    datos.append('image', '...');
                }
            }

            if (this.state._id) {

                if (this.state.aux.name) {
                    this.deleteImage2();
                    this.uploadImage2();
                }

                axios.put(`${REACT_APP_HOST}/api/users/` + this.state._id, datos).then(async(response) => {
//                    let eliminar = await this.deleteImage();
//                    let cargar = await this.uploadImage();
                    Swal({
                        title: 'Usuario Actualizada',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getUsers();
                    this.setState({nombre: '', apellido: '', cedula: '',correo:'',telefono:'', user: '', pass: '', rol: 'USUARIO', _id: '', textButton: 'REGISTRAR', header: 'Insertar Usuario', modalOpen: false, aux: '', estado_update: false, image: '...', errors: {}});
                })
            } else {

                axios.post(`${REACT_APP_HOST}/api/users`, datos).then(async(response) => {
                    let cargar = await this.uploadImage();

                    Swal({
                        title: 'Usuario registrada',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getUsers();

                    this.setState({nombre: '', apellido: '', cedula: '',correo:'',telefono:'', rol: 'USUARIO', user: '', pass: '', aux: '', image: '...'});
                });
            }

        }

    }

    editUser(id) {
        axios.get(`${REACT_APP_HOST}/api/users/` + id).then((response) => {
//            console.log(response.data)
            this.setState({
                nombre: response.data.nombre,
                apellido: response.data.apellido,
                cedula: response.data.cedula,
                user: response.data.user,
                pass: response.data.pass,
                telefono: response.data.telefono,
                correo: response.data.correo,
                rol: response.data.rol,
                image: response.data.image,
                img_temp: response.data.image,
                _id: response.data._id,
                textButton: 'ACTUALIZAR',
                estado_update: true,
                header: 'Actualizar Usuario'
            });
//            console.log(this.state.image)
        });
    }

    validarEliminacion(id, image, nombre, apellido) {
        axios.get(`${REACT_APP_HOST}/api/user_taller/` + id).then((response) => {
            if (response.data <= 0) {
                this.deleteUser(id, image, nombre, apellido);
            } else {
                Swal({
                    title: '!Atención',
                    text: 'Este Usuario tiene historial en el sistema, imposible eliminar',
                    icon: 'warning',
                    button: true
                });
            }
        });
    }

    deleteUser(id, image, nombre, apellido) {
        this.setState({img_temp: image});
        Swal({
            title: `Esta seguro de eliminar el Usuario ${nombre} ${apellido}`,
            text: ' El usuario se eliminara definitivamente',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.delete(`${REACT_APP_HOST}/api/users/` + id).then(async(response) => {
//                    console.log(response.data);
                    if (this.state.img_temp !== '...') {
                        let eliminar = await this.deleteImage();
                    }
                    Swal({
                        title: 'Usuario eliminada',
                        icon: 'success',
                        timer: 1000,
                        button: false
                    });
                    this.getUsers();
                });
            }
        });
    }

    showModal() {
        this.setState({modalOpen: true});
    }
    hideModal() {
        this.setState({nombre: '', apellido: '', cedula: '', user: '', pass: '',correo:'',telefono:'', rol: 'USUARIO', modalOpen: false,estado_update: false, textButton: 'REGISTRAR', header: 'Insertar Usuario', image: '...', errors: {}})
    }

    showModalPass() {
        this.setState({modalOpenPass: true});
    }
    hideModalPass() {
        this.setState({modalOpenPass: false,newpass:'',newpassconfirm:''});
    }

    handleChange(e) {
        const{name, value} = e.target;
        this.setState({[name]: value});
//        console.log(e.target.value);
    }

    uploadImage = async() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imguser/${this.state.image.name}`);
        return await spaceRef.put(this.state.image)

    }
    deleteImage = async() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imguser/${this.state.img_temp}`);
        return await  spaceRef.delete();

    }

    uploadImage2 = () => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imguser/${this.state.image.name}`);
        return spaceRef.put(this.state.image);

    }
    deleteImage2 = () => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imguser/${this.state.img_temp}`);
        return  spaceRef.delete();

    }

    handleImageUpload = (e) => {

        this.setState({image: e.target.files[0], aux: e.target.files[0]});
//        console.log(e.target.files[0]);
    }

    downloadReporte = (e) => {
        const newData = this.state.users.map(row => {
            delete row._id;
            delete row.__v;
            delete row.pass;
            return row;
        })
        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "usuarios");
        //Buffer
        let buf = XLSX.write(workBook, {bookType: "xlsx", type: "buffer"});
        //Binary string
        XLSX.write(workBook, {bookType: "xlsx", type: "binary"});
        //Download
        XLSX.writeFile(workBook, "Usuarios.xlsx");


    }

    resetearPassword = (e) => {
        e.preventDefault();
        const datos = {newpass: this.state.newpass, id_user:this.state._id}
        if (this.state.newpass === this.state.newpassconfirm) {
            axios.post(`${REACT_APP_HOST}/api/users/resetpassword`, datos).then((response) => {
                if (response.data) {
                    Swal({
                        title: '!OK',
                        text: 'La contraseña ha sido reseteada exitosamente',
                        icon: 'success'
                    });
                }
                this.setState({modalOpenPass: false});
            });
        } else {
            Swal({
                title: '!Atencion',
                text: 'Las contraseñas no coinciden',
                icon: 'warning'
            });
        }

    }

    render() {
        const {errors} = this.state;
        return (
                <div className="container-fluid">
                    <Navigation />
                    <div className="containerList">
                
                
                        <br/>
                        <Button color="primary" onClick={this.showModal}><FontAwesomeIcon icon={faUser}/> Nuevo Usuario</Button>
                       
                        {this.state.users.length > 0 ?
                                    <DataTable
                            
                                        columns={[
                                                            {title: 'NOMBRE', field: 'nombre'},
                                                            {title: 'APELLIDO', field: 'apellido'},
                                                            {title: 'CÉDULA', field: 'cedula'},
                                                            {title: 'CORREO', field: 'correo'},
                                                            {title: 'TELÉFONO', field: 'telefono'},
                                                            {title: 'USUARIO', field: 'user'},
                                                            {title: 'ROL', field: 'rol'},
                                                            {title: 'IMAGEN', field: 'image'},
                                                        ]}
                                        data={this.state.users}
                                        title='Lista de Usuarios del Sistema'
                                        actions={[
                                                    {
                                                        icon: () => <span className="btn btn-secondary btn-sm" ><FontAwesomeIcon icon={faUnlockAlt}/></span>,
                                                            tooltip: 'Resetear Password',
                                                            onClick: (event, rowData) => {
                                                                this.showModalPass();
                                                                this.editUser(rowData._id);
                                                            }
                                                        },
                                                        {
                                                        icon: () => <span className="btn btn-warning btn-sm" ><FontAwesomeIcon icon={faEdit}/></span>,
                                                        tooltip: 'Editar Usuario',
                                                        onClick: (event, rowData) => {
                                                            this.showModal();
                                                            this.editUser(rowData._id);
                                                        }
                                                    },
                                                    {
                                                            icon: () => <span className="btn btn-danger btn-sm" ><FontAwesomeIcon icon={faTrash}/></span>,
                                                            tooltip: 'Eliminar Usuario',
                                                            onClick: (event, rowData) => this.validarEliminacion(rowData._id, rowData.image, rowData.nombre, rowData.apellido)
                                                        },
                                                        {
                                                            icon: () => <span className="btn btn-success btn-sm" ><FontAwesomeIcon icon={faFileExcel}/> Exportar</span>,
                                                            tooltip: 'Exportar a Excel',
                                                            onClick: () => this.downloadReporte(),
                                                            isFreeAction: true
                                                        }
                                                    ]}
                                        options={{
                                                        actionsColumnIndex: -1,
                                                        toolbar: true,
                                                        exportButton: true,
                                                        filtering: true,
                                                        headerStyle: {
                                                            backgroundColor: '#343a40',
                                                            color: '#FFF'
                                                        },
                                                        padding: 'default', //dense
                                                        pageSize: 8,
                                                        pageSizeOptions: [8, 15, 30],
                                                        paginationType: 'stepped'
                                                    }}
                                        localization={{
                                                        pagination: paginacion,
                                                        toolbar: {
                                                            exportCSVName: "Export some Excel format",
                                                            exportPDFName: "Export as pdf!!"
                                                        },
                                                        header: {
                                                            actions: 'ACCIONES'
                                                        }
                                                    }}
                                        style={{fontSize: "12px", padding: '15px', cellPadding: '0px'}}
                                        />
                                        : <h1>No hay Usuarios registrados</h1>}
                            <Modal isOpen={this.state.modalOpen}>
                                <ModalHeader>
                                    <div><h3><FontAwesomeIcon icon={faUser}/> {this.state.header}</h3></div>
                                </ModalHeader>
                
                                <ModalBody>
                                    <form onSubmit={this.addUser} className="container">
                                        <div className="row">
                                         <InputGroup className="my-1" >
                                            <InputGroupText>
                                                Nombres
                                            </InputGroupText>
                                                <input name="nombre" onChange={this.handleChange} type="text" className="form-control" placeholder="Cristian" value={this.state.nombre}/>
                                        </InputGroup>    
                                        {errors.nombre && <P errors={errors.nombre} />}
                                        </div>
                                        
                                        <div className="row my-2">
                                         <InputGroup className="my-1" >
                                            <InputGroupText>
                                                Apellidos
                                            </InputGroupText>
                                            <input name="apellido" onChange={this.handleChange} type="text" className="form-control" placeholder="Paz" value={this.state.apellido}/>
                                        </InputGroup>    
                                        {errors.apellido && <P errors={errors.apellido} />}
                                        </div>  
                                        
                                        <div className="row">
                                         <InputGroup className="my-1" >
                                            <InputGroupText>
                                                Cédula
                                            </InputGroupText>
                                            <input name="cedula" onChange={this.handleChange} type="number" className="form-control " placeholder="1900xxxxxx" value={this.state.cedula}/>
                                        </InputGroup>   
                                            {errors.cedula && <P errors={errors.cedula} />}
                                        </div> 
                                        
                                        <div className="row my-2">
                                         <InputGroup className="my-1" >
                                            <InputGroupText>
                                                Usuario
                                            </InputGroupText>
                                            <input name="user" onChange={this.handleChange} type="text" className="form-control" placeholder="cris" value={this.state.user}/>
                                        </InputGroup>    
                                        {errors.user && <P errors={errors.user} />}
                                        </div>
                                        
                                        {this.state.estado_update !== true ?
                                    <div className="row">
                                    <InputGroup className="my-1" >
                                            <InputGroupText>
                                                Contraseña
                                            </InputGroupText>
                                        <input name="pass" onChange={this.handleChange} type="password" className="form-control " placeholder="*****" value={this.state.pass}/>
                                    </InputGroup>    
                                        {errors.pass && <P errors={errors.pass} />}
                                    
                                     </div> : ''}
                                    <div className="row my-2">
                                    <InputGroup className="my-1" >
                                            <InputGroupText>
                                                Correo
                                            </InputGroupText>
                                        <input name="correo" onChange={this.handleChange} type="email" className="form-control " placeholder="pcris.994@gmail.com" value={this.state.correo}/>
                                    </InputGroup>
                                    </div>
                                    
                                    <div className="row my-2">
                                    <InputGroup className="my-1" >
                                            <InputGroupText>
                                                Teléfono
                                            </InputGroupText>
                                        <input name="telefono" onChange={this.handleChange} type="text" className="form-control " placeholder="0992094788" value={this.state.telefono}/>
                                    </InputGroup>    
                                    </div>
                                        <div className="row my-2">
                                        <InputGroup className="my-1" >
                                            <InputGroupText>
                                                Rol
                                            </InputGroupText>
                                            <select className="form-control" name="rol" onChange={this.handleChange} value={this.state.rol}>
                                                <option>Selecione un Rol</option>
                                                <option value="USUARIO">USUARIO</option>
                                                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                                            </select>
                                        </InputGroup>    
                                            {errors.rol && <P errors={errors.rol} />}
                                        </div>                            
                                        <div className="row my-2">
                                            <CustomInput className="form-control-sm" name="image" type="file" onChange={this.handleImageUpload} id="image" label='Seleccione una Foto' accept="image/png, .jpeg, .jpg"/>
                                        </div>
                                        <br/>
                
                                        <Button id="btnInsertar"><FontAwesomeIcon icon={faSave}/> {this.state.textButton}</Button>{' '}
                                        <Button id="btnCancelar" onClick={this.hideModal} className="btn btn-danger" data-dismiss="modal" aria-hidden="true"><FontAwesomeIcon icon={faBan}/> CANCELAR</Button>
                                    </form>
                                </ModalBody>               
                            </Modal>
                
                            <Modal isOpen={this.state.modalOpenPass}>
                                <ModalHeader>
                                    <div><h3>Resetear Password</h3></div>
                                </ModalHeader>
                
                                <ModalBody>
                                    <form onSubmit={this.resetearPassword} className="container">
                
                                        <div className="row">
                                            <input name="newpass" onChange={this.handleChange} type="password" className="form-control form-control-sm" placeholder="Ingrese la nueva contraseña" required value={this.state.newpass}/>
                                        </div>
                                        <div className="row">
                                            <input name="newpassconfirm" onChange={this.handleChange} type="password" className="form-control form-control-sm" placeholder="Confirme la nueva contraseña" required value={this.state.newpassconfirm}/>
                                        </div>
                
                                        <br/>
                
                                        <Button id="btnReset"> <FontAwesomeIcon icon={faUnlockAlt}/> RESETEAR</Button>{' '}
                                        <Button id="btnCancelar2" onClick={this.hideModalPass} className="btn btn-danger" data-dismiss="modal" aria-hidden="true"><FontAwesomeIcon icon={faBan}/> CANCELAR</Button>
                                    </form>
                                </ModalBody>               
                            </Modal>
                    </div>
                </div>

                );
    }

}

export default  AdminUsers;
