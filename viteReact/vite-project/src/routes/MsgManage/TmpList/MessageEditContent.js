import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Card, Row, Col, Input, Select, Button, Divider, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formItemLayoutFull, CDN_STATIC_HOST } from '@/utils/utils';
import MarginBar from '@/components/MarginBar';
import AuthComponent from '@/components/AuthComponent';
import FooterToolbar from '@/components/FooterToolbar';
import UserListModal from './UserListModal';
import HandAddMobileModal from './HandAddMobileModal';
import UploadExcelModal from './UploadExcelModal';
import MobileFailModal from './MobileFailModal';
import ExamineModal from './ExamineModal';
import MobilePoolModal from './MobilePoolModal';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

function MessageEditContent({ form, edit, data }, { popView }) {
  const selectRow = edit ? data || {} : {};
  const dispatch = useDispatch();
  const { PushType, PushMode } = useSelector(state => state.message);
  const saveing = useSelector(state => state.loading.effects['message/saveMessagePushConfig']);
  const WeChat = PushType.WeChat.key;
  const ShortMessage = PushType.ShortMessage.key;
  // const Timing = PushMode.Timing.key;

  const [userListVisible, setUserListVisible] = useState(false);
  const [handAddVisible, setHandAddVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [failMobileVisible, setFailMobileVisible] = useState(false);
  const [examineVisible, setExamineVisible] = useState(false);
  const [mobilePoolVisible, setMobilePoolVisible] = useState(false);

  const [templateCodeList, setTemplateCodeList] = useState([]);
  const [selectPushType, setSelectPushType] = useState(selectRow.pushType || WeChat);
  const [failData, setFailData] = useState({});
  const [id, setId] = useState(selectRow.id);
  const [authStatus, setAuthStatus] = useState(selectRow.authStatus);
  const isShortMessage = selectPushType === ShortMessage;
  const isWetchMessage = selectPushType === WeChat;
  const [messageContent, setMessageContent] = useState('');
  const [srvName, setSrvName] = useState();
  const [tmpName, setTmpName] = useState();
  const [mobileNums, setMobileNums] = useState(selectRow.mobileNums || 0);
  const [srvList, setSrvList] = useState();

  const { getFieldDecorator, getFieldValue } = form;
  const content = getFieldValue('content');
  const messageTemplateId = getFieldValue('messageTemplateId');
  const srvId = getFieldValue('srvId');
  // const fieldmode = getFieldValue('pushMode');

  // const format = 'YYYY-MM-DD HH:mm';

  useEffect(() => {
    dispatch({
      type: 'message/fetchSrvList',
    }).then(res => {
      setSrvList(res);
      setSrvName((res.find(item => item.srvId === selectRow.srvId) || {}).srvName);
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'message/fetchTemplateCode',
      payload: {
        templateType: selectPushType,
      },
    }).then(res => {
      setTemplateCodeList(res);
    });
  }, [selectPushType]);

  const setContent = (name, cont) => {
    form.setFieldsValue({
      content: name ? `【${name}】${cont}` : cont,
    });
  };

  const handleTmpChange = useCallback(
    (value, type) => {
      if (type === 1) {
        const { content: cont, templateName } = templateCodeList.find(item => item.id === value) || {};
        if (isShortMessage) {
          setMessageContent(cont);
          setContent(srvName, cont);
        } else {
          setTmpName(templateName);
        }
      }
      if (type === 2 && isShortMessage) {
        const { srvName: name } = srvList.find(item => item.srvId === value) || {};
        const cont = edit
          ? templateCodeList.find(item => item.id === selectRow.messageTemplateId).content
          : messageContent;
        setSrvName(name);
        setContent(name, cont);
      }
    },
    [messageTemplateId, templateCodeList, srvList, srvId]
  );

  const fetchMessageInfo = useCallback(() => {
    dispatch({
      type: 'message/messageConfigInfo',
      payload: {
        messagePushConfigId: id,
      },
    }).then(res => {
      setMobileNums(res.mobileNums);
    });
  }, [id]);

  const handlePushTypeChange = useCallback(
    value => {
      setSelectPushType(value);
      setMobileNums(0);
      setId(null);
      form.setFieldsValue({
        messageTemplateId: undefined,
        content: undefined,
        srvId: undefined,
      });
    },
    [selectPushType]
  );

  const getTotal = useCallback(() => {
    const { length } = content;
    const base = length > 70 ? 67 : 70;
    const total = length > 70 ? length + Number.parseInt(length / base, 10) * 3 : length;
    const count = Math.ceil(length / base);
    const curIndex = length % base === 0 ? 70 : length % base;
    return {
      total,
      count,
      curIndex,
    };
  }, [content]);

  const saveMessage = useCallback(() => {
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'message/saveMessagePushConfig',
        payload: {
          ...formData,
          pushDate: formData.pushDate ? formData.pushDate.valueOf() : undefined,
          id: id || undefined,
        },
      }).then(result => {
        if (result) {
          message.success(id ? '编辑成功' : '添加成功');
          setId(result.id);
          setAuthStatus(result.authStatus);
        }
      });
    });
  }, [id]);

  const onFail = res => {
    setFailMobileVisible(true);
    setFailData(res);
  };

  const handelExamineVisibleChange = visible => {
    setExamineVisible(visible);
  };

  const handelSubmit = () => {
    dispatch({
      type: 'message/applyPushConfig',
      payload: {
        id,
      },
    }).then(result => {
      if (result) {
        message.success('提交成功');
        setAuthStatus(result.authStatus);
        popView();
      }
    });
  };

  return (
    <Card bordered={false}>
      <Row>
        <Col md={14}>
          <Form {...formItemLayoutFull}>
            <Row>
              <Col md={12}>
                <Form.Item label="群发类型">
                  {getFieldDecorator('pushType', {
                    initialValue: selectPushType,
                    rules: [
                      {
                        required: true,
                        message: '请选择群发类型',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" disabled={!!edit} onChange={handlePushTypeChange}>
                      {Object.values(PushType).map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label="选择模板">
                  {getFieldDecorator('messageTemplateId', {
                    initialValue: selectRow.messageTemplateId,
                    rules: [
                      {
                        required: true,
                        message: '请选择模板',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" onChange={value => handleTmpChange(value, 1)}>
                      {templateCodeList.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.templateName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label="选择业务">
                  {getFieldDecorator('srvId', {
                    initialValue: selectRow.srvId,
                    rules: [
                      {
                        required: true,
                        message: '请选择业务',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" onChange={value => handleTmpChange(value, 2)}>
                      {(srvList || []).map(item => (
                        <Select.Option key={item.srvId} value={item.srvId}>
                          {item.srvName} - {item.srvId}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label="发送方式">
                  {getFieldDecorator('pushMode', {
                    initialValue: selectRow.pushMode,
                    rules: [
                      {
                        required: true,
                        message: '请选择发送方式',
                      },
                    ],
                  })(
                    <Select placeholder="请选择">
                      {Object.values(PushMode).map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {/* {fieldmode === Timing && (
                <Col md={12}>
                  <Form.Item label="定时发送">
                    {getFieldDecorator('pushDate', {
                      initialValue: edit ? moment(selectRow.pushDate) : null,
                      rules: [
                        {
                          required: true,
                          message: '请选择定时发送时间',
                        },
                      ],
                    })(
                      <DatePicker showTime={{ format }} format={format} placeholder="请选择" className="full-width" />
                    )}
                  </Form.Item>
                </Col>
              )} */}
              {isWetchMessage && (
                <>
                  <Col md={24} className={styles.contentRow}>
                    <Form.Item label="微信内容" {...formItemLayout}>
                      {getFieldDecorator('content', {
                        initialValue: selectRow.content,
                        rules: [
                          {
                            required: true,
                            message: '请输入微信内容',
                          },
                        ],
                      })(<Input.TextArea rows={4} maxLength={50} placeholder="每条微信限50个字" />)}
                    </Form.Item>
                    {content && (
                      <Col md={24} className={styles.contentLength}>
                        总计{content.length}个字 &nbsp;&nbsp; {content.length} / 50个字
                      </Col>
                    )}
                  </Col>
                </>
              )}
              {isShortMessage && (
                <>
                  <Col md={24} className={styles.contentRow}>
                    <Form.Item label="短信内容" {...formItemLayout}>
                      {getFieldDecorator('content', {
                        initialValue: selectRow.content,
                        rules: [
                          {
                            required: true,
                            message: '请输入短信内容',
                          },
                        ],
                      })(<Input.TextArea rows={4} maxLength={200} placeholder="每条短信限70个字" />)}
                    </Form.Item>
                    {content && (
                      <Col md={24} className={styles.contentLength}>
                        总计{getTotal().total}个字 &nbsp;&nbsp;第{getTotal().count}条&nbsp;&nbsp;{getTotal().curIndex} /
                        70个字
                      </Col>
                    )}
                  </Col>
                </>
              )}
              <Col md={24}>
                <Button type="primary" className={styles.saveMessage} disabled={saveing} onClick={saveMessage}>
                  保存
                </Button>
              </Col>
              <Col md={24}>
                <Form.Item
                  label={
                    <>
                      <span className={styles.fail}>* </span>号码池
                    </>
                  }
                  {...formItemLayout}
                  className={styles.number}
                >
                  <Button type="primary" disabled={!id} onClick={() => setUploadVisible(true)}>
                    导入文件
                  </Button>
                  {selectPushType === ShortMessage && (
                    <Button type="primary" disabled={!id} onClick={() => setHandAddVisible(true)}>
                      手动添加
                    </Button>
                  )}
                  <Button type="primary" disabled={!id} onClick={() => setUserListVisible(true)}>
                    选择会员
                  </Button>
                  <span className={mobileNums > 0 ? styles.blueColor : ''} onClick={() => setMobilePoolVisible(true)}>
                    号码池: {mobileNums}
                  </span>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider />
          <div className={styles.rule}>
            {isWetchMessage && (
              <>
                <Form.Item label="内容规范" {...formItemLayout}>
                  <span> * 只能选择审核通过的业务名称，内容首尾不能添加【】</span>
                  <span>* 内容合法，不能发送房产、发票、移民等国家法律规定严格禁止的内容。</span>
                  <span>
                    * 超链接地址请写在短信内容中，便于核实，部分安卓系统存在超链接识别问题，需在超链接前后添加空格
                  </span>
                </Form.Item>
                <Form.Item label="审核规则" {...formItemLayout}>
                  * 如果出现批量微信发送驳回的情况，可能为“敏感词”拦截，进入人工审核，请联系客服
                </Form.Item>
              </>
            )}
            {isShortMessage && (
              <>
                <Form.Item label="内容规范" {...formItemLayout}>
                  <span>
                    * 内容必须带有【业务名称】，业务名称可以为公司或品牌名称，字数要求2-16个字符，运营商规定必填。
                  </span>
                  <span>* 只能选择审核通过的业务名称，内容首尾不能添加【】</span>
                  <span>* 内容合法，不能发送房产、发票、移民等国家法律规定严格禁止的内容。</span>
                  <span>
                    * 超链接地址请写在短信内容中，便于核实，部分安卓系统存在超链接识别问题，需在超链接前后添加空格
                  </span>
                </Form.Item>
                <Form.Item label="计费规则" {...formItemLayout}>
                  <span>* 短信字数&lt;=70个字，按照70个字一条短信计算。中英文字符统一计算为一个字符。</span>
                  <span>
                    *
                    短信字数&gt;70个字，占用3个字符作为分条字符，按照67个字记为一条短信计算，多条短信可能在部分手机系统上呈现为一条短信的形态。
                  </span>
                </Form.Item>
                <Form.Item label="审核规则" {...formItemLayout}>
                  * 如果出现批量短信发送驳回的情况，可能为“敏感词”拦截，进入人工审核，请联系客服
                </Form.Item>
              </>
            )}
          </div>
        </Col>
        <Col md={9} offset={1}>
          <h3 className={styles.previewTitle}>样式预览</h3>
          <div className={styles.previewTip}>不同手机显示效果不同，请以实际发送效果为准</div>
          <div
            className={styles.preview}
            style={{ backgroundImage: `url(${CDN_STATIC_HOST}/images/cloud/message/iphone.png)` }}
          >
            <div className={styles.tmpContainer}>
              {isWetchMessage && (content || tmpName) && (
                <Card className="full-width">
                  <p>{tmpName}</p>
                  <p>{content}</p>
                  {/* {wechatTmpContent.remark && <p>备注: {wechatTmpContent.remark}</p>} */}
                </Card>
              )}
              {isShortMessage && content && <div className={classNames(styles.bubble, 'full-width')}>{content}</div>}
            </div>
          </div>
        </Col>
      </Row>

      <AuthComponent auth="submit">
        <FooterToolbar>
          <MarginBar top right inline>
            <Button type="primary" disabled={!id || mobileNums === 0} onClick={() => handelSubmit()}>
              提交
            </Button>
          </MarginBar>
        </FooterToolbar>
      </AuthComponent>

      <UploadExcelModal
        visible={uploadVisible}
        onVisibleChange={setUploadVisible}
        messagePushConfigId={id}
        fetchMessageInfo={fetchMessageInfo}
        selectPushType={selectPushType}
        onFail={res => onFail(res)}
      />

      <HandAddMobileModal
        visible={handAddVisible}
        onVisibleChange={setHandAddVisible}
        messagePushConfigId={id}
        fetchMessageInfo={fetchMessageInfo}
        onFail={res => onFail(res)}
      />

      <UserListModal
        visible={userListVisible}
        onVisibleChange={setUserListVisible}
        messagePushConfigId={id}
        authStatus={authStatus}
        fetchMessageInfo={fetchMessageInfo}
        onFail={res => onFail(res)}
        selectPushType={selectPushType}
      />

      <MobileFailModal visible={failMobileVisible} onVisibleChange={setFailMobileVisible} data={failData} />

      <ExamineModal
        visible={examineVisible}
        onVisibleChange={handelExamineVisibleChange}
        messagePushConfigId={id}
        onOk={() => popView()}
      />

      <MobilePoolModal
        visible={mobilePoolVisible}
        onVisibleChange={setMobilePoolVisible}
        messagePushConfigId={id}
        authStatus={authStatus}
        fetchMessageInfo={fetchMessageInfo}
        selectPushType={selectPushType}
      />
    </Card>
  );
}

MessageEditContent.contextTypes = {
  popView: PropTypes.func,
};

export default Form.create()(MessageEditContent);
