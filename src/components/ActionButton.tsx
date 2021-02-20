import React, { Component } from "react";
import { Link } from "react-router-dom";

//MUI
import Button from "@material-ui/core/Button";

interface props {
  page?: string;
  theState?: object;
  onClickEvent: () => void;
}

// const customLink = React.forwardRef((linkprops, ref) => (
//   <Link ref={ref as any} to={{pathname: page, state: theState}}>
//   </Link> ));

export default function ActionButton (props: any) {
    const { children, page, theState, onClickEvent } = props;

    // const customLink = React.forwardRef((linkprops, ref) => (
    //   <Link ref={ref as any} to={{pathname: page, state: theState}}>
    //   </Link> ));
      
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
            {/* <Link to={{pathname: page, state: theState}}> */}
              {children}
            {/* //</Link> */}
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
