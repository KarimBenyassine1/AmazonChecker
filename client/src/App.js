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
      <div className="background">
          <h1><span className="amazon"></span> Amazon Price Checker</h1>
          <p>This app will send you an email when the price of a product goes down. Click the button below!</p>   
          <form
          onSubmit={this.handleSubmit} 
          name="myForm" 
          id='myForm'>
                    <p> Enter Your Information Here: </p>
                    <p1 className="labels"> Email: </p1>
                      <input  value={this.state.email} onChange={this.handleChange} type="email" name='email' id="user" placeholder="Example@gmail.com" required/>
                    <p1 className="labels"> Url:  </p1>
                      <input type="url" value={this.state.url} onChange={this.handleChange} name='url' id="url" placeholder="amazon.com" required/>
                    <p1 className="labels">Minimum Price:</p1>
                      <input value={this.state.price} onChange={this.handleChange} id="price" name='price' placeholder="10.00" required/>
                    <button type="submit" id='submitButton'>Submit</button>
          </form>   
      </div>
    );
  }
}

export default App;
