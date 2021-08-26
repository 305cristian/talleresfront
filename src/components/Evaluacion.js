import React, {Component} from 'react';
import {Container, Button, Modal} from'reactstrap'
import {render}from 'react-dom';
import{Link, useParams} from'react-router-dom';
import axios from'axios';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faChevronCircleRight, faFeatherAlt, faClock}from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.css';
import Swal from 'sweetalert';
//import '../libraries/back';

import Cookies from 'universal-cookie';

const cookies = new Cookies;

const{REACT_APP_HOST, REACT_APP_DIREC} = process.env;

var resp_correcta = [];
var puntaje_list = [];
var cont_correctas = 0;
var cont_incorrectas = 0;
var punt = 0;
var puntuacion = 0;

var a = 0;
var pts = 0;
var sum_pts = 0;

var intervaloCont = '';

var hora = 0;
var minutos = 0;
var segundos = 59;
var estado_tiempo = true;

var id_taller = '0';

var intentos = 0;
var interval = '';
class Evaluacion extends Component {

    constructor() {
        super();
        this.state = {
            preguntas_respuestas: [],
            resultados: false,
            deshabilitar: false,
            modalOpen: false,
            intentos: '',
        }
        this.cargarSegundos = this.cargarSegundos.bind(this);
        this.cargarMinutos = this.cargarMinutos.bind(this);
        this.cargarHora = this.cargarHora.bind(this);
        this.showModalResp = this.showModalResp.bind(this);

    }

    componentDidMount() {
        if (!cookies.get('nombre')) {
            window.location.href = `${REACT_APP_DIREC}/home`;
        }
        this.getPreguntasRespuestas();
        interval = setInterval(this.cargarSegundos, 1000);

    }

    getPreguntasRespuestas() {
        const {match} = this.props;
        id_taller = match.params.id;
        axios.get(`${REACT_APP_HOST}/api/evaluacion/` + id_taller).then((response) => {
            this.setState({preguntas_respuestas: response.data});
            if (this.state.preguntas_respuestas.length === 0) {
                Swal({
                    title: '!ATENCION',
                    text: 'No hay evaluación registrada',
                    icon: 'warning',
                    closeOnClickOutside: false,
                    closeOnEsc: false

                }).then((value) => {
                    if (value) {
                        window.location.href = `${REACT_APP_DIREC}/home`;
//                       window.location.href=`${REACT_APP_DIREC}/presentacion/`+id_taller;
                    }
                })
                clearInterval(interval);
            } else {
                console.log(this.state.preguntas_respuestas)
                this.mostarEvaluacion();
            }
        });
    }
    mostarEvaluacion() {
        const contenedor_eval = document.getElementById('contenedor_eval');
        const preguntasYrespuestas = [];
        this.state.preguntas_respuestas.map((preguntaAct, numPregunta) => {
            const respuestas = [];
            preguntaAct.respuestas.map((respuestaAct, numRespuesta) => {
                respuestas.push(
                        `<label><input type="radio"  name="${numPregunta}" value="${respuestaAct.respuesta}"/> ${respuestaAct.respuesta}</label><br/> `
                        );
                //Voy almacenando la respuestas correctas de cada pregunta
                if (respuestaAct.estadoresp === true) {
                    resp_correcta.push(`${respuestaAct.respuesta}`);
                }
            });

            preguntasYrespuestas.push(
                    `
                        <div class="font-weight-bold">${numPregunta + 1 + ':'} ${preguntaAct.pregunta} (${preguntaAct.puntaje}pts.)</div>
                        <div class="respuestas pl-4 pt-2">${respuestas.join('')}</div><hr/>
                    `
                    );
            puntaje_list.push(preguntaAct.puntaje);//Voy almacenando el puntaje de cada pregunta

            preguntaAct.taller.map((taller, index) => {
                minutos = taller.tiempo - 1;
                intentos = taller.intentos;
//                this.setState({intentos: taller.intentos, tiempo: taller.tiempo})
            })
        });
        this.pintarTiempo();
        contenedor_eval.innerHTML = preguntasYrespuestas.join('');

    }

