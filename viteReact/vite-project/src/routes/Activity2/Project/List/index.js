import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import LevelView from '@/components/LevelView';
import AuditConfirmModal from '@/components/Activity2/AuditConfirmModal';
import TimeLineModal from '@/components/Activity2/TimeLineModal';
import ColorStateView from '@/components/Activity2/ColorStateView';
import ViewHeader from '@/components/Activity2/ViewHeader';
import { formatDateTime, formatModel } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import Reviewer from './Reviewer';

function converState(ProjectAuditStates, state) {
  switch (state) {
    case ProjectAuditStates.Approved.key:
      return ViewHeader.States.Yes;
    case ProjectAuditStates.Rejected.key:
    case ProjectAuditStates.Cancel.key:
      return ViewHeader.States.No;
    default:
  }
  return ViewHeader.States.Pending;
}

function List() {
  const dispatch = useDispatch();
  const cancelIng = useSelector(state => state.loading.effects['activity2/cancelReq']);
  const auditIng = useSelector(state => state.loading.effects['activity2/auditReq']);
  const logFetching = useSelector(state => state.loading.effects['activity2/fetchAuditLog']);

  const { ProjectAuditStates } = useSelector(state => state.activity2);
  const [auditType, setAuditType] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [levelView, setLevelView] = useState();
  const [table, setTableInit] = useState();
  const [logs, setLogs] = useState([]);
  const [logModalVisible, setLogModalVisible] = useState(false);

  useEffect(() => {
    if (logModalVisible) {
      dispatch({
        type: 'activity2/fetchAuditLog',
        payload: {
          auditDataId: selectedRows[0].id,
        },
      }).then(res => {
        setLogs(res.rows);
      });
    }
  }, [logModalVisible]);

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 150,
      },
      {
        title: '申报项目',
        dataIndex: 'reportName',
        width: 120,
      },
      {
        title: '申报项目编号',
        dataIndex: 'reportConfigId',
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'auditState',
        render: value => {
          return (
            <ColorStateView state={converState(ProjectAuditStates, value)}>
              {formatModel(ProjectAuditStates, value)}
            </ColorStateView>
          );
        },
        width: 90,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 250,
      },
      {
        title: '业务名称',
        dataIndex: 'xxx',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: formatDateTime,
        width: 170,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '申报项目',
          name: 'reportName',
        },
        {
          label: '单位名称',
          name: 'companyName',
        },
        {
          label: '审核状态',
          name: 'auditState',
          options: modelMapToOption(ProjectAuditStates),
          type: ItemTypes.Select,
        },
        [
          {
            label: '操作时间（始）',
            name: 'startTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '操作时间（止）',
            name: 'endTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          text: '申报活动',
          type: 'primary',
          auth: 'create-activity',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { auditState, isApply } = rows[0];
            return isApply && auditState === ProjectAuditStates.Approved.key;
          },
          action() {
            dispatch(push(`activity/info?reportCompanyListId=${selectedRows[0].id}`));
          },
        },
        {
          text: '编辑',
          type: 'primary',
          auth: 'project-edit',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { auditState, isApply } = rows[0];
            return (
              isApply &&
              (auditState === ProjectAuditStates.Rejected.key || auditState === ProjectAuditStates.Cancel.key)
            );
          },
          action() {
            dispatch(push(`req?id=${selectedRows[0].id}&edit=1`));
          },
        },
        {
          text: '审核人设置',
          auth: 'project-reviewer',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { isApply, companyExerciseAudit } = rows[0];
            // companyExerciseAudit 包含有申请单位审核节点
            return isApply && companyExerciseAudit;
          },
          action() {
            levelView.pushView(
              <LevelView.SubView title="审核人">
                <Reviewer configId={selectedRows[0].id} />
              </LevelView.SubView>
            );
          },
        },
        {
          text: '审核',
          type: 'primary',
          auth: 'project-auth',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { auditState, isAudit } = rows[0];
            return isAudit && auditState === ProjectAuditStates.Wait.key;
          },
          action() {
            setAuditType(2);
          },
        },
        {
          text: '审核资质详情',
          forRow: 'single',
          action() {
            dispatch(push(`req?id=${selectedRows[0].id}`));
          },
        },
        {
          text: '申报的活动',
          auth: 'activity-search',
          forRow: 'single',
          action() {
            const { id, companyName } = selectedRows[0];
            dispatch(push(`activity/list?reportCompanyListId=${id}&companyName=${encodeURIComponent(companyName)}`));
          },
        },
        {
          text: '撤销',
          type: 'danger',
          auth: 'project-cancel',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { auditState, isApply } = rows[0];
            return isApply && auditState === ProjectAuditStates.Wait.key;
          },
          action() {
            setAuditType(1);
          },
        },
        {
          text: '审核日志',
          forRow(rows) {
            if (rows.length !== 1) {
              return false;
            }
            const { auditState } = rows[0];
            return auditState === ProjectAuditStates.Approved.key;
          },
          action() {
            setLogModalVisible(true);
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    [levelView, selectedRows]
  );

  const auditTitle = auditType === 1 ? '撤销' : '审核';

  return (
    <PageHeaderLayout>
      <LevelView ref={setLevelView}>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={(_, rows) => {
              setSelectedRows(rows);
            }}
            url="/reportCompanyList/dataList.do"
            columns={columns}
            rowKey="id"
            formSearch={formSearch}
            operation={operation}
            onInit={setTableInit}
          />
        </Card>
      </LevelView>

      <TimeLineModal
        log={{ logs, loading: logFetching }}
        visible={logModalVisible}
        onVisibleChange={setLogModalVisible}
      />
      <AuditConfirmModal
        isAudit={auditType === 2}
        loading={cancelIng || auditIng}
        visible={!!auditType}
        title={auditTitle}
        onVisibleChange={val => {
          if (val) {
            setAuditType(val);
            return;
          }
          setAuditType(null);
        }}
        onReject={async ({ auditReasons, fileKeys }) => {
          await dispatch({
            type: 'activity2/auditReq',
            payload: {
              id: selectedRows[0].id,
              auditDescription: auditReasons,
              fileKeys,
            },
          });
          setAuditType(null);
          message.success('驳回成功');
          table.reload();
        }}
        onSure={async ({ auditReasons, fileKeys }) => {
          await dispatch({
            type: auditType === 1 ? 'activity2/cancelReq' : 'activity2/auditReq',
            payload: {
              id: selectedRows[0].id,
              auditDescription: auditReasons,
              fileKeys,
              ok: true,
            },
          });
        }}
        onOk={() => {
          message.success(`${auditTitle}成功`);
          table.reload();
        }}
      />
    </PageHeaderLayout>
  );
}

export default List;
