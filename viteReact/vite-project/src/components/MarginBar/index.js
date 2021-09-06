import { PureComponent } from 'react';
import classNames from 'classnames';
import { isNumber } from '@/utils/utils';
import style from './index.less';

const isString = str => typeof str === 'string' && str.trim().length > 0;

export default class MarginBar extends PureComponent {
  defVal = '8px';

  render() {
    const styleObj = {};
    const mergeStyle = (key, value) => {
      if (isNumber(value)) {
        styleObj[key] = `${value}px`;
      } else if (isString(value)) {
        styleObj[key] = value;
      }
    };
    const { children, left, top, right, bottom, inline, className, style: propsStyle, ...props } = this.props;
    mergeStyle('marginLeft', left);
    mergeStyle('marginTop', top);
    mergeStyle('marginRight', right);
    mergeStyle('marginBottom', bottom);
    Object.assign(styleObj, propsStyle);
    return (
      <div
        className={classNames(
          {
            [style.inline]: inline === true,
            [style.top]: top === true,
            [style.left]: left === true,
            [style.right]: right === true,
            [style.bottom]: bottom === true,
          },
          className
        )}
        style={styleObj}
        {...props}
      >
        {children}
      </div>
    );
  }
}
