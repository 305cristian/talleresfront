import React, {Component}from'react';
import {render}from'react-dom';
import {Table, Button, Container,InputGroup,InputGroupText, CustomInput, Modal, ModalHeader, ModalBody, ModalFooter, formGroup} from 'reactstrap';
import Swal from 'sweetalert';
import axios from 'axios'
import P from '../components/P';
import Styles from '../index.css'

import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';
import Cookies from 'universal-cookie';
import firebase from '../../src/setting/server_firebase';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome';
import {faCheckCircle, faExclamationCircle,faSave,faBan,faBook, faFileAlt,faExclamationTriangle, faEdit, faTrash, faFile,faFileExcel}from '@fortawesome/free-solid-svg-icons';
import DataTable from "@material-table/core";
import XLSX from 'xlsx'

const cookies = new Cookies();

const {REACT_APP_HOST, REACT_APP_STORAGE} = process.env;

var storage = firebase.app().storage(`${REACT_APP_STORAGE}`);

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


class AdminAreas extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            estado: '1',
            _id: '',
            areas: [],
            textButton: 'REGISTRAR',
            header: 'Insertar Area',
            modalOpen: false,
            img_temp:'',
            image: '',
            aux:'',
            errors: {},

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
        axios.post(`${REACT_APP_HOST}/api/areas/get_areas`).then((response) => {
            this.setState({areas: response.data})
//            console.log(response.data);
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
            datos.append('estado', this.state.estado);
//            datos.append('image', this.state.image.name);
            
            if (this.state._id && this.state.aux==='') {
//                console.log('modifico');
                datos.append('image', this.state.image);
            } else if(this.state._id && this.state.aux.name) {
//                 console.log('modifico imagen');
                datos.append('image', this.state.image.name);
            }else{
//                 console.log('guardo');
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
                    this.setState({title: '', description: '',estado:'1', _id: '', textButton: 'REGISTRAR', modalOpen: false, image: null,aux:'', errors: {}});
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
                    this.setState({title: '', description: '',estado:'1',aux:'', image: null})
                })
            }
        }

    }

    editArea(id) {
        axios.get(`${REACT_APP_HOST}/api/areas/` + id).then((response) => {
            this.setState({
                title: response.data.title,
                description: response.data.description,
                estado: response.data.estado,
                image: response.data.image,
                img_temp: response.data.image,
                _id: response.data._id,
                textButton: 'ACTUALIZAR',
                header: 'Actualizar Area',
            })
//            console.log(this.state.image)
        })
    }
    
    validarEliminacion(id_area, image){
        axios.get(`${REACT_APP_HOST}/api/talleres/` + id_area+'/0').then( (response)=> {
            if(response.data==='no_existe'){
              this. deleteArea(id_area, image);
            }else if(response.data ==='existe'){
             Swal({
                title: '!Atención',
                text:'Esta Area tiene talleres registrados, imposible eliminar',
                icon: 'warning',
                button: true
           });
            }
        });
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
//                    console.log(response.data);
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
//        console.log(e.target.value);
    }
    
     uploadImage = async() => {
        var storageRef = storage.ref();       
        var spaceRef = storageRef.child(`images/imgareas/${this.state.image.name}`);
//         console.log(spaceRef);
        return await spaceRef.put(this.state.image);

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
//        console.log(e.target.files[0]);
    }
     downloadReporte=(e)=>{
      const newData=this.state.areas.map(row=>{
        delete row._id;
        delete row.__v;
        return row;
      })
      const workSheet=XLSX.utils.json_to_sheet(newData);
      const workBook=XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook,workSheet,"areas");
      //Buffer
      let buf=XLSX.write(workBook,{bookType:"xlsx",type:"buffer"});
      //Binary string
      XLSX.write(workBook,{bookType:"xlsx",type:"binary"});
      //Download
      XLSX.writeFile(workBook,"Areas.xlsx");


    }
    
    

    render() {

        const {errors} = this.state;
        return (
                <div className="container-fluid">
                    <Navigation />
                    <div className="containerList">
                        <br/>
                        <Button color="primary" onClick={this.showModal}><FontAwesomeIcon icon={faFileAlt}/> Nueva Area</Button>
              
                        {this.state.areas.length > 0 ?
                                <DataTable
                           
                                columns={[
                                   {title:'AREA', field:'title'},
                                   {title:'DETALLE', field:'description'},
                                   {title: 'Estado', field: 'estado',
                                        render: (rowData) => rowData.estado === '0' ? <span size="sm" className='badge text-white bg-danger'>Inactivo <FontAwesomeIcon icon={faExclamationCircle} /></span>
                                                    : <span size="sm" className='badge bg-success text-white'>Activo <FontAwesomeIcon icon={faCheckCircle}/></span>

                                    },
                                   {title:'IMG-DIR', field:'image'},
                                ]}
                                data={this.state.areas}
                                title='Lista de Areas'
                                actions={[                                   
                                    {
                                        icon:()=><span className="btn btn-warning btn-sm"><FontAwesomeIcon icon={faEdit}/></span>,
                                        tooltip:'Editar Area',
                                        onClick:(event, rowData)=>{this.showModal();this.editArea(rowData._id); }                                         
                                    },
                                    {
                                       icon:()=><span className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faTrash}/></span>,
                                        tooltip:'Eliminar Area',
                                        onClick:(event, rowData)=>this.validarEliminacion(rowData._id, rowData.image)
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
                                    padding:'default',//dense
                                    pageSize:7,
                                    pageSizeOptions:[7,15,30],
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
                                    : <h5 className="text-warning">! Atencion, No se encontraron areas registradas <FontAwesomeIcon icon={faExclamationTriangle}/></h5>}
                        <Modal isOpen={this.state.modalOpen}>
                            <ModalHeader>
                                <div><h3><FontAwesomeIcon icon={faBook}/> {this.state.header}</h3></div>
                            </ModalHeader>
                
                            <ModalBody>
                                <form onSubmit={this.addArea} className="container">
                                    <div className="row">
                                    <InputGroup className="my-1" >
                                        <InputGroupText>
                                            Titulo
                                        </InputGroupText>
                                        <input name="title" onChange={this.handleChange} type="text" className="form-control" placeholder="Title" value={this.state.title}/>
                                    </InputGroup> 
                                      {errors.title && <P errors={errors.title} />}
                                    </div>
                                    <br/>
                                    <div className="row">
                                     <InputGroup className="my-1" >
                                        <InputGroupText>
                                            Descripción
                                        </InputGroupText>
                                        <textarea name="description" onChange={this.handleChange} type="text" className="form-control" placeholder="Description" value={this.state.description}/>
                                    </InputGroup>
                                    </div>                            
                                    <br/>
                                    <div className="row">
                                        <CustomInput name="image" type="file" onChange={this.handleImageUpload} id="image" label='Seleccione una Imagen' accept="image/png, .jpeg, .jpg"/>
                                        {errors.image && <P errors={errors.image} />}
                                    </div>
                                    <br/>
                                    <div className="row">
                                     <InputGroup className="my-1" >
                                        <InputGroupText>
                                            Estado
                                        </InputGroupText>
                                        <select name="estado" className='form-control' onChange={this.handleChange} value={this.state.estado}>
                                            <option value='1'>ACTIVO</option>
                                            <option value='0'>INACTIVO</option>
                                        </select>
                                    </InputGroup>
                                    </div>
                                    
                                    <br/>
                
                                    <Button id="btnInsertar"><FontAwesomeIcon icon={faSave}/> {this.state.textButton}</Button>{' '}
                                    <Button id="btnCancelar" onClick={this.hideModal} className="btn btn-danger" data-dismiss="modal" aria-hidden="true"><FontAwesomeIcon icon={faBan}/> CANCELAR</Button>
                                </form>
                            </ModalBody>               
                        </Modal>
                    </div>
                </div>

                );
    }

}

export default  AdminAreas
