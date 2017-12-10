import React, { Component } from 'react';
import { initializeApp, database} from 'firebase';
import moment from 'moment'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
//import functions from 'firebase-functions';

import { Chart } from 'react-google-charts';

//var database = firebase.database();

export default class Grafico extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      options: {
        title: 'Consumo litros por Mes',
        hAxis: { title: 'Mes' },
        vAxis: { title: 'Litros'},
        legend: 'none',
      },
      rows: [],
      columns: [
        {
          type: 'string',
          label: 'Mes',
        },
        {
          type: 'number',
          label: 'Litros',
        },
      ],
      color: '#xxxx',
      año: '2017',
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
      for (var i = 1; i <= 12; i++) {
        rows.push([i+"",0])
      }
      //console.log(mes)
      dataset.forEach(dato=>{
        const mes_int = parseInt(dato.mes)
        rows[mes_int-1][1]+=dato.litros
      })
      this.setState({ rows })
    })
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
