import  React, {Component}from'react';
import style from '../index.css';
import style_card from '../card_style_areas.css';
import {Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, formGroup, CardTitle, Card, CardBody, CardHeader, CardImg, CardText}from 'reactstrap';
import axios from 'axios';
import{Link} from'react-router-dom';
import {render}from'react-dom';
import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';

import Cookies from 'universal-cookie';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faChartPie, faStepBackward,faLayerGroup, faFileSignature,faEye,faListOl}from '@fortawesome/free-solid-svg-icons'


const cookies = new Cookies();
//import env from "react-dotenv";
const{REACT_APP_HOST, REACT_APP_PATCH} = process.env;

const styles = {
    div: {
        padding: 10,
        textAlign: "left",

    } 

}

export default class ListAreas extends Component {
    constructor() {
        super();
        this.state = {
            areas: [],
            visitas:[],
            visitas_taller:[],
            preguntas_fallidas:[]
        }
    }

    componentDidMount() {
        if (!cookies.get('nombre')) {
            window.location.href = '/'
        }
        this.getTalleres();
        this.getVisitas();
        this.getVisitas_taller();
        this.getPreguntasFallidas();
    }
    
    getVisitas() {
        axios.get(`${REACT_APP_HOST}/api/visitaslike`).then(response => {
            this.setState({visitas: response.data})
        })

    }
    getVisitas_taller() {
        axios.get(`${REACT_APP_HOST}/api/visitastaller`).then(response => {
            this.setState({visitas_taller: response.data})
        })

    }
    getPreguntasFallidas() {
        axios.get(`${REACT_APP_HOST}/api/resultados`).then(response => {
            this.setState({preguntas_fallidas: response.data})
        })

    }
    getTalleres() {
        axios.get(`${REACT_APP_HOST}/api/areas`).then(response => {
//      axios.get('http://localhost:4000/api/talleres').then(response => {
            console.log(response.data)
            this.setState({areas: response.data})

        })

    }

    render() {


        return (
                <div className="container-fluid">
                 <Navigation />
                <div className="containerFluid2 mt-2 p-5 ">
                    <div className="row">
                    <div className="row col-md-9">
                
                        {
                    this.state.areas.map((area) => (
                                                <div className="col-md-3" key={area._id} style={styles.div}>

                                                    
                                                    
                                                     <section className="card-section">
                                                        <div className="card_">
                                                            <div className="flip-card">
                                                                <div className="flip-card__container">
                                                                    <div className="card-front">
                                                                        <div className="card-front__tp card-front__tp--dark">
                                                                                        <p className="card-front__text-price">
                                                                                          <FontAwesomeIcon icon={faFileSignature} size="2x"/>
                                                                                       </p>
                                                                                       <h5 className="card-front__heading">
                                                                                           <p className="font-weight-bold" >{area.title} </p>
                                                                                       </h5>
                                                                                      
                                                                        </div>

                                                                        <div className="card-front__bt">
                                                                            
                                                                            <p className="card-front__text-view card-front__text-view--dark">
                                                                                Ver mas
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="card-back">
                                                                    <CardImg src={`${REACT_APP_PATCH}imgareas%2F${area.image}?alt=media`} alt="Card image cap" /> 

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="inside-page">
                                                                <div className="inside-page__container">
                                                                    <h3 className="inside-page__heading inside-page__heading--dark">
                                                                        Detalle
                                                                    </h3>
                                                                    <p className="inside-page__text">
                                                                       <span style={{fontSize:'13px'}}>{area.description}</span>
                                                                    </p>
                                                                     <Link className=" inside-page__btn--dark " to={`/listTalleres/${area._id}`} style={{color: "black", textDecoration: "none black"}}>
                                                                      <span className="inside-page__btn inside-page__btn--dark">Talleres</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                ))
                        }
 

                       
                
                    </div>
                    <div className="row col-md-3">
                        <div className="container-fluid pl-4 verticalLine">
                             <Card className="card_taller">
                                                        <CardHeader>
                                                            <CardTitle className="font-weight-bold" tag="h5">Estadistica <FontAwesomeIcon icon={faChartPie}/></CardTitle>
                                                        </CardHeader>
                                        
                                                        <CardBody >
                                                             <CardText className="font-weight-bold text-danger">Preguntas mas Fallidas</CardText>
                                                            {
                                                            this.state.preguntas_fallidas.map((data, index)=>(
                                                                    <ul key={data.preguntas_get._id}>
                                                                        <i className="font-weight-bold text-danger">{data.preguntas_get.pregunta}{' '} <span className="badge bg-dark text-white"><FontAwesomeIcon icon={faListOl}/> {data.cont}</span></i>
                                                                    </ul>
                                                            ))
                                                           
                                                            }
                                                            <hr/>
                                                            <CardText className="font-weight-bold">Visitas a Areas</CardText>
                                                            {
                                                            this.state.visitas.map((data, index)=>(
                                                                    <ul key={data._id}>
                                                                        <i className="font-weight-bold">{data.talleresArea.title}{' '}<span className="badge bg-dark text-white"><FontAwesomeIcon icon={faEye}/> {data.visitas}</span></i>
                                                                    </ul>
                                                            ))
                                                           
                                                            }
                                                            <hr/>
                                                            <CardText className="font-weight-bold">Visitas a Talleres</CardText>
                                                            {
                                                            this.state.visitas_taller.map((data, index)=>(
                                                                    <ul key={data._id}>
                                                                        <i className="font-weight-bold">{data.talleres.title}{' '}<span className="badge bg-dark text-white"><FontAwesomeIcon icon={faEye}/> {data.visitas}</span></i>
                                                                    </ul>
                                                            ))
                                                           
                                                            }
           
                                                           
                                                        </CardBody>
                                                        </Card>
                        </div>
                    </div>
                    </div>
                 
                </div>
                </div>
                )
    }
}


