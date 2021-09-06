import { List } from 'antd';
import classNames from 'classnames';
import Iconfont from '@/components/Icon';
import styles from './NoticeList.less';

export default function NoticeList({ data = [], onClick, onClear, title, locale, emptyText, emptyImage, NoticeTypes }) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {/* 最多只显示10个 */}
        {data.slice(0, 10).map((item, i) => {
          const { read, key, type, messageType, content, extra, description, datetime } = item;
          return (
            <List.Item
              className={classNames(styles.item, {
                [styles.read]: read,
              })}
              key={key || i}
              onClick={() => onClick(item)}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={(() => {
                  if (type === NoticeTypes.Message.key) {
                    switch (messageType) {
                      case 1:
                      case 4:
                      case 7:
                      case 10:
                      case 13:
                      case 18:
                      case 28:
                        return <Iconfont className={styles.avatar} type="new-add" />;
                      case 2:
                      case 5:
                      case 8:
                      case 11:
                      case 14:
                      case 19:
                      case 22:
                      case 23:
                      case 24:
                      case 25:
                      case 26:
                      case 27:
                      case 36:
                      case 38:
                      case 43:
                        return <Iconfont className={styles.avatar} type="new-refund" />;
                      case 30:
                      case 32:
                      case 35:
                      case 39:
                        return <Iconfont className={styles.avatar} type="new-warning" />;
                      case 3:
                      case 6:
                      case 9:
                      case 12:
                      case 15:
                      case 17:
                      case 20:
                      case 37:
                      case 42:
                        return <Iconfont className={styles.avatar} type="new-pay" />;
                      default:
                        return <Iconfont className={styles.avatar} type="new-normal" />;
                    }
                  }
                })()}
                title={
                  <div className={styles.title}>
                    {content}
                    <div className={styles.extra}>{extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={description}>
                      {description}
                    </div>
                    <div className={styles.datetime}>{datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.clear} onClick={onClear}>
        {locale.clear}
        {title}
      </div>
    </div>
  );
}
