import React, { Component } from 'react';
//import autobind from 'autobind-decorator'
import logo from './logo.svg';
import './App.css';

import Grafico from './Grafico'
import Grafico2 from './Grafico2'
import Grafico3 from './Grafico3'
import Fecha from './Fecha'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      tipo: "dia"
    }
  }

  changeData(fecha){
    console.log( fecha )
    this.setState({ fecha });
  }

  changeTipo(tipo){
    this.setState({
      tipo 
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Usuario: NestorPlasencia</h1>
          <img className="App-profile_image" src="https://scontent.flim5-4.fna.fbcdn.net/v/t1.0-9/23031375_10214804037997983_7641411816442929984_n.jpg?oh=384f2325d0d6a17a1f2f8a309fe81e42&oe=5AD6E47E" width="70" />
        </header>
        <p className="App-intro">
          Consumo en tiempo real del Agua.
        </p>
        <div className="">
          <ul className="App-list-button">
            <li className={ this.state.tipo !== 'dia' ? "App-button" : "App-button activo" } ><a href="#" onClick={ ()=>this.changeTipo('dia') } >Dia</a></li>
            <li className={ this.state.tipo !== 'mes' ? "App-button" : "App-button activo" } ><a href="#" onClick={ ()=>this.changeTipo('mes') } >Mes</a></li>
            <li className={ this.state.tipo !== 'año' ? "App-button" : "App-button activo" } ><a href="#" onClick={ ()=>this.changeTipo('año') } >Año</a></li>
          </ul>
          
          <div className="grafico" > 
            {
              this.state.tipo == 'dia'
              ?
              <Grafico />
              :
              this.state.tipo == 'mes'
              ?
              <Grafico2 />
              :
              <Grafico3 />
            }
          </div>
        </div>
        <div className = "seccion-inferior">
         <div className = "estado-seccion">  
            <h4>Estado: </h4>
            <div className = "estado-items">
              <p><b>Dias de consumo alto: </b> 25 </p>
              <p><b>Dias de consumo bajo: </b> 36 </p>
              <p><b>Valoración: </b> 59.02 % </p>
            </div>  
          </div>  
          <div className = "direccion-seccion">  
            <h4> Direccion </h4>
            <img src="https://sm.askmen.com/askmen_latam/photo/default/cambo-google-maps_a9n5.jpg" width="400" />
          </div>
         
        </div>    
      </div>
    );
  }
}

export default App;
