import  React, {Component}from'react';
import style from '../index.css';
import style2 from '../card_style_talleres.css';
import {Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, formGroup, CardTitle, Card, CardBody, CardHeader, CardImg, CardText}from 'reactstrap';
import {render}from'react-dom';
import axios from 'axios';
import{Link, useParams} from'react-router-dom';

import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faCheckCircle, faExclamationCircle, faExclamationTriangle, faLock, faFilm, faPenAlt}from '@fortawesome/free-solid-svg-icons'

import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';

import Cookies from 'universal-cookie';



const cookies = new Cookies();
const{REACT_APP_HOST, REACT_APP_PATCH} = process.env;

const styles = {
    div: {
        padding: 10,
        textAlign: "left",

    }

}

class ListTalleres extends Component {
    constructor() {
        super();
        this.state = {
            talleres: [],
            user_talleres: [],
            talleres_validados: []
        }

    }

    componentDidMount() {
        this.visitas();
        if (!cookies.get('nombre')) {
            window.location.href = '/';
        }
        this.getTaller();
    }
    visitas(){
        const{match} = this.props;
        const id_ar = match.params.id_ar;
        const datos={id_area:`${id_ar}`};
        
        axios.post(`${REACT_APP_HOST}/api/visitaslike`,datos).then( (response)=> {
            if(response.data){
                console.log('visita registrada');
            }
        });
    }
    
    getTaller() {
        const{match} = this.props;
        const id_ar = match.params.id_ar;

        axios.post(`${REACT_APP_HOST}/api/talleres_ar/${id_ar}`).then(response => {
            this.setState({talleres: response.data});
            console.log(response.data);
            this.getUserTaller();
        });

    }

    getUserTaller() {
        const id_user = cookies.get('id');
        axios.get(`${REACT_APP_HOST}/api/user_taller/${id_user}`).then((response) => {
            this.setState({user_talleres: response.data})
//            console.log(response.data)
            this.verificarCompletado();
        })

    }

    verificarCompletado() {
        /**
         * Recorro el arreglo de talleres y agarro el primero de la lista
         * Luego recorro el arreglo de user_talleres y agarro el primero de la lista
         * Luego Comparo los 2 objetos agarrados taller._id === us_taller.id_taller, y paso el estado a 1, lo cual indica que este taller en este usuario ya esta completado
         * Luego pregunto si el estado esta en 1 o 0, si esta en 1 quiere decir que la tarea esta completada, procedemos a concatenar
         * el objeto taller con un objeto adicional el cual tendra el estado del taller y la fecha
         * */

        var talleresjoin = [];

        this.state.talleres.map((taller, index) => {

            var estado = '0';//Variable clave, indica cuando que taller esta completado, le pasamos de estado 0 a 1 
            var fecha = '';
            var intentos = '';
            var intentosok = '';

            this.state.user_talleres.map((us_taller, i) => {

                if ((taller._id === us_taller.id_taller) && (us_taller.estado === '1')) {

                    estado = '1'; //Cambiamos el estado a 1 porque este taller ya esta completado
                    fecha = us_taller.fecha_regis;//Variable adicional solo para la fecha
                    intentosok = us_taller.intentos;
//                    console.log('eeee')
                } else {
                    if (taller._id === us_taller.id_taller) {
                        intentos = us_taller.intentos;
//                    console.log('intentos ',intentos)
                    }

                }

            })

            if (estado === '1') {
                var returnedobj = Object.assign(taller, {estado: '1', fecha: fecha, intentoslock: intentosok});
            } else {
                var returnedobj = Object.assign(taller, {estado: '0', intentoslock: intentos});
            }
            talleresjoin.push(returnedobj);

        })
        console.log('talleres join ', talleresjoin)
        this.setState({talleres_validados: talleresjoin});

    }

