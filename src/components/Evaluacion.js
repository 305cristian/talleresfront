import React, {Component} from 'react';
import {Container, Button, Modal} from'reactstrap'
import {render}from 'react-dom';
import{Link, useParams} from'react-router-dom';
import axios from'axios';
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import {faChevronCircleRight, faFeatherAlt, faClock, faCheckCircle, faSkull, faMailBulk, faFileAlt, faClipboard}from '@fortawesome/free-solid-svg-icons'
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
var aprobacion = 0;
var interval = '';

var preguntas_eval = [];
var respuestas_eval = [];
var estado_resp_eval = [];

var tituloTaller='';

class Evaluacion extends Component {

    constructor() {
        super();
        this.state = {
            preguntas_respuestas: [],
            resultados: false,
            deshabilitar: false,
            modalOpen: false,
            intentos: '',
            respuestas_pint: [],
            ss: ''
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
      nobackbutton(){      	
           window.location.hash="no-back-button";	
           window.location.hash="Again-No-back-button" //chrome 	
           window.onhashchange=function(){window.location.hash="no-back-button";}
        	
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
        const titulo_taller = document.getElementById('titulo_taller');
        const preguntasYrespuestas = [];
        this.state.preguntas_respuestas.map((preguntaAct, numPregunta) => {
           
            //eSTE APARTADO ES SOLO PARA PONER TITULO A LA EVALUACION
            preguntaAct.taller.map((data)=>{
                tituloTaller =data.title ;
                console.log(tituloTaller)
            });
            titulo_taller.innerHTML= 'EVALUACIÓN DE '+tituloTaller;
            //AQUI CIERRA
            
            const respuestas = [];
            preguntaAct.respuestas.map((respuestaAct, numRespuesta) => {

                //VERIFICO SI LA PREGUNTA ES DE TIPO RADIO O CHECK 1=RADIO, 2=CHEACK
                if (preguntaAct.tipo_preg === '1') {
                    respuestas.push(
                            `<label class="elem"><input type="radio"  name="${numPregunta}" value="${respuestaAct.respuesta}"/> ${respuestaAct.respuesta}</label><br/> `
                            );
                } else if (preguntaAct.tipo_preg === '2')
                    respuestas.push(
                            `<label class="elem"><input type="checkbox"  name="${numPregunta}" value="${respuestaAct.respuesta}"/> ${respuestaAct.respuesta}</label><br/> `
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
                aprobacion = taller.aprobacion;
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
         this.nobackbutton();
        cont_incorrectas = 0;
        cont_correctas = 0;

        const respuestas = document.querySelectorAll('.respuestas');

//        let estado = true;
        var estado_resp = '';

        //CON ESTE CODIGO VERIFICO QUE TODAS LAS PREGUNTAS ESTEN SELECCIONADAS
        for (var i = 0; i < this.state.preguntas_respuestas.length; i++) {
            const resp_x_preguntas = respuestas[i];//agarro todos los input radio de la pregunta
            const checkSelect = `input[name='${i}']:checked`; //agarro el input radio seleccionado
            const resp_elegida = (resp_x_preguntas.querySelector(checkSelect) || {}).value; // de todas las resp_x_preguntas escogeme el chequeado
            if (resp_elegida === undefined) {
                Swal({
                    title: '!Atencion',
                    text: `La pregunta ${i + 1} esta sin seleccionar`,
                    icon: 'warning'
                });
                return false;
            }
        }
        //CIERRO ESTE CODIGO
        this.state.preguntas_respuestas.map(async(preg_respAct, indexPreg) => {

            const resp_x_preguntas = respuestas[indexPreg];//agarro todos los input radio de la pregunta
            const checkSelect = `input[name='${indexPreg}']:checked`; //agarro el input radio seleccionado
            const resp_elegida = (resp_x_preguntas.querySelector(checkSelect) || {}).value; // de todas las resp_x_preguntas escogeme el chequeado

            if (preg_respAct.tipo_preg === '1') {//Si el tipo de pregunta es 1 (seleccion unica) valido respuestas 

                var preg_incorrecta = false;//ESTA VARIABLE SIRVE PARA PINTAR LAS INCORRECTAS CUANDO ESTA EN ESTADO TRUE QUIERE DECIR QUE LA RESPUESTA DE LA PREGUNTA FUE INCORRECTA I AGO UN cont_incorrectas++;
                for (var resp of preg_respAct.respuestas) {
                    //                  if (resp_elegida === resp_correcta[indexPreg]) {
                    if (resp_elegida === resp.respuesta && resp.estadoresp === true) {
                        preg_incorrecta = false; //CON ESTO ME SERSIORO QUE SI TENGO UNA RESPUESTA CORRECTA NO ME SUME UNA INCORRECTA
                        cont_correctas++;
                        sum_pts = this.sumarPuntaje(indexPreg);
                        this.get_respuestas_pint(indexPreg, preg_respAct._id, resp_elegida, estado_resp = '1', preg_respAct.tipo_preg);
                        break;
                    } else {
                        preg_incorrecta = true;
                    }

                }
                if (preg_incorrecta === true) {
                    cont_incorrectas++;
                    this.get_respuestas_pint(indexPreg, preg_respAct._id, resp_elegida, estado_resp = '0', preg_respAct.tipo_preg);
                }
                //                
            } else if (preg_respAct.tipo_preg === '2') {//Si el tipo de pregunta es 2 (seleccion multiple) valido respuestas multiples

                var select_size_db = await  this.get_resp_true(preg_respAct._id);//Con esta linea obtengo el total de respuestas en true

                var resp_select_size = document.getElementsByName(`${indexPreg}`);//Con este bucle reviso cuantas opciones he seleccionado
//                                        console.log(resp_select_size);

//                    var select_size = 0;
                var respCheackeado = '';
                var acmd2 = '';
                var select_size = 0;
                for (var x = 0; x < resp_select_size.length; x++) {
                    if (resp_select_size[x].checked) {
                        select_size++;
                        acmd2 = resp_select_size[x].value + ', ';
                        respCheackeado += acmd2;
                    }
                }
                var resp_select = '';
                var preg_incorrecta = false;//ESTA VARIABLE SIRVE PARA PINTAR LAS INCORRECTAS CUANDO ESTA EN ESTADO TRUE QUIERE DECIR QUE LA RESPUESTA DE LA PREGUNTA FUE INCORRECTA I AGO UN cont_incorrectas++;
                var contador = 0;
                if (select_size_db === select_size) {

                    for (var x = 0; x < resp_select_size.length; x++) {
                        if (resp_select_size[x].checked) {
                            resp_select = resp_select_size[x].value;

                            for (var resp of preg_respAct.respuestas) {
//                        console.log('resp elegida:'+resp_select + ' resp: '+resp.respuesta)
                                if (resp_select === resp.respuesta && resp.estadoresp === true) {
//                                        console.log('resp elegida:' + resp_select + ' resp: ' + resp.respuesta + 'trueeee')

                                    preg_incorrecta = false; //CON ESTO ME SERSIORO QUE SI TENGO UNA RESPUESTA CORRECTA NO ME SUME UNA INCORRECTA
                                    contador++;
//                                            console.log(contador+ '  '+select_size)

                                    if (contador === select_size) {
                                        cont_correctas++;
                                        sum_pts = this.sumarPuntaje(indexPreg);
                                        this.get_respuestas_pint(indexPreg, preg_respAct._id, respCheackeado, estado_resp = '1', preg_respAct.tipo_preg, select_size_db, select_size);
                                    } else {
                                        preg_incorrecta = true;
                                    }

                                    break;
                                } else {
//                                        console.log('resp elegida:' + resp_select + ' resp: ' + resp.respuesta + 'falseeeee')
                                    preg_incorrecta = true;
                                }

                            }
//                               
                        }


                    }

                } else {
                    preg_incorrecta = true;
                }
                if (preg_incorrecta === true) {
                    cont_incorrectas++;
                    this.get_respuestas_pint(indexPreg, preg_respAct._id, respCheackeado, estado_resp = '0', preg_respAct.tipo_preg);
                }

            }

        });

        this.setState({resultados: true, deshabilitar: true});
        this.bloquearRespuestas();
        window.history.pushState(null, "", "undefinid");
        clearInterval(interval);

    }

    calificacion() {
        const acmd = puntaje_list.reduce((a, b) => a + b);
        punt = sum_pts * 10 / acmd;
        puntuacion = Math.round(punt);
        return puntuacion;
    }

    sumarPuntaje(index) {
        a = puntaje_list[index];
        pts += a;
        return  pts;
    }
    get_respuestas_pint(indexPreg, id_preg, resp, estado_resp, tipo_pregunta, select_size_db, select_size) {
        axios.get(`${REACT_APP_HOST}/api/respuestas/` + id_preg + '/' + 0 + '/' + 0).then(async(response) => {
            if (response.data) {
                this.setState({respuestas_pint: response.data})
                if (tipo_pregunta === '1') {
                    this.pintarRespuestas(indexPreg, id_preg, resp, estado_resp);
                } else if (tipo_pregunta === '2') {
                   this.pintarRespuestasMultiple(indexPreg, id_preg, resp, estado_resp, select_size_db, select_size);

                }
            }
        })

    }

    pintarRespuestasMultiple(indexPreg, id_preg, resp, estado_resp, select_size_db, select_size) {
//       console.log('====>>> '+this.state.respuestas_pint)
        preguntas_eval.push(id_preg);//Almaceno las preguntas para el reporte de resultados
        respuestas_eval.push(resp);//Almaceno las respuestas para el reporte de resultados
        estado_resp_eval.push(estado_resp);//Almaceno el estado de las respuestas 1= si es la respuesta correcta, 0= si es la respuesta incorrecta para el reporte de resultados

        const respuestas_select = document.getElementsByName(indexPreg);

        var contador = 0;
        var resp_select = '';
        var preg_incorrecta = false;
        console.log(select_size_db + '  ' + select_size)
        
        if (select_size_db === select_size) {//Si el tamaño de la seleccion es igual al numero de respuestas correctas de la base entro
            for (var x = 0; x < respuestas_select.length; x++) {
                if (respuestas_select[x].checked) {
                    resp_select = respuestas_select[x].value;

                    for (var resp  of this.state.respuestas_pint) {
//                        console.log('resp elegida:' + resp_select + ' resp: ' + resp.respuesta + 'trueeee')
                        if (resp.respuesta === resp_select && resp.estadoresp === true) {
                            preg_incorrecta = false;
                            
                            /**
                             * SI LA SELECCION ES IGUAL AL DE LA BASE Y LA DE LA BASE ESTA EN ESTADO TRUE ENTRO Y SUNO EL CONTADOR
                             * CUANDO EL CONTADOR SEA IGUAL A LA SELECCION DEL SISTEMA LAS PINTO EN SUCCESS
                             * */
                            contador++;

                            if (contador === select_size) {
//                                console.log('contador: ' + contador + ' selectsize: ' + select_size)
                                for (var x = 0; x < respuestas_select.length; x++) {
                                    if (respuestas_select[x].checked) {
                                        var labelRadio = respuestas_select[x].parentNode;
                                        labelRadio.classList.add("text-success", "font-weight-bold");
                                    }

                                }

                            } else {
                                preg_incorrecta = true;
                            }
                            break;
                        } else {
                            //SI LA CONDICION NO SE CUMPLE PONGO EL ESTADO DE  preg_incorrecta = true PARA LUEGO SER PINTADO EN DANGER
                            preg_incorrecta = true;
                        }
                    }
                }
            }
        } else {
           console.log('fuera de seleccion la seleccion de la base con la del sistema no son iguales, la marco como incorrecta')
            preg_incorrecta = true;
        }
        if (preg_incorrecta) {
            for (var x = 0; x < respuestas_select.length; x++) {
                if (respuestas_select[x].checked) {
                    var labelRadio = respuestas_select[x].parentNode;
                    labelRadio.classList.add("text-danger", "font-weight-bold");
                }

            }
        }

    }

    pintarRespuestas(indexPreg, id_preg, resp, estado_resp) {
//        console.log('respuesta: ', resp);
        preguntas_eval.push(id_preg); //Almaceno las preguntas para el reporte de resultados
        respuestas_eval.push(resp);//Almaceno las respuestas para el reporte de resultados
        estado_resp_eval.push(estado_resp);//Almaceno el estado de las respuestas 1= si es la respuesta correcta, 0= si es la respuesta incorrecta para el reporte de resultados


        const radios = document.getElementsByName(indexPreg);
//                console.log(radios)
        for (var i = 0; i < radios.length; i++) {
            var radioCheckeado = radios[i].checked;
            if (radioCheckeado === true) {
                var respCheackeado = radios[i].value;
//                var labelRadio = document.querySelector(`${indexResp}`).parentNode;

                const labelRadio = document.querySelector(`input[name="${indexPreg}"]:checked`).parentNode;//Accede a los radios que tengan el nombre indexResp, verifica el que esta checheado y traeme el elemento padre
                var preg_incorrecta = false;
                for (var resp  of this.state.respuestas_pint) {
                    if (respCheackeado === resp.respuesta && resp.estadoresp === true) {
                        preg_incorrecta = false;

                        labelRadio.classList.add("text-success", "font-weight-bold");
                        break;
                    } else {
//                    console.log('.... '+resp.respuesta);
                        preg_incorrecta = true;
                    }

                   
                }
                 if (preg_incorrecta) {

                        labelRadio.classList.add("text-danger", "font-weight-bold");
                    }

            }
        }




    }

//    despintarRespuestas() {
//
//        for (var x = 0; x < this.state.preguntas_respuestas.length; x++) {
//           $('.elem').removeClass("text-success"); 
//             $('.elem').removeClass("text-danger"); 
//             $('.elem').removeClass("font-weight-bold"); 
////            const radios = document.getElementsByName(x);
////            console.log('x: '+x+'   ',radios)
////            for (var i = 0; i < radios.length; i++) {
////                const labelchecked = radios[i].checked;
////                if (labelchecked === true) {
////                    console.log(labelchecked)
////                    const labelradio = radios[i].parentNode;
//////                console.log('i: ' + i + '   ', labelradio)
////              labelradio.style.removeProperty('color'); 
////
////              labelradio.style.color = 'black';
////              labelradio.style.fontWeight = 'normal';
////                    radios.classList.remove("text-success", "text-danger", "font-weight-bold");
//////                labelradio.removeClass("text-success");
//////                    labelradio.classList.add("font-weight-normal");
//////              labelradio.classList.replace("font-weight-bold","");
////                }
////
////
////            }
//
//        }
//    }

    bloquearRespuestas() {
        const respuestas = document.getElementsByTagName('label');
        for (var i = 0; i < respuestas.length; i++) {
            const radios = document.getElementsByTagName('input');
            radios[i].disabled = true;
        }
    }

    async get_resp_true(id_preg) {
        const response = await axios.get(`${REACT_APP_HOST}/api/respuestas/` + id_preg + '/' + 0 + '/' + 0 + '/' + 0);
        return await response.data.length;
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
//        console.log('aprobacion con: ', aprobacion)
        var estado = 0;
        if (puntuacion >= aprobacion) {
            estado = 1;
        }

        const id_user = cookies.get('id');
        const ci_user = cookies.get('cedula');
        const datos = {id_user: id_user, id_taller: id_taller, ci_user: ci_user, puntuacion: puntuacion, estado: estado};

        axios.post(`${REACT_APP_HOST}/api/user_taller/`, datos).then((response) => {
            if (response.data) {

                if (puntuacion >= aprobacion) {
                    this.save_resultados(id_user, ci_user, id_taller, preguntas_eval, respuestas_eval, estado_resp_eval);
                    Swal({
                        title: 'Taller Completada',
                        text: `Su puntuacion es de: ${puntuacion}/10, Felicidades`,
                        icon: 'success'
                    }).then((resp) => {
                        window.location.href = `${REACT_APP_DIREC}/home`;
                    });
                } else {
                    Swal({
                        title: 'Taller Registrada',
                        text: `Su puntuacion es de: ${puntuacion}/10, Debe acertar en todas las preguntas para completar la tarea, caso contario debera repetir el taller`,
                        icon: 'warning',
                    }).then((resp) => {
                        window.location.href = `${REACT_APP_DIREC}/home`;
                    });
                }

            }
        })

    }
    save_resultados(id_user, ci_user, id_taller, preguntas_eval, respuestas_eval, estado_resp_eval) {
//        console.log(id_user);
//        console.log(ci_user);
//        console.log(id_taller);
//        console.log(preguntas_eval);
//        console.log(respuestas_eval);

        const datos = {id_user: id_user, ci_user: ci_user, id_taller: id_taller, preguntas_eval: preguntas_eval, respuestas_eval: respuestas_eval, estado_resp_eval: estado_resp_eval};

        axios.post(`${REACT_APP_HOST}/api/resultados/`, datos).then((response) => {
            if (response) {
                console.log('resultados registrados exitosamente')
            }
        });
    }

    render() {
        return(
                <Container className="my-5">
                
                    <div className=' container col-md-10 bg-dark text-white'>
                        <div className="row">
                            <div className="col-md-10">
                                <h2 id="titulo_taller" className="p-2"><FontAwesomeIcon icon={faFeatherAlt}/> Evaluación</h2>               
                            </div>
                            <div className="col-md-2 py-2">
                                <div className="border text-center p-2 bg-primary font-weight-bold">
                                    <FontAwesomeIcon icon={faClock} size="lg"/>{' '}
                                    <span id="hora" ></span >
                                    <span  id="minuto"></span>
                                    <span id="segundo" ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container col-md-10 border p-4' id='contenedor_eval'>
                
                    </div>
                    <div className='container bg-dark clearfix  col-md-10 p-2 '>
                        <div className='bg-danger float-right'>
                            <Button disabled={this.state.deshabilitar} onClick={() => {
                                    this.validarRespuestas();

                                        }} size='lg' color='primary'><FontAwesomeIcon icon={faChevronCircleRight} size="lg"/> Calificar</Button>
                        </div>
                    </div>
                    { this.state.resultados ?
                                    <div className="container col-md-7 border p-4 my-5">
                                        <form >
                                            <div  className="bg-success container text-center p-1">
                                                <label className="font-weight-bold text-white"><FontAwesomeIcon icon={faCheckCircle} size="2x"/> Respuestas Correctas: <span>{cont_correctas}</span></label>
                                            </div>
                                
                                            <div  className="bg-danger container text-center p-1 my-2">
                                                <label className="font-weight-bold text-white"><FontAwesomeIcon icon={faSkull} size="2x"/> Respuestas Incorrectas: <span>{cont_incorrectas}</span></label>
                                            </div>
                                
                                            <div  className="bg-primary container text-center p-1 my-2">
                                                <div>
                                                    <label className="font-weight-bold text-white"><FontAwesomeIcon icon={faClipboard} size="2x"/> Su Puntuación es: <span>{this.calificacion()}/10</span></label>                
                                                </div>
                                
                                
                                            </div>
                                
                                            <div  className="col-md-12 container text-center p-1 my-2 d-flex">
                                                <div  className="col-md-6">
                                                    {cookies.get('rol') === 'ADMINISTRADOR' ?
                                                            <a className='mano btn btn-info' onClick={this.showModalResp}  style={{fontSize: 13}}><FontAwesomeIcon icon={faFileAlt} size="2x"/><span className="font-weight-bold"> Ver Respuestas</span></a>
                                                                    : ''}
                                                </div>
                                                <div className="col-md-6">
                                                    <Button size="xs" color='primary' onClick={() => {
                                                                this.sendResp(puntuacion)
                                                                    }}><FontAwesomeIcon icon={faMailBulk} size="2x"/> <span className="font-weight-bold">Enviar Resultados</span></Button>                                                  
                                
                                                </div>
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
                                <Button size='sm' color="danger" onClick={() => {
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
                                                            {preg.tipo_preg === '1' ?
                                                                        <div>
                                                                            {resp.estadoresp ?
                                                                                            <label className='font-weight-bold' style={{color: 'green'}}><input type='radio' checked disabled/> {resp.respuesta}</label>
                                                                                : <label ><input  type='radio' disabled/> {resp.respuesta}</label>
                                                                            }
                                                                        </div>
                                                            :
                                                                        <div>
                                                                            {resp.estadoresp ?
                                                                                            <label className='font-weight-bold' style={{color: 'green'}}><input type='checkbox' checked disabled/> {resp.respuesta}</label>
                                                                                : <label ><input  type='checkbox' disabled/> {resp.respuesta}</label>
                                                                            }
                                                                        </div>
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


