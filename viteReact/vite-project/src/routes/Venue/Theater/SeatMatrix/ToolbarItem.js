import styles from './index.less';

export default ({ children }) => {
  return <span className={styles.toolbarItem}>{children}</span>;
};
