import React, { Component } from 'react';

import './Auth.css'

const backendURL = 'http://localhost:8000/graphql'

class AuthPage extends Component {
  state = {
    isLogin: true
  }

  constructor(props){
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.usernameEl = React.createRef();
  }
  switchModeHandler = (event) => {
    event.preventDefault();
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin};
    })
  }

  submitHandler = (event) =>  {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const username = this.usernameEl.current.value;
    const password = this.passwordEl.current.value;

    //Could add more robust validation and feedback here
    if (email.trim().length === 0 || password.trim().length ===0){
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}"){
            userId
            token
            tokenExpiration
          }
        }
      `
    }

    if (!this.state.isLogin) {
      requestBody ={
         query: `
           mutation{
             createUser(userInput:{email: "${email}", username: "${username}", password: "${password}"}){
               _id
               email
             }
           }
         `
       }
    }

    //send to the backend
    fetch(backendURL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!')
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData);
    })
    .catch(err => {
      console.log(err)
    })
  };

  render(){
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control" id={!this.state.isLogin ? null : "username-hidden"}>
          <label htmlFor="username">Username</label>
          <input type="username" id="username" ref={this.usernameEl} ></input>
        </div>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" ref={this.emailEl}></input>
        </div>

        <div className="form-control">
          <label htmlFor="email">Password</label>
          <input type="password" id="password" ref={this.passwordEl}></input>
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
          Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
