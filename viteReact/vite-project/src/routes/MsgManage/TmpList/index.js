import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import LevelView from '@/components/LevelView';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatModel } from '@/utils/format';
import { modal } from '@/utils/feedback';
import { modelMapToOption } from '@/utils/utils';
import MessageEditContent from './MessageEditContent';
import ExamineModal from './ExamineModal';
import styles from './index.less';

export default function () {
  const dispatch = useDispatch();
  const { PushType, PushMode, AuthStatus, SendStatus } = useSelector(state => state.message);
  const [selectedRows, setSelectedRows] = useState([]);
  const [table, setTableInit] = useState();
  const [levelView, setLevelView] = useState();
  const [examineVisible, setExamineVisible] = useState(false);

  const goNotice = (value, record) => {
    const { pushType, id } = record;
    return (
      <Link to={`/basic/msgmanage/notice/${pushType === PushType.ShortMessage.key ? 'short' : 'wechat'}?id=${id}`}>
        {value}
      </Link>
    );
  };

  const overrideSetting = {
    // override
    render: value => value,
  };

  const columns = useMemo(
    () => [
      {
        title: '群发编号',
        dataIndex: 'id',
        render: (value, record) => goNotice(value, record),
        width: 80,
      },
      {
        title: '发送内容',
        dataIndex: 'content',
        width: 300,
      },
      {
        title: '提交状态',
        dataIndex: 'authStatus',
        render: value => {
          return (
            <span
              className={classNames({
                [styles.examine]: value === AuthStatus.Examineing.key,
              })}
            >
              {formatModel(AuthStatus, value)}
            </span>
          );
        },
        width: 80,
      },
      {
        title: '发送消息数',
        dataIndex: 'messageNums',
        align: 'center',
        render: (value, record) => goNotice(value, record),
        width: 100,
      },
      {
        title: '已发送完数',
        dataIndex: 'successNums',
        align: 'center',
        render: (value, record) => goNotice(value, record),
        width: 100,
      },
      {
        title: '号码总数',
        dataIndex: 'mobileNums',
        align: 'center',
        width: 80,
      },
      {
        title: '发送状态',
        dataIndex: 'sendStatus',
        render: value => {
          return (
            <span
              className={classNames({
                [styles.fail]: value === SendStatus.SEND_FAIL.key || value === SendStatus.PART_FAIL.key,
              })}
            >
              {formatModel(SendStatus, value)}
            </span>
          );
        },
        width: 100,
      },
      {
        title: '消息类型',
        dataIndex: 'pushType',
        render: value => formatModel(PushType, value),
        width: 100,
      },
      {
        title: '发送方式',
        dataIndex: 'pushMode',
        render: value => formatModel(PushMode, value),
        width: 100,
      },
      {
        title: '定时时间',
        dataIndex: 'pushDate',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '审核人',
        dataIndex: 'updateRealName',
        width: 100,
      },
      {
        title: '审核时间',
        dataIndex: 'authTime',
        render: formatDateTime,
        width: 190,
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
        width: 190,
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
      fields: [
        {
          label: '发送状态',
          name: 'sendStatus',
          options: modelMapToOption(SendStatus),
          type: ItemTypes.Select,
        },
        {
          label: '消息类型',
          name: 'pushType',
          options: modelMapToOption(PushType),
          type: ItemTypes.Select,
        },
        {
          label: '发送方式',
          name: 'pushMode',
          options: modelMapToOption(PushMode),
          type: ItemTypes.Select,
        },
        [
          {
            label: '创建时间（始）',
            name: 'startTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '创建时间（止）',
            name: 'endTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        {
          label: '提交状态',
          name: 'authStatus',
          options: modelMapToOption(AuthStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '发送内容',
          name: 'templateContent',
          defHidden: true,
        },
        {
          label: '审核时间',
          name: 'authTime',
          type: ItemTypes.DatePicker,
          defHidden: true,
        },
        {
          label: '审核人',
          name: 'updateRealName',
          defHidden: true,
        },
      ].filter(Boolean),
    }),
    []
  );

  const goAddContent = edit => {
    levelView.pushView(
      <LevelView.SubView>
        <MessageEditContent edit={edit} data={selectedRows[0]} />
      </LevelView.SubView>,
      () => {
        table.reload();
      }
    );
  };

  const handelExamineVisibleChange = visible => {
    setExamineVisible(visible);
  };

  const operation = {
    export: {
      settings: {
        id: overrideSetting,
        messageNums: overrideSetting,
        successNums: overrideSetting,
      },
    },
    buttons: [
      {
        text: '添加',
        icon: 'plus',
        action() {
          goAddContent();
        },
      },
      {
        text: '修改',
        type: 'primary',
        icon: 'edit',
        forRow: rows => {
          if (rows.length !== 1) {
            return false;
          }
          const { authStatus } = rows[0];
          return authStatus === AuthStatus.Editing.key || authStatus === AuthStatus.Rejected.key;
        },
        action() {
          goAddContent('edit');
        },
      },
      {
        text: '审核',
        auth: 'examine',
        type: 'primary',
        forRow: rows => {
          if (rows.length !== 1) {
            return false;
          }
          return rows[0].authStatus === AuthStatus.Examineing.key;
        },
        action() {
          handelExamineVisibleChange(true);
        },
      },
      {
        text: '删除',
        type: 'danger',
        icon: 'delete',
        forRow: rows => {
          if (rows.length !== 1) {
            return false;
          }
          return rows[0].authStatus === AuthStatus.Editing.key;
        },
        async action() {
          modal.confirm('确认删除吗？', {
            onOk: async () => {
              await dispatch({
                type: 'message/delMessage',
                payload: {
                  messagePushConfigId: selectedRows[0].id,
                },
              });
              message.success('删除成功');
              table.reload();
            },
          });
        },
      },
      {
        btnType: ButtonTypes.Export,
      },
    ],
  };

  return (
    <PageHeaderLayout>
      <LevelView ref={setLevelView}>
        <Card bordered={false}>
          <Datatable
            select="multi"
            url="/messagePushConfig/dataList.do"
            rowKey="id"
            columns={columns}
            formSearch={formSearch}
            operation={operation}
            onInit={setTableInit}
            onSelectedChange={(_, rows) => {
              setSelectedRows(rows);
            }}
          />
        </Card>
      </LevelView>
      <ExamineModal
        visible={examineVisible}
        onVisibleChange={handelExamineVisibleChange}
        messagePushConfigId={(selectedRows[0] || {}).id}
        onOk={() => table.reload()}
      />
    </PageHeaderLayout>
  );
}
