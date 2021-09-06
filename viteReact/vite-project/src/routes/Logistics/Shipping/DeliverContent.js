import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Divider, Select, Input, Radio, message } from 'antd';
import Content from '@/components/Datatable/Content';
import MarginBar from '@/components/MarginBar';
import { formatHomeTown } from '@/utils/format';
import { checkNumber, checkMobile } from '@/commons/lib/validator';
import ShippingEditModal from './ShippingEditModal';
import styles from './index.less';

@connect(({ logistics, loading }) => ({
  logistics,
  deliverInfoFetching: loading.effects['logistics/fetchDeliverInfo'],
  delivering: loading.effects['logistics/deliver'],
}))
@Form.create()
class DeliverContent extends Component {
  state = {
    deliverInfo: undefined,
    editorModalVisible: false,
  };

  formItemLayout = {
    labelCol: {
      xs: {
        span: 6,
      },
      md: {
        span: 4,
      },
      lg: {
        span: 3,
      },
    },
    wrapperCol: {
      xs: {
        span: 18,
      },
      md: {
        span: 20,
      },
      lg: {
        span: 21,
      },
    },
  };

  formItemLayoutHalf = {
    labelCol: {
      xs: {
        span: 6,
      },
      md: {
        span: 4,
      },
      lg: {
        span: 3,
      },
    },
    wrapperCol: {
      xs: {
        span: 6,
      },
      md: {
        span: 8,
      },
      lg: {
        span: 9,
      },
    },
  };

  async componentDidMount() {
    const { dispatch, selectedRows } = this.props;
    const { id } = (selectedRows || [])[0] || {};
    const result = await dispatch({
      type: 'logistics/fetchDeliverInfo',
      payload: id,
    });
    if (result) {
      this.setState({
        deliverInfo: result,
      });
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  doSure = () => {
    const { form, dispatch, sure = result => result, selectedRows } = this.props;
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'logistics/deliver',
        payload: {
          ...formData,
          dealShippingId: selectedRows[0].id,
        },
      }).then(sure);
    });
  };

  showEditor = () => {
    this.handleEditorModalVisibleChange(true);
  };

  handleEditorModalVisibleChange = editorModalVisible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      editorModalVisible,
    });
  };

  onEditDone = () => {
    message.success('修改成功');
    const { reload } = this.props;
    if (reload) {
      this.handleEditorModalVisibleChange(false);
      reload();
    }
  };

  render() {
    const {
      form,
      dispatch,
      deliverInfoFetching,
      delivering,
      cancel = () => {},
      sure,
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      logistics: { ExpressCompanys },
      ...restProps
    } = this.props;
    const { deliverInfo, editorModalVisible } = this.state;
    const {
      commonSalesList,
      province,
      city,
      district,
      consigneeAddress,
      consigneeName,
      consigneeMobile,
      dealAddress,
      shipperName,
      shipperMobile,
      dealDescription,
    } = deliverInfo || {};
    const defaultSales = (commonSalesList || [])[0] || {};
    return (
      <Content
        title="发货"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: deliverInfoFetching || delivering,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            disabled: deliverInfoFetching,
            loading: delivering,
            action: this.doSure,
          },
        ]}
      >
        <Form layout="vertical">
          <Sub title="订单信息">
            <Form.Item>{dealDescription}</Form.Item>
          </Sub>
          <Divider />
          <Sub title="收件信息">
            <Form.Item {...this.formItemLayout} label="收件人">
              {consigneeName}&nbsp;{consigneeMobile}&nbsp;
              {formatHomeTown(province)}
              {formatHomeTown(city)}
              {formatHomeTown(district)}
              {consigneeAddress}
              <MarginBar inline left>
                <span className="link" onClick={this.showEditor}>
                  修改
                </span>
              </MarginBar>
            </Form.Item>
            {dealAddress &&
              (dealAddress.province !== province ||
                dealAddress.city !== city ||
                dealAddress.district !== district ||
                dealAddress.detailAddress !== consigneeAddress ||
                dealAddress.realName !== consigneeName ||
                dealAddress.mobile !== consigneeMobile) && (
                <Form.Item {...this.formItemLayout} label="原收货地址">
                  {dealAddress.realName}&nbsp;{dealAddress.mobile}&nbsp;
                  {formatHomeTown(dealAddress.province)}
                  {formatHomeTown(dealAddress.city)}
                  {formatHomeTown(dealAddress.district)}
                  {dealAddress.detailAddress}
                </Form.Item>
              )}
          </Sub>
          <Divider />
          <Sub title="物流信息">
            <Form.Item {...this.formItemLayoutHalf} label="物流公司">
              {form.getFieldDecorator('shippingCompanyId', {
                rules: [
                  {
                    required: true,
                    message: '请选择物流公司',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {Object.values(ExpressCompanys).map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...this.formItemLayoutHalf} label="物流单号">
              {form.getFieldDecorator('shippingNo', {
                rules: [
                  {
                    required: true,
                    message: '请填写物流单号',
                  },
                  {
                    message: '物流单号只能为纯数字',
                    validator: checkNumber,
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item {...this.formItemLayoutHalf} label="备注">
              {form.getFieldDecorator('descr')(<Input.TextArea rows={6} autoSize maxLength={500} />)}
            </Form.Item>
          </Sub>
          <Divider />
          <Sub title="寄件信息">
            <Form.Item {...this.formItemLayoutHalf} label="寄件人">
              {form.getFieldDecorator('shipperName', {
                initialValue: shipperName,
                rules: [
                  {
                    required: true,
                    message: '请填写寄件人',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item {...this.formItemLayoutHalf} label="寄件人手机号">
              {form.getFieldDecorator('shipperMobile', {
                initialValue: shipperMobile,
                rules: [
                  {
                    required: true,
                    message: '请填写寄件人手机号',
                  },
                  {
                    message: '物流单号只能为纯数字',
                    validator: checkMobile,
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('salesId', {
                initialValue: defaultSales.id,
                rules: [
                  {
                    required: true,
                    message: '请选择寄件信息',
                  },
                ],
              })(
                <Radio.Group>
                  {(commonSalesList || []).map(({ id, salesName, province: p, city: c, district: d, salesAddress }) => (
                    <Radio key={id} value={id} className={styles.radioBlock}>
                      {salesName}&nbsp;{shipperName}&nbsp;{shipperMobile}&nbsp;
                      {formatHomeTown(p)}
                      {formatHomeTown(c)}
                      {formatHomeTown(d)}
                      {salesAddress}
                    </Radio>
                  ))}
                </Radio.Group>
              )}
            </Form.Item>
          </Sub>
        </Form>

        <ShippingEditModal
          data={deliverInfo}
          visible={editorModalVisible}
          onVisibleChange={this.handleEditorModalVisibleChange}
          onOk={this.onEditDone}
        />
      </Content>
    );
  }
}

function Sub({ title, children }) {
  return (
    <Row>
      <Col xs={6} md={4} lg={2} className="text-right">
        {title}
      </Col>
      <Col xs={18} md={20} lg={22}>
        &nbsp;
      </Col>
      <Col xs={6} md={4} lg={2}>
        &nbsp;
      </Col>
      <Col xs={18} md={20} lg={22}>
        {children}
      </Col>
    </Row>
  );
}

export default DeliverContent;
