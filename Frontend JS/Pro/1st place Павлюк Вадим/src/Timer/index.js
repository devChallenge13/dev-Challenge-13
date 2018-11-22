import React, { Component } from 'react'

class Timer extends Component {
  state = {
    time: 0,
  }

  tick = () => {
    this.setState((prevState) => {
      return {
        time: prevState.time + 1,
      }
    })
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const { time } = this.state
    return (
      <div>Time: {time} s.</div>
    )
  }
}

export default Timer