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
      consumo: 0,
      numero: 1,
      clase: 'nonvisible',
      buenos: 0
    }
  }

  changeConsumo(consumo, buenos){
    this.setState({ consumo,buenos, numero: (Math.floor(Math.random() * 8) + 1 ), clase: 'visible' });
    setTimeout(()=> {
      this.setState({
        clase: 'nonvisible'
      });
    }, 3500);
  }

  changeTipo(tipo){
    this.setState({
      tipo,
      consumo:0
    });
  }

  render() {
    const { consumo, buenos } = this.state

    const consumo_total = parseFloat(consumo)/1000
    const mensual_maximo = (600*30)/1000
    const costo_total = consumo_total*2.5

      const ahorro = (buenos/30)*0.1*costo_total

    return (
      <div className="App">
        
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <img className="App-profile_image" src="https://scontent.flim5-4.fna.fbcdn.net/v/t1.0-9/23031375_10214804037997983_7641411816442929984_n.jpg?oh=384f2325d0d6a17a1f2f8a309fe81e42&oe=5AD6E47E" width="70" />
          <h1 className="App-title">Usuario: NestorPlasencia</h1>
        </header>

        <div className="App-superior">
          <div className={"App-intro " }>
            {
              !consumo
              ?
              <p className="aceptable nonvisible "> Estas en un consumo aceptable (10000 litros ), recuerda que no debes superar los 600 litros diarios.</p>
              :
              this.state.tipo === 'dia'
              ?
                consumo <= 600                  
                ?
                <p className="aceptable"> Estas en un consumo aceptable ( {consumo.toFixed(2)} litros ), recuerda que no debes superar los 600 litros diarios.</p>
                :
                <p className="noaceptable"> Lo sentimos has superado la cuota de consumo de 600 litros. Tu consumo es { consumo.toFixed(2) } litros.</p>
              :
                consumo <= 600*30                
                ?
                <p className = "aceptable"> Estas en un consumo aceptable, recuerda que no debes superar los {mensual_maximo.toFixed(2) } metros cubicos de agua mensuales, o te perderas de un descuento de { parseInt(ahorro) } soles.</p>
                :
                <p className = "noaceptable"> Lo sentimos has superado la cuota de consumo de {mensual_maximo.toFixed(2) } metros cubicos de agua, te perdiste de un descuento de { parseInt(ahorro) } soles.</p>
            }
          </div>


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
            <Grafico2 onChange={ this.changeConsumo.bind(this) }/>
            :
            <Grafico3 />
          }
        </div>

        <div className = {"info "+this.state.clase} >  
          <img src={`https://raw.githubusercontent.com/NestorPlasencia/rm_images/master/${this.state.numero}.png`} />
        </div>
 
      </div>
    );
  }
}

export default App;
