import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import Datatable from '@/components/Datatable';
import { formatModel } from '@/utils/format';

const formItemLayout = {
  labelCol: { md: 2 },
  wrapperCol: { md: 22 },
};

function BanContent({ form, cancel, sure, selectedRows, enable, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const { MagneticCardTypes, MagneticCardStatus } = useSelector(state => state.pubticket);
  const { RelTypes } = useSelector(state => state.global);
  const saving = useSelector(state => state.loading.effects['global/updateICCardBindState']);

  return (
    <Content
      title={enable ? '启用' : '禁用'}
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: saving,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: saving,
          action: () => {
            validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              await dispatch({
                type: 'global/updateICCardBindState',
                payload: {
                  ...formData,
                  ids: selectedRows.map(({ id }) => id),
                  icState: enable ? MagneticCardStatus.Enable.key : MagneticCardStatus.Disable.key,
                },
              });
              sure();
            });
          },
        },
      ]}
    >
      <Row>
        <Col md={12}>
          <Form {...formItemLayout}>
            <Form.Item label="备注">
              {getFieldDecorator('descr', {
                rules: [
                  {
                    required: true,
                    message: '请填写备注',
                  },
                ],
              })(<Input.TextArea placeholder="请填写" rows={3} />)}
            </Form.Item>
          </Form>
          已选择
          <Datatable
            pagination={false}
            personalization={false}
            columns={[
              {
                title: '编号',
                dataIndex: 'id',
                width: 90,
              },
              {
                title: '卡类型',
                dataIndex: 'icType',
                render: value => formatModel(MagneticCardTypes, value),
                width: 90,
              },
              {
                title: '卡号',
                dataIndex: 'icNo',
                width: 150,
              },
              {
                title: '数据类型',
                dataIndex: 'relType',
                render: value => formatModel(RelTypes, value),
                width: 110,
              },
              {
                title: '持有人姓名',
                dataIndex: 'realName',
                width: 130,
              },
            ]}
            dataList={selectedRows || []}
          />
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(BanContent);
