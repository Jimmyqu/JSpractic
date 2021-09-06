import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Form, Input, Upload, Button, message } from 'antd';
import Modal from '@/components/Modal';
import { modal } from '@/utils/feedback';
import { getActiveStep } from '@/components/ActivityDeclare';
import { genUploadDocCustomRequest, FileAccept, formUploadOtherProps, formFileMapper } from '@/utils/upload';
import { formatModel } from '@/utils/format';
import { formItemLayoutNormal } from '@/utils/utils';
import BasicView from './BasicView';
import AuditView from './AuditView';

@connect(({ activity }) => ({
  activity,
}))
@Form.create()
class ActivityAudit extends Component {
  state = {
    title: undefined,
    callback: () => {},
    auditConfirmModalVisible: false,
  };

  // eslint-disable-next-line react/destructuring-assignment
  customDocRequest = genUploadDocCustomRequest({ dispatch: this.props.dispatch });

  componentDidMount() {
    const { onInit } = this.props;
    if (typeof onInit === 'function') {
      onInit({
        onAuditReject: () => {
          const {
            data: { declareCurrentNode },
          } = this.props;
          const { nodeAuditType } = declareCurrentNode;
          const msg = [null, '驳回到上一步', '驳回请重填', '未通过'][nodeAuditType || 1] || '您确定要驳回吗';
          modal.confirm(`确认${msg}？`, {
            onOk: () => {
              this.toAuditDialog('驳回未通过', true);
            },
          });
        },
        onAuditResolve: () => {
          modal.confirm('您确定要通过吗?', {
            onOk: () => {
              this.toAuditDialog('确认通过');
            },
          });
        },
        onExtensionsSave: extension => {
          this.toExtensionsSave(extension);
        },
      });
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleAuditConfirmModalVisibleChange = auditConfirmModalVisible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      auditConfirmModalVisible,
    });
  };

  toServer = ({ deepCallOk }) => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const { file } = formData;
      const { callback } = this.state;
      if (typeof callback === 'function') {
        deepCallOk(callback, {
          ...formData,
          file: formFileMapper(file),
        });
      }
    });
  };

  toAuditDialog(title, isReject) {
    this.toDialog(title, async (arg, formData) => {
      const {
        data: { declareDetail },
        dispatch,
        activity: { AuditStates },
      } = this.props;
      const { id } = declareDetail;
      await dispatch({
        type: 'activity/audit',
        payload: {
          exerciseId: id,
          auditState: isReject ? AuditStates.No.key : AuditStates.Yes.key,
          ...formData,
        },
      });
      message.success('操作成功');
      dispatch(
        push({
          pathname: './info',
          search: `id=${id}&flag=${Date.now()}`,
        })
      );
    });
  }

  toExtensionsSave(extension) {
    const {
      activity: { ExtensionsFunctionTypes },
    } = this.props;
    this.toDialog(formatModel(ExtensionsFunctionTypes, extension), async (arg, formData) => {
      const { data, dispatch } = this.props;
      const {
        declareDetail: { id },
      } = data;
      const { auditReasons, file: extensionFiles } = formData;
      const activeStep = getActiveStep(data);
      await dispatch({
        type: 'activity/saveExtensions',
        payload: {
          nodeStep: activeStep,
          exerciseId: id,
          extension,
          extensionDescr: auditReasons,
          extensionFiles,
        },
      });
      message.success('操作成功');
      dispatch(
        push({
          pathname: './info',
          search: `id=${id}&step=${activeStep}&flag=${Date.now()}`,
        })
      );
    });
  }

  toDialog(title, callback) {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      title,
      callback,
      auditConfirmModalVisible: true,
    });
  }

  render() {
    const { data, activity, fixedStaticFields, form } = this.props;
    const { auditConfirmModalVisible, title } = this.state;
    const { dynamicDeclareFieldsMapping } = activity;
    const { declareDetailItemList, declareDetail } = data;
    const { configId } = declareDetail || {};

    const declareFields = (dynamicDeclareFieldsMapping[configId] || []).map(field => {
      return {
        ...field,
        dataValue: declareDetail[field.extName], // 放默认值
      };
    });
    return (
      <div>
        <BasicView data={data} declareFields={declareFields} fixedStaticFields={fixedStaticFields} />
        {(declareDetailItemList || []).map(item => (
          <AuditView key={item.nodeStep} detailItem={item} />
        ))}
        <Modal
          title={title}
          visible={auditConfirmModalVisible}
          onVisibleChange={this.handleAuditConfirmModalVisibleChange}
          onOk={this.toServer}
        >
          <Form {...formItemLayoutNormal}>
            <Form.Item label="操作说明">
              {form.getFieldDecorator('auditReasons')(<Input.TextArea placeholder="最多输入500字" maxLength="500" />)}
            </Form.Item>
            <Form.Item label="文件">
              {form.getFieldDecorator('file', {
                ...formUploadOtherProps,
              })(
                <Upload accept={FileAccept.DOC} multiple customRequest={this.customDocRequest}>
                  <Button icon="upload" type="primary">
                    上传
                  </Button>
                  &nbsp; 上传附件格式为：xls,xlsx,ppt,pptx,docx,doc,pdf
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ActivityAudit;
