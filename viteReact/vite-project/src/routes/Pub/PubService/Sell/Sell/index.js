import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, Row, Col, Divider, Form, Input, Button } from 'antd';
import VenueSwitcher from '@/components/VenueSwitcher';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import MarginBar from '@/components/MarginBar';
import AmountInput from '@/components/Amount/Input';
import CountInput from '@/components/CountInput';
import DataContent from '@/components/PubServiceCard/DataContent';
import { formatTimeDuration, formatDate, encodeMoney, decodeMoney, formatModel } from '@/utils/format';
import { getPageQuery, formItemLayoutNormal } from '@/utils/utils';
import style from './index.less';

const { isCalcPriceKey } = DataContent;

@connect(({ pubservice, orderprocessing, venue }) => ({
  pubservice,
  orderprocessing,
  venue,
}))
@Form.create({
  // field 包含除了值以外的一些其他状态，它们变化了也会触发
  onFieldsChange({ form }, changedFields, allFields) {
    const changedValues = {};
    Object.keys(changedFields).forEach(key => {
      changedValues[key] = changedFields[key].value;
    });
    //  如果服务销售金额变化
    if ('price' in changedValues) {
      // 多个组合动态表单名是serviceValueId-propName的格式
      // 触发动态字段验证
      setTimeout(() => {
        form.validateFieldsAndScroll(Object.keys(allFields).filter(isCalcPriceKey));
      }, 0);
    }
  },
})
class Sell extends Component {
  submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  static contextTypes = {
    isAuthorized: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
  };

  async componentDidMount() {
    const {
      dispatch,
      match: { params },
      orderprocessing: { dealInfo },
    } = this.props;
    await dispatch({
      type: 'pubservice/fetchOne',
      payload: params.id,
    });
    const { id } = getPageQuery();
    if (dealInfo == null && id) {
      await dispatch({
        type: 'orderprocessing/fetchOrder',
        payload: {
          switchEnv: true,
        },
      });
    }
  }

