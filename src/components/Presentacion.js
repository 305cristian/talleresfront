import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button, CardTitle, CardText, Card, CardHeader, CardBody} from 'reactstrap';
import ReactPlayer from 'react-player';
import{useParams, Link} from 'react-router-dom';
import axios from 'axios';

import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';

import Cookies from 'universal-cookie';



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

function Presentacion() {

    const {id} = useParams();
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
        };
        obtenertaller();
    }, [id]);



    const evalEnable = (e) => {
        setstatusBoton(true);
    }
    const evalDisable = (e) => {
        setstatusBoton(false);
    }





    return(
            <div>
                <Navigation />
                <div className="containerFluid mt-3 p-2" >
                    {taller.video !== '...' ?
                            <Row>
                                <Col xs={3} >
                                <Card>
                                <CardHeader><div className="pl-2"><CardTitle className="font-weight-bold" tag="h5">{taller.title}</CardTitle></div></CardHeader>
                                <CardBody><div className="pl-2"><CardText>{taller.description}</CardText></div></CardBody>
                                <div className="pl-2 pb-2 text-center">
                                    <Link to={`/evaluacion/${id}`}><Button disabled={!value} color="success">Evaluacion</Button></Link>
                                </div>
                                </Card>
                                </Col>
                                <Col xs={9}>
                    
                                <ReactPlayer
                                    url={`${REACT_APP_HOST}/public_video/${taller.video}`}   
                                    controls
                                    width='100%'
                                    height='100%'    
                    
                                    onEnded={evalEnable}
                                    onPlay={evalDisable}
                                    />
                    
                    
                                </Col>
                    
                    
                    
                            </Row>
                                :
                            <div className="row p-3 d-flex flex-column align-items-center">
                                <div className="col-md-4">
                    
                                    <Card>
                                    <CardHeader><div className="pl-2"><CardTitle className="font-weight-bold" tag="h5">{taller.title}</CardTitle></div></CardHeader>
                                    <CardBody><div className="pl-2"><CardText>{taller.description}</CardText></div></CardBody>
                                    <div className="pl-2 pb-2 text-center">
                                        <Link to={`/evaluacion/${id}`}><Button disabled={value} color="success">Evaluacion</Button></Link>
                                    </div>
                                    </Card>
                    
                                </div><br/>
                                <div  className="col-md-8 text-center">
                    
                                    <h1>No hay Presentacion Registrada</h1>
                    
                                </div>
                    
                    
                    
                            </div>
                    }
                </div>
            </div>
            )

}

export default Presentacion;


