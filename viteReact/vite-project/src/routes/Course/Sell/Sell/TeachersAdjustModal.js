import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message, Button } from 'antd';
import Modal from '@/components/Modal';
import Datatable from '@/components/Datatable';

export default function ({ referData, courseDataId: nowId, onOk = () => {}, ...restProps }) {
  const dispatch = useDispatch();
  const { courseDataId = nowId, teacherList } = referData || {};
  const [selectedRows, setSelectedRows] = useState();
  const [listRows, setListRows] = useState();

  const saving = useSelector(state => state.loading.effects['pubcourse/updateCourseTeachers']);

  useEffect(() => {
    if (teacherList) {
      setSelectedRows(
        (listRows || []).filter(item => teacherList.some(teacher => teacher.teachrerId === item.courseDataSysUserId))
      );
    }
  }, [listRows]);

  return (
    <Modal
      title="调整教职人员"
      {...restProps}
      footer={[
        <Button key="close" link="cancel" disabled={saving} />,
        <Button key="ok" link="ok" disabled={selectedRows == null || selectedRows.length === 0} loading={saving} />,
      ]}
      onOk={arg => {
        return dispatch({
          type: 'pubcourse/updateCourseTeachers',
          payload: {
            courseDataId,
            userId: selectedRows.map(({ id }) => id),
          },
        }).then(() => {
          message.success('调整成功');
          onOk(arg);
        });
      }}
    >
      <Datatable
        pagination={false}
        personalization={false}
        select="multi"
        url={`/courseScheduleSysUser/list.do?courseDataId=${courseDataId}`}
        rowKey="id"
        columns={[
          {
            title: '姓名',
            dataIndex: 'realName',
            width: 90,
          },
          {
            title: '手机号',
            dataIndex: 'mobile',
            width: 90,
          },
          {
            title: '单位',
            dataIndex: 'companyName',
            width: 90,
          },
        ]}
        onLoadData={setListRows}
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        rowSelection={{
          selectedRows,
        }}
      />
    </Modal>
  );
}