  // 准备后面需要的表单数据
  flushFormData = (dealServicePubSnapList, serviceValueId, dataObj) => {
    if (serviceValueId == null || dataObj == null) {
      return;
    }
    const {
      pubservice: { cacheMapping },
      match: { params },
    } = this.props;
    const { pubServiceDataList = [] } = cacheMapping[params.id] || {};
    const snap = pubServiceDataList.find(item =>
      (item.pubServiceValueList || []).some(subItem => subItem.id === serviceValueId)
    );
    if (snap == null) {
      return;
    }
    const dealSnap = dealServicePubSnapList.find(item => item.serviceDataId === snap.id);
    const valueItem = {
      serviceValueId,
      ...dataObj,
    };
    if (dealSnap == null) {
      dealServicePubSnapList.push({
        serviceDataId: snap.id,
        dealServicePubValueList: [valueItem],
      });
    } else {
      const findValueItem = dealSnap.dealServicePubValueList.find(item => item.serviceValueId === serviceValueId);
      // 如果有则直接写属性
      if (findValueItem) {
        Object.assign(findValueItem, dataObj);
      } else {
        dealSnap.dealServicePubValueList.push(valueItem);
      }
    }
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const {
      form,
      venue: { currentVenue },
      match: { params },
      pubservice: { cacheMapping },
      dispatch,
    } = this.props;
    const { getNextStepPath } = this.context;
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const dealServicePubSnapList = [];
      const {
        selectPubStudy,
        validFace,
        pubService: { serviceName },
      } = cacheMapping[params.id] || {};
      // 多个组合动态表单名是serviceValueId-propName的格式
      Object.entries(formData).forEach(([key, value]) => {
        let serviceValueId = +key;
        if (Number.isFinite(serviceValueId)) {
          this.flushFormData(dealServicePubSnapList, serviceValueId, {
            serviceValue: encodeMoney(value), // 操作的数据都除以了100显示
          });
          return;
        }
        const kv = key.split('-');
        if (kv.length !== 2) {
          return;
        }
        serviceValueId = +kv[0];
        const propName = kv[1];
        this.flushFormData(dealServicePubSnapList, serviceValueId, {
          [propName]: encodeMoney(value), // 操作的数据都除以了100显示
        });
      });

      const { serviceAmount, price, buyNum, descr } = formData;

      dispatch({
        type: 'pubserviceselling/pubServiceNextStep',
        payload: {
          list: [
            // 冗余一些字段给人脸采集时用
            {
              selectPubStudy,
              // 会员服务暂不支持 validPubStudy
              validFace,
              salesId: currentVenue.id,
              serviceId: +params.id,
              serviceAmount: encodeMoney(serviceAmount), // 操作的数据都除以了100显示
              transactionPrice: encodeMoney(price), // 操作的数据都除以了100显示
              dealServicePubSnapList,
              serviceName,
              buyNum,
            },
          ],
          sellerMessage: descr,
        },
      }).then(() => {
        dispatch(push(getNextStepPath()));
      });
    });
  };

  render() {
    const { isAuthorized } = this.context;
    const {
      pubservice: { cacheMapping, ServiceTagTypes, ServiceTypes },
      orderprocessing: { dealInfo },
      venue: { currentVenue },
      match: { params },
      form,
    } = this.props;
    const info = cacheMapping[params.id];
    if (info == null) {
      return null;
    }
    const { dealServicePubList, deal: cacheDeal } = dealInfo || {};
    const { pubService, pubServiceDataList } = info;
    const {
      id,
      serviceType,
      price,
      serviceName,
      descr,
      serviceTag,
      serviceUseMode,
      serviceAmount,
      serviceValid,
      startDate,
      endDate,
      serviceValidSalesName,
    } = pubService || {};
    const cacheDealServicePub = (dealServicePubList || []).find(
      item => item.serviceId === id && item.salesId === currentVenue.id
    );
    const cacheDealServicePubSnapList = cacheDealServicePub?.dealServicePubSnapList;

    // 存在缓存替换价格
    const finalPubServiceDataList =
      cacheDealServicePubSnapList == null || cacheDealServicePubSnapList.length === 0
        ? pubServiceDataList
        : pubServiceDataList.map(item => {
            const cache = cacheDealServicePubSnapList.find(citem => citem.serviceDataId === item.id);
            if (cache == null) {
              return item;
            }
            return {
              ...item,
              pubServiceValue: item.pubServiceValueList.map(vitem => {
                const vcache = cache.dealServicePubValueList.find(cvitem => cvitem.serviceValueId === vitem.id);
                if (vcache == null) {
                  return vitem;
                }
                return {
                  ...vitem,
                  serviceValue: vcache.serviceValue,
                };
              }),
            };
          });

    const type = Object.values(ServiceTypes).find(item => item.key === serviceType) || {};

    const disabled = !isAuthorized('edit-amount');

    // 服务销售金额
    const initialValueSellTotalPrice = decodeMoney(cacheDealServicePub ? cacheDealServicePub.transactionPrice : price);
    let sellTotalPrice = form.getFieldValue('price');
    if (sellTotalPrice == null) {
      sellTotalPrice = initialValueSellTotalPrice;
    }
    const initialValueNum = cacheDealServicePub?.buyNum || 1;

    const buyNum = form.getFieldValue('buyNum');
    return (
      <PageHeaderLayout title="服务销售">
        <Card
          bordered={false}
          bodyStyle={{
            paddingBottom: 0,
          }}
        >
          <Row>
            <Col md={8} xs={24}>
              <VenueSwitcher />
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col md={24} lg={8}>
              <MarginBar bottom>
                <Card bordered={false} className={style.card}>
                  <h1>{serviceName}</h1>
                  <h3>{descr}</h3>
                  <MarginBar top={24}>
                    <h3>[{formatModel(ServiceTagTypes, serviceTag)}]</h3>
                  </MarginBar>
                </Card>
              </MarginBar>
            </Col>
            <Col md={24} lg={16}>
              <Form {...formItemLayoutNormal} onSubmit={this.handleFormSubmit}>
                <Card
                  title="服务说明"
                  bordered={false}
                  headStyle={{
                    background: '#fafafa',
                  }}
                  extra={
                    <div>
                      销售张数
                      <MarginBar inline left>
                        {form.getFieldDecorator('buyNum', {
                          initialValue: initialValueNum,
                          rules: [
                            {
                              required: true,
                              message: '请填写数量',
                            },
                          ],
                        })(<CountInput size="default" width={130} min={1} />)}
                      </MarginBar>
                      <MarginBar inline left>
                        <Button type="primary" disabled={!(buyNum > 0)} onClick={this.handleFormSubmit}>
                          立即购买
                        </Button>
                      </MarginBar>
                    </div>
                  }
                >
                  <DataContent
                    pubServiceDataList={finalPubServiceDataList}
                    editable={!disabled}
                    form={form}
                    sellTotalPrice={sellTotalPrice}
                    serviceUseMode={serviceUseMode}
                  />
                  <Divider />
                  <Form.Item label="服务储值金额(元)">
                    {form.getFieldDecorator('serviceAmount', {
                      initialValue: decodeMoney(
                        cacheDealServicePub ? cacheDealServicePub.serviceAmount : serviceAmount
                      ),
                      rules: [
                        {
                          required: true,
                          message: '请填写金额',
                        },
                      ],
                    })(<AmountInput className={style.input} fullWidth min={0} precision={2} />)}
                  </Form.Item>
                  <Form.Item label="服务销售金额(元)">
                    {form.getFieldDecorator('price', {
                      initialValue: initialValueSellTotalPrice,
                      rules: [
                        {
                          required: true,
                          message: '请填写金额',
                        },
                      ],
                    })(<AmountInput disabled={disabled} className={style.input} fullWidth min={0} precision={2} />)}
                  </Form.Item>
                  <Form.Item label="服务有效期类型">
                    <Input value={type.value} readOnly disabled />
                  </Form.Item>
                  <Form.Item label="服务有效期(天)">
                    <Input
                      value={(() => {
                        switch (type.key) {
                          case ServiceTypes.DYNAMICINVISIBLE.key:
                            return formatTimeDuration(serviceValid);
                          case ServiceTypes.FIXATIONINVISIBLE.key:
                            return `${formatDate(startDate)}至${formatDate(endDate)}`;
                          default:
                            return '';
                        }
                      })()}
                      readOnly
                      disabled
                    />
                  </Form.Item>
                  <Form.Item label="服务有效场馆">
                    <Input value={serviceValidSalesName} readOnly disabled />
                  </Form.Item>
                  <Form.Item label="商家留言">
                    {form.getFieldDecorator('descr', {
                      initialValue: cacheDeal ? cacheDeal.sellerMessage : null,
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                  {/* <Form.Item {...this.submitFormLayout}>
                    <Button type="primary" htmlType="submit">
                      立即购买
                    </Button>
                  </Form.Item> */}
                </Card>
              </Form>
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Sell;
