import { PureComponent } from 'react';
import classNames from 'classnames';
import { InputNumber } from 'antd';

import style from './index.less';

export default class Input extends PureComponent {
  focus = () => this.input.focus();

  render() {
    const { children, className, fullWidth, ...restProps } = this.props;
    return (
      <InputNumber
        ref={node => {
          this.input = node;
        }}
        size="large"
        min={0}
        precision={2}
        className={classNames(
          style.input,
          {
            'full-width': fullWidth,
          },
          className
        )}
        {...restProps}
      />
    );
  }
}
