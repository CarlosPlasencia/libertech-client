import React, { Component } from 'react';
import {  database} from 'firebase';
import moment from 'moment'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
//import functions from 'firebase-functions';
import './App.css';

import { Chart } from 'react-google-charts';

//var database = firebase.database();

export default class Grafico extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      options: {
        title: 'Consumo metros cubicos por hora',
        hAxis: { title: 'Dia' },
        vAxis: { title: 'Litros (m3)'},
        legend: 'none',
      },
      rows: [],
      columns: [
        {
          type: 'string',
          label: 'Dia',
        },
        {
          type: 'number',
          label: 'Litros (m3)',
        },
      ],
      color: '#xxxx',
      año: '2017',
      mes: '11',
      consumo: 0,
      malos:0,
      buenos:0
    };
  }

  componentWillMount() {
    const mes = parseInt(moment("2017-11-28").format("M"))
    const año = moment("2017-11-28").format("YYYY")
    const dias=[31,29,31,30,31,30,31,31,30,31,30,31]
    this.cargarDatos( año, mes, dias[mes-1]  )    
	}

  snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
  };

  cargarDatos( año, mes, dias ){
    var ref = database().ref().child('metric')
    const rows = []
    ref.orderByChild('año').equalTo(año).on('value', data => {
      //console.log(año, data.val())
      const dataset = this.snapshotToArray( data )
      for (var i = 1; i <= dias; i++) {
        rows.push([i+"",0])
      }
      //console.log(mes)
      let consumo = 0
      dataset.forEach(dato=>{
        if( parseInt(dato.mes) === mes ){
          //console.log( dato )
          let dia = parseInt(dato.dia) 
          rows[dia-1][1]+=dato.litros
          consumo+=dato.litros
        }
      })
      let buenos=0, malos = 0
      rows.forEach(row=>{
        if( parseFloat(row[1]) > 600 ){
          malos++
        } else {
          buenos++
        }
        row[1] = (parseFloat(row[1])/(1000*1.00))
      })

      this.setState({ rows, consumo, malos, buenos })
    })
  }

  changeMes(data){
    if (data) {
      this.setState({
        mes: data.value 
      });
      const mes = parseInt(data.value)
      const año = this.state.año
      const dias=[31,29,31,30,31,30,31,31,30,31,30,31]
      this.cargarDatos( año, mes, dias[mes-1]  )
    }
  }

  changeAño(data){
    if (data) {
      this.setState({
        año : data.value
      })
      const año = data.value
      const mes = this.state.mes
      const dias=[31,29,31,30,31,30,31,31,30,31,30,31]
      this.cargarDatos( año, mes, dias[mes-1] )
    }
  }

  render() {

    let años = [] , año = moment().format("YYYY")
    for (let i = 2010; i <=  año ; i++) {
      años.push( {value:i, label: i} )
    }

    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map( (mes,index) =>{
      let obj_mes =  { value: index+1, label: mes }
      return obj_mes    
    })

    if ( this.state.year == año ) {
      meses = meses.filter( mes =>  mes._id <= moment().format("M") )
    }

    if (this.state.rows.length) {
      const { consumo } = this.state
      const dias=[31,29,31,30,31,30,31,31,30,31,30,31]
      const total= dias[ this.state.mes ]
      
      const consumo_total = parseFloat(consumo)/1000
      const mensual_maximo = (600*total)/1000
      const costo_total = consumo_total*2.5

      const ahorro = (this.state.buenos/total)*0.1*costo_total
      return(
        <div>
          
           <div className = "contenedor-selects" > 
              <div className = "box-select" >
                <Select
                  value = { this.state.año }
                  options = { años }
                  onChange = { this.changeAño.bind(this) }
                />
              </div>
              <div className = "box-select" >
                <Select
                  value = { this.state.mes }
                  options = { meses }
                  onChange = { this.changeMes.bind(this) }
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
          <div className = "seccion-inferior">
            <div className = "estado-seccion">  
              <h4>Estado en el mes { this.state.mes } del { this.state.año } </h4>
              <div className = "estado-items">
                <p><b>Consumo total: </b> { consumo_total.toFixed(2) } metros cubicos de agua. </p>
                <p><b>Costo total: </b> { costo_total.toFixed(2) } soles. </p>
                
                {
                  consumo <= 600*total                  
                  ?
                  <p className = "aceptable cien"> Estas en un consumo aceptable, recuerda que no debes superar los {mensual_maximo.toFixed(2) } metros cubicos de agua mensuales, o te perderas de un descuento de { parseInt(ahorro) } soles.</p>
                  :
                  <p className = "noaceptable cien"> Lo sentimos has superado la cuota de consumo de {mensual_maximo.toFixed(2) } metros cubicos de agua, te perdiste de un descuento de { parseInt(ahorro) } soles.</p>
                }                  
              </div>  
            </div>  
            <div className = "direccion-seccion">  
              <h4> Dirección </h4>
              <img src="https://sm.askmen.com/askmen_latam/photo/default/cambo-google-maps_a9n5.jpg" width="400" />
            </div>         
          </div>
        </div>
      )
    } else {
      return <div>Cargando ...</div>
    }
	}
}
