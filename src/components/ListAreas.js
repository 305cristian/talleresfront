import  React, {Component}from'react';
import style from '../index.css';
import {Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, formGroup, CardTitle, Card, CardBody, CardHeader, CardImg, CardText}from 'reactstrap';
import axios from 'axios';
import{Link} from'react-router-dom';
import {render}from'react-dom';
import Navigation from '../components/Navigation';
import Breadcrumb_nav from '../components/Breadcrumb_nav';

import Cookies from 'universal-cookie';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faChartPie, faStepBackward,faLayerGroup}from '@fortawesome/free-solid-svg-icons'


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
                                                    <Link to={`/listTalleres/${area._id}`} style={{color: "black", textDecoration: "none black"}}>
                                                        <Card className="card_taller">
                                                        <CardHeader>
                                                        <div  className="row  pl-2">
                                                            <div className="  col-md-10">
                                                                <CardTitle className="font-weight-bold" tag="h5">{area.title} </CardTitle>
                                                            </div>
                                                            <div className=" col-md-2">
                                                              <span style={{fontSize: 20, color:'#6c757d'}}><FontAwesomeIcon icon={faLayerGroup}/></span>
                                                            </div>
                                                        </div>
                                                        </CardHeader>
                                        
                                                        <CardBody className="text-center">
                                                            <CardImg className="image" top width="100%" src={`${REACT_APP_PATCH}imgareas%2F${area.image}?alt=media`} alt="Card image cap" /> 
                                                            <CardText>{area.description}</CardText>
                                                            
                                                        </CardBody>
                                                        </Card>
                                                    </Link>
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


