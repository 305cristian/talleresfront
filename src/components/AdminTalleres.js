import React, {Component}from'react';
import {render}from'react-dom';
import {Table, Button, Container, CustomInput, Modal, ModalHeader, ModalBody, ModalFooter, formGroup, Row, Col, InputGroup,InputGroupText, Input}from 'reactstrap';
import Swal from 'sweetalert';
import axios from 'axios'
import P from '../components/P';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import { faFileAlt, faEdit,faEye, faTrash, faFile, faSave, faSyncAlt, faCheckCircle, faSkull, faClock, faRedo, faFileExcel }from '@fortawesome/free-solid-svg-icons'
//import { faApple} from '@fortawesome/free-brands-svg-icons'

import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';

import Cookies from 'universal-cookie';

import firebase from '../../src/setting/server_firebase';

import DataTable from "@material-table/core";
import {Grid, Avatar} from "@material-ui/core";
import XLSX from 'xlsx'



const cookies = new Cookies();
const {REACT_APP_HOST, REACT_APP_STORAGE} = process.env;

const paginacion={
                                        labelRowsSelect:'Filas',
                                        labelRowsPerPage:'Filas por Pagina',
                                        previousAriaLabel:'Pagina Anterior',
                                        previousTooltip:'Pagina Anterior',
                                        nextAriaLabel:'Siguiente Página',
                                        nextTooltip:'Siguiente Página',
                                        lastAriaLabel:'Ultima page',
                                        lastTooltip:'Ultima page',
                                        firstAriaLabel:'Primera Página',
                                        firstTooltip:'Primera Página'
}

const toolbar={
    exportTitle:'Exportar',
    exportAriaLabel:'Exportar',
    exportName:'Exportar a',
    searchTooltip:'Buscar',
    searchPlaceholder:'Buscar'
}



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
//Para pintar boton Prueba
var prueba_regis = [];
var array = [];

var storage = firebase.app().storage(`${REACT_APP_STORAGE}`);


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
            header: 'Insertar Taller',
            modalOpen: false,
            modalEval: false,
            videoload: false,
            image: '',
            img_temp: '',
            video: '...',
            video_temp: '',
            tiempo: '30',
            intentos: '2',
            aprobacion: '10',
            estado: '1',
            evaluacion:'0',
            errors: {},

            //modal eval
            //pregunta
            taller_id: '',
            pregunta: '',
            estadopreg: true,
            preguntas_taller: [],
            pregunta_id: '',
            puntaje: '',
            btnCreaPreg: 'Crear',
            _idpreg: '',
            tipo_preg:'1',

            //respuesta
            pregunta_resp: '',
            pregunta_taller_id: '',
            respuesta: '',
            estadoresp: false,
            btnCreaResp: 'Crear',
            respuestas_preg: [],
            _idresp: '',

            //
            aux: '',
            aux_v: ''

        };
