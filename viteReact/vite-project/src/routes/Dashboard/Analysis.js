import { useState, useCallback, useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Icon, Tooltip } from 'antd';
import IntervalChart from '@/components/Charts/IntervalChart';
import IntervalStackChart from '@/components/Charts/IntervalStackChart';
import { formatPercent, formatMoney } from '@/utils/format';
import styles from './index.less';

const stackTypeList = [
  {
    type: 0,
    name: '全部',
  },
  {
    type: 1,
    name: 'PC端',
  },
  {
    type: 2,
    name: '无线端',
  },
];
const totalCol = {
  xs: 24,
  sm: 24,
  lg: 9,
  xl: 9,
};
const modeCol = {
  xs: 24,
  sm: 24,
  lg: 15,
  xl: 15,
};
const colors = ['#4DCB73', '#3BA0FF', '#975FE4', '#FAD337', '#F2637B'];
const vipColors = ['#3BA0FF', '#F2637B', '#FAD337'];

const Analysis = forwardRef(({ data }, ref) => {
  const ansyRef = useRef();
  const [stackType, setStackType] = useState(0);
  const {
    publicAccountAgeVOList,
    publicAccountManNum,
    publicAccountWomanNum,
    publicAccountTotalNum,
    cloudPayByWechatAmount,
    portalPayByWechatAmount,
    cloudPayByAlipayAmount,
    portalPayByAlipayAmount,
    cloudPayByBankCardAmount,
    portalPayByBankCardAmount,
    cloudPayByBankTransferAmount,
    portalPayByBankTransferAmount,
    cloudPayByCachAmount,
    portalPayByCachAmount,
    publicAccountNewNum,
    publicAccountActiveNum,
    isAuthorized,
  } = data;
  const cloudStack = [
    cloudPayByWechatAmount,
    cloudPayByAlipayAmount,
    cloudPayByBankCardAmount,
    cloudPayByBankTransferAmount,
    cloudPayByCachAmount,
  ];
  const portalStack = [
    portalPayByWechatAmount,
    portalPayByAlipayAmount,
    portalPayByBankCardAmount,
    portalPayByBankTransferAmount,
    portalPayByCachAmount,
  ];
  const allStack = useMemo(() => {
    return cloudStack.map((item, index) => {
      return item + portalStack[index];
    });
  }, [data]);
  const stackTypeToValue = type => {
    switch (type) {
      case 0:
        return allStack;
      case 1:
        return cloudStack;
      case 2:
        return portalStack;
      default:
        return allStack;
    }
  };

  const state = useMemo(
    () => ({
      payModeData: [
        {
          type: '微信',
          value: stackTypeToValue(stackType)[0],
        },
        {
          type: '支付宝',
          value: stackTypeToValue(stackType)[1],
        },
        {
          type: '银行卡刷卡',
          value: stackTypeToValue(stackType)[2],
        },
        {
          type: '银行卡转账',
          value: stackTypeToValue(stackType)[3],
        },
        {
          type: '现金',
          value: stackTypeToValue(stackType)[4],
        },
      ],
      aysData: [
        {
          type: '男性',
          value: publicAccountManNum,
        },
        {
          type: '女性',
          value: publicAccountWomanNum,
        },
        {
          type: '未知',
          value: publicAccountTotalNum - publicAccountManNum - publicAccountWomanNum,
        },
      ],
      vipData: publicAccountAgeVOList?.map(item => ({
        x: item.ageDescr,
        value: item.num,
      })),
    }),
    [data, stackType]
  );
  const isPayModeAnalysis = isAuthorized('payModeAnalysis');
  const isMemberAnalysis = isAuthorized('payModeAnalysis');
  const [vipData, setVipData] = useState(state.vipData);
  const [payModeData, setPayModeData] = useState(state.payModeData);
  const [aysData, setAysData] = useState(state.aysData);
  const sum = payModeData.reduce((pre, cur) => {
    return pre + cur.value;
  }, 0);

  useEffect(() => {
    setVipData(state.vipData);
    setAysData(state.aysData);
    setStackType(0);
  }, [data]);

  useEffect(() => {
    setPayModeData(state.payModeData);
    ansyRef.current.changeValue(state.payModeData);
  }, [data, stackType]);

  useImperativeHandle(
    ref,
    () => ({
      changeValue: () => {
        ansyRef.current.changeValue(state.payModeData);
      },
    }),
    [payModeData]
  );

  const handelChangeStack = useCallback((e, type) => {
    setStackType(type);
  });

  const payIntervalStackChart = useMemo(
    () => (
      <IntervalStackChart
        ref={ansyRef}
        padding={[30, 48, 35, 48]}
        data={payModeData}
        colors={colors}
        height={350}
        isMonery="true"
        legendVisible={false}
        legendHtml={
          <Row className={styles.legendHtml}>
            <Col {...totalCol} className={styles.totalAmount}>
              <span>支付方式总金额</span>
              <p>¥ {formatMoney(sum)}</p>
            </Col>
            <Col {...modeCol} className={styles.info}>
              {payModeData.map((item, index) => (
                <Row key={item.type} className={styles.legend}>
                  <Col span={11} className={styles.typeName}>
                    <i className={styles.marker} style={{ backgroundColor: colors[index] }} />
                    <span>{item.type}</span>
                  </Col>
                  <Col span={5} className={styles.percent}>
                    {formatPercent(item.value / sum || 0)}
                  </Col>
                  <Col span={8} className={styles.amount}>
                    ¥ {formatMoney(item.value)}
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        }
      />
    ),
    [payModeData, stackType]
  );

  const VipIntervalStackChart = useMemo(
    () => <IntervalStackChart data={aysData} height={230} colors={vipColors} />,
    [aysData]
  );

  return (
    <div className={styles.analysis}>
      <Row gutter={[25, 20]}>
        {isPayModeAnalysis && (
          <Col xs={24} xl={isMemberAnalysis ? 12 : 24}>
            <Card
              bordered={false}
              title={
                <span>
                  支付方式分析
                  <Tooltip
                    placement="right"
                    title="支付方式分析：当前时段内，所选场馆，所有以现金流支付的金额占比分析，PC端（线下营业员端）、无线端（线上手机终端）"
                  >
                    <Icon type="question" className={styles.question} />
                  </Tooltip>
                </span>
              }
            >
              <div className={styles.stackType}>
                {stackTypeList.map(({ type, name }) => (
                  <div
                    key={type}
                    className={stackType === type ? styles.active : ''}
                    onClick={e => handelChangeStack(e, type)}
                  >
                    {name}
                  </div>
                ))}
              </div>
              {payIntervalStackChart}
            </Card>
          </Col>
        )}
        {isMemberAnalysis && (
          <Col xs={24} xl={isPayModeAnalysis ? 12 : 24}>
            <Card
              bordered={false}
              title={
                <span>
                  会员分析
                  <Tooltip placement="right" title="会员分析：新增、活跃、累积会员，依据会员下单，性别和年龄区进行分析">
                    <Icon type="question" className={styles.question} />
                  </Tooltip>
                </span>
              }
            >
              <Row gutter={[20, 20]} className={styles.vip}>
                <Col span={16} className={styles.vipSts}>
                  {VipIntervalStackChart}
                </Col>
                <Col span={8} className={styles.vipInfo}>
                  <div>
                    <span>活跃会员数</span>
                    <h3>{publicAccountActiveNum}</h3>
                    <span>新增会员数</span>
                    <h3>{publicAccountNewNum}</h3>
                    <span>累计会员数</span>
                    <h3>{publicAccountTotalNum}</h3>
                  </div>
                </Col>
              </Row>
              <Row>
                <IntervalChart
                  height={250}
                  minWidth="432px"
                  padding={[50, 30, 50, 50]}
                  label={{ offset: 20 }}
                  color="#67d388"
                  data={vipData}
                  size={25}
                  title="会员分析"
                  fullClassName={styles.vipFull}
                />
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
});

Analysis.contextTypes = {
  isAuthorized: PropTypes.func,
};

export default Analysis;