    pintarTiempo() {
        while (estado_tiempo) {
            if (minutos > 60) {
                hora++;
                minutos = minutos - 60;
            } else {
                estado_tiempo = false;
            }
        }

    }
    validarRespuestas() {
        cont_correctas = 0;
        cont_incorrectas = 0;
        const respuestas = document.querySelectorAll('.respuestas');

        let estado = true;

        this.state.preguntas_respuestas.map((respuestaAct, indexPreg) => {
            const resp_x_preguntas = respuestas[indexPreg];//agarro todos los input radio de la pregunta
            const checkSelect = `input[name='${indexPreg}']:checked`; //agarro el input radio seleccionado
            const resp_elegida = (resp_x_preguntas.querySelector(checkSelect) || {}).value; // de todas las resp_x_preguntas escogeme el chequeado
//            alert(resp_elegida + ':  ' + resp_correcta[indexPreg]);
            if (resp_elegida !== undefined) {
                if (resp_elegida === resp_correcta[indexPreg]) {
                    cont_correctas++;
                    sum_pts = this.sumarPuntaje(indexPreg);
                    this.pintarRespuestas(indexPreg, resp_correcta[indexPreg]);
                } else {
                    cont_incorrectas++;
                    this.pintarRespuestas(indexPreg, resp_correcta[indexPreg]);
                }

            } else {
                estado = false;
                cont_correctas = 0;
                cont_incorrectas = 0;
                Swal({
                    title: '!Atencion',
                    text: `La pregunta ${indexPreg + 1} esta sin seleccionar`,
                    icon: 'warning'
                })
//                alert(`La pregunta ${indexPreg + 1} esta sin seleccionar`)
            }

        });
        if (estado) {//basta con que haya una respuesta desselecionada para que entre al estado false y ejecute el metodo despintarRespuestas
            this.setState({resultados: true, deshabilitar: true});
            this.bloquearRespuestas();
            window.history.pushState(null, "", "undefinid");
            clearInterval(interval);


        } else {
            for (var i = 0; i < this.state.preguntas_respuestas.length; i++) {
                this.despintarRespuestas(i)
            }
        }
        const acmd = puntaje_list.reduce((a, b) => a + b);
        punt = sum_pts * 10 / acmd;
        puntuacion = Math.round(punt);

//        
    }

    sumarPuntaje(index) {
        a = puntaje_list[index];
        pts += a;
        return pts;
    }
    pintarRespuestas(indexResp, resp_Correcta) {
        const radios = document.getElementsByName(indexResp);
        for (var i = 0; i < radios.length; i++) {
            var radioCheckeado = radios[i].checked;
            if (radioCheckeado === true) {
                var respCheackeado = radios[i].value;
//                var labelRadio = document.querySelector(`${indexResp}`).parentNode;
                const labelRadio = document.querySelector(`input[name="${indexResp}"]:checked`).parentNode;//Accede a los radios que tengan el nombre indexResp, verifica el que esta checheado y traeme el elemento padre
                if (respCheackeado === resp_Correcta) {
                    labelRadio.style.color = 'green';
                    labelRadio.classList.add('font-weight-bold')
//                    labelRadio.classList.add('bg-success');
//                    labelRadio.classList.add('p-1');
                } else {
                    labelRadio.style.color = 'red';
                    labelRadio.classList.add('font-weight-bold');
//                    labelRadio.classList.add('p-1');

                }
            }
        }
    }
    despintarRespuestas(index) {
        const radios = document.getElementsByName(index);
        for (var i = 0; i < radios.length; i++) {
            const labelradio = radios[i].parentNode;
            labelradio.style.color = 'black';
            labelradio.classList.remove('font-weight-bold');
            labelradio.classList.add('font-weight-normal');
        }
    }

    bloquearRespuestas() {
        const respuestas = document.getElementsByTagName('label');
        for (var i = 0; i < respuestas.length; i++) {
            const radios = document.getElementsByTagName('input');
            radios[i].disabled = true;
        }
    }

    showModalResp() {
        this.setState({modalOpen: true});

    }
    hideModal() {
        this.setState({modalOpen: false});
    }

    cargarSegundos() {
        let txt_segundo;
        if (segundos < 0) {
            segundos = 59;
        }

        //pintamos en pantalla
        if (segundos < 10) {
            txt_segundo = `0${segundos}`;
        } else {
            txt_segundo = segundos;
        }
        document.getElementById('segundo').innerHTML = ' : ' + txt_segundo;
        segundos--;

        this.cargarMinutos(segundos);
    }

    cargarMinutos(segundos) {
        let txt_minuto;
        if (segundos === -1 && minutos !== 0) {
            setTimeout(() => {
                minutos--;
            }, 500);
        } else {
            if (segundos === -1 && minutos === 0) {
                setTimeout(() => {
                    minutos = 59;
                }, 500);
            }
        }
        //pintamos en pantalla
        if (minutos < 10) {
            txt_minuto = `0${minutos}`;
        } else {
            txt_minuto = minutos;
        }
        document.getElementById('minuto').innerHTML = ' : ' + txt_minuto;

        this.cargarHora(segundos, minutos);

    }

    cargarHora(segundo, minuto) {
        const {match} = this.props;
        const id_taller = match.params.id;
        let txtHora;
        if (segundo === -1 && minuto === 0 && hora !== 0) {
            setTimeout(() => {
                hora--;
            }, 500);
        } else {
            if (segundo === -1 && minuto === 0 && hora === 0) {
                Swal({
                    title: '!ATENCION',
                    text: 'SU TIEMPO HA EXPIRADO',
                    icon: 'warning',
                    closeOnClickOutside: false,
                    closeOnEsc: false
                }).then((value) => {
                    if (value) {
                        window.location.href = `${REACT_APP_DIREC}/home`;
//                       window.location.href=`${REACT_APP_DIREC}/presentacion/`+id_taller;
                    }
                })
            }
        }

        //Pintar la hora
        if (hora < 10) {
            txtHora = `0${hora}`;
        } else {
            txtHora = hora;
        }

        document.getElementById('hora').innerHTML = txtHora;

    }

