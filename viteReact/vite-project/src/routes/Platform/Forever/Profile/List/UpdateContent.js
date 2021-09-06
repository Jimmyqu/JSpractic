import { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col, Form } from 'antd';
import Content from '@/components/Datatable/Content';
import Item, { ItemTypes } from '@/components/Datatable/Item';
import { formatDate } from '@/utils/format';
import { formItemLayoutNormal } from '@/utils/utils';
import ResultModal from '../ResultModal';

@connect(({ pubplatform, loading }) => ({
  pubplatform,
  editing: loading.effects['pubplatform/editPlatformForeverDatePeriod'],
}))
@Form.create()
class UpdateContent extends Component {
  state = {
    visible: false,
    result: undefined,
  };

  handleVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  doSure = () => {
    const { form, dispatch, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const result = await dispatch({
        type: 'pubplatform/editPlatformForeverDatePeriod',
        payload: {
          sportPlatformForeverId: selectedRows[0].sportPlatformForeverId,
          startDate: formData.startDate.valueOf(),
          endDate: formData.endDate.valueOf(),
        },
      });
      if (result) {
        this.setState({
          result,
          visible: true,
        });
      }
    });
  };

  sure = () => {
    const { sure = () => {} } = this.props;
    setTimeout(() => {
      sure();
    }, 0);
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      editing,
      pubplatform,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { visible, result } = this.state;
    return (
      <Content
        title="更新固定场"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: editing,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: editing,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="有效区间">
                {formatDate(selectedRows[0].timeTag.startDate)}至{formatDate(selectedRows[0].timeTag.endDate)}
              </Form.Item>
              <Form.Item label="开始时间">
                {form.getFieldDecorator('startDate', {
                  initialValue: moment(selectedRows[0].startDate),
                })(
                  <Item
                    compose="1"
                    type={ItemTypes.DatePickerRangeStart}
                    form={form}
                    min={moment(Math.max(selectedRows[0].timeTag.startDate))}
                    composeStateMapping={composeStateMapping}
                    handleComposeStateChange={handleComposeStateChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="结束时间">
                {form.getFieldDecorator('endDate', {
                  initialValue: moment(selectedRows[0].endDate),
                })(
                  <Item
                    compose="1"
                    type={ItemTypes.DatePickerRangeEnd}
                    form={form}
                    max={moment(selectedRows[0].timeTag.endDate)}
                    composeStateMapping={composeStateMapping}
                    handleComposeStateChange={handleComposeStateChange}
                  />
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <ResultModal
          title="设置结果-固定场"
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          data={result}
          onOk={this.sure}
          onCancel={this.sure}
        />
      </Content>
    );
  }
}

export default UpdateContent;
