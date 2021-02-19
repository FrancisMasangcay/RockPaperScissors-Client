import React, { Component } from "react";
import { Link } from "react-router-dom";

//MUI
import Button from "@material-ui/core/Button";

interface props {
  page?: string;
  onClickEvent: () => void;
}

class ActionButton extends Component<props> {
  render() {
    const { children, page, onClickEvent } = this.props;
    //console.log("Page = ", page);
    return (
      <>
        {page && (
          <Button
            variant="contained"
            size="large"
            component={Link}
            to={page}
            onClick={onClickEvent}
          >
            {children}
          </Button>
        )}
        {!page && (
          <Button variant="contained" size="large" onClick={onClickEvent}>
            {children}
          </Button>
        )}
      </>
    );
  }
}

export default ActionButton;
