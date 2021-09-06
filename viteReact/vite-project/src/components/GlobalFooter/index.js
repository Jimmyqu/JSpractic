import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './index.less';

const GlobalFooter = ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      {links && (
        <div className={styles.links}>
          {links.map(link => {
            const target = link.blankTarget ? '_blank' : '_self';
            if (/^https?:\/\//.test(link.href)) {
              return (
                <a key={link.key} target={target} href={link.href}>
                  {link.title}
                </a>
              );
            }
            return (
              <Link key={link.key} to={link.href} target={target}>
                {link.title}
              </Link>
            );
          })}
        </div>
      )}
      <div className={styles.copyright}>
        <div>建议使用Chrome、Firefox、Edge、360、QQ、搜狗浏览器</div>
        <div>
          {copyright || (
            <>
              Copyright <Icon type="copyright" /> 2015-{new Date().getFullYear()} 深圳运动帝图科技有限公司
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalFooter;
