import { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Card, Form, Upload, Radio, Input } from 'antd';
import ColorPicker from '@/components/Form/FormItem/ColorPicker';
import Result from '@/components/Result';
import MarginBar from '@/components/MarginBar';
import AuthComponent from '@/components/AuthComponent';
import { formItemLayoutNormal, submitFormLayoutNormal } from '@/utils/utils';
import { FileAccept, formUploadOtherProps, formFileMapper } from '@/utils/upload';
import { useServerCache, useUploadImgRequest } from '@/utils/hooks';
import HorizontalCard from './HorizontalCard';
import createCardView from './createCardView';
import styles from './index.less';

const cacheKeyPrefix = 'printCard-';

const PresetColors = {
  Black: {
    key: 1,
    value: '黑色',
  },
  White: {
    key: 2,
    value: '白色',
  },
};

function PrintCardView({ form, data }, { popView, isAuthorized }) {
  const dispatch = useDispatch();
  const { PubServicePrintCardStatus } = useSelector(state => state.pubservice);
  const presetColorList = useMemo(() => Object.values(PresetColors), []);

  // const isMaster = true;
  const isMaster = isAuthorized('print-master');
  const disabled = !isMaster;

  const { getFieldDecorator, getFieldsError, setFieldsValue, getFieldsValue, validateFields } = form;
  const { id, publicServiceStudyList, cardNo, serviceName, cardState, cardDescription } = data || {};

  const [useCardState, setUseCardState] = useState(cardState);
  const [printFront, setPrintFront] = useState(true);

  const [setting, setSetting, inited] = useServerCache(`${cacheKeyPrefix}${id}`);
  const defaultSetting = setting || {};
  const [study, setStudy] = useState();

  // state初始化时setting还没值，所以作为useState的初始值来初始化行不通
  const [frontCustomColor, setFrontCustomColor] = useState();
  // state初始化时setting还没值，所以作为useState的初始值来初始化行不通
  const [backCustomColor, setBackCustomColor] = useState();

  const defaultSettingFetching = useSelector(state => state.loading.effects[useServerCache.queryEffectName]);
  const surePrinting = useSelector(state => state.loading.effects['pubservice/surePrintCard']);

  const dataError = publicServiceStudyList?.length !== 1 || !cardNo;

  const transColor = useCallback(color => {
    switch (color) {
      case 1:
        return '#000';
      case 2:
        return '#fff';
      default:
        return color;
    }
  }, []);

  const isPresetColor = useCallback(color => presetColorList.find(item => item.key === color), [presetColorList]);

  const resetFront = useCallback(() => {
    setFieldsValue({
      frontBG: undefined,
      avatar: undefined,
      cardNoColor: PresetColors.Black.key,
    });
    setFrontCustomColor();
  }, [form]);

  const resetBack = useCallback(() => {
    setFieldsValue({
      backBG: undefined,
      avatar: undefined,
      textColor: PresetColors.Black.key,
      text: undefined,
    });
    setBackCustomColor();
  }, [form]);

  useEffect(() => {
    if (dataError) {
      return;
    }
    dispatch({
      type: 'contact/fetchById',
      payload: publicServiceStudyList[0].pubStudyId,
    }).then(setStudy);
  }, []);

  // 正面自定义颜色校验-配合
  useEffect(() => {
    validateFields(['cardNoColor']);
  }, [frontCustomColor]);

  // 正面自定义颜色校验-配合
  useEffect(() => {
    validateFields(['textColor']);
  }, [backCustomColor]);

  // state初始化时setting还没值，所以作为useState的初始值来初始化行不通
  useEffect(() => {
    const { cardNoColor = PresetColors.Black.key, textColor = PresetColors.Black.key } = defaultSetting || {};
    if (cardNoColor && !isPresetColor(cardNoColor)) {
      setFrontCustomColor(cardNoColor);
    }
    if (textColor && !isPresetColor(textColor)) {
      setBackCustomColor(textColor);
    }
  }, [defaultSetting]);

  // formDate始终是个新对象，所以如果其他原因引发rerender,formDate也会重新获取
  const formDate = getFieldsValue();
  const { cardNoColor, text, textColor, frontBG, backBG, avatar, showCardNo } = formDate;

  // frontBG, backBG 的值转化成基本类型
  const frontBGFileKeys = (formFileMapper(frontBG) || []).join(',');
  const backBGFileKeys = (formFileMapper(backBG) || []).join(',');
  const avatarFileKeys = (formFileMapper(avatar) || []).join(',');

  // 控制只支持一张图片
  useEffect(() => {
    if (frontBG && frontBG.length > 1) {
      setFieldsValue({
        frontBG: [frontBG[frontBG.length - 1]],
      });
    }
  }, [frontBGFileKeys]);

  // 控制只支持一张图片
  useEffect(() => {
    if (backBG && backBG.length > 1) {
      setFieldsValue({
        backBG: [backBG[backBG.length - 1]],
      });
    }
  }, [backBGFileKeys]);

  // 控制只支持一张图片
  useEffect(() => {
    if (avatar && avatar.length > 1) {
      setFieldsValue({
        avatar: [avatar[avatar.length - 1]],
      });
    }
  }, [avatarFileKeys]);

  useEffect(() => {
    const errs = getFieldsError();
    // 表单有错误
    if (Object.values(errs).some(item => item && item.length > 0)) {
      return;
    }
    if (!inited) {
      return;
    }
    setSetting(formDate);
  }, [
    cardNoColor,
    text,
    textColor,
    frontBGFileKeys,
    backBGFileKeys,
    // 头像不存储
    // avatarFileKeys
    showCardNo,
  ]); // 都用基本类型来watch

  const surePrint = useCallback(
    front => {
      setPrintFront(front);
      // https://rdc.aliyun.com/issue/2867059
      // 延迟打印存在问题 https://github.com/facebook/react/issues/16734，不延迟的话切换又会滞后
      window.print();
      if (useCardState === PubServicePrintCardStatus.NotYet.key) {
        dispatch({
          type: 'pubservice/surePrintCard',
          payload: id,
        }).then(() => {
          setUseCardState(PubServicePrintCardStatus.Printing.key);
        });
      }
    },
    [id, useCardState]
  );

  const donePrint = useCallback(async () => {
    if (useCardState === PubServicePrintCardStatus.Printing.key) {
      await dispatch({
        type: 'pubservice/surePrintCard',
        payload: id,
      });
      setUseCardState(PubServicePrintCardStatus.Done.key);
      popView();
    }
  }, [id, useCardState]);

  const CardView = useMemo(() => createCardView()(HorizontalCard), []);

  const uploadImgCustomRequest = useUploadImgRequest({ dispatch });

  if (dataError) {
    return (
      <Result
        type="error"
        title="错误"
        description="当前会员服务不可制卡"
        actions={
          <Button type="primary" onClick={popView}>
            返回
          </Button>
        }
      />
    );
  }

  const canPrint = useCardState !== PubServicePrintCardStatus.Done.key;

  return (
    <Row
      className={classNames(styles.wrapper, {
        [styles.printFront]: printFront,
        [styles.printBack]: !printFront,
      })}
    >
      <Col md={12}>
        <CardView
          className={styles.cardView}
          formDate={formDate}
          study={study}
          cardNo={cardNo}
          serviceName={serviceName}
          transColor={transColor}
          hiddenCardNo={showCardNo === 2}
        />
      </Col>
      <Col md={12}>
        <Form {...formItemLayoutNormal}>
          <div className={classNames('link', styles.serviceName)}>
            {serviceName} {study ? `/ ${study.realName} ${study.mobile} / NO.${study.id}` : null}
          </div>
          <Card title="正面设置" bordered={false} loading={defaultSettingFetching}>
            {inited && (
              <>
                <Form.Item label="正面背景图">
                  {getFieldDecorator('frontBG', {
                    ...formUploadOtherProps,
                    initialValue: defaultSetting.frontBG,
                    rules: [
                      {
                        required: true,
                        message: '请上传正面背景图片',
                      },
                    ],
                  })(
                    <Upload accept={FileAccept.IMG} customRequest={uploadImgCustomRequest} disabled={disabled}>
                      <Button icon="upload" type="primary" disabled={disabled}>
                        上传
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item label="卡号">
                  {cardNo}
                  <MarginBar left inline>
                    {getFieldDecorator('showCardNo', {
                      initialValue: defaultSetting.showCardNo || 1,
                    })(
                      <Radio.Group disabled={disabled}>
                        <Radio value={1}>显示</Radio>
                        <Radio value={2}>隐藏</Radio>
                      </Radio.Group>
                    )}
                  </MarginBar>
                </Form.Item>
                <Form.Item label="卡号文字颜色">
                  {getFieldDecorator('cardNoColor', {
                    initialValue: defaultSetting.cardNoColor || PresetColors.Black.key,
                    rules: [
                      {
                        required: true,
                        message: '请选择或者设置卡号文字颜色',
                      },
                      {
                        message: '请设置为非透明色',
                        validator(rule, value, fn) {
                          if (value === ColorPicker.Transparent) {
                            fn([new Error('invalid')]);
                            return;
                          }
                          fn();
                        },
                      },
                    ],
                  })(
                    <Radio.Group disabled={disabled}>
                      {presetColorList.map(item => (
                        <Radio key={item.key} value={item.key}>
                          {item.value}
                        </Radio>
                      ))}
                      <Radio value={frontCustomColor}>
                        <ColorPicker
                          disabled={disabled}
                          value={frontCustomColor}
                          onChange={color => {
                            setFrontCustomColor(color);
                            if (isPresetColor(cardNoColor)) {
                              return;
                            }
                            setFieldsValue({
                              cardNoColor: color,
                            });
                          }}
                        />
                      </Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item {...submitFormLayoutNormal}>
                  <AuthComponent auth={isMaster}>
                    <Button disabled={surePrinting} onClick={resetFront}>
                      重置
                    </Button>
                  </AuthComponent>
                  {canPrint && (
                    <MarginBar left inline>
                      <Button type="primary" loading={surePrinting} onClick={() => surePrint(true)}>
                        打印正面
                      </Button>
                    </MarginBar>
                  )}
                </Form.Item>
              </>
            )}
          </Card>
          <Card title="反面设置" bordered={false} loading={defaultSettingFetching}>
            {inited && (
              <>
                <Form.Item label="头像">
                  {getFieldDecorator('avatar', {
                    ...formUploadOtherProps,
                    initialValue: defaultSetting.avatar,
                    rules: [
                      {
                        required: true,
                        message: '请上传头像',
                      },
                    ],
                  })(
                    <Upload accept={FileAccept.IMG} customRequest={uploadImgCustomRequest}>
                      <Button icon="upload" type="primary">
                        上传
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item label="反面背景图">
                  {getFieldDecorator('backBG', {
                    ...formUploadOtherProps,
                    initialValue: defaultSetting.backBG,
                  })(
                    <Upload accept={FileAccept.IMG} customRequest={uploadImgCustomRequest} disabled={disabled}>
                      <Button icon="upload" type="primary" disabled={disabled}>
                        上传
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item label="文字描述颜色">
                  {getFieldDecorator('textColor', {
                    initialValue: defaultSetting.textColor || PresetColors.Black.key,
                    rules: [
                      {
                        required: true,
                        message: '请选择或者设置文字描述颜色',
                      },
                      {
                        message: '请设置为非透明色',
                        validator(rule, value, fn) {
                          if (value === ColorPicker.Transparent) {
                            fn([new Error('invalid')]);
                            return;
                          }
                          fn();
                        },
                      },
                    ],
                  })(
                    <Radio.Group disabled={disabled}>
                      {presetColorList.map(item => (
                        <Radio key={item.key} value={item.key}>
                          {item.value}
                        </Radio>
                      ))}
                      <Radio value={backCustomColor}>
                        <ColorPicker
                          disabled={disabled}
                          value={backCustomColor}
                          onChange={color => {
                            setBackCustomColor(color);
                            if (isPresetColor(textColor)) {
                              return;
                            }
                            setFieldsValue({
                              textColor: color,
                            });
                          }}
                        />
                      </Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="文字描述">
                  {getFieldDecorator('text', {
                    initialValue: defaultSetting.text || cardDescription,
                  })(<Input.TextArea placeholder="请填写" rows={4} disabled={disabled} />)}
                </Form.Item>
                <Form.Item {...submitFormLayoutNormal}>
                  <AuthComponent auth={isMaster}>
                    <Button disabled={surePrinting} onClick={resetBack}>
                      重置
                    </Button>
                  </AuthComponent>
                  {canPrint && (
                    <MarginBar left inline>
                      <Button type="primary" loading={surePrinting} onClick={() => surePrint()}>
                        打印反面
                      </Button>
                    </MarginBar>
                  )}
                  {useCardState === PubServicePrintCardStatus.Printing.key && (
                    <MarginBar left inline>
                      <Button type="danger" disabled={surePrinting} onClick={donePrint}>
                        制卡完成并关闭
                      </Button>
                    </MarginBar>
                  )}
                </Form.Item>
              </>
            )}
          </Card>
        </Form>
      </Col>
    </Row>
  );
}

PrintCardView.contextTypes = {
  popView: PropTypes.func,
  isAuthorized: PropTypes.func,
};

export default Form.create()(PrintCardView);
