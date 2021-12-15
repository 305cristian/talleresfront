import React, {Component} from 'react';
import{Link} from'react-router-dom';
import {render}from'react-dom';
import {Container, Table, Modal, ModalHeader, ModalBody, Row, Col, Button}from 'reactstrap';
import Navigation from '../components/Navigation';
import axios from 'axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome';
import {faCheckCircle, faExclamationCircle, faFileDownload, faTimesCircle}from '@fortawesome/free-solid-svg-icons';

//Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 

import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'

        const{REACT_APP_HOST} = process.env;
var t_c = [];
var talleres_comp = [];
var respuestas_consolidado=[];

class AdminResultados extends Component {

    constructor() {
        super();
        this.state = {
            talleres: [],
            usuarios: [],
            user_talleres: [],
            
            //Modal
            modalOpen:false,
            puntuacion:'',
            
            resultados:[],
            
            //Para el consolidado
            preguntas:[],
            resultados_taller:[],
            
            modalOpen_consolidadod:false
        }



    }
    componentDidMount() {
        this.getTalleres();
        //initialize datatable
       
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
            this.datatabla();
        })

    }

datatabla(){
    
    $(document).ready(function () {
                       $('#resultados').DataTable({
                          language: {url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
                          dom: "<'row'<'col-sm-12 col-md-12 text-left'B>>" +
                            "<'row'<'col-sm-12'tr>>" +
                            "<'row'<'col-sm-12'tr>>" +
                            "<'row'<'col-sm-12 my-1'>>" +
                            "<'row'<'col-sm-12 col-md-5 text-left'l><'col-sm-12 col-md-7'f>>" +
                            "<'row'<'col-sm-12'tr>>" +
                            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                        buttons: [
                           // 'copy', 'csv', 'excel', 'print'
                           {
                            extend: 'copy',
                            text: 'Copiar',
                            titleAttr: 'Copiar Tabla',
                            className: 'btn btn-info btn-sm ',                            
                           },
                           {
                            extend: 'csv',
                            text: 'Excel',
                            titleAttr: 'Copiar Tabla',
                            className: 'btn btn-success btn-sm  ',                            
                           },                        
                           {
                            extend: 'print',
                            text: 'Imprimir',
                            titleAttr: 'Copiar Tabla',
                            className: 'btn btn-dark btn-sm  ',                            
                           },
                        ]
                       });
            });
}

    marcarCompletado(user, index) {
//        alert(user);
        var taller_completado = [];
        var returnedobj = [];
        this.state.talleres.map((taller, i) => {
            var estado = '0';
            var puntuacion='';
            this.state.user_talleres.map((user_taller, j) => {
                if (user === user_taller.id_user) {
                    if (taller._id === user_taller.id_taller) {
                        estado = '1';
                        puntuacion=user_taller.puntuacion;
                    }
                }
            })
            if (estado === '1') {
                returnedobj = Object.assign(taller, {estado: '1', puntuacion:puntuacion});
                console.log(user+ '--'+ taller._id+ '--'+ puntuacion+ '  est:1')
                console.log(returnedobj)
            } else {
                returnedobj = Object.assign(taller, {estado: '0'});
            }
            taller_completado.push(returnedobj);

        })
//        console.log(taller_completado);

        talleres_comp = taller_completado;
//        console.log('--- ',talleres_comp)
    }
    
    
    getNotas(id_user, id_taller){
      axios.get(`${REACT_APP_HOST}/api/user_taller/`+id_user+'/'+id_taller+'/0').then( (response)=> {
            if(response.data){
               this.setState({puntuacion:response.data.puntuacion}); 
            }
        })  
    }
    
    //ABRE MODAL RESULTADOS
    modalOpen(id_user, id_taller, puntuacion){
       this.getNotas(id_user, id_taller);
       this.setState({modalOpen:true});
       this.showResultados(id_user, id_taller);

    }
    showResultados(id_user, id_taller){
        axios.get(`${REACT_APP_HOST}/api/resultados/`+id_user+'/'+id_taller).then((response)=>{
            this.setState({resultados:response.data});
        });
    }
    
    hideModalEval() {
        this.setState({modalOpen: false});
    }
    //CIERRA MODAL RESULTADOS
    
    
    
    //ABRE MODAL CONSOLIDADO
    show_consolidado(id_taller){

        this.setState({modalOpen_consolidadod:true});
        this.show_consolidado_data(id_taller);

    }
     
    show_consolidado_data(taller_id){
        axios.get(`${REACT_APP_HOST}/api/preguntas/`+taller_id).then((response)=>{
            this.setState({preguntas:response.data});
            this.get_resultados(taller_id);

        });
    }
    
    get_resultados(taller_id){

         axios.get(`${REACT_APP_HOST}/api/resultados/`+taller_id).then((response)=>{
            this.setState({resultados_taller:response.data});

        });

    }
    
    respuestas_user(id_user){
        
        var respuestas_consol=[];
        this.state.preguntas.map((preg, i)=>{
            this.state.resultados_taller.map((resp, j)=>{
                    if(preg._id === resp.id_preg && id_user=== resp.id_user){
//                        alert(id_user+'  '+ preg.pregunta+'  : '+resp.resp)
                        respuestas_consol.push(resp.resp);
                    }

            })
        });
        respuestas_consolidado=respuestas_consol;

    }
    hideModal_consolidado() {
        this.setState({modalOpen_consolidadod: false});
    }
   // CIERRA MODAL CONSOLIDADO
    
     

    render() {

        return(
                <div>
                    <Navigation />
                    <div className="containerList my-3" style={{overflowX: 'auto'}}> 
                        <h2>Resultados de los Talleres</h2>
                        
                        <table id='resultados' className='table table-nowrap' style={{fontSize:'15px'}}>
                            <thead >
                
                                <tr>
                
                                    <th></th>
                                    <th></th>
                                    {
                                        this.state.talleres.map((data, index) => (
                                        <th key={data._id}><button className="btn btn-success btn-sm" onClick={()=>{this.show_consolidado(data._id)}}><FontAwesomeIcon icon={faFileDownload}/> Exportar</button></th>
                                                    ))
                                    }
                
                                </tr>
                                <tr className='bg-dark text-white'>
                
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
                                              talleres_comp.map((data2) => (
                                                                     
                                                <td key={data2._id}>
                                                    {data2.estado==='1'?<a href='#' onClick={()=>{this.modalOpen(data._id, data2._id)}}><span className=' text-success'>Completo {data2.puntuacion} <FontAwesomeIcon icon={faCheckCircle} /></span></a>
                                                                       :<span className='text-warning badge'>En curso <FontAwesomeIcon icon={faExclamationCircle} /></span>}
                                                 </td>
                                                            
                                            ))
                                    }
                                    </tr>
                                            ))
                            }
                
                            </tbody>
                        </table>
                    </div>
                    
                <Modal isOpen={this.state.modalOpen} size='lg'>
                 <div className='p-2 border'>
                                <Row>
                                    <Col xs='11'>
                                    <h4>Resultados de La evaluación  <span className='badge bg-success text-white'>{this.state.puntuacion}/10</span></h4>
                                    </Col>
                                    <Col xs='1'>
                                    <Button color="danger" size="sm" onClick={() => { this.hideModalEval(); }}>X</Button>                                                                        
                                    </Col>
                                </Row>
                            </div>  
                <ModalBody>
                <div className="col-md-12">
                    {
                        this.state.resultados.map((data, index)=>{
                            return(
                                    <Container key={data._id} >  
                                        <label>{index +1+')'} {data.preg_taller.pregunta}</label><br/>
                                        {data.estado_resp ==='1'?
                                        <span className="text-success"><label className='ml-5'>{data.resp}</label></span>
                                        
                                        :
                                         <span className="text-danger font-weight-bold"><label className='ml-5'>{data.resp}</label></span>
                                        }                                      
                                    </Container>
                                    );
                        })
                    }
                </div>
                </ModalBody>
                </Modal>
                
                
                <Modal isOpen={this.state.modalOpen_consolidadod} style={{maxWidth: '1300px', width: '100%'}} >
                 <ReactHTMLTableToExcel
                    id="btn-export-excel"
                    className="btn btn-success"
                    table="consolidado"
                    filename="Consolidado de Respuestas"
                    sheet="HOJA 1"
                    buttonText="Descargar as XLS"/>
                <ModalBody>
                  <div className=" my-3" style={{overflowX: 'auto'}}>                         
                        <table id='consolidado' className='table table-nowrap' style={{fontSize:'11px'}}>
                            <thead className='bg-dark text-white' >
                
                                <tr>
                
                                    <th>USUARIO</th>
                                    <th>CEDULA</th>
                                    {
                                        this.state.preguntas.map((data, index) => (
                                        <th key={data._id}>{data.pregunta}</th>
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
                                            {this.respuestas_user(data._id, index)}
                                            {
                                                respuestas_consolidado.map((data2, j)=>(
                                                   <td key={j}> {data2}</td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                
                            </tbody>
                           
                        </table>
                    </div>
                    
                </ModalBody>
                
                    <div className="my-2 text-center"><Button color="danger" size="sm" onClick={() => { this.hideModal_consolidado(); }}><FontAwesomeIcon icon={faTimesCircle}/> Close</Button> </div>                                                                       

                </Modal>
                </div>

                );
    }
}

export default AdminResultados;