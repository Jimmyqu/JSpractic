import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Upload, Button, Divider, Input, Radio } from 'antd';
import Content from '@/components/Datatable/Content';
import MarginBar from '@/components/MarginBar';
import { FileAccept, formUploadOtherProps } from '@/utils/upload';
import { formatHomeTown } from '@/utils/format';
import { checkUpload } from '@/commons/lib/validator';
import ConfirmDeliverModal from './ConfirmDeliverModal';
import styles from './index.less';

@connect(({ logistics, loading }) => ({
  logistics,
  shippingSalesInfoFetching: loading.effects['logistics/fetchShippingSalesInfo'],
  postBatchDelivering: loading.effects['logistics/postBatchDeliver'],
}))
@Form.create()
class DeliverBatchContent extends Component {
  state = {
    shippingSalesInfo: undefined,
    confirmData: undefined,
    confirmDeliverModalVisible: false,
    file: undefined,
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
      type: 'logistics/fetchShippingSalesInfo',
      payload: id,
    });
    if (result) {
      this.setState({
        shippingSalesInfo: result,
      });
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  doSure = () => {
    const { form, dispatch } = this.props;
    const { file } = this.state;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const result = await dispatch({
        type: 'logistics/postBatchDeliver',
        payload: {
          ...formData,
          file,
        },
      });
      if (result) {
        this.setState({
          confirmData: result,
          confirmDeliverModalVisible: true,
        });
        // sure(result);
      }
    });
  };

  showEditor = () => {
    this.handleEditorModalVisibleChange(true);
  };

  handleconfirmDeliverModalVisibleChange = confirmDeliverModalVisible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      confirmDeliverModalVisible,
    });
  };

  onEditDone = () => {
    const { reload } = this.props;
    if (reload) {
      reload();
    }
  };

  beforeUpload = file => {
    this.setState({
      file,
    });
    return false;
  };

  onRemove = () => {
    this.setState({
      file: undefined,
    });
  };

  onConfirm = arg => {
    const { sure = () => {}, dispatch } = this.props;
    const { confirmData } = this.state;
    const { effectiveNum, codeDynamic } = confirmData;
    if (effectiveNum > 0) {
      arg.deepCallOk(() => {
        return dispatch({
          type: 'logistics/deliverBatch',
          payload: codeDynamic,
        }).then(() => {
          this.handleconfirmDeliverModalVisibleChange(false);
          sure(effectiveNum);
        });
      });
      return;
    }
    sure(effectiveNum);
  };

  render() {
    const {
      form,
      dispatch,
      shippingSalesInfoFetching,
      postBatchDelivering,
      cancel = () => {},
      sure,
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      logistics,
      ...restProps
    } = this.props;
    const { file, shippingSalesInfo, confirmData, confirmDeliverModalVisible } = this.state;
    const { commonSalesList, shipperName, shipperMobile } = shippingSalesInfo || {};
    const defaultSales = (commonSalesList || [])[0] || {};
    return (
      <Content
        title="批量发货"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: shippingSalesInfoFetching || postBatchDelivering,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            disabled: shippingSalesInfoFetching,
            loading: postBatchDelivering,
            action: this.doSure,
          },
        ]}
      >
        <Form>
          批量导入发货表格
          <div className={styles.batchContent}>
            <MarginBar top className={styles.batchWarning}>
              从发货列表筛选待发货列表导出，填写物流公司和物流单号后上传
            </MarginBar>
            <MarginBar top>
              <Form.Item>
                <Row>
                  <Col md={12}>
                    {form.getFieldDecorator('file', {
                      ...formUploadOtherProps,
                      rules: [
                        {
                          required: true,
                          validator: checkUpload,
                        },
                      ],
                    })(
                      <Upload accept={FileAccept.XLS} beforeUpload={this.beforeUpload} onRemove={this.onRemove}>
                        <Button type="primary" icon="upload" disabled={file != null}>
                          上传
                        </Button>
                      </Upload>
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </MarginBar>
            <MarginBar top>上传附件格式为：xls,xlsx,ppt,pptx,docx,doc,pdf</MarginBar>
          </div>
          <Divider />
          <div className={styles.batchContent}>
            <Form.Item {...this.formItemLayoutHalf} label="发货人姓名">
              {form.getFieldDecorator('shipperName', {
                initialValue: shipperName,
                rules: [
                  {
                    required: true,
                    message: '请选择发货地址',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item {...this.formItemLayoutHalf} label="发货人手机号">
              {form.getFieldDecorator('shipperMobile', {
                initialValue: shipperMobile,
                rules: [
                  {
                    required: true,
                    message: '请选择发货地址',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <MarginBar top className={styles.batchWarning}>
              *注意：您所导入的订单，只能统一是一个发货人信息；系统将默认配置输入框中发货人、发货手机号和选择的地址！
            </MarginBar>
          </div>
          <MarginBar top bottom>
            选择发货地址
          </MarginBar>
          <div className={styles.batchContent}>
            <Form.Item>
              {form.getFieldDecorator('salesId', {
                initialValue: defaultSales.id,
                rules: [
                  {
                    required: true,
                    message: '请选择发货地址',
                  },
                ],
              })(
                <Radio.Group>
                  {(commonSalesList || []).map(({ id, salesName, province, city, district, salesAddress }) => (
                    <Radio key={id} value={id} className={styles.radioBlock}>
                      {salesName}&nbsp;
                      {formatHomeTown(province)}
                      {formatHomeTown(city)}
                      {formatHomeTown(district)}
                      {salesAddress}
                    </Radio>
                  ))}
                </Radio.Group>
              )}
            </Form.Item>
          </div>
        </Form>
        <ConfirmDeliverModal
          data={confirmData}
          visible={confirmDeliverModalVisible}
          onVisibleChange={this.handleconfirmDeliverModalVisibleChange}
          onOk={this.onConfirm}
        />
      </Content>
    );
  }
}

export default DeliverBatchContent;
