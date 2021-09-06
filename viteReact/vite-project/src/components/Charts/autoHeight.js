import { Component } from 'react';

function computeHeight(node) {
  const totalHeight = Number.parseInt(getComputedStyle(node).height, 10);
  const padding =
    Number.parseInt(getComputedStyle(node).paddingTop, 10) + Number.parseInt(getComputedStyle(node).paddingBottom, 10);
  return totalHeight - padding;
}

function getAutoHeight(n) {
  if (!n) {
    return 0;
  }

  let node = n;

  let height = computeHeight(node);

  while (!height) {
    node = node.parentNode;
    if (node) {
      height = computeHeight(node);
    } else {
      break;
    }
  }

  return height;
}

const Wc = WrappedComponent =>
  class extends Component {
    state = {
      computedHeight: 0,
    };

    componentDidMount() {
      const { height } = this.props;
      if (!height) {
        const h = getAutoHeight(this.root);
        this.setState({ computedHeight: h });
      }
    }

    handleRoot = node => {
      this.root = node;
    };

    render() {
      const { height } = this.props;
      const { computedHeight } = this.state;
      const h = height || computedHeight;
      return <div ref={this.handleRoot}>{h > 0 && <WrappedComponent {...this.props} height={h} />}</div>;
    }
  };

const autoHeight = () => Wc;

export default autoHeight;
