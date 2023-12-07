import React from "react";
import { Alert } from "react-bootstrap";

class PageAlert extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      heading: "",
      variant: ""
    }
  }

  /*--------------------------------------------------------------------------*/

  componentDidUpdate(prevProps) {

    if (this.props.show && (!prevProps.show || (prevProps.heading !== this.props.heading))) {
      this.setState({
        show: true,
        heading: this.props.heading,
        variant: this.props.variant
      }, () => {
        console.log("PAGE ALERT STATE UPDATE: show = true");
      });
    }
  }

  /*--------------------------------------------------------------------------*/

  handleClose = () => {
    this.setState({
      show: false,
      heading: "",
      variant: ""
    }, () => {
      console.log("PAGE ALERT STATE UPDATE: show = false")
    });
    this.props.close();
  }

  /*--------------------------------------------------------------------------*/

  render() {

    if (this.state.show) {
      return (
        <Alert 
          className="PageAlert d-flex align-items-center"
          variant={this.state.variant === ""? "info" : this.state.variant} 
          onClose={this.handleClose}
          dismissible
        >
          <Alert.Heading>{this.state.heading}</Alert.Heading>
        </Alert>
      );
    }
  }
}

export default PageAlert;