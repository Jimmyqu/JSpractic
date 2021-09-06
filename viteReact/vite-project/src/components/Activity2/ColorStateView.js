import classNames from 'classnames';
import styles from './index.less';
import ViewHeader from './ViewHeader';

export default ({ state, children }) => {
  return (
    <span
      className={classNames(styles.pending, {
        [styles.yes]: state === ViewHeader.States.Yes,
        [styles.no]: state === ViewHeader.States.No,
      })}
    >
      {children}
    </span>
  );
};
