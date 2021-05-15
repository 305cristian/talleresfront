import React, {Component}from'react';
import {render}from'react-dom';
import {Table, Button, Container, CustomInput, Modal, ModalHeader, ModalBody, ModalFooter, formGroup, Row, Col}from 'reactstrap';
import Swal from 'sweetalert';
import axios from 'axios'
import P from '../components/P';
import { FontAwesomeIcon }
from '@fortawesome/react-fontawesome'
import { faFileAlt, faEdit, faTrash, faFile }
from '@fortawesome/free-solid-svg-icons'
//import { faApple} from '@fortawesome/free-brands-svg-icons'

        const {REACT_APP_HOST} = process.env;

const validation = data => {
    const errors = {};
    if (!data.area_id) {
        errors.area_id = 'Seleccione el área o cree una nueva';
    }
    if (!data.title) {
        errors.title = 'El campo title es obligatorio';
    }
    if (!data.description) {
        errors.description = 'El campo description es obligatorio';
    }
    if (!data.image) {
        errors.image = 'La imagen es obligatorio';
    }
    return errors;
}

class AdminTalleres extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            area_id: '',
            talleres: [],
            areas: [],
            _id: '',
            textButton: 'REGISTRAR',
            header: 'Insertar Tarea',
            modalOpen: false,
            modalEval: false,
            videoload: false,
            image: null,
            video: '...',
            errors: {},

            //modal eval
            taller_id: '',
            pregunta: '',
            respuesta: '',
            estadoresp: false

        };
