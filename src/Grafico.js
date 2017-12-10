import React, { Component } from 'react';
import { initializeApp, database} from 'firebase';
import moment from 'moment'
//import functions from 'firebase-functions';

import { Chart } from 'react-google-charts';

var config = {
  apiKey: "AIzaSyCuhVPc44Ge-MGyHDJRLmCkZC20TKG8HeA",
  authDomain: "libertech-ddc11.firebaseapp.com",
  databaseURL: "https://libertech-ddc11.firebaseio.com",
  projectId: "libertech-ddc11",
  storageBucket: "libertech-ddc11.appspot.com",
  messagingSenderId: "201531606659"
};
initializeApp(config);

//var database = firebase.database();

export default class Grafico extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      options: {
        title: 'Consumo litros por hora',
        hAxis: { title: 'Hora' },
        vAxis: { title: 'Litros'},
        legend: 'none',
      },
      rows: [],
      columns: [
        {
          type: 'string',
          label: 'Hora',
        },
        {
          type: 'number',
          label: 'Litros',
        },
      ],
      color: '#xxxx',
      fecha: "2017-11-28"
    };
  }

  convertirFecha(fecha){
    const array_date = fecha.split('/')
    return array_date[2]+'-'+array_date[1]+'-'+array_date[0]
  }

  componentWillMount() {
    this.cargarDatos( this.state.fecha )    
    var ref_ini = database().ref().child('metric')
    ref_ini.on('child_added', data=>{
      const dataset = data.val()
      if (moment(this.convertirFecha(dataset.fecha)).isAfter( this.props.fecha )) {
        //console.log( dataset )
        //console.log( "nueva: ",dataset.fecha )
        this.setState({
          fecha: this.convertirFecha(dataset.fecha)
        });
      }
    })
	}

  cargarDatos( fecha ){
    fecha = moment(fecha).format("DD/MM/YYYY")
    var ref = database().ref().child('metric')
    
    ref.orderByChild('fecha').equalTo(fecha).on('value', data => {
      const dataset = data.val()
      let color = "#xxxxx"
      const rows = []
      const pesos = [-0.282334,-0.456218,-1.13113,-1.24853,-0.969658,-0.329558,0,-0.124916,0,0.115203,-0.532397,-1.01534,-1.29479,-1.41269,-2.02483,-0.0351085,0,0.825043,0,-0.473963,-0.74161,-0.701979,-0.935762,-0.61049,4.46967]
      for (var i = 1; i <= 24; i++) {
        rows.push([i+"",0])
      }
      //console.log("carga fechas ", fecha)
      let j = 0, suma_pesos=0;
      for (var dato in dataset){
        //const hora = dataset[dato].hora.split(':')[0] + 1
        const litros = dataset[dato].litros
        rows[j][1] = litros
        suma_pesos+= litros*(-pesos[j]) 
        j++
        //rows.push([hora, litros])
      }
      if (j === 24) {
        console.log( suma_pesos )
        console.log( suma_pesos + pesos[24] )
        if( suma_pesos - pesos[24] < 0 ){
          color = "#yyyyy"
        } else {
          color = "#zzzzz"
        }
        console.log(color)
      }
      this.setState({ rows, color })
    })
  }

  changeData(e){
    const fecha = moment(e.target.value).format("YYYY-MM-DD")
    //console.log( fecha )
    this.setState({ fecha })
    this.cargarDatos( this.convertirFecha(fecha) )
    //this.props.onChange( fecha )
  }

  render() {
    if (this.state.rows.length) {
      return(
        <div>
          <div className = "contenedor-selects" > 
              <div className = "box-select" >
                <input 
                  className = "input-calendar"
                  ref="date" 
                  type="date" 
                  onChange={ this.changeData.bind(this) } 
                  defaultValue={ this.state.fecha }
                />
              </div> 
          </div>
          <div className = "contenedor-chart" >   
            <Chart
              chartType="Bar"
              rows={this.state.rows}
              columns={this.state.columns}
              options={this.state.options}
              graph_id="ScatterChart"
              width={'90%'}
              height={'400px'}
              legend_toggle
            />
          </div>
        </div>
      )
    } else {
      return <div>Cargando ...</div>
    }
	}
}
