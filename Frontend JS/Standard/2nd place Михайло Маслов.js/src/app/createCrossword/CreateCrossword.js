import React, { Component } from 'react';


class CreateCrossword extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
    return(
      <button className="mdl-button mdl-button--colored"
              onClick={this.props.goHome}
      >
        Go home
      </button>
    )
  }
}

export default CreateCrossword;