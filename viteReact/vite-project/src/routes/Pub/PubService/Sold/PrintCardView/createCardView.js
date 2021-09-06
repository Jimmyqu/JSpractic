import { Component } from 'react';

export default () => {
  return CardVIewComponent => {
    return class CardView extends Component {
      state = {
        frontResizing: false,
        backResizing: false,
        resizeData: null,
      };

      onFrontResizeStart = (e, data) => {
        this.setState({
          frontResizing: true,
          resizeData: data,
        });
      };

      onFrontResizeStop = (e, data) => {
        this.setState({
          frontResizing: false,
          resizeData: data,
        });
      };

      onFrontResize = (e, data) => {
        this.setState({
          resizeData: data,
        });
      };

      onBackResizeStart = (e, data) => {
        this.setState({
          backResizing: true,
          resizeData: data,
        });
      };

      onBackResizeStop = (e, data) => {
        this.setState({
          backResizing: false,
          resizeData: data,
        });
      };

      onBackResize = (e, data) => {
        this.setState({
          resizeData: data,
        });
      };

      render() {
        const { frontResizing, backResizing, resizeData } = this.state;
        return (
          <CardVIewComponent
            {...this.props}
            frontResizing={frontResizing}
            backResizing={backResizing}
            resizeData={resizeData}
            onFrontResizeStart={this.onFrontResizeStart}
            onFrontResizeStop={this.onFrontResizeStop}
            onFrontResize={this.onFrontResize}
            onBackResizeStart={this.onBackResizeStart}
            onBackResizeStop={this.onBackResizeStop}
            onBackResize={this.onBackResize}
          />
        );
      }
    };
  };
};
