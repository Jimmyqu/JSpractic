import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goBack, push } from 'connected-react-router';
import { Button, Card, Col, Divider, Form, message, Row, Select, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ExtFormItem from '@/components/Form/FormItem/ExtFormItem';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import { formItemLayoutBasic, getPageQuery } from '@/utils/utils';
import { converFormDataToServerReady2 } from '@/utils/form';
import NewsIframe from '@/components/Iframe/NewsIframe';
import ProjectReqDataView from '@/components/Activity2/ProjectReqDataView';

function Req({ form }) {
  const { id, edit } = getPageQuery();
  const dispatch = useDispatch();
  const cfgFetching = useSelector(state => state.loading.effects['activity2/fetchReqCfgList']);
  const fieldsFetching = useSelector(state => state.loading.effects['activity2/fetchReqFields']);
  const valueFetching = useSelector(state => state.loading.effects['activity2/fetchReqValue']);

  const { fieldCfgCache } = useSelector(state => state.activity2);
  const [configList, setConfigList] = useState();
  const [configListPromise, setConfigListPromise] = useState();
  const [configId, setConfigId] = useState();
  const [editMode, setEditMode] = useState(!!edit);
  const [reqInfo, setReqInfo] = useState();

  useEffect(() => {
    if (configId == null) {
      return;
    }
    dispatch({
      type: 'activity2/fetchReqFields',
      payload: configId,
    });
  }, [configId]);

  useEffect(() => {
    setConfigListPromise(
      dispatch({
        type: 'activity2/fetchReqCfgList',
      }).then(setConfigList)
    );
  }, []);

  useEffect(() => {
    if (id == null) {
      setReqInfo(null);
      return;
    }
    if (configListPromise == null) {
      return;
    }
    configListPromise.then(() => {
      dispatch({
        type: 'activity2/fetchReqValue',
        payload: { id },
      }).then(info => {
        setReqInfo(info);
      });
    });
  }, [id, configListPromise]);

  useEffect(() => {
    const cfgId = reqInfo?.configId || configList?.[0].id;
    setConfigId(cfgId);
  }, [reqInfo, configList]);

  const config = configId ? configList?.find(item => item.id === configId) : null;
  const fields = fieldCfgCache[configId];

  const { canEdit, fieldMap } = reqInfo || {};

  return (
    <PageHeaderLayout>
      <Card bordered={false} loading={cfgFetching}>
        <Spin spinning={!!(fieldsFetching || valueFetching)}>
          {editMode || !id ? (
            <>
              <Form {...formItemLayoutBasic}>
                <Form.Item label="申报项目" required>
                  <Select placeholder="请选择" value={configId} onChange={setConfigId}>
                    {configList?.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.reportName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Divider />
                {fields?.map(field => (
                  <ExtFormItem
                    key={field.extKeyName}
                    form={form}
                    field={field}
                    initialValue={fieldMap?.[field.extKeyName]}
                  />
                ))}
              </Form>
              {config?.reportIntroId > 0 && (
                <Row>
                  <Col md={4} />
                  <Col md={16}>
                    <Divider />
                    <NewsIframe newsId={config.reportIntroId} />
                  </Col>
                  <Col md={4} />
                </Row>
              )}
            </>
          ) : (
            <ProjectReqDataView showAuthInfo fields={fields} data={reqInfo} />
          )}
        </Spin>
      </Card>
      <FooterToolbar>
        {id > 0 && (
          <>
            <MarginBar top inline>
              <Button
                disabled={cfgFetching || fieldsFetching || valueFetching}
                onClick={() => {
                  dispatch(goBack());
                }}
              >
                返回
              </Button>
            </MarginBar>
            {canEdit && (
              <MarginBar top left inline>
                {editMode ? (
                  <Button
                    disabled={cfgFetching || fieldsFetching || valueFetching}
                    onClick={() => {
                      setEditMode(false);
                    }}
                  >
                    取消
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    disabled={cfgFetching || fieldsFetching || valueFetching}
                    onClick={() => {
                      setEditMode(true);
                    }}
                  >
                    编辑
                  </Button>
                )}
              </MarginBar>
            )}
          </>
        )}
        {(!id || editMode) && (
          <MarginBar top left inline>
            <Button
              type="primary"
              disabled={cfgFetching || fieldsFetching || valueFetching}
              onClick={() => {
                form.validateFieldsAndScroll(async (err, formData) => {
                  if (err) {
                    return;
                  }
                  await dispatch({
                    type: 'activity2/saveReqValue',
                    payload: {
                      ...converFormDataToServerReady2(fields, formData),
                      configId,
                      id,
                    },
                  });
                  message.success('提交成功');
                  dispatch(push('project'));
                });
              }}
            >
              提交
            </Button>
          </MarginBar>
        )}
      </FooterToolbar>
    </PageHeaderLayout>
  );
}

export default Form.create()(Req);
