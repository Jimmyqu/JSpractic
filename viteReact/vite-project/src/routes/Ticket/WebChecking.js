import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Button, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import MarginBar from '@/components/MarginBar';
import TicketCheckResult from '@/components/TicketCheckResult';
import FooterToolbar from '@/components/FooterToolbar';
import Block from '@/components/Block';
import ScanCode from '@/components/ScanCode';
import WeixinSubscribeQrCodeTip from '@/components/ScanCode/WeixinSubscribeQrCodeTip';
import { isPDA, print } from '@/utils/utils';
import styles from './index.less';

function WebChecking({ form }, { playVerifyAudio }) {
  const inPDA = isPDA();
  const [showQrCode, setShowQrCode] = useState(false);
  const [ticketQueryInfo, setTicketQueryInfo] = useState();
  const [isVerify, setIsVerify] = useState(false);

  const dispatch = useDispatch();

  const { RelTypes } = useSelector(state => state.global);
  const fetching = useSelector(state => state.loading.effects['global/queryByCode']);
  const verifying = useSelector(state => state.loading.effects['global/verifyTicket']);

  const reset = useCallback(() => {
    setIsVerify(false);
    setTicketQueryInfo(null);
    setShowQrCode(false);
  }, []);

  const queryInfo = useCallback(async code => {
    reset();
    let result;
    try {
      result = await dispatch({
        type: 'global/queryByCode',
        payload: {
          code,
          // 不提供action则不要求匹配，所有码都正确识别
          // action: QrCodeMatrixActions.?.key,
        },
      });
    } catch {
      playVerifyAudio(false);
      return;
    }
    setTicketQueryInfo(result);
  }, []);

  // success 查询的时候代表能不能验，验证的时候代表是否成功
  const { data, message, success: suc } = ticketQueryInfo || {};

  const {
    id,
    dealId,
    relType,
    totalNum,
    checkedNum,
    displayCheckPersonNum,
    salesName,
    startTime,
    calendarType,
    fromDate,
    toDate,
    seatDataName,
    validCode,
  } = data || {};

  const availableNum = totalNum - checkedNum || 0;
  const isVerifiable = suc && availableNum > 0;
  // 是活动票务
  const isTicket = relType === RelTypes.DEALTICKET.key;

  const pdaPrint = useCallback(() => {
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
  }, [data]);

  // 核验
  async function check(all) {
    if (!isVerifiable) {
      return;
    }
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { checkPersonNum } = formData;
      let result;
      try {
        result = await dispatch({
          type: 'global/verifyTicket',
          payload: {
            dataId: id || dealId, // 场地 时没有id,提供dealId
            relType,
            checkedNumState: all,
            checkPersonNum,
          },
        });
      } catch {
        playVerifyAudio(false);
        return;
      }
      if (result) {
        playVerifyAudio(result.success);
        setIsVerify(true);
        setTicketQueryInfo(result);
      }
    });
  }

  return (
    <PageHeaderLayout>
      <Row>
        <Col md={6} />
        <Col md={12}>
          <Card>
            <Row>
              <Col md={3} />
              <Col md={18}>
                <Block title="在线验票">
                  <ScanCode checkFn={queryInfo} onShowTipChange={setShowQrCode} />
                </Block>
                <Block>
                  <div className="text-center">
                    <div>微信扫码</div>
                    <div>指定时间段或场次核验请选择业务类型</div>
                    <div>
                      <MarginBar top inline>
                        <Button onClick={() => dispatch(push('/basic/ticket/scanchecking/list'))}>活动票务</Button>
                      </MarginBar>
                      <MarginBar top left inline>
                        <Button onClick={() => dispatch(push('/basic/platform/booking/booking'))}>场地/场地票务</Button>
                      </MarginBar>
                    </div>
                  </div>
                </Block>
                {showQrCode ? (
                  <WeixinSubscribeQrCodeTip />
                ) : (
                  (data || fetching) && (
                    <Block title="核验信息">
                      <div className={styles.checkResutBody}>
                        <TicketCheckResult
                          data={data}
                          message={message}
                          success={isVerifiable}
                          isVerify={isVerify}
                          form={displayCheckPersonNum && isVerifiable ? form : null}
                        />
                      </div>
                    </Block>
                  )
                )}
              </Col>
              <Col md={3} />
            </Row>
          </Card>
        </Col>
        <Col md={6} />
      </Row>
      {data && !showQrCode && (
        <FooterToolbar>
          <Button disabled={fetching || verifying} onClick={reset}>
            {isVerify ? '关闭' : '取消'}
          </Button>
          {inPDA && isTicket && isVerify && (
            <MarginBar left top inline>
              <Button disabled={fetching || verifying} onClick={pdaPrint}>
                打印
              </Button>
            </MarginBar>
          )}
          {isVerify && (
            <MarginBar left top inline>
              <Button disabled={fetching || verifying} onClick={() => dispatch(push('/basic/device/logs'))}>
                所有核验记录
              </Button>
            </MarginBar>
          )}
          {isVerifiable &&
            !isVerify && [
              totalNum - checkedNum > 1 && (
                <MarginBar left top inline key="split">
                  <Button type="primary" loading={verifying} onClick={() => check(false)}>
                    拆分核验
                  </Button>
                </MarginBar>
              ),
              <MarginBar left top inline key="all">
                <Button type="primary" loading={verifying} onClick={() => check(true)}>
                  {totalNum - checkedNum > 1 ? '合并核验' : '确认核验'}
                </Button>
              </MarginBar>,
            ]}
        </FooterToolbar>
      )}
    </PageHeaderLayout>
  );
}

WebChecking.contextTypes = {
  playVerifyAudio: PropTypes.func,
};

export default Form.create()(WebChecking);
