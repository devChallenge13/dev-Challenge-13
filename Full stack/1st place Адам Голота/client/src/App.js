import React, { Component } from 'react';
import { Container, Label, Input, 
  Row, Col, Button , ListGroup, 
  ListGroupItem, FormGroup, Form} from 'reactstrap';
import uuid from 'uuid/v1';
import io from 'socket.io-client';
import Info from './Info';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:8080');

class App extends Component {

  state = {
    chosenDevice: null, // {ip: ip, name: name}
    devices: {} // ip : name
  }

  componentWillMount() {
    socket.emit('get devices');
    socket.on('devices', (devices) => {
      this.setState({devices: devices});
    });
  }

  info = (device) => {
    if (!device)
      return null;
    return (
      <Info
        socket={socket}
        device={device}
      />
    )
  }

  onRemove = (e) => {
    socket.emit('remove device', e.target.dataset.ip);
    if (e.target.dataset.ip === this.state.chosenDevice.ip)
    {
      this.setState({chosenDevice: null});
    }
  }

  onNewDevice = (e) => {
    e.preventDefault();

    let input = e.target.elements.device;
    socket.emit("add device", input.value);
    input.value = "";
  }

  onChoose = (e) => {
    let ip =  e.target.dataset.ip;
    this.setState({chosenDevice: {ip: ip, name: this.state.devices[ip]}})
  }

  render() {
    return (
      <Container className="App">
        <Row>
          <Col>
            <h3>Devices </h3>
            <Form onSubmit={this.onNewDevice}>
            <FormGroup>
              <Label for="device">Add device</Label>
              <Input 
                type="text" 
                name="device" 
                id="device" 
                placeholder="Enter IP"/>
              <Input
                type="submit"
                value="Add"
              />
            </FormGroup>
            </Form>
            <ListGroup>
              {Object.keys(this.state.devices).map((ip) => {
                return(
                  <ListGroupItem key={'device'+uuid()}>
                    <Row>
                      <Col>
                      <Button data-ip={ip} color="light" onClick={this.onChoose}>{this.state.devices[ip]}</Button>
                      </Col>
                      <Col>
                        <Button data-ip={ip} color="dark" onClick={this.onRemove}>X</Button>
                      </Col>
                    </Row>
                    
                  </ListGroupItem>
                )
              })}
              
            </ListGroup>
          </Col>
          <Col>
            {this.info(this.state.chosenDevice)}
          </Col>
        </Row>
      </Container>
    );
  }
}


export default App;