    sendResp(puntuacion) {
        var estado = 0;
        if (puntuacion === 10) {
            estado = 1;
        }

        const id_user = cookies.get('id');
        const datos = {id_user: id_user, id_taller: id_taller, estado: estado};

        axios.post(`${REACT_APP_HOST}/api/user_taller/`, datos).then((response) => {
            if (response.data) {

                if (puntuacion === 10) {
                    Swal({
                        title: 'Tarea Completada',
                        text: `Su puntuacion es de: ${puntuacion}/10, Felicidades`,
                        icon: 'success',
                    }).then((resp) => {
                        window.location.href = `${REACT_APP_DIREC}/home`;
                    });
                } else {
                    Swal({
                        title: 'Tarea Registrada',
                        text: `Su puntuacion es de: ${puntuacion}/10, Debe acertar en todas las preguntas para completar la tarea, caso contario debera repetir el taller`,
                        icon: 'warning',
                    }).then((resp) => {
                        window.location.href = `${REACT_APP_DIREC}/home`;
                    });
                }

            }
        })

    }

    render() {
        return(
                <Container className="my-5">
                
                    <div className=' container col-md-10 bg-primary text-white'>
                        <div className="row">
                            <div className="col-md-10">
                                <h2 className="p-2"><FontAwesomeIcon icon={faFeatherAlt}/> Evaluación</h2>               
                            </div>
                            <div className="col-md-2 py-2">
                                <div className="border text-center p-2 bg-info font-weight-bold">
                                    <FontAwesomeIcon icon={faClock}/>{' '}
                                    <span id="hora" ></span >
                                    <span  id="minuto"></span>
                                    <span id="segundo" ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container col-md-10 border p-4' id='contenedor_eval'>
                
                    </div>
                    <div className='container bg-primary clearfix  col-md-10 p-2 '>
                        <div className='bg-danger float-right'>
                            <Button disabled={this.state.deshabilitar} onClick={() => {
                                    this.validarRespuestas();

                                        }} size='sm' color='success'><FontAwesomeIcon icon={faChevronCircleRight}/> Calificar</Button>
                        </div>
                    </div>
                    { this.state.resultados ?
                                    <div className="container col-md-7 border p-4 my-5">
                                        <form >
                                            <div  className="bg-success container text-center p-1">
                                                <label className="font-weight-bold text-white">Respuestas Correctas: <span>{cont_correctas}</span></label>
                                            </div>
                                
                                            <div  className="bg-danger container text-center p-1 my-2">
                                                <label className="font-weight-bold text-white">Respuestas Incorrectas: <span>{cont_incorrectas}</span></label>
                                            </div>
                                
                                            <div  className="bg-primary container text-center p-1 my-2">
                                                <div>
                                                    <label className="font-weight-bold text-white">Su Puntuación es: <span>{puntuacion}/10</span></label>                
                                                </div>

                                                {cookies.get('rol')==='ADMINISTRADOR'?
                                                <div>
                                                    <a className='mano text-white' onClick={this.showModalResp}  style={{fontSize: 13}}>Ver Respuestas</a>              
                                                </div>
                                                :''}
                                            </div>
                                
                                            <div  className=" container text-center p-1 my-2">
                                                <Button size="xs" color='primary' onClick={() => {
                                            this.sendResp(puntuacion)
                                        }}>Enviar Resultados</Button>
                                            </div>
                                        </form>
                                
                                    </div>

                            : null}
                
                    <Modal size='lg' isOpen={this.state.modalOpen}>
                
                        <div className='row'>
                            <div className='col-md-11'>
                                <h3 className='p-2 pl-3'><FontAwesomeIcon icon={faFeatherAlt}/> Respuestas Correctas</h3>               
                            </div>
                            <div className='col-md-1 my-2'>
                                <Button size='sm' onClick={() => {
                        this.hideModal()
                    }}>X</Button>                
                            </div>
                        </div>
                        <div className='container border p-3' id='contenedor_resp_correctas'>
                            {
                    this.state.preguntas_respuestas.map((preg, index) => {
                        return(
                                        <Container key={preg._id} >                           
                                            <hr/><label  className='font-weight-bold'>{index + 1}{': '}{preg.pregunta}</label><br/> 
                                            { preg.respuestas.map((resp, index) => {
                                                        return(
                                                                                <div key={resp._id} className="pl-4 pt-2">
                                                                                    {resp.estadoresp ?
                                                                                                                            <label className='font-weight-bold' style={{color: 'green'}}><input type='radio' checked disabled/> {resp.respuesta}</label>
                                                                                            : <label ><input  type='radio' disabled/> {resp.respuesta}</label>
                                                                                    }
                                                                
                                                                                </div>

                                                                )
                                                                })}
                                        </Container>
                                            )

                    })
                            }
                        </div>
                    </Modal>
                </Container>
                );
    }
}

export default Evaluacion;


