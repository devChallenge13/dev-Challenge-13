import React, { Component } from 'react';
import { Container, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
      ListGroup, ListGroupItem} from 'reactstrap';
import uuid from 'uuid/v1';

class Info extends Component {
  state = {
    indicators: {}, // name: value
    commandDropdownOpen: false,
    commands: []
  }
  componentWillMount(){
    let socket = this.props.socket;
    socket.emit('chosen device', this.props.device.ip);

    socket.on('indicators', (indicators) => {
      this.setState({indicators: indicators});
    });
    socket.on('commands', (commands) => {
      this.setState({commands: commands})
    });
  }

  componentWillUnmount(){
    this.props.socket.removeAllListeners("indicators");
    this.props.socket.removeAllListeners("commands");
  }

  toggleCommandDropdown = () => {
    this.setState({
      commandDropdownOpen: !this.state.commandDropdownOpen
    });
  }

  onExecute = (e) => {
    this.props.socket.emit('execute', e.target.innerText);
  }

  render() {

    return (
      <Container className="App">
        <h3>{this.props.device.name}</h3>

        <h4>Indicators:</h4>
        <ListGroup>
          {Object.keys(this.state.indicators).map((name) => {
            return(
              <ListGroupItem key={'device'+uuid()}>
                {name}: {this.state.indicators[name]}
              </ListGroupItem>
            )
          })}
        </ListGroup>

        <h4>Execute command</h4>
        <ButtonDropdown isOpen={this.state.commandDropdownOpen} toggle={this.toggleCommandDropdown}>
          <DropdownToggle caret>
            Execute command
          </DropdownToggle>
          <DropdownMenu>
            {this.state.commands.map((command) => {
              return(
                <DropdownItem key={'device'+uuid()} onClick={this.onExecute}>{command}</DropdownItem>
              )
            })}
          </DropdownMenu>
        </ButtonDropdown>

      </Container>
    );
  }
}

export default Info;