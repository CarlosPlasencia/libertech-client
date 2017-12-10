import React, { Component } from 'react';
//import autobind from 'autobind-decorator'
import moment from 'moment'
//import logo from './logo.svg';
//import './Fecha.css';


class Fecha extends Component {
  constructor(props){
  	super(props)
  	this.state = {
  		fecha: props.fecha
  	}
  }

  componentWillReceiveProps(nextProps){
    if (this.props.fecha !== nextProps.fecha ) {
      const { fecha } = nextProps
      this.setState({ fecha })
    }
  }

  changeData(e){
  	const fecha = moment(e.target.value).format("YYYY-MM-DD")
  	//console.log( fecha )
  	this.setState({ fecha	})
  	this.props.onChange( fecha )
  }

  render() {
    return (
      <input 
      	ref="date" 
      	type="date" 
      	onChange={ this.changeData.bind(this) } 
      	defaultValue={ this.state.fecha }
      />
    );
  }
}

export default Fecha;