//        this.fileInput = React.createRef();

        this.addTaller = this.addTaller.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.addPregunta = this.addPregunta.bind(this);
    }

    componentDidMount() {
        this.getTalleres(); //Para que inicie la pantalla de tareas
        this.getAreas();
    }
    getAreas() {
        axios.get(`${REACT_APP_HOST}/api/areas`).then((response) => {
            console.log(response.data)
            this.setState({areas: response.data})
        })
    }

    getTalleres() {
        axios.get(`${REACT_APP_HOST}/api/talleres_ar`).then((response) => {
//        axios.get(`${REACT_APP_HOST}/api/talleres`).then((response) => {
            console.log(response.data)
            this.setState({talleres: response.data})
        })
    }
    addTaller(e) {
        e.preventDefault();
        const {errors, ...sinErrors} = this.state;
        const result = validation(sinErrors);
//        console.log(result);

        this.setState({errors: result});
        if (!Object.keys(result).length) {

            let datos = new FormData();
            datos.append('area_id', this.state.area_id);
            datos.append('title', this.state.title);
            datos.append('description', this.state.description);
            datos.append('image', this.state.image);
            datos.append('video', this.state.video);
            if (this.state._id) {
                axios.put(`${REACT_APP_HOST}/api/talleres/` + this.state._id, datos).then((data) => {
//                axios.put('http://localhost:4000/api/talleres/' + this.state._id, datos).then((data) => {
                    console.log(data);
                    Swal({
                        title: 'Tarea Actualizada',
                        text: 'ok',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getTalleres();
                    this.setState({title: '', description: '', _id: '', textButton: 'REGISTRAR', modalOpen: false, image: null, errors: {}});
                }).catch(err => console.error(err));
            } else {
                axios.post(`${REACT_APP_HOST}/api/talleres`, datos).then((data) => {
//                axios.post('http://localhost:4000/api/talleres', datos).then((data) => {
                    console.log(data);
                    Swal({
                        title: 'Tarea Registrada',
                        text: 'ok',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getTalleres()
                    this.setState({title: '', description: '', image: null});
                })
                        .catch(err => console.error(err));
            }
        }
    }
    deleteTaller(id) {
        Swal({
            title: 'Esta seguro de eliminar la tarea',
            text: ' La tarea se eliminara definitivamente',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.delete(`${REACT_APP_HOST}/api/talleres/` + id).then((response) => {
//                axios.delete('http://localhost:4000/api/talleres/' + id).then((response) => {
                    console.log(response.data);
                    Swal({
                        title: 'Tarea eliminada',
                        icon: 'success',
                        timer: 1000,
                        button: false
                    });
                    this.getTalleres();
                });
            }
        });
    }

    editTaller(id) {
        axios.get(`${REACT_APP_HOST}/api/talleres/` + id).then((response) => {
            console.log(response.data);
            this.setState({
                title: response.data.title,
                description: response.data.description,
                area_id: response.data.area_id,
                image: response.data.image,
                video: response.data.video,
                _id: response.data._id,
                textButton: 'ACTUALIZAR',
                header: 'Actualizar Tarea',
                videoload: true
            });
            console.log(this.state.image)
            console.log(this.state.video)
        })
    }
    hideModal() {
        this.setState({title: '', description: '', _id: '', textButton: 'REGISTRAR', header: 'Insertar Tarea', modalOpen: false, image: null, errors: {}, videoload: false});
    }
    showModal() {
        this.setState({modalOpen: true});
    }
    showModalEval(idtaller) {
        this.setState({modalEval: true, taller_id: idtaller});

    }
    hideModalEval() {
        this.setState({modalEval: false});
    }

    handleChange(e) {
        console.log(e.target.value);
        if (e.target.type === 'checkbox') {
            var value = e.target.checked;
            var name = e.target.name;
        } else {
            var {name, value} = e.target;
        }
//       
        this.setState({[name]: value});
    }

    handleImageUpload = (e) => {
        console.log(e.target.files[0]);
        this.setState({image: e.target.files[0]});
        console.log(this.state.image)
    }
    handleVideoUpload = (e) => {
        console.log(e.target.files[0]);
        this.setState({video: e.target.files[0]});
        console.log(this.state.video)
    }

    agregarRespuesta = (e) => {

//Variables
        var listaResp = document.getElementById('lista');
        var cont = listaResp.children.length + 1;

        var newResp = document.createElement('li');
        newResp.setAttribute('class', 'list-unstyled');

        //Contenedor de los 2 contenedores
        var contenedorMain = document.createElement('div');
        contenedorMain.setAttribute('class', 'row');

        //contenedor del inputText
        var contenedorText = document.createElement('div');
        contenedorText.setAttribute('class', 'col-md-9');

        //contenedor del inputCheck
        var contenedorCheck = document.createElement('div');
        contenedorCheck.setAttribute('class', 'col-md-1');

        //contenedor del boton remover
        var contenedorRemover = document.createElement('div');
        contenedorRemover.setAttribute('class', 'col-md-1');

        //text
        var inputtextResp = document.createElement('input');
        inputtextResp.setAttribute('type', 'text');
        inputtextResp.setAttribute('name', 'respuesta');
        inputtextResp.setAttribute('class', 'form-control form-control-sm mt-2');
        inputtextResp.setAttribute('value', 'Respuesta ' + cont + '');

        //checkBox
        var inputcheckResp = document.createElement('input');
        inputcheckResp.setAttribute('type', 'checkbox');
        inputcheckResp.setAttribute('name', 'check');
        inputcheckResp.setAttribute('class', 'form-control form-control-sm mt-2');

        //Quitar Respuesta
        var quitarResp = document.createElement('button');
        quitarResp.setAttribute('id', 'delete');
        quitarResp.setAttribute('type', 'button');
        quitarResp.setAttribute('class', 'btn btn-secondary btn-sm mt-2');
        quitarResp.innerText = 'X';
        quitarResp.onclick = function () {
            //El método Node.removeChild() elimina un nodo hijo del DOM 
            listaResp.removeChild(newResp); //De listaResp que es el elemento padre remuevo newResp que es el elemento hijo
        }

        contenedorText.appendChild(inputtextResp);
        contenedorCheck.appendChild(inputcheckResp);
        contenedorRemover.appendChild(quitarResp);

        contenedorMain.appendChild(contenedorText);
        contenedorMain.appendChild(contenedorCheck);
        contenedorMain.appendChild(contenedorRemover);

        newResp.appendChild(contenedorMain);
        listaResp.appendChild(newResp);
    }

    addPregunta(e) {
        e.preventDefault();
        let datos = new FormData();
        datos.append('taller_id', this.state.taller_id);
        datos.append('pregunta', this.state.pregunta);
        datos.append('respuesta', this.state.respuesta);
        datos.append('estadoresp', this.state.estadoresp) ;
        
        axios.post(`${REACT_APP_HOST}/api/preguntas`,datos).then((response) => {
            console.log(response.data);           
            Swal({
                title: 'Pregunta registrada exitosamente',
                text: 'ok',
                icon: 'success',
                timer: 2000,
                button: false
            });
            this.setState({idtaller: '', pregunta: '', respuesta: '', estadoresp: ''})
        }).catch(err => console.error(err));


    }

    render() {

        const {errors} = this.state;
        return (
                <div className="containerList">
                    <br/>
                    <Button size="sm" color="primary" onClick={this.showModal}><FontAwesomeIcon icon={faFile}/> Nueva Tarea</Button>
                    <br/>
                    <br/>
                    {this.state.talleres.length > 0 ?
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>AREA</th>
                                                <th>TALLER</th>
                                                <th>DESCRIPCION</th>
                                                <th>IMG_DIR</th>
                                                <th>VD_DIR</th>
                                                <th>EVALUAR</th>
                                                <th>ACCIONES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                        this.state.talleres.map(data => {
                                            return(
                                                                            <tr key={data._id}>
                                                                                <td>{data.talleresArea.title}</td>
                                                                                <td>{data.title}</td>
                                                                                <td>{data.description}</td>                                                                   
                                                                                <td>{data.image}</td>
                                                                                <td>{data.video}</td>
                                                                                <td> <Button color="info" size="sm" onClick={() => {
                                                                                    this.showModalEval(data._id)
                                                                                }}>Crear <FontAwesomeIcon icon={faFileAlt}/></Button></td>
                                                                
                                                                                <td>
                                                                                    <Button color="warning" onClick={() => {
                                                                                    this.showModal();
                                                                                    this.editTaller(data._id);
                                                                                                    }} size="sm"><FontAwesomeIcon icon={faEdit}/></Button>{' '}
                                                                
                                                                                    <Button color="danger" onClick={ () => {
                                                                                    this.deleteTaller(data._id)
                                                                                }} size="sm"><FontAwesomeIcon icon={faTrash}/></Button>
                                                                                </td>
                                                                            </tr>
                                                    )
                                        })
                                            }
                                        </tbody>
                                    </Table>
                            : <h1>No hay talleres registrados</h1>}
                    <Modal isOpen={this.state.modalOpen}>
                        <ModalHeader>
                            <div><h3>{this.state.header}</h3></div>
                        </ModalHeader>
                
                        <ModalBody>
                            <form onSubmit={this.addTaller} className="container">
                                <div className="row">
                                    <select  name="area_id" onChange={this.handleChange} value={this.state.area_id} className="form-control">
                                        <option>Seleccione una Area</option>
                                        {
                    this.state.areas.map(data => {
                        return(
                                                                <option key={data._id} value={data._id}>{data.title}</option>
                                                        );
                    })
                                        }
                                    </select>
                                    {errors.area_id && <P errors={errors.area_id} />}
                                </div>
                                <br/>
                                <div className="row">
                                    <input name="title" onChange={this.handleChange} type="text" className="form-control" placeholder="Title" value={this.state.title}/>
                                    {errors.title && <P errors={errors.title} />}
                                </div>
                                <br/>
                                <div className="row">
                                    <textarea name="description" onChange={this.handleChange} type="text" className="form-control" placeholder="Description" value={this.state.description}/>
                                    {errors.description && <P errors={errors.description} />}
                                </div>                            
                                <br/>
                                <div className="row">
                                    <CustomInput name="image" type="file" onChange={this.handleImageUpload} id="image" label='Seleccione una Imagen' accept="image/png, .jpeg, .jpg"/>
                                    {errors.image && <P errors={errors.image} />}
                                </div>
                                <br/>
                
                                {this.state.videoload ?
                                    <div className="row">
                                        <CustomInput name="video" type="file" onChange={this.handleVideoUpload} id="video" label='Seleccione una Presentación' accept="video/mp4, .vlc, .avi"/>
                                    </div>
                            : <p style={{color: 'blue', fontSize: 12}}>Para cargar una presentacion utilize la opcion Editar</p>}
                                <br/>
                                <Button id="btnInsertar">{this.state.textButton}</Button>{' '}
                                <Button id="btnCancelar" onClick={this.hideModal} className="btn btn-danger" data-dismiss="modal" aria-hidden="true">CANCELAR</Button>
                            </form>
                        </ModalBody>               
                    </Modal>
                
                
                    <Modal isOpen={this.state.modalEval} size="lg">
                        <ModalHeader>
                            <div><h3>Crear Preguntas de Evaluación</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <form onSubmit={this.addPregunta} className="container">
                
                                <Row>
                                    <Col xs="12">
                                    <input type="hidden" name="id" value={this.state.idtaller}/>
                                    <input type="text" name="pregunta" onChange={this.handleChange} value={this.state.pregunta} className="form-control form-control-sm" placeholder="Ingrese la pregunta" required/>   
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col xs="12">                
                                    <ul id="lista">
                                        <li className="list-unstyled">
                                        <Row>               
                                            <Col xs="9">
                                            <input type="text" name="respuesta" onChange={this.handleChange} value={this.state.respuesta} className="form-control form-control-sm" placeholder="Ingrese una respuesta" required/> 
                                            </Col>
                                            <Col xs="1">              
                                            <input type="checkbox" name="estadoresp" onChange={this.handleChange} checked={this.state.estadoresp} className="form-control form-control-sm"/> 
                                            </Col>
                                            <Col xs="1">
                                            </Col>
                                        </Row>
                                        </li>
                                    </ul>
                                    </Col>
                                    <a href="#" id="agregarRespuesta" onClick={this.agregarRespuesta}>Agregar Respuesta</a>
                                </Row>
                                <Row className="float-right">               
                                    <Button size="sm" color="primary">Registrar Pregunta</Button>
                
                                </Row>
                                <br/>
                                <br/>
                
                                <Row>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Preguntas</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                
                                        </tbody>
                                    </Table>                
                                </Row>
                                <Row className="float-right">
                                    <Button color="danger" size="sm" onClick={() => {
                        this.hideModalEval()
                    }}>Cancelar</Button>
                                </Row>               
                            </form>
                
                        </ModalBody>                
                
                    </Modal>
                </div>

                );
    }

}
;
export default AdminTalleres;