    render() {

        return (
                <div className="container-fluid">
                    <Navigation />
                    <div className="containerFluid2 mt-2 p-5 ">
                
                        {this.state.talleres.length > 0 ?
                                    <div className="row">
                                    
                                        {
                                                    this.state.talleres_validados.map((taller, index) => (
                                                        
                                                            
                                                                <div className="col-md-3" key={taller._id} style={styles.div}>
                                                                    {taller.estado === '1' ?
                                                                                         <div className="container">
                                                                                                        <div className="cardd">
                                                                                                            <div className="face face1">                                                                                                                                                                                                                                                                                                                               
                                                                                                                <div className="content  text-center">                                                                                                                                                          
                                                                                                                    <CardImg className="image_taller"  top width="100%" src={`${REACT_APP_PATCH}imgtaller%2F${taller.image}?alt=media`} alt="Card image cap" /> 
                                                                                                                    <h3><CardTitle className="font-weight-bold" >{taller.title}</CardTitle></h3>
                                                                                                                    <div className="text-center"><span className="badge bg-success text-white" style={{fontSize:'15px'}}>Completado <FontAwesomeIcon icon={faCheckCircle}/></span></div>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                        <div className="face face2">
                                                                                                            <div className="content">
                                                                                                                <CardText>{taller.description}</CardText>
                                                                                                                <Link to={`/culminado/${taller._id}/${taller.fecha}`} style={{color: "black", textDecoration: "none black"}}><span><FontAwesomeIcon icon={faFilm}/> Ver Presentación</span></Link>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    </div>
                                                                                            :
                                                                                                <div>
                                                                                                    {taller.intentoslock >= taller.intentos ?
                                                                                                   <div className="container">
                                                                                                        <div className="cardd">
                                                                                                            <div className="face face1">

                                                                                                                <div className="content  text-center">

                                                                                                                    <CardImg className="image_taller" top width="100%" src={`${REACT_APP_PATCH}imgtaller%2F${taller.image}?alt=media`} alt="Card image cap" /> 
                                                                                                                    <h3><CardTitle className="font-weight-bold text-danger" >{taller.title}</CardTitle></h3>
                                                                                                                    <div className="text-center"><span className="badge bg-danger text-white" style={{fontSize:'15px'}}>Lock <FontAwesomeIcon icon={faLock}/></span></div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="face face2">
                                                                                                                <div className="content">
                                                                                                                    <CardText className="text-danger">Taller Bloqueado por exceso de intentos, cominiquese con el administrador del sistema</CardText>
                                                                                                                    <Link to={`#`} style={{color: "black", textDecoration: "none black"}}><span><FontAwesomeIcon icon={faFilm}/> Ver Presentacion</span></Link>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        </div>
                                                                                                    :                                           
                                                                                                        <div className="container">
                                                                                                        <div className="cardd">
                                                                                                            <div className="face face1">

                                                                                                                <div className="content  text-center">

                                                                                                                    <CardImg className="image_taller" top width="100%" src={`${REACT_APP_PATCH}imgtaller%2F${taller.image}?alt=media`} alt="Card image cap" /> 
                                                                                                                    <h3><CardTitle className="font-weight-bold" >{taller.title}</CardTitle></h3>
                                                                                                                    <div className="text-center"><span className="badge bg-warning text-white" style={{fontSize:'15px'}}>En Curso <FontAwesomeIcon icon={faExclamationCircle}/></span></div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="face face2">
                                                                                                                <div className="content">
                                                                                                                    <CardText>{taller.description}</CardText>
                                                                                                                    <Link to={`/presentacion/${taller._id}/0`} style={{color: "black", textDecoration: "none black"}}><span><FontAwesomeIcon icon={faFilm}/> Ver Presentación</span></Link>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        </div>
                                                                                                                                                       
                                                                                                    }  
                                                                                                </div>
                                                                    }                          
                                                                </div>

                                                                ))


                                        }
                            
                                    </div>
                                    
 

                                    : <h5 className="text-warning">! Atencion, No hay talleres registrados en esta area <FontAwesomeIcon icon={faExclamationTriangle}/></h5>}
                    </div>
               
               
                </div>
                
                )
    }

}
export default ListTalleres;



