import React, { Component } from 'react';
//import autobind from 'autobind-decorator'
import logo from './logo.png';
import './App.css';

import Grafico from './Grafico'
import Grafico2 from './Grafico2'
import Grafico3 from './Grafico3'
import Fecha from './Fecha'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      tipo: "dia",
      consumo: 0
    }
  }

  changeConsumo(consumo){
    console.log( consumo )
    this.setState({ consumo });
  }

  changeTipo(tipo){
    this.setState({
      tipo,
      consumo:0
    });
  }

  render() {
    const { consumo } = this.state
    return (
      <div className="App">
        
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <img className="App-profile_image" src="https://scontent.flim5-4.fna.fbcdn.net/v/t1.0-9/23031375_10214804037997983_7641411816442929984_n.jpg?oh=384f2325d0d6a17a1f2f8a309fe81e42&oe=5AD6E47E" width="70" />
          <h1 className="App-title">Usuario: NestorPlasencia</h1>
        </header>

        <div className="App-superior">
          <p className="App-intro">
            {
              !consumo
              ?
              null
              :
              consumo <= 600                  
              ?
              <p className="aceptable"> Estas en un consumo aceptable ( {consumo.toFixed(2)} litros ), recuerda que no debes superar los 600 litros diarios.</p>
              :
              <p className="noaceptable"> Lo sentimos has superado la cuota de consumo de 600 litros. Tu consumo es { consumo.toFixed(2) } litros.</p>
            }
          </p>


          <ul className="App-list-button">
              <li className={ this.state.tipo !== 'dia' ? "App-button" : "App-button activo" } ><a href="#" onClick={ ()=>this.changeTipo('dia') } >Dia</a></li>
              <li className={ this.state.tipo !== 'mes' ? "App-button" : "App-button activo" } ><a href="#" onClick={ ()=>this.changeTipo('mes') } >Mes</a></li>
              <li className={ this.state.tipo !== 'año' ? "App-button" : "App-button activo" } ><a href="#" onClick={ ()=>this.changeTipo('año') } >Año</a></li>
          </ul>
        
        </div>  
        <div className="grafico" > 
          {
            this.state.tipo == 'dia'
            ?
            <Grafico onChange={ this.changeConsumo.bind(this) } />
            :
            this.state.tipo == 'mes'
            ?
            <Grafico2 />
            :
            <Grafico3 />
          }
        </div>

        <div className = "info">  
          <img src="https://raw.githubusercontent.com/NestorPlasencia/rm_images/master/1.png" />
        </div>
 
      </div>
    );
  }
}

export default App;
