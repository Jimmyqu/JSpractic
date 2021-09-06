import PropTypes from 'prop-types';
import { Row, Col, Checkbox, InputNumber } from 'antd';
import CountInput from '@/components/CountInput';
import AmountColor from '@/components/Amount/Color';
import { div, mul } from '@/commons/lib/math';
import { formatMoney, encodeMoney, decodeMoney } from '@/utils/format';
import style from './counter.less';

function Counter(props, context) {
  const { isAuthorized } = context;
  const {
    data,
    config: { num, price: p },
    onNumberChange = () => {},
    onPriceChange = () => {},
  } = props;

  const disabled = !isAuthorized('edit-amount');

  const price = p == null ? data.salesPrice : p;
  const showPrice = decodeMoney(price);
  const total = mul(price, num);
  return (
    <div className={style.counter}>
      <Row>
        <Col>
          <Checkbox value={data.id}>{data.itemName}</Checkbox>
        </Col>
      </Row>
      <Row className={style.number}>
        <Col span={10}>
          <CountInput
            min={1}
            size="large"
            value={num}
            max={data.stockCount}
            onChange={value => onNumberChange(value, data.id)}
          />
        </Col>
        <Col span={8}>
          <AmountColor>
            <InputNumber
              size="large"
              disabled={disabled}
              value={showPrice}
              min={0}
              precision={2}
              onChange={value => onPriceChange(encodeMoney(value), data.id)}
            />
          </AmountColor>
        </Col>
        <Col className={style.dis} span={6}>
          <AmountColor>{formatMoney(total)}</AmountColor>
        </Col>
      </Row>
    </div>
  );
}

Counter.contextTypes = {
  isAuthorized: PropTypes.func,
};

export default Counter;
