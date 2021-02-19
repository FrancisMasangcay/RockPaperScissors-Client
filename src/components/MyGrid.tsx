import React, { Component } from "react";

interface theProps {
  gridStyle?: React.CSSProperties | undefined;
  element1: React.ReactNode;
  element2: React.ReactNode;
}

class MyGrid extends Component<theProps> {
  render() {
    return (
      <div className="grid" style={this.props.gridStyle}>
        {this.props.element1}
        {this.props.element2}
      </div>
    );
  }
}

export default MyGrid;
