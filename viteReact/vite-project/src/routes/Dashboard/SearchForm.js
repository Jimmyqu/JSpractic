import { useCallback, useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Form, DatePicker, Select, Row, Col, Button } from 'antd';
import styles from './index.less';

const colProps = {
  xs: 24,
  sm: 24,
  lg: 20,
  xl: 16,
};
const marketingCol = {
  xs: 24,
  sm: 24,
  lg: 24,
  xl: 8,
};
const options = [
  {
    key: 1,
    text: '上一天',
  },
  {
    key: 2,
    text: '下一天',
  },
  {
    key: 3,
    text: '昨天',
  },
  {
    key: 4,
    text: '今天',
  },
  {
    key: 5,
    text: '本周',
  },
  {
    key: 6,
    text: '本月',
  },
];
const { RangePicker } = DatePicker;
const { Option } = Select;
let timer = null;

const SearchForm = forwardRef(({ handlerClick }, ref) => {
  const { list } = useSelector(state => state.venue);
  const now = moment();
  const [venue, setVenue] = useState([0]);
  const [disabledCurrent, setDisabledCurrent] = useState(null);
  const [preset, setPreset] = useState(4);
  const [startValue, setStartValue] = useState(now);
  const [endValue, setEndValue] = useState(now);
  const [rangePickerValue, setRangePickerValue] = useState([now, now]);
  const listOpt = [{ id: 0, salesName: '全部' }, ...list];

  const searchRef = useRef(true);
  useImperativeHandle(
    ref,
    () => ({
      startValue,
      endValue,
      venue,
    }),
    [startValue, endValue, venue]
  );
  const onChangePreset = useCallback(
    (e, v) => {
      let startDate;
      let endDate;
      const refDay = startValue !== now && ![0, 5, 6].includes(preset) ? startValue : now;
      switch (v) {
        case 1:
          // eslint-disable-next-line no-case-declarations
          const prevDay = refDay.clone().subtract(1, 'days');
          startDate = prevDay;
          endDate = prevDay;
          break;
        case 2:
          // eslint-disable-next-line no-case-declarations
          const tomorrow = refDay.clone().add(1, 'days');
          startDate = tomorrow;
          endDate = tomorrow;
          break;
        case 3:
          // eslint-disable-next-line no-case-declarations
          const yesterday = now.clone().add(-1, 'days');
          startDate = yesterday;
          endDate = yesterday;
          break;
        case 4:
          startDate = now;
          endDate = now;
          break;
        case 5:
          startDate = now.week(moment().week()).clone().startOf('week');
          endDate = now.week(moment().week()).clone().endOf('week');
          break;
        case 6:
          startDate = now.month(now.month()).clone().startOf('month');
          endDate = now.month(now.month()).clone().endOf('month');
          break;
        default:
          startDate = now;
          endDate = now;
      }
      setPreset(v);
      setStartValue(startDate);
      setEndValue(endDate);
      setRangePickerValue([startDate, endDate]);
    },
    [startValue, endValue]
  );

  const onOpenChange = useCallback(() => {
    setDisabledCurrent(null);
  }, []);
  const onChangePicker = useCallback(dates => {
    setPreset(0);
    setStartValue(dates[0]);
    setEndValue(dates[1]);
    setRangePickerValue(dates);
  }, []);
  const onCalendarChange = dates => {
    setDisabledCurrent(dates[0]);
  };
  const disabledDate = current => {
    if (!disabledCurrent) return false;
    return (
      (current && current < moment(disabledCurrent).startOf('day')) ||
      current > moment(disabledCurrent).add(1, 'M').endOf('day')
    );
  };
  const onChangeVenue = useCallback(value => {
    const resetVenue =
      (value[0] === 0 && value.length === 0) || value[value.length - 1] === 0
        ? [0]
        : value.filter(item => {
            return item !== 0;
          });
    setVenue(resetVenue);
  }, []);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current = false;
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      handlerClick(true);
    }, 300);
  }, [startValue, endValue, venue]);

  return (
    <Form className={styles.formSearch} ref={searchRef}>
      <Row gutter={10} justify="space-between" type="flex">
        <Col {...marketingCol} className={styles.marketing}>
          <Form.Item label="营销中心">
            <Select
              mode="multiple"
              placeholder="默认全部营销中心"
              defaultValue={venue}
              onChange={onChangeVenue}
              value={venue}
            >
              {listOpt.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.salesName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col {...colProps} className={styles.range}>
          <span>
            {options.map(({ key, text }) => (
              <Button
                key={key}
                onClick={e => onChangePreset(e, key)}
                type={preset === key ? 'primary' : 'default'}
                ghost
                className={preset === key ? styles.btn : styles.noborder}
              >
                {text}
              </Button>
            ))}
          </span>
          <Form.Item label="时间段">
            <RangePicker
              allowClear={false}
              style={{ width: 260 }}
              onOpenChange={onOpenChange}
              onChange={onChangePicker}
              onCalendarChange={onCalendarChange}
              value={rangePickerValue}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default SearchForm;
