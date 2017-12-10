import React, { Component } from 'react';
import { initializeApp, database} from 'firebase';
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
      mes: '11'
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
      dataset.forEach(dato=>{
        if( parseInt(dato.mes) === mes ){
          //console.log( dato )
          let dia = parseInt(dato.dia) 
          rows[dia-1][1]+=dato.litros
        }
      })

      rows.forEach(row=>{
        
      })

      this.setState({ rows })
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
        </div>
      )
    } else {
      return <div>Cargando ...</div>
    }
	}
}
