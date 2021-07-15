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
import AdminAreas from './components/AdminAreas'
import AdminUsers from './components/AdminUsers'
import Evaluacion from './components/Evaluacion'
import Login from './components/Login'



        class App extends Component {

    render() {
        return (
                <BrowserRouter>   
                
                   <Switch>                  
                    <Route path="/listTalleres/:id_ar" component={ListTalleres}/>
                    <Route path="/adminTask" component={AdminTalleres}/>
                    <Route path="/adminAreas" component={AdminAreas}/>
                    <Route path="/presentacion/:id" component={Presentacion}/>
                    <Route path="/adminUsers/" component={AdminUsers}/>
                    <Route path="/evaluacion/:id" component={Evaluacion}/>
                    <Route path="/home" component={ListAreas}/>
                    <Route path="/" render={() => <Login name="Login" />}/>
                    </Switch>
                
                </BrowserRouter>

                )
    }

}
;


export default App;


