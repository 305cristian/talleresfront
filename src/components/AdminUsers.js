import React, {Component}from'react';
import {render}from'react-dom';
import {Table, Button, Container, CustomInput, Modal, ModalHeader, ModalBody, ModalFooter, formGroup} from 'reactstrap';
import Swal from 'sweetalert';
import axios from 'axios'
import P from '../components/P';
import Styles from '../index.css'


        const {REACT_APP_HOST} = process.env;

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
    if (!data.rol) {
        errors.rol = 'El rol es un campo obligatorio';
    }
    return errors;
}
class AdminUsers extends Component {
    constructor() {
        super();
        this.state = {
            nombre: '',
            apellido: '',
            cedula: '',
            rol: '',
            _id: '',
            users: [],
            textButton: 'REGISTRAR',
            header: 'Insertar Usuario',
            modalOpen: false,
            image: '...',
            errors: {}

        }

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.addUser = this.addUser.bind(this)
    }
    componentDidMount() {//Es como el initComponents
        this.getUsers();//Para que inicie la pantalla de tareas
    }
    getUsers() {
        axios.get(`${REACT_APP_HOST}/api/users`).then((response) => {
            this.setState({users: response.data})
            console.log(response.data);
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
            datos.append('rol', this.state.rol);
            datos.append('image', this.state.image);
            if (this.state._id) {
                axios.put(`${REACT_APP_HOST}/api/users/` + this.state._id, datos).then((response) => {
                    Swal({
                        title: 'Usuario Actualizada',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getUsers();
                    this.setState({nombre: '', apellido: '', cedula: '', rol: '', _id: '', textButton: 'REGISTRAR', modalOpen: false, image: '...', errors: {}});
                })
            } else {
                axios.post(`${REACT_APP_HOST}/api/users`, datos).then((response) => {
                    Swal({
                        title: 'Usuario registrada',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getUsers();
                    this.setState({nombre: '', apellido: '', cedula: '', rol: '', image: '...'})
                })
            }
        }

    }

    editUser(id) {
        axios.get(`${REACT_APP_HOST}/api/users/` + id).then((response) => {
            console.log(response.data)
            this.setState({
                nombre: response.data.nombre,
                apellido: response.data.apellido,
                cedula: response.data.cedula,
                rol: response.data.rol,
                image: response.data.image,
                _id: response.data._id,
                textButton: 'ACTUALIZAR',
                header: 'Actualizar Usuario',
            })
            console.log(this.state.image)
        })
    }

    deleteUser(id) {
        Swal({
            title: 'Esta seguro de eliminar el Usuario',
            text: ' El usuario se eliminara definitivamente',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.delete(`${REACT_APP_HOST}/api/users/` + id).then((response) => {
                    console.log(response.data);
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
        this.setState({nombre: '', apellido: '', cedula: '', rol: '', modalOpen: false, textButton: 'REGISTRAR', header: 'Insertar Usuario', image: '...'})
    }

    handleChange(e) {
        const{name, value} = e.target;
        this.setState({[name]: value});
        console.log(e.target.value);
    }

    handleImageUpload = (e) => {
        this.setState({image: e.target.files[0]});
        console.log(e.target.files[0]);
    }

    render() {
        const {errors} = this.state;
        return (
                <div className="containerList">
                
                
                    <br/>
                    <Button color="primary" onClick={this.showModal}>Nuevo Usuario</Button>
                    <br/>
                    <br/>
                    {this.state.users.length>0?
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>NOMBRE</th>
                                                <th>APELLIDO</th>
                                                <th>CEDULA</th>
                                                <th>ROL</th>
                                                <th>IMAGE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                    this.state.users.map(data => {
                                                        return(
                                                                <tr key={data._id}>
                                                                    <td>{data.nombre}</td>
                                                                    <td>{data.apellido}</td>
                                                                    <td>{data.cedula}</td>
                                                                    <td>{data.rol}</td>
                                                                    <td>{data.image}</td>
                                                                    <td>
                                                                        <Button color="warning" onClick={() => {
                                                                                            this.showModal();
                                                                                            this.editUser(data._id);
                                                                                                }}>Edit</Button>{' '}
                                                    
                                                                        <Button color="danger" onClick={ () => {
                                                                                            this.deleteUser(data._id)
                                                                                                }}>Delete</Button>
                                                                    </td>
                                                                </tr>
                                                                )
                                                    })
                                            }
                                        </tbody>
                                    </Table>
                                : <h1>No hay Usuarios registrados</h1>}
                    <Modal isOpen={this.state.modalOpen}>
                        <ModalHeader>
                            <div><h3>{this.state.header}</h3></div>
                        </ModalHeader>
                
                        <ModalBody>
                            <form onSubmit={this.addUser} className="container">
                                <div className="row">
                                    <input name="nombre" onChange={this.handleChange} type="text" className="form-control" placeholder="Nombres" value={this.state.nombre}/>
                                    {errors.nombre && <P errors={errors.nombre} />}
                                </div>
                                <br/>
                                <div className="row">
                                    <input name="apellido" onChange={this.handleChange} type="text" className="form-control" placeholder="Apellidos" value={this.state.apellido}/>
                                    {errors.apellido && <P errors={errors.apellido} />}
                                </div>                            
                                <br/>
                                <div className="row">
                                    <input name="cedula" onChange={this.handleChange} type="number" className="form-control" placeholder="Cedula" value={this.state.cedula}/>
                                    {errors.cedula && <P errors={errors.cedula} />}
                                </div>                            
                                <br/>
                                <div className="row">
                                    <select className="form-control" name="rol" onChange={this.handleChange} value={this.state.rol}>
                                        <option>Selecione un Rol</option>
                                        <option value="USUARIO">USUARIO</option>
                                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                                    </select>
                                    {errors.rol && <P errors={errors.rol} />}
                                </div>                            
                                <br/>
                                <div className="row">
                                    <CustomInput name="image" type="file" onChange={this.handleImageUpload} id="image" label='Seleccione una Foto' accept="image/png, .jpeg, .jpg"/>
                                </div>
                                <br/>
                
                                <Button id="btnInsertar">{this.state.textButton}</Button>{' '}
                                <Button id="btnCancelar" onClick={this.hideModal} className="btn btn-danger" data-dismiss="modal" aria-hidden="true">CANCELAR</Button>
                            </form>
                        </ModalBody>               
                    </Modal>
                </div>

                );
    }

}

export default  AdminUsers;
