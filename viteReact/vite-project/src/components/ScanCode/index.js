import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input, Row, Col } from 'antd';
import { isPDA, isWeiXin } from '@/utils/utils';
import MarginBar from '../MarginBar';
import IconFont from '../Icon';
import styles from './index.less';

function ScanCode({ checkFn = () => {}, onShowTipChange = () => {} }, { scanQRCode }) {
  const inPDA = isPDA();
  const inWeiXin = isWeiXin();
  const [inputValue, setInputValue] = useState();
  const [textInput, setTextInput] = useState();

  const doCheck = useCallback(val => {
    setInputValue('');
    onShowTipChange(false);
    if (val.trim().length === 0) {
      return;
    }
    checkFn(val);
  }, []);

  function focusIt() {
    if (textInput) {
      textInput.focus();
    }
  }

  useEffect(focusIt, [textInput]);
  return (
    <div>
      <Input.Search
        enterButton="确认"
        placeholder="请打开扫码枪扫描二维码"
        size="large"
        value={inputValue}
        ref={setTextInput}
        onChange={e => setInputValue(e.target.value)}
        onPressEnter={e => doCheck(e.target.value)}
        onSearch={val => doCheck(val)}
      />
      <Row gutter={8}>
        {inPDA || inWeiXin ? null : (
          <Col md={12}>
            <MarginBar top>
              <div
                className={classNames(styles.checkTypeCard, styles.gunScanner)}
                onClick={() => {
                  setInputValue('');
                  onShowTipChange(false);
                  focusIt();
                }}
              >
                <IconFont type="qrgun-scan" />
                <div className={styles.typeCardTop}>扫码枪</div>
                <div className="text-overflow">请使用扫码枪扫二维码</div>
              </div>
            </MarginBar>
          </Col>
        )}
        <Col md={12}>
          <MarginBar top>
            <div
              className={classNames(styles.checkTypeCard, styles.wxScanner, {
                [styles.pdaScanner]: inPDA,
              })}
              onClick={() => {
                setInputValue('');
                if (scanQRCode(doCheck)) {
                  return;
                }
                onShowTipChange(true);
              }}
            >
              <IconFont type={inPDA ? 'pda-scan' : 'wechat'} />
              <div className={styles.typeCardTop}>{inPDA ? 'PDA' : '微信'}扫码</div>
              <div className="text-overflow">请使用{inPDA ? 'PDA' : '微信扫一扫'}扫二维码</div>
            </div>
          </MarginBar>
        </Col>
      </Row>
    </div>
  );
}

ScanCode.contextTypes = {
  scanQRCode: PropTypes.func,
};

export default ScanCode;
