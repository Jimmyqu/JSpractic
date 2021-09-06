import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * 组件过滤操作权限
 */
export default class AuthComponent extends Component {
  static contextTypes = {
    isAuthorized: PropTypes.func,
  };

  render() {
    const { children, auth } = this.props;
    const { isAuthorized } = this.context;
    if (auth === true || isAuthorized(auth)) {
      return children;
    }
    return null;
  }
}
