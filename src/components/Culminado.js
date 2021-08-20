import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button, CardTitle, CardText, Card, CardHeader, CardBody} from 'reactstrap';
import ReactPlayer from 'react-player';
import{useParams, Link} from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faCheckCircle, faStepBackward}from '@fortawesome/free-solid-svg-icons'

import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';

import Cookies from 'universal-cookie';

import exito from '../img/copa.png';

const cookies = new Cookies();
//import Styles from '../index.css'


const{REACT_APP_HOST} = process.env;

const styles = {
    border: {
        borderStyle: 'groove',
        color: "#3c3a2d",
        display: 'flex'
    }
}

function Culminado() {

    const {id} = useParams();
    const {fecha} = useParams();
    const[taller, getTaller] = useState([]);
    const[value, setstatusBoton] = useState(false);

    useEffect(() => {
        if (!cookies.get('nombre')) {
            window.location.href = '/'
        }
        const obtenertaller = () => {
            axios.get(`${REACT_APP_HOST}/api/talleres/${id}`).then(response => {
                getTaller(response.data);
//                console.log(response.data)
            });
        }
        obtenertaller();
    }, [id]);




    return(
            <div>
                <Navigation />
                <div className="containerFluid mt-3 p-2" >
                    <Row>
            
                        <Col xs={12} className='text-center text-success'>
                        <img width='400' height='400' src={exito} alt="Exito"/>
                        <h2>Curso Completo <FontAwesomeIcon icon={faCheckCircle} /></h2>
                        <h5>Curso Completado el {fecha} <FontAwesomeIcon icon={faCheckCircle} /></h5>
                        <Card>
                        <CardHeader><div className="pl-2"><CardTitle className="font-weight-bold" tag="h5">Nombre del curso: {taller.title} <FontAwesomeIcon icon={faCheckCircle} /></CardTitle></div></CardHeader>
                        <div className="pl-2 pb-2 text-left">
                            <Link to={`/home`}><Button color="success"><FontAwesomeIcon icon={faStepBackward} />Home</Button></Link>
                        </div>
                        </Card>
            
            
                        </Col>
            
            
            
                    </Row>
            
            
                </div>
            </div>
            )

}

export default Culminado;


