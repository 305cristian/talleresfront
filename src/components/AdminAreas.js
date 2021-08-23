import React, {Component}from'react';
import {render}from'react-dom';
import {Table, Button, Container, CustomInput, Modal, ModalHeader, ModalBody, ModalFooter, formGroup} from 'reactstrap';
import Swal from 'sweetalert';
import axios from 'axios'
import P from '../components/P';
import Styles from '../index.css'

import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';
import Cookies from 'universal-cookie';
import firebase from '../../src/setting/server_firebase';


const cookies = new Cookies();

const {REACT_APP_HOST} = process.env;
var storage = firebase.app().storage("gs://talleres-1b6d0.appspot.com");

const validation = data => {
    const errors = {};
    if (!data.title) {
        errors.title = 'El campo title es obligatorio';
    }
    if (!data.image) {
        errors.image = 'La imagen es obligatorio';
    }
    return errors;
}
class AdminAreas extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            _id: '',
            areas: [],
            textButton: 'REGISTRAR',
            header: 'Insertar Area',
            modalOpen: false,
            img_temp:'',
            image: '',
            aux:'',
            errors: {}

        }

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.addArea = this.addArea.bind(this)
    }
    componentDidMount() {//Es como el initComponents
        if (!cookies.get('nombre')) {
            window.location.href = '/'
        }
        this.getAreas();//Para que inicie la pantalla de tareas
    }
    getAreas() {
        axios.get(`${REACT_APP_HOST}/api/areas`).then((response) => {
            this.setState({areas: response.data})
            console.log(response.data);
        })
    }

    addArea(e) {
        e.preventDefault();

        const {errors, ...sinErrors} = this.state;
        const result = validation(sinErrors);
        this.setState({errors: result});

        if (!Object.keys(result).length) {
            let datos = new FormData();
            datos.append('title', this.state.title);
            datos.append('description', this.state.description);
//            datos.append('image', this.state.image.name);
            
            if (this.state._id && this.state.aux==='') {
                console.log('modifico');
                datos.append('image', this.state.image);
            } else if(this.state._id && this.state.aux.name) {
                 console.log('modifico imagen');
                datos.append('image', this.state.image.name);
            }else{
                 console.log('guardo');
                datos.append('image', this.state.image.name); 
            }
            
            if (this.state._id) {
                
                if (this.state.aux.name) {
                    this.deleteImage2();
                    this.uploadImage2();
                }
                
                axios.put(`${REACT_APP_HOST}/api/areas/` + this.state._id, datos).then(async(response) => {
                  
                    Swal({
                        title: 'Tarea Actualizada',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getAreas();
                    this.setState({title: '', description: '', _id: '', textButton: 'REGISTRAR', modalOpen: false, image: null,aux:'', errors: {}});
                })
            } else {
                axios.post(`${REACT_APP_HOST}/api/areas`, datos).then(async(response) => {
                    let cargar = await this.uploadImage();
                    Swal({
                        title: 'Area registrada',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getAreas();
                    this.setState({title: '', description: '',aux:'', image: null})
                })
            }
        }

    }

    editArea(id) {
        axios.get(`${REACT_APP_HOST}/api/areas/` + id).then((response) => {
            this.setState({
                title: response.data.title,
                description: response.data.description,
                image: response.data.image,
                img_temp: response.data.image,
                _id: response.data._id,
                textButton: 'ACTUALIZAR',
                header: 'Actualizar Area',
            })
            console.log(this.state.image)
        })
    }

    deleteArea(id, image) {
         this.setState({img_temp:image});
        Swal({
            title: 'Esta seguro de eliminar el Area',
            text: ' El area se eliminara definitivamente',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.delete(`${REACT_APP_HOST}/api/areas/` + id).then(async(response) => {
                    console.log(response.data);
                     let eliminar = await this.deleteImage();
                    Swal({
                        title: 'Area eliminada',
                        icon: 'success',
                        timer: 1000,
                        button: false
                    });
                    this.getAreas();
                });
            }
        });
    }

    showModal() {
        this.setState({modalOpen: true});
    }
    hideModal() {
        this.setState({title: '', description: '', modalOpen: false, textButton: 'REGISTRAR', header: 'Insertar Area', image: null})
    }

    handleChange(e) {
        const{name, value} = e.target;
        this.setState({[name]: value});
        console.log(e.target.value);
    }
    
     uploadImage = async() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imgareas/${this.state.image.name}`);
        return await spaceRef.put(this.state.image)

    }
    deleteImage = async() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imgareas/${this.state.img_temp}`);
        return await  spaceRef.delete();

    }
    
      uploadImage2 = () => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imgareas/${this.state.image.name}`);
        return spaceRef.put(this.state.image);

    }
    deleteImage2 = () => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imgareas/${this.state.img_temp}`);
        return  spaceRef.delete();

    }


    handleImageUpload = (e) => {
        this.setState({image: e.target.files[0],aux: e.target.files[0]});
        console.log(e.target.files[0]);
    }
    
    

    render() {

        const {errors} = this.state;
        return (
                <div>
                    <Navigation />
                    <div className="containerList">
                        <br/>
                        <Button color="primary" onClick={this.showModal}>Nueva Area</Button>
                        <br/>
                        <br/>
                        {this.state.areas.length > 0 ?
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>AREA</th>
                                                <th>DETALLE</th>
                                                <th>IMG_DIR</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                        this.state.areas.map(data => {
                                                            return(
                                                                <tr key={data._id}>
                                                                    <td>{data.title}</td>
                                                                    <td>{data.description}</td>
                                                                    <td>{data.image}</td>
                                                                    <td>
                                                                        <Button color="warning" onClick={() => {
                                                                                                this.showModal();
                                                                                                this.editArea(data._id);
                                                                                                    }}>Edit</Button>{' '}
                                                
                                                                        <Button color="danger" onClick={ () => {
                                                                                                this.deleteArea(data._id,data.image)
                                                                                                    }}>Delete</Button>
                                                                    </td>
                                                                </tr>
                                                                    )
                                                        })
                                            }
                                        </tbody>
                                    </Table>
                                    : <h1>No hay Areas registrados</h1>}
                        <Modal isOpen={this.state.modalOpen}>
                            <ModalHeader>
                                <div><h3>{this.state.header}</h3></div>
                            </ModalHeader>
                
                            <ModalBody>
                                <form onSubmit={this.addArea} className="container">
                                    <div className="row">
                                        <input name="title" onChange={this.handleChange} type="text" className="form-control" placeholder="Title" value={this.state.title}/>
                                        {errors.title && <P errors={errors.title} />}
                                    </div>
                                    <br/>
                                    <div className="row">
                                        <textarea name="description" onChange={this.handleChange} type="text" className="form-control" placeholder="Description" value={this.state.description}/>
                
                                    </div>                            
                                    <br/>
                                    <div className="row">
                                        <CustomInput name="image" type="file" onChange={this.handleImageUpload} id="image" label='Seleccione una Imagen' accept="image/png, .jpeg, .jpg"/>
                                        {errors.image && <P errors={errors.image} />}
                                    </div>
                                    <br/>
                
                                    <Button id="btnInsertar">{this.state.textButton}</Button>{' '}
                                    <Button id="btnCancelar" onClick={this.hideModal} className="btn btn-danger" data-dismiss="modal" aria-hidden="true">CANCELAR</Button>
                                </form>
                            </ModalBody>               
                        </Modal>
                    </div>
                </div>

                );
    }

}

export default  AdminAreas
