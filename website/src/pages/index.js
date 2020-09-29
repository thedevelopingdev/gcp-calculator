import React, { Component } from "react"
import GCECalculator from "../components/gce"

class HomePage extends Component {
  render() {
    return (
      <div>
        <GCECalculator />
        <GCECalculator />
      </div>
    )
  }
}

export default HomePage