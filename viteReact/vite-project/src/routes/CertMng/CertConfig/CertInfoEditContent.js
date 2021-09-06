import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, InputNumber, Radio } from 'antd';
import Content from '@/components/Datatable/Content';
import Modal from '@/components/Modal';
import ExtFormItem from '@/components/ExtFormItem';
import { formItemLayoutNormal, modelMapToOption, isNumerical } from '@/utils/utils';
import Datatable, { ItemTypes } from '@/components/Datatable';
import { formatModel } from '@/utils/format';
import { converFormDataToServerReady } from '@/utils/form';

@connect(({ pubserviceuser, extfield, venue, loading }) => ({
  pubserviceuser,
  venue,
  extfield,
  editing: loading.effects['pubserviceuser/addCertInfo'] || loading.effects['pubserviceuser/editCertInfo'],
}))
@Form.create()
class EditContent extends Component {
  state = {
    visible: false,
    categoryList: undefined,
    selectedRows: undefined,

    usedRows: undefined,
  };

  columns = [
    {
      title: '数据类型',
      dataIndex: 'extDataType',
      render: value => {
        const {
          extfield: { ExtDataTypes },
        } = this.props;
        return formatModel(ExtDataTypes, value);
      },
      width: 100,
    },
    {
      title: '显示名称',
      dataIndex: 'extShowName',
      width: 100,
    },
    {
      title: '数据分类',
      dataIndex: 'extCategory',
      render: value => {
        const {
          pubserviceuser: { ExtFieldCategoryList },
        } = this.props;
        return ((ExtFieldCategoryList || []).find(item => item.id === value) || {}).text;
      },
      width: 100,
    },
  ];

  formSearch = () => {
    const {
      extfield: { ExtDataTypes },
      pubserviceuser: { ExtFieldCategoryList },
    } = this.props;
    return {
      col: 12,
      fields: [
        {
          label: '数据字段名',
          name: 'extShowName',
        },
        {
          label: '数据分类',
          name: 'extCategory',
          options: (ExtFieldCategoryList || []).map(item => ({
            key: item.id,
            text: item.text,
          })),
          type: ItemTypes.Select,
        },
        {
          label: '数据类型',
          name: 'extDataType',
          options: modelMapToOption(ExtDataTypes),
          type: ItemTypes.Select,
        },
      ],
    };
  };

  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows, edit, certConfigId } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      if (edit) {
        const record = selectedRows[0] || {};
        await dispatch({
          type: 'pubserviceuser/editCertInfo',
          payload: {
            ...converFormDataToServerReady(
              [
                {
                  ...record,
                  extName: 'dataDefaultValue',
                },
              ],
              formData
            ),
            id: record.id,
          },
        });
      } else {
        const { usedRows } = this.state;
        const { extFieldName, ...formValues } = formData;
        await dispatch({
          type: 'pubserviceuser/addCertInfo',
          payload: {
            ...formValues,
            certConfigId,
            extFieldIds: (usedRows || []).map(item => item.id),
          },
        });
      }
      sure();
    });
  };

  showSelectModal = () => {
    const { categoryList } = this.state;
    if (categoryList == null) {
      const { dispatch } = this.props;
      dispatch({
        type: 'pubserviceuser/fetchExtFieldCategoryList',
      });
    }
    this.setState({
      visible: true,
    });
  };

  modalSure = () => {
    const { selectedRows } = this.state;
    const {
      form,
      pubserviceuser: { ExtFieldCategoryList },
    } = this.props;
    this.setState({
      usedRows: selectedRows,
    });
    form.setFieldsValue({
      extFieldName: (selectedRows || [])
        .map(item => {
          return `${item.extShowName}(${
            ((ExtFieldCategoryList || []).find(one => one.id === item.extCategory) || {}).text
          })`;
        })
        .join(', '),
    });
  };

  onVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      editing,
      fetching,
      pubserviceuser,
      venue,
      edit,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      extfield: { ExtDataTypes },
      ...restProps
    } = this.props;
    const { getFieldDecorator } = form;
    const { visible } = this.state;

    const selectedRow = edit ? (selectedRows || [])[0] || {} : {};

    const { dataDefaultValue, extFieldName, extShowName, required, filter, showMode, placeholder, extDataType, ranks } =
      selectedRow;
    const { CertShowMode } = pubserviceuser;
    // const nowDefaultValue = getFieldValue('dataDefaultValue');
    // const fileDisabled =
    //   (selectedRow.extDataType === ExtDataTypes.ImgFile.key || selectedRow.extDataType === ExtDataTypes.DocFile.key) &&
    //   nowDefaultValue &&
    //   nowDefaultValue.length > 0;
    return (
      <Content
        title={`${edit ? '编辑' : '添加'}认证信息`}
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
              <Form.Item label="认证字段">
                {edit
                  ? getFieldDecorator('extFieldName', {
                      initialValue: extFieldName,
                    })(<Input placeholder="请填写" disabled />)
                  : getFieldDecorator('extFieldName', {
                      // initialValue: selectedRow.extFieldIds,
                      rules: [
                        {
                          required: true,
                          message: '请选择认证字段',
                        },
                      ],
                    })(
                      <Input.Search
                        placeholder="请选择认证字段"
                        enterButton="选择"
                        readOnly
                        onSearch={this.showSelectModal}
                      />
                    )}
              </Form.Item>
              {edit && (
                <Form.Item label="标题名称">
                  {getFieldDecorator('extShowName', {
                    initialValue: extShowName,
                    rules: [
                      {
                        required: true,
                        message: '请填写标题名称',
                      },
                    ],
                  })(<Input placeholder="请填写" />)}
                </Form.Item>
              )}
              <Form.Item label="是否必填">
                {getFieldDecorator('required', {
                  initialValue: required,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否必填',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="支持筛选">
                {getFieldDecorator('filter', {
                  initialValue: filter,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否支持筛选',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="手机端是否显示">
                {getFieldDecorator('showMode', {
                  initialValue: showMode,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否支持筛选',
                    },
                  ],
                })(
                  <Radio.Group>
                    {Object.values(CertShowMode).map(item => (
                      <Radio key={item.key} value={item.key}>
                        {item.value}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="占位符">
                {getFieldDecorator('placeholder', {
                  initialValue: placeholder,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              {edit &&
                ![ExtDataTypes.Contact.key, ExtDataTypes.ImgFile.key, ExtDataTypes.DocFile.key].includes(
                  extDataType
                ) && (
                  <ExtFormItem
                    field={{
                      ...selectedRow,
                      dataValue: isNumerical(dataDefaultValue) ? +dataDefaultValue : dataDefaultValue,
                      required: false,
                      extName: 'dataDefaultValue',
                    }}
                    label="筛选默认值"
                    form={form}
                    canEdit
                  />
                )}
              <Form.Item label="排序">
                {getFieldDecorator('ranks', {
                  initialValue: ranks,
                })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Modal
          title="请选择认证字段"
          width={620}
          visible={visible}
          onVisibleChange={this.onVisibleChange}
          onOk={this.modalSure}
        >
          <Datatable
            personalization={false}
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/commonExtField/dataList.do"
            columns={this.columns}
            rowKey="id"
            formSearch={this.formSearch()}
            pagination={{
              size: 'small',
            }}
          />
        </Modal>
      </Content>
    );
  }
}

export default EditContent;
