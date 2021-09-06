import { PureComponent } from 'react';
import classNames from 'classnames';
import style from './index.less';

export default class Color extends PureComponent {
  render() {
    const { children, className, inputSize, ...props } = this.props;
    return (
      <span
        className={classNames(
          style.color,
          {
            [style.inputSize]: inputSize,
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
}
