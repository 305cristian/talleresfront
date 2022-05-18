import React, {Component} from'react';
import {render}from'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Route, Switch} from'react-router-dom'
import Navigation from './components/Navigation';
import Breadcrumb_nav from './components/Breadcrumb_nav';
import ListTalleres from './components/ListTalleres';
import ListAreas from './components/ListAreas';
import AdminTalleres from './components/AdminTalleres';
import Presentacion from './components/Presentacion'
import Culminado from './components/Culminado'
import AdminAreas from './components/AdminAreas'
import AdminUsers from './components/AdminUsers'
import AdminResultados from './components/AdminResultados'
import ResetIntentos from './components/ResetIntentos'
import ResetTalleres from './components/ResetTalleres'
import Evaluacion from './components/Evaluacion'
import Login from './components/Login'
import Footer from './components/Footer'



        class App extends Component {

    render() {
        return (
                <BrowserRouter>   
                
                    <Switch>                  
                    <Route path="/listTalleres/:id_ar" component={ListTalleres}/>
                    <Route path="/adminAreas" component={AdminAreas}/>
                    <Route path="/presentacion/:id/:estado" component={Presentacion}/>
                    <Route path="/adminTask" component={AdminTalleres}/>    
                    <Route path="/culminado/:id/:fecha" component={Culminado}/>
                    <Route path="/adminUsers/" component={AdminUsers}/>
                    <Route path="/adminResultados/" component={AdminResultados}/>
                    <Route path="/resetIntentos/" component={ResetIntentos}/>
                    <Route path="/resetTalleres/" component={ResetTalleres}/>
                    <Route path="/evaluacion/:id" component={Evaluacion}/>
                    <Route path="/home" component={ListAreas}/>
                    <Route path="/" render={() => <Login name="Login" />}/>
                    </Switch>
                    <Footer/>
                
                </BrowserRouter>

                )
    }

}
;


export default App;


