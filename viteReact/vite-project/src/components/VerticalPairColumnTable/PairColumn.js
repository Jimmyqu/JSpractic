import classNames from 'classnames';
import styles from './index.less';

export default function PairColumn({ label, children, per, labelClassName, contentClassName, labelCol, wrapperCol }) {
  let labelGridCol = labelCol;
  let valueGridCol = wrapperCol;
  if (labelGridCol == null && valueGridCol == null) {
    switch (per) {
      case 2:
        labelGridCol = 3;
        valueGridCol = 9;
        break;
      case 3:
        labelGridCol = 2;
        valueGridCol = 6;
        break;
      case 4:
        labelGridCol = 2;
        valueGridCol = 4;
        break;
      default:
        // 1
        labelGridCol = 3;
        valueGridCol = 19;
        break;
    }
  }
  return (
    <>
      <td
        className={classNames(styles.sellLabel, labelClassName, 'ant-col-sm-6', {
          [`ant-col-md-${labelGridCol}`]: labelGridCol > 0,
        })}
      >
        {label}
      </td>
      <td
        className={classNames(contentClassName, 'ant-col-sm-18', {
          [`ant-col-md-${valueGridCol}`]: valueGridCol > 0,
        })}
      >
        {children}
      </td>
    </>
  );
}
