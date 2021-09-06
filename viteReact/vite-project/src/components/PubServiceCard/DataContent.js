import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Form } from 'antd';
import { formatHM, decodeMoney, formatWeekDaySeries } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import AmountInput from '@/components/Amount/Input';
import { add, mul } from '@/commons/lib/math';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

/**
 * 解析星期
 * @param commonCalendar 逗号分割字符串
 */
function resolveWeekDays(commonCalendar) {
  if (commonCalendar == null) {
    return null;
  }

  return formatWeekDaySeries(
    commonCalendar
      .trim()
      .split(',')
      .filter(wd => +wd === Number.parseInt(wd, 10))
  );
}

function resolveTimes(weekDate, startTime, endTime) {
  if (weekDate == null) {
    return '?';
  }
  let endTimeStr;
  if (endTime) {
    const mmt = moment(endTime);
    endTimeStr =
      mmt.hours() === 0 && mmt.minutes() === 0 && mmt.seconds() === 0 && mmt.milliseconds() === 0
        ? '24:00'
        : formatHM(endTime);
  }
  return `${resolveWeekDays(weekDate)} ${formatHM(startTime)}${endTimeStr ? `-${endTimeStr}` : ''}`;
}

const isCalcPriceKey = key => /^\d+-serviceCalcPrice$/.test(key);

const getCalcPriceKeyById = id => `${id.toString()}-serviceCalcPrice`;

// 解析描述为文本或者表单
@connect(({ venue, pubservice }) => ({
  venue,
  pubservice,
}))
class DataContent extends Component {
  static propTypes = {
    form: ({ editable, form }) => {
      if (editable && form == null) {
        throw new Error('编辑模式下必须提供form');
      }
    },
  };

  static contextTypes = {
    convertNodeToString: PropTypes.func,
  };

  static defaultProps = {
    form: undefined,
  };

  renderServiceUseMode = () => {
    const {
      pubservice: { PubServiceUseModeTypes },
      serviceUseMode,
    } = this.props;
    switch (serviceUseMode) {
      case PubServiceUseModeTypes.AND.key:
        return '和 ';
      case PubServiceUseModeTypes.OR.key:
        return '或 ';
      default:
        return null;
    }
  };

  inputOnChange = (val, name) => {
    const v = val || 0;
    // 数量单位，name就是id
    const {
      pubservice: { PubServiceUseModeTypes },
      form,
      pubServiceDataList,
      withdraw,
      withdrawTotalPriceChange,
      serviceUseMode,
    } = this.props;
    const isOr = serviceUseMode === PubServiceUseModeTypes.OR.key;
    const isAnd = serviceUseMode === PubServiceUseModeTypes.AND.key;
    // null而不是0
    let totalCalcPrice;
    if (isOr) {
      const isCalcKey = isCalcPriceKey(name);
      let first;
      // 同步其他值
      const formKeysMapping = {};
      pubServiceDataList.forEach(item => {
        const valueList = item.pubServiceValueList || item.dealServicePubValueList || [];
        valueList.forEach(subItem => {
          // 如果是or，取第一个来使用
          if (first == null) {
            first = subItem;
          }
          const idName = subItem.id.toString();
          const key = isCalcKey ? getCalcPriceKeyById(idName) : idName;
          if (key === name) {
            // 跳过自己
            return;
          }
          formKeysMapping[key] = v;
        });
      });
      // 同步非自己的其他id的表单值并不会触发对方的onChange, 所以还需要替它们触发calc的表单值
      form.setFieldsValue(formKeysMapping);
      if (withdraw) {
        // 注意：serviceCalcPrice 的值，在售前，是服务卡总的计费金额，售后是一个单位的计费金额
        const { serviceCalcPrice } = first;
        totalCalcPrice = mul(v, decodeMoney(serviceCalcPrice));
        Object.keys(formKeysMapping).forEach(key => {
          form.setFieldsValue({
            [getCalcPriceKeyById(key)]: totalCalcPrice,
          });
        });
      }
    }
    // 只服务于withdraw
    if (withdraw) {
      // or的计算放前一个if了，提高性能
      let total = isOr ? totalCalcPrice : 0;
      const formData = form.getFieldsValue();
      pubServiceDataList.forEach(item => {
        const valueList = item.pubServiceValueList || item.dealServicePubValueList || [];
        valueList.forEach(subItem => {
          // 注意：serviceCalcPrice 的值，在售前，是服务卡总的计费金额，售后是一个单位的计费金额
          const { id, serviceCalcPrice } = subItem;
          const idName = id.toString();
          const isTarget = idName === name;
          const calcPrice = mul(isTarget ? v : formData[idName] || 0, decodeMoney(serviceCalcPrice));
          if (isAnd) {
            total = add(total, calcPrice);
          }
          // 当前修改的那个
          if (isTarget) {
            form.setFieldsValue({
              [getCalcPriceKeyById(name)]: calcPrice,
            });
          }
        });
      });
      // withdrawTotalPriceChange 是里面传出，要求外面来遵循某个逻辑
      withdrawTotalPriceChange?.(total);
    }
  };

