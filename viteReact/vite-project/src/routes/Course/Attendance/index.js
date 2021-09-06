import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatHM, formatDate, formatModel } from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';
import BatchSignContent from './BatchSignContent';

export default function () {
  const query = getPageQuery();
  const { SignModeTypes, SignStatus } = useSelector(state => state.pubcourse);
  const [table, setTableInit] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [, setSelectedRows] = useState();

  function cancelContent() {
    setShowContentMode(null);
  }

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          url="/publicStudyCourse/list.do"
          rowKey="id"
          columns={[
            {
              title: '主订单号',
              dataIndex: 'dealId',
              width: 80,
            },
            {
              title: '会员姓名',
              dataIndex: 'realName',
              width: 80,
            },
            {
              title: '会员手机号',
              dataIndex: 'mobile',
              width: 120,
            },
            {
              title: '学员姓名',
              dataIndex: 'pubStudyName',
              width: 80,
            },
            {
              title: '学员手机号',
              dataIndex: 'pubStudyMobile',
              width: 120,
            },
            {
              title: '课程编号',
              dataIndex: 'courseId',
              width: 75,
            },
            {
              title: '课程周期数据编号',
              dataIndex: 'courseDataId',
              width: 130,
            },
            {
              title: '课程名称',
              dataIndex: 'courseName',
              width: 130,
            },
            {
              title: '课程日期',
              dataIndex: 'classDate',
              render: formatDate,
              width: 100,
            },
            {
              title: '开始时间',
              dataIndex: 'classStartTime',
              render: formatHM,
              width: 75,
            },
            {
              title: '结束时间',
              dataIndex: 'classEndTime',
              render: formatHM,
              width: 75,
            },
            {
              title: '签到方式',
              dataIndex: 'signInMode',
              render: value => formatModel(SignModeTypes, value),
              width: 75,
            },
            {
              title: '签到时间',
              dataIndex: 'signIn',
              render: formatDateTime,
              width: 150,
            },
            {
              title: '签到说明',
              dataIndex: 'signInDescr',
              width: 75,
            },
            {
              title: '签退方式',
              dataIndex: 'signOutMode',
              render: value => formatModel(SignModeTypes, value),
              width: 75,
            },
            {
              title: '签退时间',
              dataIndex: 'signOut',
              render: formatDateTime,
              width: 150,
            },
            {
              title: '签退说明',
              dataIndex: 'signOutDescr',
              width: 75,
            },
            {
              title: '事件保存时间',
              dataIndex: 'eventTime',
              render: formatDateTime,
              width: 150,
            },
            {
              title: '事件标签',
              dataIndex: 'eventTag',
              width: 80,
            },
            {
              title: '事件说明',
              dataIndex: 'eventDescr',
              width: 75,
            },
            {
              title: '备注',
              dataIndex: 'descr',
              width: 60,
            },
            {
              title: '会员编号',
              dataIndex: 'pubAccountId',
              width: 90,
            },
            {
              title: '学员编号',
              dataIndex: 'pubStudyId',
              width: 80,
            },
            {
              title: '创建时间',
              dataIndex: 'gmtCreate',
              render: formatDateTime,
              width: 170,
            },
            {
              title: '更新时间',
              dataIndex: 'gmtModified',
              render: formatDateTime,
              width: 170,
            },
            {
              title: '创建人',
              dataIndex: 'createRealName',
              width: 120,
            },
            {
              title: '单位名称',
              dataIndex: 'companyName',
              width: 150,
            },
          ]}
          formSearch={{
            fields: [
              {
                label: '签到状态',
                name: 'signInState',
                options: modelMapToOption(SignStatus),
                type: ItemTypes.Select,
              },
              {
                label: '课程编号',
                name: 'courseId',
              },
              {
                label: '课程周期数据编号',
                name: 'courseDataId',
                initialValue: query.courseDataId,
              },
              {
                label: '课程名称',
                name: 'courseName',
                initialValue: (() => {
                  const { courseName } = getPageQuery();
                  if (courseName) {
                    return courseName;
                  }
                })(),
                defHidden: true,
              },
              [
                {
                  label: '课程日期（始）',
                  name: 'classStartDate',
                  placeholder: '开始时间',
                  type: ItemTypes.DatePickerRangeStart,
                  defHidden: true,
                },
                {
                  label: '课程日期（止）',
                  name: 'classEndDate',
                  placeholder: '结束时间',
                  type: ItemTypes.DatePickerRangeEnd,
                  defHidden: true,
                },
              ],
              [
                {
                  label: '开始时间',
                  name: 'classStartTime',
                  initialValue: (() => {
                    const { courseStartTime } = getPageQuery();
                    if (courseStartTime) {
                      return +courseStartTime;
                    }
                  })(),
                  type: ItemTypes.TimePickerRangeStart2,
                  defHidden: true,
                },
                {
                  label: '结束时间',
                  name: 'classEndTime',
                  initialValue: (() => {
                    const { courseEndTime } = getPageQuery();
                    if (courseEndTime) {
                      return +courseEndTime;
                    }
                  })(),
                  type: ItemTypes.TimePickerRangeEnd2,
                  defHidden: true,
                },
              ],
              {
                label: '会员姓名',
                name: 'realName',
                initialValue: (() => {
                  const { pubRealName } = getPageQuery();
                  if (pubRealName) {
                    return pubRealName;
                  }
                })(),
                defHidden: true,
              },
              {
                label: '会员手机号',
                name: 'mobile',
                initialValue: (() => {
                  const { pubMobile } = getPageQuery();
                  if (pubMobile) {
                    return pubMobile;
                  }
                })(),
                defHidden: true,
              },
              {
                label: '主订单编号',
                name: 'dealId',
                initialValue: query.dealId,
                defHidden: true,
              },
              {
                label: '学员编号',
                name: 'pubStudyId',
                initialValue: query.pubStudyId,
                defHidden: true,
              },
              {
                label: '学员姓名',
                name: 'pubStudyName',
                defHidden: true,
              },
              {
                label: '学员手机号',
                name: 'pubStudyMobile',
                defHidden: true,
              },
            ],
          }}
          operation={{
            buttons: [
              {
                auth: 'batch-sign',
                text: '批量补签',
                forRow: 'multi',
                action() {
                  setShowContentMode(1);
                },
              },
              {
                auth: 'export',
                btnType: ButtonTypes.Export,
              },
            ],
          }}
          onInit={setTableInit}
          onSelectedChange={(_, rows) => {
            setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
            setSelectedRows(rows);
          }}
          content={(() => {
            switch (showContentMode) {
              case 1:
                return (
                  <BatchSignContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('审核成功');
                      cancelContent();
                      table.reload();
                    }}
                  />
                );
              default:
                return null;
            }
          })()}
        />
      </Card>
    </PageHeaderLayout>
  );
}
