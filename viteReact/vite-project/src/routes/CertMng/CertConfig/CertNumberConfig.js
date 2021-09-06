import { useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, message, Form, Select, Input } from 'antd';
import Datatable from '@/components/Datatable';
import { modal } from '@/utils/feedback';
import { formItemLayoutNormal } from '@/utils/utils';
import Modal from '@/components/Modal';

function EditModal({ certConfigId, form }) {
  const dispatch = useDispatch();
  const deleting = useSelector(state => state.loading.effects['pubserviceuser/auditKeyDelete']);
  const [table, setTableInit] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [visible, setVisible] = useState();
  const [showMode, setShowMode] = useState();
  const {
    RelTypes: { CERTCONFIG },
  } = useSelector(state => state.global);
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const numberDigit = useCallback(() => {
    const list = [];
    for (let i = 1; i <= 10; i += 1) {
      list.push(i);
    }
    return list;
  }, []);

  const cancel = () => {
    setVisible(false);
  };

  const columns = useMemo(
    () => [
      {
        title: '认证编号位数',
        dataIndex: 'dynamicDigit',
        width: 150,
      },
      {
        title: '认证编号前缀',
        dataIndex: 'prefix',
        width: 150,
      },
      {
        title: '生成首个认证编号',
        dataIndex: 'dynamicStart',
        width: 150,
      },
      {
        title: '认证编号后缀缀',
        dataIndex: 'suffix',
        width: 150,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'info-add',
          text: '添加',
          disabled: deleting,
          action() {
            setVisible(true);
            setShowMode(0);
          },
        },
        {
          auth: 'info-edit',
          text: '修改',
          forRow: 'single',
          disabled: deleting,
          action() {
            setVisible(true);
            setShowMode(1);
          },
        },
        {
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          loading: deleting,
          action() {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'pubserviceuser/auditKeyDelete',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
      ],
    }),
    [selectedRows, deleting]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        url={`/commonKeyGenerator/dataList.do?dataId=${certConfigId}&relType=${CERTCONFIG.key}`}
        columns={columns}
        rowKey="id"
        operation={operation}
        onInit={setTableInit}
      />

      <Modal
        title={showMode ? '编辑' : '添加'}
        width={550}
        visible={visible}
        onOk={() => {
          validateFieldsAndScroll(async (err, formData) => {
            if (err) {
              return;
            }
            const { ...formValues } = formData;
            if (showMode) {
              formValues.id = selectedRows[0].id;
            }
            dispatch({
              type: 'pubserviceuser/auditKeySave',
              payload: {
                ...formValues,
                dataId: certConfigId,
                relType: CERTCONFIG.key,
              },
            }).then(() => {
              message.success(`${showMode ? '编辑' : '添加'}成功`);
              table.reload();
              setVisible(false);
            });
          });
          return false;
        }}
        onCancel={cancel}
      >
        <Form {...formItemLayoutNormal}>
          <Form.Item label="认证编号位数">
            {getFieldDecorator('dynamicDigit', {
              initialValue: selectedRows[0]?.dynamicDigit,
              rules: [
                {
                  required: true,
                  message: '请选择认证编号位数',
                },
              ],
            })(
              <Select placeholder="请选择">
                {numberDigit().map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="认证编号前缀">
            {getFieldDecorator('prefix', { initialValue: selectedRows[0]?.prefix })(<Input />)}
          </Form.Item>
          <Form.Item label="生成首个认证编号">
            {getFieldDecorator('dynamicStart', { initialValue: selectedRows[0]?.dynamicStart })(<Input />)}
          </Form.Item>
          <Form.Item label="认证编号后缀">
            {getFieldDecorator('suffix', { initialValue: selectedRows[0]?.suffix })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default Form.create()(EditModal);