  getAllValueIdsBySameGroup = valueItemId => {
    const { pubServiceDataList } = this.props;
    const groupObjIdMapping = new Map();
    let targetGroupObjId;
    pubServiceDataList?.forEach(item => {
      if (groupObjIdMapping.get(item.groupObjId) == null) {
        groupObjIdMapping.set(item.groupObjId, []);
      }
      const list = groupObjIdMapping.get(item.groupObjId);
      const valueList = item.pubServiceValueList || item.dealServicePubValueList || [];
      valueList.forEach(({ id }) => {
        if (targetGroupObjId == null && id === valueItemId) {
          targetGroupObjId = item.groupObjId;
        }
        list.push(id);
      });
    });
    if (targetGroupObjId) {
      return groupObjIdMapping.get(targetGroupObjId);
    }
    return [];
  };

  render() {
    const { convertNodeToString = str => str } = this.context;
    const {
      venue: { ProfessionTypes, Careers },
      pubservice: { PubServiceUnitTypes, PubServiceTypes, PubServiceObjTypes, PubServiceUseModeTypes },
      pubServiceDataList,
      editable,
      inputCls,
      inputSize,
      dispatch,
      serviceUseMode,
      sellTotalPrice,
      ...rest
    } = this.props;
    if (pubServiceDataList == null || pubServiceDataList.length === 0) {
      return null;
    }
    const isOr = serviceUseMode === PubServiceUseModeTypes.OR.key;
    const inputProps = {
      ...rest,
      isOr,
      editable,
      className: inputCls,
      size: inputSize,
      onChange: this.inputOnChange,
      getAllValueIdsBySameGroup: this.getAllValueIdsBySameGroup,
    };
    const content = pubServiceDataList.map((item, i) => {
      const platformSportsType = Object.values(ProfessionTypes).find(it => it.key === item.serviceObjExt2);
      let WarningUnknown = false;
      if (
        platformSportsType == null &&
        // 需要显示场地的但是不识别的场地
        (item.serviceObj === PubServiceObjTypes.Platform.key || item.serviceObj === PubServiceObjTypes.User.key)
      ) {
        // 项目类型未知
        WarningUnknown = (
          <div>
            未知的项目类型:
            {item.serviceObjExt2}
          </div>
        );
      }
      const pubServiceProfessionType = Object.values(Careers).find(it => it.key === item.serviceObjExt3);
      const valueList = item.pubServiceValueList || item.dealServicePubValueList;
      const ignoreTimeList = item.pubServiceTimeList || [];

      return (
        <Fragment key={item.id}>
          {WarningUnknown}
          {(valueList || []).map((subItem, j) => {
            const { commonCalendar } = subItem || {};
            const { weekDate, startTime, endTime } = commonCalendar || {};
            if (weekDate == null) {
              return null;
            }
            // 一张服务卡，value list 的所有 serviceType 的值永远会是同一个，业务也不支持非同一个的场景
            const pubService = Object.values(PubServiceTypes).find(it => it.key === subItem.serviceType);
            if (pubService == null) {
              return null;
            }
            let goon = true;
            const pubServiceObjType = Object.values(PubServiceObjTypes).find(it => it.key === item.serviceObj) || {};

            const finallyProps = {
              ...inputProps,
              data: subItem,
              disabled:
                (isOr && !rest.withdraw && (i > 0 || j > 0)) ||
                // 转结时，非次数卡不可编辑
                (rest.withdraw && pubService.key !== PubServiceTypes.NUMBER.key),
            };
            return (
              <WpItem key={subItem.id} editable={editable}>
                {(i > 0 || j > 0) && (
                  <>
                    {!editable && <>&nbsp;</>}
                    {this.renderServiceUseMode()}
                  </>
                )}
                <Wrapper editable={editable}>
                  {(() => {
                    switch (pubServiceObjType.key) {
                      case PubServiceObjTypes.Platform.key: // 场地
                        return `${(platformSportsType || {}).value || ''}${pubServiceObjType.value}`;
                      case PubServiceObjTypes.User.key: // 人员
                        return `${(platformSportsType || {}).value || ''}${pubServiceObjType.value}${
                          pubServiceProfessionType ? pubServiceProfessionType.value : ''
                        }`;
                      case PubServiceObjTypes.Course.key: // 课程
                      case PubServiceObjTypes.Item.key: // 商品
                      case PubServiceObjTypes.Exerciselist.key: // 赛事活动培训影剧
                        return pubServiceObjType.value;
                      default:
                        goon = false;
                        return null;
                    }
                  })()}
                  {goon && (
                    <>
                      {resolveTimes(weekDate, startTime, endTime)},&nbsp;
                      {(() => {
                        switch (pubService.key) {
                          case PubServiceTypes.DISCOUNT.key: // 折扣
                            return (
                              <>
                                <BuildInput {...finallyProps} precision={2} max={10} />折
                              </>
                            );
                          case PubServiceTypes.PAY_ONLY.key: // 仅付
                            return (
                              <>
                                仅付
                                <BuildInput {...finallyProps} precision={2} />元
                              </>
                            );
                          case PubServiceTypes.NUMBER.key: // 次数
                            switch (subItem.unit) {
                              case PubServiceUnitTypes.EVERYTIME.key: // 次
                                return (
                                  <>
                                    <BuildInput {...finallyProps} precision={0} />
                                    {PubServiceUnitTypes.EVERYTIME.value}
                                  </>
                                );
                              case PubServiceUnitTypes.PERHOURS.key: // 小时
                                return (
                                  <>
                                    <BuildInput {...finallyProps} precision={1} step={0.5} />
                                    {PubServiceUnitTypes.PERHOURS.value}
                                  </>
                                );
                              case PubServiceUnitTypes.CLASS_TIME.key: // 课
                                return (
                                  <>
                                    <BuildInput {...finallyProps} precision={1} step={0.5} />
                                    {PubServiceUnitTypes.CLASS_TIME.value}
                                  </>
                                );
                              case PubServiceUnitTypes.PER_PIECE.key: // 张
                                return (
                                  <>
                                    <BuildInput {...finallyProps} precision={0} />
                                    {PubServiceUnitTypes.PER_PIECE.value}
                                  </>
                                );
                              case PubServiceUnitTypes.PIECE.key: // 件
                                return (
                                  <>
                                    <BuildInput {...finallyProps} precision={0} />
                                    {PubServiceUnitTypes.PIECE.value}
                                  </>
                                );
                              default:
                                goon = false;
                                return null;
                            }
                          case PubServiceTypes.PREFERENTIAL.key: // 优惠
                            switch (subItem.unit) {
                              case PubServiceUnitTypes.EVERYTIME.key: // 次
                                return (
                                  <>
                                    每{PubServiceUnitTypes.EVERYTIME.value}
                                    <BuildInput {...finallyProps} precision={2} />元
                                  </>
                                );
                              case PubServiceUnitTypes.PERHOURS.key: // 小时
                                return (
                                  <>
                                    每{PubServiceUnitTypes.PERHOURS.value}
                                    <BuildInput {...finallyProps} precision={2} />元
                                  </>
                                );
                              case PubServiceUnitTypes.CLASS_TIME.key: // 课
                                return (
                                  <>
                                    每{PubServiceUnitTypes.CLASS_TIME.value}
                                    <BuildInput {...finallyProps} precision={2} />元
                                  </>
                                );
                              case PubServiceUnitTypes.PER_PIECE.key: // 张
                                return (
                                  <>
                                    每{PubServiceUnitTypes.PER_PIECE.value}
                                    <BuildInput {...finallyProps} precision={2} />元
                                  </>
                                );
                              case PubServiceUnitTypes.PIECE.key: // 件
                                return (
                                  <>
                                    每{PubServiceUnitTypes.PIECE.value}
                                    <BuildInput {...finallyProps} precision={2} />元
                                  </>
                                );
                              default:
                                goon = false;
                                return null;
                            }
                          default:
                            goon = false;
                            return null;
                        }
                      })()}
                    </>
                  )}
                </Wrapper>
                {goon && (
                  <Wrapper editable={editable}>
                    {pubService.key === PubServiceTypes.NUMBER.key && (
                      <ServiceCalc {...finallyProps} sellTotalPrice={sellTotalPrice} />
                    )}
                  </Wrapper>
                )}
              </WpItem>
            );
          })}
          {ignoreTimeList.length > 0 && (
            <Wrapper editable={editable}>
              &nbsp;在
              {ignoreTimeList
                .map(({ commonCalendar }) => {
                  const { weekDate, startTime, endTime } = commonCalendar || {};
                  return resolveTimes(weekDate, startTime, endTime);
                })
                .join(', ')}
              期间内不可用;
            </Wrapper>
          )}
        </Fragment>
      );
    });
    return editable ? content : <span title={convertNodeToString(content)}>{content}</span>;
  }
}

