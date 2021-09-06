import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { message, Button } from 'antd';
import Modal from '@/components/Modal';
import Datatable from '@/components/Datatable';
import { formatModel, formatBoolean } from '@/utils/format';
import { modal } from '@/utils/feedback';

export default function ({ referData, courseDataId: nowId, onOk = () => {}, ...restProps }) {
  const dispatch = useDispatch();
  const { courseDataId = nowId, platformList, classStartTime, classEndTime } = referData || {};
  const [selectedRows, setSelectedRows] = useState();
  const [listRows, setListRows] = useState();

  const { Industries, ProfessionTypes } = useSelector(state => state.venue);
  const saving = useSelector(state => state.loading.effects['pubcourse/updateCoursePlatforms']);

  useEffect(() => {
    if (platformList) {
      setSelectedRows(
        (listRows || []).filter(item => platformList.some(platform => platform.id === item.courseDataPlatformId))
      );
    }
  }, [listRows]);

  return (
    <Modal
      title="调整场地"
      width={768}
      {...restProps}
      footer={[
        <Button key="close" link="cancel" disabled={saving} />,
        <Button key="ok" link="ok" disabled={selectedRows == null || selectedRows.length === 0} loading={saving} />,
      ]}
      onOk={arg => {
        const fn = () =>
          dispatch({
            type: 'pubcourse/updateCoursePlatforms',
            payload: {
              courseDataId,
              platformId: selectedRows.map(({ id }) => id),
            },
          }).then(() => {
            message.success('调整成功');
            onOk(arg);
          });
        if (selectedRows.some(item => item.isOccupy)) {
          modal.confirm('您选择的场地有已被占用的，您是否需要继续使用已选场地？', {
            onOk: () => {
              const { deepCallOk } = arg;
              deepCallOk(fn);
            },
          });
          return false;
        }
        return fn();
      }}
    >
      <Datatable
        pagination={false}
        personalization={false}
        select="multi"
        url={`/courseSchedulePlatform/platformList.do?courseDataId=${courseDataId}&startTime=${
          classStartTime || ''
        }&endTime=${classEndTime || ''}`}
        rowKey="id"
        columns={[
          {
            title: '是否已占场',
            dataIndex: 'isOccupy',
            render: value => (
              <span
                className={classNames({
                  red: value,
                })}
              >
                {formatBoolean(value)}
              </span>
            ),
            width: 90,
          },
          {
            title: '场地名称',
            dataIndex: 'platformName',
            render: (value, { parentPlatformName }) =>
              `${parentPlatformName || ''}${parentPlatformName ? '-' : ''}${value}`,
            width: 90,
          },
          {
            title: '项目类型',
            dataIndex: 'professionalId',
            render: value => formatModel(ProfessionTypes, value),
            width: 90,
          },
          {
            title: '营销中心',
            dataIndex: 'salesName',
            width: 150,
          },
          {
            title: '行业',
            dataIndex: 'industryId',
            render: value => formatModel(Industries, value),
            width: 90,
          },
          {
            title: '单位',
            dataIndex: 'companyName',
            width: 150,
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
