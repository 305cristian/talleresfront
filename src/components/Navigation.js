import React, {Component}from 'react';
import{Link} from'react-router-dom';
import {render}from'react-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeadset, faUserTie, faFeatherAlt} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import {Modal, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem}from'reactstrap';


const cookies = new Cookies();
const {REACT_APP_HOST,REACT_APP_PATCH} = process.env;

export default class Navigation extends Component {

    constructor() {
        super();
        this.state = {
            modalopen: false,
            dropdownOpen: false
        }
    }

    modalShow() {
        this.setState({modalopen: true})
    }
    hideModal() {
        this.setState({modalopen: false})
    }
 
    toggle() {
        this.state.dropdownOpen?this.setState({dropdownOpen:false}) :this.setState({dropdownOpen:true})
    }

    componentDidMount() {
        if (!cookies.get('nombre')) {
            window.location.href = '/'
        }

    }
    cerrar_session() {
        cookies.remove('id', {path: '/'});
        cookies.remove('nombre', {path: '/'});
        cookies.remove('apellido', {path: '/'});
        cookies.remove('user', {path: '/'});
        cookies.remove('rol', {path: '/'});
        cookies.remove('cedula', {path: '/'});
        cookies.remove('image', {path: '/'});
        window.location.href = '/';
    }
    
   hidden(){
      const menu =document.querySelector('#navbarNav');
      menu.classList.toggle('show')

  }

    render() {
        return(
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-dark">
                        <Link className="navbar-brand text-white" to="/home"><FontAwesomeIcon icon={faFeatherAlt}/> TALLERES BY CC</Link>
                        <button id="btn" className="navbar-toggler bg-white" type="button" onClick={()=>{this.hidden()}} data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className=" collapse navbar-collapse" id="navbarNav">
                            <ul className=" navbar-nav">
                            
                                <li className="nav-item active">
                                    <Link className="nav-link text-white" to="/home">Home</Link>
                                </li>
                                
                                {cookies.get('rol')=='ADMINISTRADOR'?
                                <li className="nav-item">
                                    <Link className="nav-link text-white"  to="/adminTask">Talleres</Link>
                                </li>
                                :''}
                                
                                {cookies.get('rol')=='ADMINISTRADOR'?
                                <li className="nav-item">
                                    <Link className="nav-link text-white"  to="/adminAreas">Areas</Link>
                                </li>
                                 :''}
                                 
                                {cookies.get('rol')=='ADMINISTRADOR'?
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/adminUsers">Users</Link>
                                </li>
                                 :''}
                                {cookies.get('rol')=='ADMINISTRADOR'?
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/adminResultados">Resultados</Link>
                                </li>
                                 :''}
                
                            </ul>
                            <ul className="navbar-nav ml-auto">
                                <FontAwesomeIcon icon={faHeadset} style={{fontSize: 30}}/>
                                <a className="mano nav-link support text-white mr-4" onClick={() => {
                                        this.modalShow()
                                       }}>Soporte</a> 
                                       
                                {cookies.get('image')!=='...' ?
                                    <img className='border p-1 mr-1' width='35' height='38' src={`${REACT_APP_PATCH}imguser%2F` + cookies.get('image')+'?alt=media'} alt='Image'/>
                                            :
                                    <FontAwesomeIcon icon={faUserTie}  style={{fontSize: 30}}/>
                                }
                               
                                <Dropdown isOpen={this.state.dropdownOpen} toggle={() => {this.toggle()}}>
                                    <DropdownToggle color='dark' caret >
                                    <span style={{fontSize:12, color:'white'}}>{cookies.get('nombre')} {cookies.get('apellido')} </span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                       {cookies.get('rol')=='ADMINISTRADOR'? <DropdownItem>Setting</DropdownItem>:''}
                                        <DropdownItem>Help</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={()=>{this.cerrar_session()}}> Log Out</DropdownItem>
                                        
                                    </DropdownMenu>
                                    
                                </Dropdown>
                
                
                            </ul>
                        </div>
                    </nav>
                    <Modal isOpen={this.state.modalopen}>                      
                        <div className='container row p-2'>
                            <div className='col-md-11' style={{padding: 5}}>
                                <h5 className='pl-3'>Soporte</h5>
                            </div>
                            <div className='col-md-1' style={{padding: 5}}>
                                <Button size='sm' onClick={() => {
                        this.hideModal()
                    }}>X</Button>   
                            </div><hr/>
                        </div>                          
                
                        <div>
                            <div class="modal-body border">
                                <div class="container border pt-2">
                                    <p>
                                        <label>Telefono: 0992094788</label><br/>
                                        <label>Correo: pcris.994@gmail.com</label>
                                    </p>
                                </div> 
                            </div>
                        </div>
                    </Modal>
                
                </div>
                );
    }
    ;
}
;
