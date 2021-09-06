import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, message } from 'antd';
import { isPDA, print } from '@/utils/utils';
import TicketCheckResult from '../TicketCheckResult';
import Modal from '.';

@connect(({ loading, global }) => ({
  verifying: loading.effects['global/verifyTicket'],
  RelTypes: global.RelTypes,
}))
@Form.create()
class TicketCheckResultModal extends Component {
  inPda = isPDA();

  sure = () => {
    const { onOk } = this.props;
    if (typeof onOk === 'function') {
      onOk();
    }
  };

  doVerifying = () => {
    const { onVerify, form } = this.props;
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const { checkPersonNum } = formData;
      onVerify(checkPersonNum);
    });
  };

  pdaPrint = () => {
    const { result } = this.props;
    const { dealId, salesName, seatDataName, validCode, fromDate, toDate, calendarType, startTime } =
      result?.data || {};
    print({
      deal: {
        id: dealId,
        salesName,
      },
      dealTicketList: [
        {
          startTime,
          calendarType,
          fromDate,
          toDate,
          seatDataName,
          matrix: {
            validCode,
          },
        },
      ],
    }).catch(e => {
      message.error(`打印异常：${e.message}`);
    });
  };

  render() {
    const { result, onVerify, verifying, form, RelTypes, ...restProps } = this.props;
    const { data, success, message: msg, isSignPlatform, isVerify } = result || {};
    const { totalNum, checkedNum, displayCheckPersonNum, relType } = data || {};
    const availableNum = totalNum - checkedNum || 0;
    const isVerifiable = success && availableNum > 0;
    // 是活动票务
    const isTicket = relType === RelTypes.DEALTICKET.key;

    const footer = [
      isVerifiable && onVerify && !isVerify ? (
        <Button size="large" key="primary" type="primary" loading={verifying} onClick={this.doVerifying}>
          核 验
        </Button>
      ) : null,
      this.inPda && isTicket && isVerify && !isSignPlatform && (
        <Button size="large" key="print" disabled={verifying} onClick={this.pdaPrint}>
          打 印
        </Button>
      ),
      isVerify && !isSignPlatform && (
        <Button size="large" key="ok" link="ok" disabled={verifying}>
          继 续 验 票
        </Button>
      ),
    ].filter(Boolean);
    return (
      <Modal title="验证" footer={footer.length === 0 ? null : footer} {...restProps} onOk={this.sure}>
        <TicketCheckResult
          data={data}
          message={msg}
          success={success}
          isVerify={isVerify}
          form={displayCheckPersonNum && isVerifiable ? form : null}
        />
      </Modal>
    );
  }
}

export default TicketCheckResultModal;
