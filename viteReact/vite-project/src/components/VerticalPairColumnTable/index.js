import { Fragment, Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PairColumn from './PairColumn';
import styles from './index.less';

class VerticalPairColumnTable extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  render() {
    const { isMobile } = this.context;
    const { children, labelClassName, contentClassName, labelCol, wrapperCol, per = 1 } = this.props;
    const contentList = [];

    Children.forEach(children, child => {
      if (child) {
        if (Array.isArray(child)) {
          contentList.push(...child);
          return;
        }
        if (child.type === Fragment) {
          contentList.push(...(child.props.children || []));
          return;
        }
        contentList.push(child);
      }
    });

    const pairProps = {
      per,
      labelCol,
      wrapperCol,
      labelClassName,
      contentClassName,
    };

    return (
      <table
        className={classNames(styles.tableRow, {
          [styles.tableRowFull]: labelCol == null && wrapperCol == null,
          [styles.tableRowMobile]: isMobile,
        })}
      >
        <tbody>
          {Array.from({ length: Math.ceil(contentList.length / per) })
            .fill({})
            .map((_, i) => {
              const pairList = contentList.slice(i * per, (i + 1) * per);
              const modulo = pairList.length % per;
              return (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={i}>
                  {Children.map(pairList, child => cloneElement(child, pairProps))}
                  {/* \补齐 */}
                  {modulo > 0 &&
                    Array.from({ length: per - modulo })
                      .fill({})
                      .map((__, j) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <PairColumn {...pairProps} key={`${Date.now()}-${j}`} />
                      ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  }
}

VerticalPairColumnTable.PairColumn = PairColumn;

export default VerticalPairColumnTable;
