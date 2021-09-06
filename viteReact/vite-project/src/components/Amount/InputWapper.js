import { PureComponent } from 'react';
import classNames from 'classnames';
import style from './index.less';

export default class InputWapper extends PureComponent {
  render() {
    const { children, className, ...props } = this.props;
    return (
      <div className={classNames(style.input, style.inputWapper, className)} {...props}>
        {children}
      </div>
    );
  }
}
