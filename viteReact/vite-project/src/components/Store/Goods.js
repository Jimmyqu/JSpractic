import { Component } from 'react';
import { message } from 'antd';
import classNames from 'classnames';
import MarginBar from '@/components/MarginBar';
import IconFont from '@/components/Icon';
import AmountColor from '@/components/Amount/Color';
import { formatMoney, formatImageUrl } from '@/utils/format';
import { DEFAULT_GIFT_PIC_FULLPATH } from '@/utils/utils';
import styles from './goods.less';

class Goods extends Component {
  handleClick = data => {
    const { onClick } = this.props;
    if (onClick) {
      const { stockCount = 0 } = data || {};
      if (stockCount > 0) {
        onClick(data);
        return;
      }
      message.warning('该商品已售罄！');
    }
  };

  showEditGoodRank = e => {
    e.stopPropagation();
    const { data, onEditGoodRank } = this.props;
    if (typeof onEditGoodRank === 'function') {
      onEditGoodRank(data);
    }
  };

  render() {
    const { data } = this.props;
    const { itemName, fileUrl, salesPrice, stockSoldCount, stockCount, stockUnit, ranks } = data || {};
    return (
      <MarginBar left top inline>
        <div className={styles.goods} title={itemName} onClick={() => this.handleClick(data)}>
          <img src={formatImageUrl(fileUrl, 'img_small_200X200_prew', DEFAULT_GIFT_PIC_FULLPATH)} alt="goods img" />
          <div className={styles.bottomBox}>
            <div className={styles.b1}>
              已售&nbsp;
              <span>{stockSoldCount}</span>
              {/* {stockUnit} */}
            </div>
            <div className={styles.b2}>
              <AmountColor>￥{formatMoney(salesPrice)}</AmountColor>
              <span>
                库存&nbsp;
                <span>{stockCount}</span>
                &nbsp;{stockUnit}
              </span>
            </div>
            <div className={classNames('text-overflow', styles.name)}>{itemName}</div>
          </div>
          <div className={styles.rank} onClick={this.showEditGoodRank}>
            排序 {ranks}
            <IconFont type="editor" />
          </div>
        </div>
      </MarginBar>
    );
  }
}

export default Goods;
