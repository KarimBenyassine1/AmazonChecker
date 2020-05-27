import React from 'react';
import './App.css';
import axios from "axios";





class App extends React.Component {
  constructor(props){
    super(props);

    this.state={
      url: '',
      email: '',
      price: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }); 
  }

  handleSubmit = (event) =>{
    const obj={
        user: this.state.email,
        url: this.state.url,
        minPrice: this.state.price
    }

    axios.post("http://localhost:5000/info", obj)
    .then(res=>{
        console.log(res);
        alert("Success!")
    })
    .catch(err=>console.log(err));

    event.preventDefault();
}
  render(){
    return (
      <body className="background">
        <div className="wrapper">
          <h1>The Amazon Price Tracker</h1>
        <div className="form">
          <form
          onSubmit={this.handleSubmit} 
          name="myForm" 
          id='myForm'>
            <div className='inputfields'>
              <input className='input' value={this.state.email} onChange={this.handleChange} type="email" name='email' id="user" placeholder="Email" required/>
              <input className='input' type="url" value={this.state.url} onChange={this.handleChange} name='url' id="url" placeholder="Url" required/>
              <input className='input' value={this.state.price} onChange={this.handleChange} id="price" name='price' placeholder="Minimum Price" required/>
              <button type="submit" className='btn'>Send</button> 
            </div> 
          </form>
          </div>
        </div>   
      </body>
    );
  }
}

export default App;
