import React, {Component} from 'react';
import {render}from'react-dom';


const styles = {
    footer: {
        padding: 10,
        textAlign: "left",

    }
}
class Footer extends Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return(
                 <footer className="fixed-bottom bg-dark">
                    <div className="footer-copyright text-left py-1 text-white">
                       <span style={{fontSize:12}}> © 2021 Ccoputers Todas los derecho reservados.</span>
                    </div>
                </footer>
                );
    }
}

export default Footer;