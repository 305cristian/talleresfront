import React, {Component} from 'react';
import {render}from 'react-dom';
import{Link, useParams} from'react-router-dom';


class Evaluacion extends Component{
    
    constructor(){
        super();
        this.state={
            eval:''
        }
    }
    
    render(){
        return(
                <h1>Evaluacion</h1>
                );
    }
}

export default Evaluacion;


