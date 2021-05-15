import React, {Component}from 'react';
import{Link} from'react-router-dom';
import {render}from'react-dom';

export default class Navigation extends Component {
    render() {
        return(
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-dark">
                        <Link className="navbar-brand text-white" to="/">TAREAS DEL DIA</Link>
                        <button className="navbar-toggler bg-white" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className=" collapse navbar-collapse" id="navbarNav">
                            <ul className=" navbar-nav">
                                <li className="nav-item active">
                                    <Link className="nav-link text-white" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/adminTask">Talleres</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/adminAreas">Areas</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/adminUsers">Users</Link>
                                </li>
                
                            </ul>
                        </div>
                    </nav>
                </div>
                );
    }
    ;
    
    
    
}
;