import React, {Component} from'react';
import {Container} from 'reactstrap';
import {render}from 'react-dom';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faUser, faKey, faSignInAlt}from '@fortawesome/free-solid-svg-icons'
import image from'../img/user.png';
import P from'../components/P';

import axios from 'axios';
import Cookies from 'universal-cookie';

const {REACT_APP_HOST} = process.env;
const cookies = new Cookies();

const validation = data => {
    const errors = {};
    if (!data.user) {
        errors.user = 'El campo user es obligatorio';
    }
    if (!data.pass) {
        errors.pass = 'El campo contraseña es obligatorio';
    }
    return errors;
}

class login extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            pass: '',
            user_session: [],
            errors: {}
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);

    }

    componentDidMount() {
        if (cookies.get('nombre')) {
            window.location.href = '/home'
        }
    }

    handleChange = (e) => {
        const{name, value} = e.target;
        this.setState({[name]: value})
//        console.log(e.target.value)
    }

    handleKeyPress(e) {

        if (e.key === 'Enter') {
            console.log('do validate');
            this.login_session();
        }
    }

    login_session() {

        const {errors, ...sinErrors} = this.state;
        const result = validation(sinErrors);
        this.setState({errors: result});
        if (!Object.keys(result).length) {

            axios.get(`${REACT_APP_HOST}/api/users/` + this.state.user + '/' + this.state.pass).then((response) => {
                return response.data
            }).then((response) => {
                if (response) {
                    cookies.set('id', response._id, {path: '/'});
                    cookies.set('nombre', response.nombre, {path: '/'});
                    cookies.set('apellido', response.apellido, {path: '/'});
                    cookies.set('user', response.user, {path: '/'});
                    cookies.set('rol', response.rol, {path: '/'});
                    cookies.set('cedula', response.cedula, {path: '/'});
                    cookies.set('image', response.image, {path: '/'});
                    window.location.href = '/home';
                } else {
                    const error_logeo = document.getElementById('idError')
                    error_logeo.innerHTML = 'Usuario o contraseña incorrectos'
                }
            })
        }
    }

    render() {
        const{errors} = this.state;
        return(
                <Container className="body">
                    <div className="image_login modal-dialog sombra text-center border my-5">
                        <div className="modal-dialog text-center ">
                            <div className="col-sm-8 main-section">
                                <p className="display-4 text-white" >LOGIN</p>
                                <hr className="bg-info col-md-8"></hr>   
                            </div>       
                        </div>
                        <div  className="modal-dialog text-center ">
                            <div     className="modal-dialog text-center ">
                                <div className="col-sm-8 main-section">
                                    <div className="modal-content sombra">
                                        <div className="col-12 img-user">
                                            <img src={image}/>
                                        </div>            
                                        <form id="idFormulario" method="get" className="col-12 ">
                                            <div className="input-group mb-2">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><FontAwesomeIcon icon={faUser}/></span>
                                                </div>    
                                                <input name="user" type="text" required="" id="user" onChange={this.handleChange} className="form-control" placeholder="Usuario"/>
                                            </div>
                                            {errors.user && <P errors={errors.user} />}
                
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><FontAwesomeIcon icon={faKey}/></span>
                                                </div>    
                                                <input name="pass" type="password" required="" id="pass" onKeyPress={this.handleKeyPress} onChange={this.handleChange} className="form-control" placeholder="Contraseña"/>  
                                            </div>
                                            {errors.pass && <P errors={errors.pass} />}
                
                                            <div className="form-group">
                                                <button type="button" id="btnLogin" className="btn btn-primary" onClick={() => {
                                                        this.login_session()
                                                            }}><FontAwesomeIcon icon={faSignInAlt}/>  ENTRAR</button>      
                                            </div>
                                            <div className="mb-3 aler alert-danger">
                                                <span className="display text-danger" id="idError"></span>
                                            </div>
                                                                     
                                        </form>
                                     
                                    </div> 
                                      
                                </div>
                            </div>
                             
                        </div>
                            <div>
                                <h4 className="text-white">Sistema de Capacitaciones online</h4>
                            </div>
                    </div>
                                
                </Container>

                )
    }
}

export default login;