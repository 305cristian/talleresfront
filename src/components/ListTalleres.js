import  React, {Component}from'react';
import style from '../index.css';
import {Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, formGroup, CardTitle, Card, CardBody, CardHeader, CardImg, CardText}from 'reactstrap';
import {render}from'react-dom';
import axios from 'axios';
import{Link, useParams} from'react-router-dom';

import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faCheckCircle, faExclamationCircle}from '@fortawesome/free-solid-svg-icons'

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
        if (!cookies.get('nombre')) {
            window.location.href = '/';
        }
        this.getTaller();
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
            console.log(response.data)
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

            this.state.user_talleres.map((us_taller, i) => {
                if (taller._id === us_taller.id_taller) {

                    estado = '1'; //Cambiamos el estado a 1 porque este taller ya esta completado
                    fecha = us_taller.fecha_regis;//Variable adicional solo para la fecha
                }

            })

            if (estado === '1') {
                var returnedobj = Object.assign(taller, {estado: '1', fecha: fecha});
            } else {
                var returnedobj = Object.assign(taller, {estado: '0'});
            }
            talleresjoin.push(returnedobj);

        })
        this.setState({talleres_validados: talleresjoin})

    }

    render() {

        return (
                <div>
                    <Navigation />
                    <Container>
                
                        {this.state.talleres.length > 0 ?
                                    <div className="row my-5">
                                        {
                                                    this.state.talleres_validados.map((taller, index) => (
                                                                <div className="col-md-3" key={taller._id} style={styles.div}>
                                                                    {taller.estado === '1' ?
                                                                                                <Link to={`/culminado/${taller._id}/${taller.fecha}`} style={{color: "black", textDecoration: "none black"}}>
                                                                                                <Card className="card_taller">
                                                                                                <CardHeader>
                                                                                                    <CardTitle className="font-weight-bold" tag="h5">{taller.title}</CardTitle>
                                                                                                    <div className="text-right"><span className="badge bg-success text-white text-right">Completado <FontAwesomeIcon icon={faCheckCircle}/></span></div>
                                                                                                </CardHeader>
                                                                                                <CardBody className="text-center">
                                                                                                    <CardImg className="image" top width="100%" src={`${REACT_APP_PATCH}imgtaller%2F${taller.image}?alt=media`} alt="Card image cap" /> 
                                                                                                    <CardText>{taller.description}</CardText>
                                                                                
                                                                                                </CardBody>
                                                                                                </Card>
                                                                                                </Link>
                                                                                            :
                                                                                                <Link to={`/presentacion/${taller._id}`} style={{color: "black", textDecoration: "none black"}}>
                                                                                                <Card className="card_taller">
                                                                                                <CardHeader>
                                                                                                    <CardTitle className="font-weight-bold" tag="h5">{taller.title}</CardTitle>
                                                                                                    <div className="text-right"><span className="badge bg-warning text-white text-right">En Curso <FontAwesomeIcon icon={faExclamationCircle}/></span></div>
                                                                                                </CardHeader>
                                                                                                <CardBody className="text-center">
                                                                                                    <CardImg className="image" top width="100%" src={`${REACT_APP_PATCH}imgtaller%2F${taller.image}?alt=media`} alt="Card image cap" /> 
                                                                                                    <CardText>{taller.description}</CardText>
                                                                                
                                                                                                </CardBody>
                                                                                                </Card>
                                                                                                </Link>
                                                                    }   
                                                                </div>

                                                                ))


                                        }
                            
                                    </div>

                                    : <h5>No hay talleres registrados en esta area</h5>}
                    </Container>
                
                </div>
                )
    }

}
export default ListTalleres;



