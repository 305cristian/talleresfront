import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button, CardTitle, CardText, Card, CardHeader, CardBody} from 'reactstrap';
import ReactPlayer from 'react-player';
import{useParams, Link} from 'react-router-dom';
import axios from 'axios';

import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';

import Cookies from 'universal-cookie';

import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faPenAlt}from '@fortawesome/free-solid-svg-icons'


const cookies = new Cookies();
//import Styles from '../index.css'


const{REACT_APP_HOST, REACT_APP_PATCH_VID} = process.env;

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
        }
        obtenertaller();
        visitas();
    }, [id]);


    const visitas=()=>{
        const datos={id_taller:`${id}`};
        
        axios.post(`${REACT_APP_HOST}/api/visitastaller`,datos).then( (response)=> {
            if(response.data){
                console.log('visita registrada');
            }
        });
    }
    const evalEnable = (e) => {
        setstatusBoton(true);
    }
    const evalDisable = (e) => {
        setstatusBoton(false);
    }





    return(
            <div>
                <Navigation />
                <main className="bg-dark">
                    {taller.video !== '...' ?
                           
                            <Row>
                                                                                                                          
                                <div className=" col-md-12 d-flex text-white p-3">
                                    <div className=" col-md-12">
                                        <div className="d-flex"><CardTitle className="font-weight-bold" tag="h5">{taller.title}</CardTitle></div>
                                    </div>
                                   
                                </div>
                                
                                <Col xs={12}>

                                <ReactPlayer
                                    url={`${REACT_APP_PATCH_VID}videostaller%2F${taller.video}?alt=media`}   
                                    controls={true}
                                    className="react-player"
                                    width='100%'
                                    height='100%'    
                                    playing={true}
                                    onEnded={evalEnable}
                                    onPlay={evalDisable}
                                    config={{
                                        file: {
                                            attributes: {
                                                disablePictureInPicture: "false",
                                                controlsList: 'nodownload  noplaybackrate',


                                            }
                                        }
                                    }}
                                    />
                                    
                    
                    
                                </Col>
                    
                                <div className=" col-md-12 d-flex text-white p-3">
                                   
                                    <div className=" col-md-12 text-right">
                                        <Link to={`/evaluacion/${id}`}target="_blank"><Button size="lg" disabled={!value} color="success"><FontAwesomeIcon icon={faPenAlt}/> Evaluación</Button></Link>                                                              
                                    </div>
                                </div>
                    
                            </Row>
                                :
                            <div className="row p-3 d-flex flex-column align-items-center">
                                <div className="col-md-4">
                    
                                    <Card>
                                    <CardHeader><div className="pl-2"><CardTitle className="font-weight-bold" tag="h5">{taller.title}</CardTitle></div></CardHeader>
                                    <CardBody><div className="pl-2"><CardText>{taller.description}</CardText></div></CardBody>
                                    <div className="pl-2 pb-2 text-center">
                                        <Link to={`/evaluacion/${id}`}target="_blank"><Button disabled={value} color="success"><FontAwesomeIcon icon={faPenAlt}/> Evaluacion</Button></Link>
                                    </div>
                                    </Card>
                    
                                </div><br/>
                                <div  className="col-md-8 text-center text-white">
                    
                                    <h1>No hay Presentacion Registrada</h1>
                    
                                </div>
                    
                    
                    
                            </div>
                    }
                </main>
            </div>
            )

}

export default Presentacion;


