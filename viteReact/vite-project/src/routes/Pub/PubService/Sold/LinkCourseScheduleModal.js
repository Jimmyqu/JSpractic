import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import Modal from '@/components/Modal';
import Datatable, { ItemTypes } from '@/components/Datatable';

export default function ({ onOk = () => {}, data, ...restProps }) {
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState();
  const [listRows, setListRows] = useState();
  const { id, pubServiceDataList } = data || {};

  const saving = useSelector(state => state.loading.effects['pubcourse/saveLinkCourseCycle']);

  useEffect(() => {
    if (pubServiceDataList) {
      setSelectedRows(
        (listRows || []).filter(item =>
          pubServiceDataList.some(d => (d.courseScheduleCycleList || []).some(cyc => cyc.id === item.id))
        )
      );
    }
  }, [listRows]);

  const columns = useMemo(
    () => [
      {
        title: '课程名称',
        dataIndex: 'courseName',
        width: 130,
      },
      {
        title: '课程编号',
        dataIndex: 'courseId',
        width: 110,
      },
      {
        title: '营销中心',
        dataIndex: 'salesName',
        width: 130,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 130,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      col: 12,
      fields: [
        {
          label: '营销中心',
          name: 'salesId',
          type: ItemTypes.CascaderVenue,
        },
        {
          label: '课程名称',
          name: 'courseName',
        },
        {
          label: '课程编号',
          name: 'courseId',
        },
      ],
    }),
    []
  );

  if (!id) {
    return null;
  }

  return (
    <Modal
      title="绑定课程"
      width={768}
      {...restProps}
      footer={[
        <Button key="close" link="cancel" disabled={saving} />,
        <Button key="ok" link="ok" disabled={selectedRows == null || selectedRows.length === 0} loading={saving} />,
      ]}
      onOk={arg => {
        return dispatch({
          type: 'pubcourse/saveLinkCourseCycle',
          payload: {
            courseIds: selectedRows.map(item => item.courseId),
            pubServiceAccountId: id,
          },
        }).then(() => {
          onOk(arg);
        });
      }}
    >
      <Datatable
        pagination={false}
        personalization={false}
        select="multi"
        url={`/publicServiceAccount/courseData.do?pubServiceAccountId=${id}`}
        rowKey="courseId"
        columns={columns}
        formSearch={formSearch}
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