DataContent.isCalcPriceKey = isCalcPriceKey;
DataContent.getCalcPriceKeyById = getCalcPriceKeyById;

export default DataContent;

const Wrapper = ({ editable, children }) => {
  if (editable) {
    return <div className={styles.rowItem}>{children}</div>;
  }
  return children;
};

const BuildInput = ({
  editable,
  data,
  form,
  sellTotalPrice,
  withdraw,
  onChange,
  isOr,
  getAllValueIdsBySameGroup,
  ...props
}) => {
  const disVal = decodeMoney(data.serviceValue) || 0;
  if (editable) {
    const name = data.id.toString();
    // const props = integer
    //   ? {
    //       step: 1,
    //       precision: 0,
    //     }
    //   : {
    //       step: 0.01,
    //       precision: 2,
    //     };
    const max = withdraw ? disVal : undefined;
    return (
      <MarginBar inline left right>
        <Form.Item className={styles.formItem} colon={false} label=" " labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
          {form.getFieldDecorator(name, {
            initialValue: disVal,
            rules: [
              {
                required: true,
                message: '请填写金额',
              },
              // sellTotalPrice 是外面传入，要求里面来遵循某个逻辑
              isNumber(sellTotalPrice) && {
                message: '所有服务计费金额累计后需要与服务销售金额一致',
                validator(rule, value, fn) {
                  const formData = form.getFieldsValue();
                  const serviceCalcPriceKeys = Object.keys(formData).filter(isCalcPriceKey);
                  // 如果是or，取第一个来使用
                  const all = (isOr ? [serviceCalcPriceKeys[0]] : serviceCalcPriceKeys).reduce(
                    (prev, current) => add(prev, formData[current]),
                    0
                  );
                  if (all === sellTotalPrice) {
                    fn();
                    serviceCalcPriceKeys.forEach(key => {
                      if (key === this.field) {
                        return;
                      }
                      const error = form.getFieldError(key);
                      if (error == null) {
                        return;
                      }
                      form.validateFields([key]);
                    });
                    return;
                  }
                  fn([new Error('invalid')]);
                },
              },
              {
                message: '该服务为组合使用，请填写相同的值',
                validator(rule, value, fn) {
                  const formData = form.getFieldsValue();
                  const ids = getAllValueIdsBySameGroup?.(data.id);
                  let hasDiff = false;
                  ids.forEach(id => {
                    if (id === data.id) {
                      return;
                    }
                    const idValue = formData[id];
                    if (!hasDiff && idValue !== value) {
                      hasDiff = true;
                    }
                    const error = form.getFieldError(id.toString());
                    if (error == null) {
                      return;
                    }
                    form.validateFields([id.toString()]);
                  });
                  if (hasDiff) {
                    fn([new Error('invalid')]);
                    return;
                  }
                  fn();
                },
              },
            ].filter(Boolean),
          })(
            <AmountInput
              {...props}
              min={0}
              max={max}
              onChange={
                typeof onChange === 'function'
                  ? v => {
                      onChange(v, name);
                    }
                  : undefined
              }
            />
          )}
        </Form.Item>
      </MarginBar>
    );
  }
  return disVal;
};

function WpItem({ editable, children }) {
  if (editable) {
    return <div>{children}</div>;
  }
  return <>{children}</>;
}

/**
 * 服务计费金额
 */
function ServiceCalc({ data, withdraw, disabled, ...rest }) {
  return (
    <>
      ,&nbsp;服务计费金额
      <BuildInput
        // 兼容BuildInput的props
        {...rest}
        data={{
          // 注意：serviceCalcPrice 的值，在售前，是服务卡总的计费金额，售后是一个单位的计费金额
          serviceValue: withdraw ? mul(data.serviceValue, decodeMoney(data.serviceCalcPrice)) : data.serviceCalcPrice,
          id: getCalcPriceKeyById(data.id),
        }}
        disabled={disabled || withdraw}
        precision={2}
      />
      元;
    </>
  );
}
