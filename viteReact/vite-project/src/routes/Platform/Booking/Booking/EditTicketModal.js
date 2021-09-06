import { Component } from 'react';
import uniqWith from 'lodash/unionWith';
import { Form } from 'antd';
import { connect } from 'react-redux';
import Modal from '@/components/Modal';
import CountInput from '@/components/CountInput';
import { formatHM } from '@/utils/format';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ booking }) => ({
  booking,
}))
@Form.create()
class EditTicketModal extends Component {
  sure = ({ deepCallOk }) => {
    const { onOk, form, list, booking } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const { sportPlatformInfo = {} } = booking;
      const sportPlatformList = sportPlatformInfo?.sportPlatformList || [];
      const arr = uniqWith(
        list.map(item => {
          let platform = sportPlatformList.find(plt => plt.id === item.platformId);
          if (platform == null) {
            return item;
          }
          if (platform.parentId) {
            platform = sportPlatformList.find(plt => plt.id === platform.parentId);
            if (platform == null) {
              return item;
            }
          }
          return {
            ...item,
            platformId: platform.id,
          };
        }),
        (a, b) => a.platformId === b.platformId && a.startTime === b.startTime
      );
      deepCallOk(onOk, formData, arr);
    });
    return false;
  };

  render() {
    const { form, list, booking, onOk, ...restProps } = this.props;
    const { sportPlatformInfo = {} } = booking;
    const sportPlatformList = sportPlatformInfo?.sportPlatformList || [];

    const { getFieldDecorator } = form;
    const keysMapping = {};
    (list || []).forEach(item => {
      let platform = sportPlatformList.find(plt => plt.id === item.platformId);
      if (platform == null) {
        return;
      }
      if (platform.parentId) {
        platform = sportPlatformList.find(plt => plt.id === platform.parentId);
        if (platform == null) {
          return;
        }
      }
      keysMapping[platform.id] = keysMapping[platform.id] || {};
      const obj = keysMapping[platform.id];
      Object.assign(obj, {
        ...obj,
        platformId: obj.platformId || item.platformId,
        parentPlatformName: platform.parentPlatformName,
        platformName: platform.platformName,
        list: obj.list || [],
      });
      if (!obj.list.some(it => it.startTime === item.startTime)) {
        obj.list.push(item);
      }
    });
    return (
      <Modal title="修改可售票数" {...restProps} onOk={this.sure}>
        <Form {...formItemLayoutNormal}>
          <Form.Item label="调整时段">
            {Object.values(keysMapping).map(item => (
              <div key={item.platformId}>
                <h3>
                  {item.parentPlatformName && `${item.parentPlatformName}-`}
                  {item.platformName}
                </h3>
                <div>
                  {(item.list || [])
                    .map(listItem => `${formatHM(listItem.startTime)}-${formatHM(listItem.endTime)}`)
                    .join('; ')}
                </div>
              </div>
            ))}
          </Form.Item>
          <Form.Item label="可售票数">
            {getFieldDecorator('number', {
              rules: [
                {
                  required: true,
                  message: '请填写数量',
                },
              ],
            })(<CountInput size="large" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditTicketModal;