//        this.fileInput = React.createRef();

        this.addTaller = this.addTaller.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);

        this.addPregunta = this.addPregunta.bind(this);
        this.editPregunta = this.editPregunta.bind(this);
        this.deletePregunta = this.deletePregunta.bind(this);


        this.addRespuesta = this.addRespuesta.bind(this);
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
            datos.append('tiempo', this.state.tiempo);
            datos.append('intentos', this.state.intentos);
            datos.append('evaluacion', this.state.evaluacion);
            datos.append('aprobacion', this.state.aprobacion);
            datos.append('estado', this.state.estado);
            

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
            
            if (this.state._id && this.state.aux_v==='') {
                console.log('modifico');
                datos.append('video', this.state.video);
            } else if(this.state._id && this.state.aux_v.name) {
                 console.log('modifico video');
               datos.append('video', this.state.video.name);
            }else{
                 datos.append('video', this.state.video);
            }


            
            if (this.state._id) {
                if (this.state.aux.name) {
                    this.deleteImage2();
                    this.uploadImage2();
                }
                if (this.state.aux_v.name) {                   
                      this.deleteVideo2();  
                    this.uploadVideo2();
                }
                axios.put(`${REACT_APP_HOST}/api/talleres/` + this.state._id, datos).then(async(data) => {
                    console.log(data);
                    Swal({
                        title: 'Taller Actualizada',
                        text: 'ok',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getTalleres();
                    this.setState({title: '', description: '', tiempo: '30', intentos: '1',aprobacion:'10',estado:'1', _id: '', textButton: 'REGISTRAR',header: 'Insertar Taller', modalOpen: false, image: '',videoload:false, aux:'',aux_v:'',errors: {}});
                }).catch(err => console.error(err));
            } else {
                axios.post(`${REACT_APP_HOST}/api/talleres`, datos).then(async(data) => {
                    console.log(data);
                    let cargarimg = await this.uploadImage();
                    Swal({
                        title: 'Taller Registrada',
                        text: 'ok',
                        icon: 'success',
                        timer: 2000,
                        button: false
                    });
                    this.getTalleres()
                    this.setState({title: '', description: '', tiempo: '30', intentos: '1',aprobacion:'10',estado:'1', image: '', aux:'', aux_v:''});
                })
                        .catch(err => console.error(err));
            }
        }
    }
    
    validarEliminacion(id, image, video, taller){
        axios.get(`${REACT_APP_HOST}/api/preguntas/`+ id).then((response)=> {
            if(response.data.length<=0){
                this.deleteTaller(id, image, video, taller);
            }else {
                Swal({
                title: '!Atención',
                text:'Este Taller tiene Evaluacion registrados, imposible eliminar, !Puede desactivarlo',
                icon: 'warning',
                button: true
           });
            }
        })
    }
    
    deleteTaller(id, image, video, taller) {
        this.setState({img_temp: image});
        this.setState({video_temp: video});
        Swal({
            title: `Esta seguro de eliminar el taller ${taller}`,
            text: ' La tarea se eliminara definitivamente',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.delete(`${REACT_APP_HOST}/api/talleres/` + id).then(async(response) => {
//                axios.delete('http://localhost:4000/api/talleres/' + id).then((response) => {
                    console.log(response.data);
                    let eliminarimg = await this.deleteImage();
                    if (video !== '...') {
                        let eliminarvideo = await this.deleteVideo();
                    }
                    Swal({
                        title: 'Taller eliminada',
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
                tiempo: response.data.tiempo,
                intentos: response.data.intentos,
                aprobacion: response.data.aprobacion,
                estado: response.data.estado,
                evaluacion: response.data.evaluacion,
                area_id: response.data.area_id,
                image: response.data.image,
                img_temp: response.data.image,
                video: response.data.video,
                video_temp: response.data.video,
                _id: response.data._id,
                textButton: 'ACTUALIZAR',
                header: 'Actualizar Taller',
                videoload: true,

            });
            console.log(this.state.image);
            console.log(this.state.video);
        })
    }
    hideModal() {
        this.setState({title: '', description: '', tiempo: '30', intentos: '1',aprobacion:'10',estado:'1', _id: '', textButton: 'REGISTRAR', header: 'Insertar Taller', modalOpen: false, image: null,aux:'',aux_v:'', errors: {}, videoload: false});
    }
    showModal() {
        this.setState({modalOpen: true});
    }
    showModalEval(idtaller) {
        this.setState({modalEval: true, taller_id: idtaller, pregunta_taller_id: idtaller});
        this.getPreguntasXtaller(idtaller);

    }

    hideModalEval() {
        this.setState({modalEval: false, idtaller: '', pregunta: '', estadopreg: true, _idpreg: '', pregunta_resp: '', respuesta: '', estadoresp: false, _idresp: ''});
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
    handleChangeSelect(e) {
        console.log(`Seleccionaste ${e.target.value}`);
        var {name, value} = e.target;
        this.setState({[name]: value}, () => this.getRespuestas());
    }

    uploadImage = async() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imgtaller/${this.state.image.name}`);
        return await spaceRef.put(this.state.image);

    }
    uploadImage2 = () => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imgtaller/${this.state.image.name}`);
        return spaceRef.put(this.state.image);

    }
    deleteImage = async() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imgtaller/${this.state.img_temp}`);
        return await  spaceRef.delete();

    }
    deleteImage2 = () => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`images/imgtaller/${this.state.img_temp}`);
        return  spaceRef.delete();

    }
    uploadVideo2 =() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`videos/videostaller/${this.state.video.name}`);
        return spaceRef.put(this.state.video)

    }
    uploadVideo = async() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`videos/videostaller/${this.state.video.name}`);
        return await spaceRef.put(this.state.video)

    }
    deleteVideo2 = () => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`videos/videostaller/${this.state.video_temp}`);
        if(this.state.video_temp!=='...'){
           return  spaceRef.delete();  
        }
       

    }
    deleteVideo = async() => {
        var storageRef = storage.ref();
        var spaceRef = storageRef.child(`videos/videostaller/${this.state.video_temp}`);
        return await  spaceRef.delete();

    }

    handleImageUpload = (e) => {
        console.log(e.target.files[0]);
        this.setState({image: e.target.files[0], aux: e.target.files[0]});
        console.log(this.state.image)
    }
    handleVideoUpload = (e) => {
        console.log(e.target.files[0]);
        this.setState({video: e.target.files[0], aux_v:e.target.files[0]});
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
        inputtextResp.setAttribute('name', 'respuesta' + cont + '');
        inputtextResp.setAttribute('class', 'form-control form-control-sm mt-2');
        inputtextResp.setAttribute('value', 'Respuesta ' + cont + '');

        //checkBox
        var inputcheckResp = document.createElement('input');
        inputcheckResp.setAttribute('type', 'checkbox');
        inputcheckResp.setAttribute('name', 'estadopreg' + cont + '');
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
        /**
         * Uso este metodo de enviar datos, solo en caso de enviar archivos (file,video, img)
         * let datos = new FormData();
         //        datos.append('taller_id', this.state.taller_id);
         //        datos.append('pregunta', this.state.pregunta);
         //        datos.append('respuesta', this.state.respuesta);
         //        datos.append('estadopreg', this.state.estadopreg) ;
         * @type type
         */
//        
        const datos = {
            taller_id: this.state.taller_id,
            pregunta: this.state.pregunta,
            puntaje: this.state.puntaje,
            estadopreg: this.state.estadopreg,
            tipo_preg: this.state.tipo_preg

        };
        if (this.state._idpreg) {
            axios.put(`${REACT_APP_HOST}/api/preguntas/` + this.state._idpreg, datos).then((response) => {
                console.log(response.data);
                Swal({
                    title: 'Pregunta modificada exitosamente',
                    text: 'ok',
                    icon: 'success',
                    timer: 2000,
                    button: false
                });
                this.getPreguntasXtaller(this.state.taller_id);
            }).catch(err => console.error(err));
        } else {
            axios.post(`${REACT_APP_HOST}/api/preguntas`, datos).then((response) => {
                console.log(response.data);
                Swal({
                    title: 'Pregunta registrada exitosamente',
                    text: 'ok',
                    icon: 'success',
                    timer: 2000,
                    button: false
                });
                this.getPreguntasXtaller(this.state.taller_id);
            }).catch(err => console.error(err));
        }

        this.setState({idtaller: '', pregunta: '', puntaje: '', estadopreg: true, _idpreg: '',tipo_preg:'1', btnCreaPreg: 'Crear'});


    }
    getPreguntasXtaller(id) {
        axios.get(`${REACT_APP_HOST}/api/preguntas/` + id).then((response) => {
            this.setState({preguntas_taller: response.data});
        });
    }
    editPregunta(id_preg) {
        axios.get(`${REACT_APP_HOST}/api/preguntas/` + this.state.taller_id + '/' + id_preg).then((response) => {
            this.setState({pregunta: response.data.pregunta,
                puntaje: response.data.puntaje,
                _idpreg: response.data._id,
                estadopreg: response.data.estadopreg,
                tipo_preg: response.data.tipo_preg,
                btnCreaPreg: 'Actualizar'});
        })

    }
    
    validarEliminacionPreg(id_preg){
        axios.get(`${REACT_APP_HOST}/api/respuestas/` + id_preg+'/'+this.state.taller_id).then( (response)=> {
            if(response.data<=0){
                this.deletePregunta(id_preg);
            }else{
             Swal({
                title: '!Atención',
                text:'Esta pregunta tiene respuestas registrados, imposible eliminar, !Primero debe eliminar las respuestas de la misma',
                icon: 'warning',
                button: true
           });
            }
        });
    }
    
    deletePregunta(id_preg) {
        Swal({
            title: 'Esta seguro de eliminar la pregunta',
            text: ' La pregunta se eliminara definitivamente',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }
        ).then((value) => {
            if (value) {
                axios.delete(`${REACT_APP_HOST}/api/preguntas/` + id_preg+'/'+this.state.taller_id).then((response) => {
                    if (response.data) {
                        Swal({
                            title: 'Pregunta eliminada exitosamente',
                            text: 'ok',
                            icon: 'success',
                            timer: 2000,
                            button: false
                        })
                        this.setState({idtaller: '', pregunta: '', estadopreg: true, _idpreg: ''});
                        this.getPreguntasXtaller(this.state.taller_id);
                    }

                })

            }
        })
//        alert(id_preg);

    }

    addRespuesta(e) {
        e.preventDefault();
        const datos = {
            pregunta_resp: this.state.pregunta_resp,
            respuesta: this.state.respuesta,
            estadoresp: this.state.estadoresp,
            resp_taller_id: this.state.pregunta_taller_id
        };
        if (this.state._idresp) {
            axios.put(`${REACT_APP_HOST}/api/respuestas/` + this.state._idresp, datos).then((response) => {
                console.log(response.data);
                Swal({
                    title: 'Respuesta Actualizada exitosamente',
                    text: 'ok',
                    icon: 'success',
                    timer: 2000,
                    button: false
                });
                this.getRespuestas();
                this.setState({respuesta: '', estadoresp: false, _idresp: '', btnCreaResp: 'Crear'});
            }).catch(err => console.error(err));
        } else {
            axios.post(`${REACT_APP_HOST}/api/respuestas`, datos).then((response) => {
                console.log(response.data);
                Swal({
                    title: 'Respuesta registrada exitosamente',
                    text: 'ok',
                    icon: 'success',
                    timer: 2000,
                    button: false
                });
                this.getRespuestas();
                this.setState({respuesta: '', estadoresp: false, btnCreaResp: 'Crear'});
            }).catch(err => console.error(err));
        }



    }
    getRespuestas() {
        axios.get(`${REACT_APP_HOST}/api/respuestas/` + this.state.pregunta_resp + '/' + this.state.taller_id).then((response) => {
            if (response) {
                this.setState({respuestas_preg: response.data});
            } else {
                Swal({
                    title: 'No se encontraron respuestas',
                    icon: 'warning',
                    timer: 2000,
                    button: false
                });
            }

        });

    }

    editRespuesta(id_resp) {
        axios.get(`${REACT_APP_HOST}/api/respuestas/` + id_resp).then((response) => {
            this.setState({btnCreaResp: 'Actualizar', respuesta: response.data.respuesta, estadoresp: response.data.estadoresp, puntaje: response.data.puntaje, pregunta_resp: response.data.pregunta_resp, _idresp: response.data._id});
        })
    }
    deleteRespuesta(id_resp) {

        Swal({
            title: 'Esta seguro de eliminar la respuesta',
            text: ' La respuesta se eliminara definitivamente',
            icon: 'warning',
            buttons: ['Cancelar', 'Sí'],
            dangerMode: true
        }).then((value) => {
            if (value) {
                axios.delete(`${REACT_APP_HOST}/api/respuestas/` + id_resp).then((response) => {
                    if (response.data) {
                        Swal({
                            title: 'Respuesta eliminada exitosamente',
                            text: 'ok',
                            icon: 'success',
                            timer: 2000,
                            button: false
                        })
                        this.getRespuestas();
                        this.setState({respuesta: '', estadoresp: false, _idresp: ''});
                    }
                })
            }
        })
    }
    
    downloadReporte=(e)=>{
      const newData=this.state.talleres.map(data=>{
        delete data._id;
        delete data.__v;
        delete data.talleresArea;
        
        return data;
      })
      const workSheet=XLSX.utils.json_to_sheet(newData);
      const workBook=XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook,workSheet,"talleres");
      //Buffer
      let buf=XLSX.write(workBook,{bookType:"xlsx",type:"buffer"});
      //Binary string
      XLSX.write(workBook,{bookType:"xlsx",type:"binary"});
      //Download
      XLSX.writeFile(workBook,"Talleres.xlsx");


    }
    

  
    render() {

        const {errors} = this.state;
        return (
                <div className="container-fluid">
                    <Navigation />
                    <div className="containerList">
                        <br/>
                        <Button  color="primary" onClick={this.showModal}><FontAwesomeIcon icon={faFile}/> Nuevo Taller</Button>
                        <br/>
                          
                        <br/>
                        
                        {this.state.talleres.length > 0 ?
                                <DataTable
                           
                                columns={[
                                   {title:'AREA', field:'talleresArea.title'},
                                   {title:'TALLER', field:'title'},
                                   {title:'DESCRIPCION', field:'description'},
                                   {title:'TIEMPO', field:'tiempo',render:(rowData)=><Grid><Avatar>{rowData.tiempo}</Avatar>Minutos</Grid>},
                                   {title:'INTENTOS', field:'intentos',render:(rowData)=><Grid><Avatar>{rowData.intentos}</Avatar></Grid>},
                                   {title:'APROBACIÓN', field:'aprobacion',render:(rowData)=><Grid><Avatar>{rowData.aprobacion}</Avatar></Grid>},
                                   
                                   {title:'ESTADO', field:'estado',
                                       render:(rowData)=>rowData.estado==='0'?<span size="sm" className='badge text-white bg-danger'>Inactivo <FontAwesomeIcon icon={faFileAlt} /></span>
                                   :<span size="sm" className='badge bg-success text-white'>Activo <FontAwesomeIcon icon={faCheckCircle}/></span>
                                   
                                    },
                                   
                                   {title:'IMG-DIR', field:'image'},
                                   {title:'VID-DIR', field:'video'},                                
                                   {title:'EVALUACIÓN', field:'evaluacion',
                                       render:(rowData)=>rowData.evaluacion==='0'?<Button size="sm" color="info" className="text-white" onClick={()=>{this.showModalEval(rowData._id)}}>Crear <FontAwesomeIcon icon={faFileAlt} /></Button>
                                   :<Button size="sm" color="success" className="text-white" onClick={()=>{this.showModalEval(rowData._id)}}>Editar <FontAwesomeIcon icon={faCheckCircle}/></Button>
                                   
                                    }
                
                                               
                                   
                                ]}
                                data={this.state.talleres}
                                title='Lista de Talleres'
                                actions={[                                   
//                                   
                                    {
                                        icon:()=><a className="btn btn-warning btn-sm" size="sm"><FontAwesomeIcon icon={faEdit}/></a>,
                                        tooltip:'Editar Taller',
                                        onClick:(event, rowData)=>{this.showModal();this.editTaller(rowData._id); }                                         
                                    },
                                    {
                                        icon:()=><a className="btn btn-danger btn-sm" size="sm"><FontAwesomeIcon icon={faTrash}/></a>,
                                        tooltip:'Eliminar Taller',
                                        onClick:(event, rowData)=>this.validarEliminacion(rowData._id, rowData.image,rowData.video, rowData.title)
                                    },
                                      {
                                        icon:()=><span className="btn btn-success btn-sm" ><FontAwesomeIcon icon={faFileExcel}/> Exportar</span>,
                                        tooltip:'Exportar a Excel',
                                        onClick:()=>this.downloadReporte(),
                                        isFreeAction:true
                                    }
                                ]}

                                options={{
                                    actionsColumnIndex:-1,
                                    exportButton:true,
                                    headerStyle: {
                                        backgroundColor: '#343a40',
                                        color: '#FFF'
                                    },
                                    padding:'dense',//dense
                                    pageSize:8,
                                    pageSizeOptions:[8,15,30],
                                    paginationType:'stepped'
                                }}
                                localization={{
                                    pagination:  paginacion,
                                    toolbar:toolbar,
                                    header:{
                                        actions:'ACCIONES'
                                    }
                                }}
                                 style={{fontSize: "15px", padding:'15px', cellPadding:'0px'}}
                            />    
                            : <h1>No hay talleres registrados</h1>}
                            
                            
                        <Modal isOpen={this.state.modalOpen}>
                            <ModalHeader>
                                <div><h3>{this.state.header}</h3></div>
                            </ModalHeader>
                
                            <ModalBody>
                                <form onSubmit={this.addTaller} className="container">
                                    <div className="row py-2">
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
                                    <div className="row py-2">
                                        <input name="title" onChange={this.handleChange} type="text" className="form-control form-control-sm" placeholder="Title" value={this.state.title}/>
                                        {errors.title && <P errors={errors.title} />}
                                    </div>
                
                                    <div className="row py-2">
                                        <textarea name="description" onChange={this.handleChange} type="text" className="form-control form-control-sm" placeholder="Description" value={this.state.description}/>
                                        {errors.description && <P errors={errors.description} />}
                                    </div>                            
                
                                    <div className="row py-2">
                                        <CustomInput className='form-control form-control-sm' name="image" type="file" onChange={this.handleImageUpload} id="image" label='Seleccione una Imagen' accept="image/png, .jpeg, .jpg"/>
                                        {errors.image && <P errors={errors.image} />}
                                    </div>
                
                                    {this.state.videoload ?
                                    <div className="row py-2">
                                        <CustomInput name="video" type="file" onChange={this.handleVideoUpload} id="video" label='Seleccione una Presentación' accept="video/mp4, .vlc, .avi"/>
                                    </div>
                            : <p style={{color: 'blue', fontSize: 12}}>Para cargar una presentacion utilize la opcion Editar</p>
                                    }
                                    <div className="row py-2 border bg-info">
                                        <div className="col-md-12 text-left">
                                            <p className="font-weight-bold text-white" style={{fontSize: 15}}>Esta sección en caso de evaluación</p>                
                                        </div>
                                         <InputGroup className="col-md-6">
                                            <InputGroupText>
                                              Tiempo
                                            </InputGroupText>
                                                <Input type="number" name="tiempo" onChange={this.handleChange} value={this.state.tiempo} placeholder="Tiempo de eval"/>
                                          </InputGroup>
                                         <InputGroup className=" col-md-6" >
                                            <InputGroupText>
                                              # Intentos
                                            </InputGroupText>
                                                <Input type="number" name="intentos" onChange={this.handleChange} value={this.state.intentos} placeholder="Intentos eval"/>
                                          </InputGroup>                                         
                                         <InputGroup className=" col-md-12 my-1" >
                                            <InputGroupText>
                                              Puntos para Aprobación
                                            </InputGroupText>
                                                <Input type="number" name="aprobacion" onChange={this.handleChange} value={this.state.aprobacion} placeholder="Aprobar con"/>
                                          </InputGroup>                                         
                                     
                                    </div>
                                    <div className="row my-2">
                                    <InputGroup className="my-1" >
                                        <InputGroupText>
                                            Estado del Taller
                                        </InputGroupText>
                                        <select className="form-control" name="estado" onChange={this.handleChange} value={this.state.estado}>
                                            <option value='1'>Activo</option>
                                            <option value="0">Inactivo</option>
                                        </select>
                                    </InputGroup> 
                                    </div>                                  
                                    <br/>
                                    
                                    
                                    <Button size='sm' id="btnInsertar">{this.state.textButton}</Button>{' '}
                                    <Button size='sm' id="btnCancelar" onClick={this.hideModal} className="btn btn-danger" data-dismiss="modal" aria-hidden="true">CANCELAR</Button>
                                </form>
                            </ModalBody>               
                        </Modal>
                
                
                        <Modal isOpen={this.state.modalEval} size="lg">
                            <div className='p-2 border'>
                                <Row>
                                    <Col xs='11'>
                                    <h4>Preguntas y Respuestas</h4>
                                    </Col>
                                    <Col xs='1'>
                                    <Button color="danger" size="sm" onClick={() => {
                        this.hideModalEval()
                                        }}>X</Button>
                                    </Col>
                                </Row>
                            </div>               
                            <ModalBody>
                               
                                <form onSubmit={this.addPregunta} className="container  p-3" style={{border: '3px solid rgba(0, 0, 255, 0.1)'}}>
                                      <h6>Registre sus preguntas</h6>
                                    <Row>
                                        <Col xs="12">
                                                  
                                        <Row>               
                                            <Col xs="8" className="my-2">
                                            <textarea type="text" name="pregunta" onChange={this.handleChange} value={this.state.pregunta} className="form-control form-control-sm" placeholder="Ingrese la pregunta" required/>   
                                            </Col>
                                            <Col xs="4" className="my-2">
                                             <select name="tipo_preg" className="form-control" onChange={this.handleChange} value={this.state.tipo_preg}>
                                                    <option value="1">Respuesta Unica</option>
                                                    <option value="2">Respuesta Multiple</option>
                                            </select>
                                            </Col>
                                            
                                        </Row>
                                        <Row>
                                            <Col xs="2">  
                                            <input type='number' name='puntaje' onChange={this.handleChange} value={this.state.puntaje} className="form-control form-control-sm" placeholder="Puntaje" required/>                             
                                            </Col>
                                            <Col xs="1">              
                                            <input type="checkbox" name="estadopreg" onChange={this.handleChange} checked={this.state.estadopreg} className="form-control form-control-sm"/> 
                                            </Col>                                        
                                            <Col xs="2">
                                            <Button size="sm" color="primary"><FontAwesomeIcon icon={faSave}/> {this.state.btnCreaPreg}</Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="10" className="mt-2">
                                            <select  name="pregunta_id" onChange={this.handleChange} value={this.state.pregunta_id} className="form-control form-control-sm">
                                                <option>Seleccione una Pregunta</option>
                
                                                {
                                                    this.state.preguntas_taller.map(data => {
                                                        return(
                                                                        <option key={data._id} value={data._id}>{data.pregunta} {'    / Puts: '} {data.puntaje}</option>
                                                        );
                                                    })
                                                }
                                            </select>                                    
                                            </Col>                                      
                                            <Col xs="2"  className="mt-2 text-right">                                      
                                            <Button size="sm" color="warning" onClick={() => {
                        this.editPregunta(this.state.pregunta_id)
                                                }}><FontAwesomeIcon icon={faEdit}/></Button>  {' '}
                                            <Button size="sm" color="danger" onClick={() => {
                        this.validarEliminacionPreg(this.state.pregunta_id)
                                                }}><FontAwesomeIcon icon={faTrash}/></Button> 
                                            </Col>                                      
                                        </Row>
                                        </Col>
                                    </Row>
                                </form>
                
                                <hr/>
                                
                                <form onSubmit={this.addRespuesta} className="container p-3" style={{border: '3px solid rgba(60, 179, 113, 0.3)'}}>
                                <h6>Registre sus respuestas</h6>
                                    <Row>
                                        <Col xs="12">                
                                        <Row>
                                            <Col xs="12">
                                            <select  name="pregunta_resp" onChange={this.handleChangeSelect} value={this.state.pregunta_resp} className="form-control form-control-sm">
                                                <option>Seleccione una Pregunta</option>                                  
                                                {
                    this.state.preguntas_taller.map(data => {
                                                        return(
                                                                        <option key={data._id} value={data._id}>{data.pregunta}</option>
                                );
                                                    })
                                                }
                                            </select> 
                                            </Col>
                                          
                                        </Row>
                                        <Row className="mt-2">               
                                            <Col xs="9">
                                            <input type="text" name="respuesta" onChange={this.handleChange} value={this.state.respuesta} className="form-control form-control-sm" placeholder="Ingrese una respuesta" required/> 
                                            </Col>
                
                                            <Col xs="1">              
                                            <input type="checkbox" name="estadoresp" onChange={this.handleChange} checked={this.state.estadoresp} className="form-control form-control-sm"/> 
                                            </Col>
                                            <Col xs="2" className="text-right"> 
                                            <Button size="sm" color="primary"><FontAwesomeIcon icon={faSave}/> {this.state.btnCreaResp}</Button>               
                                            </Col>
                                        </Row>
                                        </Col>
                                    </Row>
                                </form>
                                <br/>
                                <br/>
                
                                <Row className="container">
                                    <Table style={{fontSize: 12}}>
                                        <thead>
                                            <tr>
                                                <th>Pregunta</th>
                                                <th>Respuestas</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                    this.state.respuestas_preg.map(data => {
                                                    return(
                                                                    <tr key={data.respuestas._id}>
                                                                        <td>{data.pregunta}</td>
                                                                        <td>{data.respuestas.respuesta}</td>
                                                                        {
                                                                        data.respuestas.estadoresp === true ?
                                                                                                                                <td style={{color: 'green'}}><FontAwesomeIcon icon={faCheckCircle}/></td>
                                                                                :
                                                                                                                        <td style={{color: 'red'}}><FontAwesomeIcon icon={faSkull}/></td>
                                                                }
                                                                <td>
                                                                    <Button color="warning" onClick={() => {

                                                                                                        this.editRespuesta(data.respuestas._id);
                                                                                                    }} size="sm"><FontAwesomeIcon icon={faEdit}/></Button>{' '}
                                        
                                                                    <Button color="danger" onClick={ () => {
                                                                            this.deleteRespuesta(data.respuestas._id)
                                                                                                    }} size="sm"><FontAwesomeIcon icon={faTrash}/></Button>
                                                                </td>
                                                                </tr>
                                )
                                            })
                                        }
                                        </tbody>
                                    </Table>                
                                </Row>
                
                
                            </ModalBody>                
                
                        </Modal>
                    </div>
                </div>

                );
    }

}
;
export default AdminTalleres;