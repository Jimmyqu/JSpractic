import { Button, Divider, Typography } from 'antd';
import Modal from '.';

function SpFullWarningModal({ data, ...props }) {
  const { salesName, professionalName, warnPersionNum } = data || {};
  // const [editing] = useState();
  return (
    <Modal
      {...props}
      footer={[
        <Button key="cancel" link="cancel" />,
        // <Button key="edit" type="danger" onClick={() => setEditing(true)}>
        //   修改预警提醒
        // </Button>,
      ].filter(Boolean)}
    >
      {/* {editing ? (
        <Form>
          <Form.Item label="当前时段预警人数">
            <InputNumber placeholder="请填写" min={0} precision={0} />
          </Form.Item>
          <Form.Item label="当前时段可容纳人数">
            <InputNumber placeholder="请填写" min={0} precision={0} />
          </Form.Item>
        </Form>
      ) : (
        <> */}
      当前时段【{salesName}-{professionalName}】入场人数，达到设置的预警数&nbsp;
      <span className="red">{warnPersionNum || 0}</span> 人。
      {/* </>
      )} */}
      <Divider />
      应急处理: <br />
      <Typography.Text>1、待在场人数低于预警数时，再销售；</Typography.Text> <br />
      <Typography.Text>2、修改入场数预警值</Typography.Text> <br />
      <Typography.Text>3、营业员端不受预警数影响</Typography.Text>
    </Modal>
  );
}

export default SpFullWarningModal;
