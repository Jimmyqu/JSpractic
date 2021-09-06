import { forwardRef } from 'react';
import classNames from 'classnames';
import { Table } from 'antd';
import styles from './index.less';

function reduceColumnsWidth(columns) {
  return (columns || []).reduce((prev, col) => {
    return (
      prev +
      (Array.isArray(col.children) && col.children.length > 0
        ? reduceColumnsWidth(col.children)
        : Math.max(col.width || 0, 0))
    );
  }, 0);
}

export default forwardRef(
  ({ children, className, scroll: propsScroll, columns, countColsWidth, ...restProps }, ref) => {
    const scroll = propsScroll || {};
    if (countColsWidth) {
      scroll.x = reduceColumnsWidth(columns);
    }
    return (
      <Table
        ref={ref}
        className={classNames(className, {
          [styles.scrollXNowrap]: scroll && scroll.x === true,
        })}
        {...restProps}
        columns={columns}
        scroll={scroll}
      >
        {children}
      </Table>
    );
  }
);
