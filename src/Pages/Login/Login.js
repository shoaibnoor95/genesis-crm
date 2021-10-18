import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row ,Alert } from 'reactstrap';
import logo from '../../assets/img/brand/genesis.png'
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Axios from 'axios';
import History from '../../history'
const ComponentA = (props) => (<div>
  <KeyboardEventHandler
    handleKeys={['d', 'a']}
    onKeyEvent={(key, e) => console.log(`do something upon keydown event of ${key}`)}
    isExclusive={false} />
</div>);


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      error: "",
      ipAccess: true,
      loginText: "Login",
      disabled: false
    }
     this.login = this.login.bind(this)
  }
  keyLogin(e) {
    if (e.keyCode === 13) {
      this.login()
    }
  }
   login() {
    let { username, password } = this.state;
    console.log(username +" "+password )
    this.setState({
      loginText: "Loading....",
      disabled: true
    })
    if (username.trim() === "") {
      this.setState({
        error: "Please enter the username!",
        loginText: "Login",
        disabled: false
      })
      setTimeout(() => {
        this.setState({
          error: ""
        })
      }, 5000)
    }
    else if (password.trim() === "" ) {
      this.setState({
        error: "Please enter the password!",
        loginText: "Login",
        disabled: false
      })
      setTimeout(() => {
        this.setState({
          error: ""
        })
      }, 5000)
    }
    else if (username !== 'admin' && !this.state.ipAccess) {
      this.setState({
        error: "Access denied!",
        loginText: "Login",
        disabled: false
      })
      setTimeout(() => {
        this.setState({
          error: ""
        })
      }, 5000)
    }
    else {
      let credentials={
        username:username,
        password:password
      }
      let that = this
      Axios({
        method:'post',
        withCredentials:true,
        url:'/login',
        data:credentials
      })
      .then(data=>{
        if(data.data.success){
          
          History.push('/adminDashboard')

          // localStorage.setItem("status", "login")
          
          // this.setState({
          //   loginText: "Login",
          //   disabled: false
          // })
         }
        })
        .catch(function (error) {
          console.log(error)
          that.setState({
            error: error.message,
            loginText: "Login",
            disabled: false
          })
          setTimeout(() => {
            that.setState({
              error: ""
            })
          }, 5000)
        });
      
     }
   }
  componentDidMount() {
      Axios({
        url:'/accessIps',
        method:'get',
        withCredentials:true
      })
      .then(data=>{
        console.log(data.data)
      })
  }
  render() {
    const { error } = this.state;
    return (
      <div className="app flex-row align-items-center" style={{ backgroundColor: "#f5f5f5" }}>
        <Container>
          <ComponentA />
          <Row className="justify-content-center">
            <Col md="12">
              <CardGroup>
                <Card className="p-5">
                  <CardBody style={{ height: 300 }}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" autoComplete="username" onKeyUp={this.keyLogin.bind(this)} value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" autoComplete="current-password" onKeyUp={this.keyLogin.bind(this)} value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button style={{ backgroundColor: '#1d373b', color: '#fff' }} className="px-4" onClick={this.login} disabled={this.state.disabled}>{this.state.loginText}</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col>
                       {error &&  <Alert color="danger">{error}</Alert>}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="py-5 d-md-down-none" style={{ width: '100%' }}>
                  <CardBody className="text-center">
                    <div>
                      <img src={logo} width="500" style={{ marginTop: '35px' }} alt="img" />
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProp(state) {
  return ({
    name: state.root.name
  })
}
function mapDispatchToProp(dispatch) {
  return ({
  })
}


export default Login;
