import React from "react";
import { Alert } from "react-bootstrap";

class PageAlert extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      heading: "",
    }
  }

  /*--------------------------------------------------------------------------*/

  componentDidUpdate(prevProps) {

    if (!prevProps.show && this.props.show) {
      this.setState({
        show: true,
        heading: this.props.heading
      }, () => {
        console.log("PAGE ALERT STATE UPDATE: show = true");
      });
    }
  }

  /*--------------------------------------------------------------------------*/

  handleClose = () => {
    this.setState({
      show: false,
      heading: ""
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
          className="PageAlert"
          variant="info" 
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