import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import { Link } from 'react-router-dom';
import Datatable, { ItemTypes } from '@/components/Datatable';
import LevelView from '@/components/LevelView';
import { modelMapToOption } from '@/utils/utils';
import { formatModel, formatBoolean, formatMoneyLen2, formatDate, formatDateTime } from '@/utils/format';
import { modal } from '@/utils/feedback';
import CertInfo from './CertInfo';
import EditContent from './CertConfigEditContent';
import CertNumberConfig from './CertNumberConfig';

function CertConfig(props, { pushView }) {
  const dispatch = useDispatch();
  const { Industries, Careers, ProfessionTypes } = useSelector(state => state.venue);
  const deleting = useSelector(state => state.loading.effects['pubserviceuser/delCertCfg']);
  const { CertFlowNodes, CertCfgStates, UserTypes, CertNumberRule } = useSelector(state => state.pubserviceuser);
  const { ServiceTypes } = useSelector(state => state.pubservice);
  const [table, setTableInit] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showContentMode, setShowContentMode] = useState();

  function cancelContent() {
    setShowContentMode(null);
  }

  function getCareer(careerId) {
    switch (careerId) {
      case Careers.SPORTS_TEACHER.key:
        return 'teacher';
      case Careers.SPORTS_TEACH.key:
        return 'coach';
      case Careers.SPORTS_TRAINER.key:
        return 'referee';
      case Careers.SPORTS_ATHLETE.key:
        return 'athlete';
      case Careers.CERT_PUB.key:
        return 'cert';
      default:
        return null;
    }
  }

  const listUrl = record => {
    const { careerId, professionalId, industryId } = record;
    return `/basic/certmng/list/${getCareer(careerId)}?professionalId=${professionalId}&industryId=${industryId}`;
  };

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '认证名称',
        dataIndex: 'certTitle',
        width: 150,
      },
      {
        title: '职业',
        dataIndex: 'careerId',
        render: (_, record) => <Link to={listUrl(record)}>{formatModel(Careers, record.careerId)}</Link>,
        width: 100,
      },
      {
        title: '专业项目',
        dataIndex: 'professionalId',
        render: (_, record) => <Link to={listUrl(record)}>{formatModel(ProfessionTypes, record.professionalId)}</Link>,
        width: 100,
      },
      {
        title: '行业',
        dataIndex: 'industryId',
        render: (_, record) => <Link to={listUrl(record)}>{formatModel(Industries, record.industryId)}</Link>,
        width: 100,
      },
      {
        title: '用户类型',
        dataIndex: 'certType',
        render: value => formatModel(UserTypes, value),
        width: 100,
      },
      // {
      //   title: '证书模版图片',
      //   dataIndex: 'id',
      //   width: 100,
      // },
      {
        title: '认证流程类型',
        dataIndex: 'certFlows',
        render: value =>
          (value || []).map((flow, i) => <div key={flow}>{`${i + 1}. ${formatModel(CertFlowNodes, flow)}`}</div>),
        width: 130,
      },
      {
        title: '证书编号生成方式',
        dataIndex: 'certNoGenMode',
        render: value => formatModel(CertNumberRule, value),
        width: 130,
      },
      {
        title: '可否重新认证',
        dataIndex: 'recertification',
        render: formatBoolean,
        width: 130,
      },
      {
        title: '动态有效期(天)',
        align: 'center',
        dataIndex: 'certValidDate',
        render: (value, record) => {
          if (record.certValidType === ServiceTypes.DYNAMICINVISIBLE.key) {
            return value;
          }
          return null;
        },
        width: 120,
      },
      {
        title: '固定有效期',
        dataIndex: 'certValidStartDate',
        render: (value, { certValidEndDate, certValidType }) => {
          if (value && certValidType === ServiceTypes.FIXATIONINVISIBLE.key) {
            return `${formatDate(value)} 至 ${formatDate(certValidEndDate)}`;
          }
          return null;
        },
        width: 190,
      },
      {
        title: '认证金额',
        dataIndex: 'certPrice',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '申请时间(始)',
        dataIndex: 'startTime',
        render: formatDate,
        width: 100,
      },
      {
        title: '申请时间(止)',
        dataIndex: 'endTime',
        render: formatDate,
        width: 100,
      },
      {
        title: '认证简介',
        dataIndex: 'certIntroduce',
        width: 200,
      },
      {
        title: '提交后待审核提醒',
        dataIndex: 'certAlert',
        width: 200,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'certState',
        render: value => formatModel(CertCfgStates, value),
        width: 100,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 100,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 150,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateTime,
        width: 190,
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
        width: 150,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '行业',
          name: 'industryId',
          options: modelMapToOption(Industries),
          type: ItemTypes.Select,
        },
        {
          label: '职业',
          name: 'careerId',
          options: modelMapToOption(Careers),
          type: ItemTypes.Select,
        },
        {
          label: '专业项目',
          name: 'professionalId',
          options: modelMapToOption(ProfessionTypes),
          type: ItemTypes.Select,
        },
        {
          label: '认证名称',
          name: 'certTitle',
          defHidden: true,
        },
        {
          label: '更新人',
          name: 'updateRealName',
          defHidden: true,
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '添加',
          disabled: deleting,
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit',
          text: '修改',
          forRow: 'single',
          disabled: deleting,
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'remove',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          loading: deleting,
          action() {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'pubserviceuser/delCertCfg',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'info',
          text: '认证信息',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="认证信息">
                <CertInfo certConfigId={selectedRows[0].id} />
              </LevelView.SubView>
            );
          },
        },
        {
          auth: 'audit',
          text: '审核配置',
          forRow: 'single',
          action() {
            dispatch(
              push({
                pathname: 'auditcfg',
                search: `dataId=${selectedRows[0].id}`,
              })
            );
          },
        },
        {
          text: '认证编号规则',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="认证编号配置">
                <CertNumberConfig certConfigId={selectedRows[0].id} />
              </LevelView.SubView>
            );
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
        url="/certConfig/dataList.do"
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
        content={(() => {
          switch (showContentMode) {
            case 1:
            case 2:
              return (
                <EditContent
                  edit={showContentMode === 2}
                  cancel={cancelContent}
                  sure={() => {
                    message.success(`${showContentMode === 2 ? '修改' : '添加'}成功`);
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
  );
}

CertConfig.contextTypes = {
  pushView: PropTypes.func,
};

export default CertConfig;
