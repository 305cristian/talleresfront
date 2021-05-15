import  React, {Component}from'react';
import style from '../index.css';
import {Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, formGroup, CardTitle, Card, CardBody, CardHeader, CardImg, CardText}from 'reactstrap';
import axios from 'axios';
import{Link, useParams} from'react-router-dom';
import {render}from'react-dom';



const{REACT_APP_HOST} = process.env;

const styles = {
    div: {
        padding: 10,
        textAlign: "left",

    }

}
export default class ListTalleres extends Component {
    constructor() {
        super();
        this.state = {
            talleres: []
        }

    }

    componentDidMount() {
        this.getTaller();
    }
    getTaller() {
        const{match} = this.props;
        const id_ar = match.params.id_ar;

        axios.post(`${REACT_APP_HOST}/api/talleres_ar/${id_ar}`, ).then(response => {
            console.log(response.data)
            this.setState({talleres: response.data})

        })

    }

    render() {

        return (
                <Container>

                    {this.state.talleres.length>0 ?
                                    <div className="row my-5">
                                
                                        {
                                                this.state.talleres.map((taller) => (
                                                                <div className="col-md-3" key={taller._id} style={styles.div}>
                                                                    <Link to={`/presentacion/${taller._id}`} style={{color: "black", textDecoration: "none black"}}>
                                                                    <Card className="card_taller">
                                                                    <CardHeader>
                                                                        <CardTitle className="font-weight-bold" tag="h5">{taller.title}</CardTitle>
                                                                    </CardHeader>
                                                        
                                                                    <CardBody className="text-center">
                                                                        <CardImg className="image" top width="100%" src={`${REACT_APP_HOST}/public_image/${taller.image}`} alt="Card image cap" /> 
                                                                        <CardText>{taller.description}</CardText>
                                                        
                                                                    </CardBody>
                                                                    </Card>
                                                                    </Link>
                                                                </div>
                                                            ))
                                        }
                                
                                
                                
                                    </div>
                                : <h5>No hay talleres registrados en esta area</h5>}
                </Container>
                )
    }
}


