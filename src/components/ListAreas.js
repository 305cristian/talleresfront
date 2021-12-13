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
import {faChartPie, faStepBackward,faLayerGroup, faFileSignature}from '@fortawesome/free-solid-svg-icons'


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
            areas: []
        }
    }

    componentDidMount() {
        if (!cookies.get('nombre')) {
            window.location.href = '/'
        }
        this.getTalleres();
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
                                                                                       <h2 className="card-front__heading">
                                                                                           <CardTitle className="font-weight-bold" tag="h5">{area.title} </CardTitle>
                                                                                       </h2>
                                                                                      
                                                                        </div>

                                                                        <div className="card-front__bt">
                                                                            <p className="card-front__text-view card-front__text-view--dark">
                                                                                Ver mas
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="card-back">
                                                                    <CardImg className="image"  src={`${REACT_APP_PATCH}imgareas%2F${area.image}?alt=media`} alt="Card image cap" /> 

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="inside-page">
                                                                <div className="inside-page__container">
                                                                    <h3 className="inside-page__heading inside-page__heading--dark">
                                                                        Detalle
                                                                    </h3>
                                                                    <p className="inside-page__text">
                                                                       <CardText style={{fontSize:'13px'}}>{area.description}</CardText>
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
                                        
                                                        <CardBody className="text-center">
                                                            <CardText>En Construccion</CardText>
                                                            
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


