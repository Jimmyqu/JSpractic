import { useState } from 'react';
import { stringify } from 'qs';
import { Card } from 'antd';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDate, formatHM, formatModel, formatDateTime } from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';

const QueryStatus = {
  Done: {
    key: 1,
    value: '已下课',
  },
  Will: {
    key: 2,
    value: '未上课',
  },
  Ing: {
    key: 3,
    value: '上课中',
  },
};

export default function () {
  const query = getPageQuery();
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState();
  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          url="/courseClassData/list.do"
          rowKey={record => `${record.courseId}-${record.id}-${(record.teachingStaff || []).join('/')}`}
          columns={[
            {
              title: '课程编号',
              dataIndex: 'courseId',
              width: 80,
            },
            {
              title: '课程周期数据编号',
              dataIndex: 'id',
              width: 130,
            },
            {
              title: '课程名称',
              dataIndex: 'courseName',
              width: 150,
            },
            {
              title: '课程日期',
              dataIndex: 'classDate',
              render: formatDate,
              width: 130,
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
              title: '课程状态',
              dataIndex: 'courseState',
              render: value => formatModel(QueryStatus, value),
              width: 75,
            },
            {
              title: '已报人数',
              dataIndex: 'signupNum',
              width: 75,
            },
            {
              title: '已到人数',
              dataIndex: 'arriveNum',
              width: 75,
            },
            {
              title: '未到人数',
              dataIndex: 'notArriveNum',
              width: 75,
            },
            {
              title: '其他事件标签',
              dataIndex: 'eventTagNum',
              width: 110,
            },
            {
              title: '留言数量',
              dataIndex: 'auditNum',
              width: 75,
            },
            {
              title: '评分数量',
              dataIndex: 'scoreNum',
              width: 75,
            },
            {
              title: '训练强度',
              dataIndex: 'levelNum',
              width: 75,
            },
            {
              title: '训练图片数',
              dataIndex: 'trainPicNum',
              width: 90,
            },
            {
              title: '训练内容标签',
              dataIndex: 'dataContentTag',
              width: 110,
            },
            {
              title: '训练内容描述',
              dataIndex: 'dataContentDescr',
              width: 150,
            },
            {
              title: '教职人员',
              dataIndex: 'teachingStaff',
              render: value => {
                return (value || []).map(item => <div key={item}>{item}</div>);
              },
              width: 150,
            },
            {
              title: '课程场地',
              dataIndex: 'coursePlatform',
              width: 200,
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
              width: 130,
            },
            {
              title: '创建时间',
              dataIndex: 'gmtCreate',
              render: formatDateTime,
              width: 170,
            },
          ]}
          formSearch={{
            fields: [
              {
                label: '课程名称',
                name: 'courseName',
                initialValue: (() => {
                  const { courseName } = getPageQuery();
                  if (courseName) {
                    return courseName;
                  }
                })(),
              },
              [
                {
                  label: '开始日期',
                  name: 'classStartDate',
                  placeholder: '开始时间',
                  type: ItemTypes.DatePickerRangeStart,
                },
                {
                  label: '结束日期',
                  name: 'classEndDate',
                  placeholder: '结束时间',
                  type: ItemTypes.DatePickerRangeEnd,
                },
              ],
              [
                {
                  label: '开始时间',
                  name: 'classStartTime',
                  type: ItemTypes.TimePickerRangeStart2,
                  defHidden: true,
                },
                {
                  label: '结束时间',
                  name: 'classEndTime',
                  type: ItemTypes.TimePickerRangeEnd2,
                  defHidden: true,
                },
              ],
              {
                label: '课程编号',
                initialValue: query.courseId,
                name: 'courseId',
                defHidden: true,
              },
              {
                label: '课程周期数据编号',
                initialValue: query.courseDataId,
                name: 'id',
                defHidden: true,
              },
              {
                label: '课程状态',
                name: 'courseState',
                options: modelMapToOption(QueryStatus),
                type: ItemTypes.Select,
                defHidden: true,
              },
              {
                label: '教职姓名',
                name: 'realName',
                defHidden: true,
              },
              {
                label: '教职手机号',
                name: 'mobile',
                defHidden: true,
              },
            ],
          }}
          operation={{
            buttons: [
              {
                text: '考勤信息',
                forRow: 'single',
                action() {
                  dispatch(
                    push({
                      pathname: './attendance',
                      search: stringify({
                        courseDataId: selectedRows[0].id,
                      }),
                    })
                  );
                },
              },
              {
                auth: 'export',
                btnType: ButtonTypes.Export,
              },
              {
                text: '排期',
                type: 'primary',
                forRow: 'single',
                action() {
                  dispatch(
                    push({
                      pathname: '/basic/course/sell/list',
                      search: `courseId=${selectedRows[0].courseId}`,
                    })
                  );
                },
              },
            ],
          }}
          onSelectedChange={(_, rows) => {
            setSelectedRows(rows);
          }}
        />
      </Card>
    </PageHeaderLayout>
  );
}
