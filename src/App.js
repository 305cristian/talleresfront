import React, {Component} from'react';
import {render}from'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Route} from'react-router-dom'
import Navigation from './components/Navigation';
import Breadcrumb_nav from './components/Breadcrumb_nav';
import ListTalleres from './components/ListTalleres';
import ListAreas from './components/ListAreas';
import AdminTalleres from './components/AdminTalleres';
import Presentacion from './components/Presentacion'
import AdminAreas from './components/AdminAreas'
import AdminUsers from './components/AdminUsers'
import Evaluacion from './components/Evaluacion'

class App extends Component {

    render() {
        return (
                <BrowserRouter>
                    <Navigation/>
                    <Breadcrumb_nav/>
                    <Route path="/" exact component={ListAreas}/>
                    <Route path="/listTalleres/:id_ar" exact component={ListTalleres}/>
                    <Route path="/adminTask" component={AdminTalleres}/>
                    <Route path="/adminAreas" component={AdminAreas}/>
                    <Route path="/presentacion/:id" component={Presentacion}/>
                    <Route path="/adminUsers/" component={AdminUsers}/>
                    <Route path="/evaluacion/" component={Evaluacion}/>
                </BrowserRouter>

                )
    }

}
;

export default App;