import { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { modelMapToOption } from '@/utils/utils';
import { formatModel, formatDateTime } from '@/utils/format';
import BindingContent from './BindingContent';
import BanContent from './BanContent';
import LostItContent from './LostItContent';
import RebindingContent from './RebindingContent';
import EditSimpleContent from './EditSimpleContent';

export default function () {
  const { MagneticCardTypes, MagneticCardUserTypeList, MagneticCardStatus } = useSelector(state => state.pubticket);
  const { PubServicePrintCardStatus } = useSelector(state => state.pubservice);
  const { RelTypes } = useSelector(state => state.global);
  const [table, setTable] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [, setSelectedRows] = useState();

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const afterSure = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const onSelectedChange = useCallback((_, rows) => {
    setSelectedRows(rows);
    setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
  }, []);

  const columns = useMemo(
    () => [
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
        title: '物理卡号',
        dataIndex: 'icPhysicsNo',
        width: 150,
      },
      {
        title: '数据类型',
        dataIndex: 'relType',
        render: value => formatModel(RelTypes, value),
        width: 110,
      },
      {
        title: '状态',
        dataIndex: 'icState',
        render: value => formatModel(MagneticCardStatus, value),
        width: 90,
      },
      {
        title: '卡片状态',
        dataIndex: 'cardState',
        render: value => formatModel(PubServicePrintCardStatus, value),
        width: 75,
      },
      {
        title: '会员服务名称',
        dataIndex: 'serviceName',
        width: 150,
      },
      {
        title: '数据编号',
        dataIndex: 'dataId',
        render: (value, { relType }) => {
          if (relType === RelTypes.PUBSERVICE_ACCOUNT.key) {
            return <Link to={`/basic/pub/pubservicesold?pubServiceAccountId=${value}`}>{value}</Link>;
          }
          if (relType === RelTypes.SYS_USER.key) {
            return <Link to={`/sys/sysuser?id=${value}`}>{value}</Link>;
          }
          return value;
        },
        width: 90,
      },
      {
        title: '持有人姓名',
        dataIndex: 'realName',
        width: 130,
      },
      {
        title: '持有人手机号',
        dataIndex: 'mobile',
        width: 130,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 150,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 100,
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
          label: '卡号',
          name: 'icNo',
        },
        {
          label: '持有人手机号',
          name: 'mobile',
        },
        {
          label: '持有人姓名',
          name: 'realName',
        },
        {
          label: '状态',
          name: 'icState',
          options: modelMapToOption(MagneticCardStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '备注',
          name: 'descr',
          defHidden: true,
        },
        {
          label: '卡类型',
          name: 'icType',
          options: modelMapToOption(MagneticCardTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '创建人',
          name: 'createRealName',
          defHidden: true,
        },
        {
          label: '数据类型',
          name: 'relType',
          options: modelMapToOption(MagneticCardUserTypeList),
          type: ItemTypes.Select,
          defHidden: true,
        },
        [
          {
            label: '创建时间(始)',
            name: 'startGmtCreate',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '创建时间(止)',
            name: 'endGmtCreate',
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
      export: {
        settings: {
          dataId: {
            // override
            render: value => value,
          },
        },
      },
      buttons: [
        {
          auth: 'binding',
          type: 'primary',
          text: '绑定IC/物理卡',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'ban',
          type: 'danger',
          text: '禁用',
          forRow: rows => {
            if (rows.length === 0) {
              return;
            }
            return rows.every(row => row.icState === MagneticCardStatus.Enable.key);
          },
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'ban',
          type: 'primary',
          text: '启用',
          forRow: rows => {
            if (rows.length !== 1) {
              return;
            }
            return rows[0].icState === MagneticCardStatus.Disable.key;
          },
          action() {
            setShowContentMode(5);
          },
        },
        {
          auth: 'lostit',
          type: 'danger',
          text: '作废',
          forRow: rows => {
            if (rows.length !== 1) {
              return;
            }
            const { icState, cardState } = rows[0];
            return icState === MagneticCardStatus.Enable.key && cardState !== PubServicePrintCardStatus.NotYet.key;
          },
          action() {
            setShowContentMode(3);
          },
        },
        {
          auth: 'rebinding',
          text: '重新绑定',
          forRow: rows => {
            if (rows.length !== 1) {
              return;
            }
            const { icState, cardState } = rows[0];
            return icState === MagneticCardStatus.Enable.key && cardState === PubServicePrintCardStatus.NotYet.key;
          },
          action() {
            setShowContentMode(4);
          },
        },
        {
          text: '修改',
          forRow: rows => {
            if (rows.length !== 1) {
              return;
            }
            const { icState, cardState } = rows[0];
            return icState === MagneticCardStatus.Enable.key && cardState === PubServicePrintCardStatus.NotYet.key;
          },
          action() {
            setShowContentMode(6);
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    []
  );

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          url="/iotIcData/dataList.do"
          columns={columns}
          onInit={setTable}
          rowKey="id"
          formSearch={formSearch}
          operation={operation}
          onSelectedChange={onSelectedChange}
          content={(() => {
            switch (showContentMode) {
              case 1:
                return (
                  <BindingContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('添加成功');
                      afterSure();
                    }}
                  />
                );
              case 2:
              case 5:
                return (
                  <BanContent
                    cancel={cancelContent}
                    enable={showContentMode === 5}
                    sure={() => {
                      message.success(`${showContentMode === 2 ? '禁用' : '启用'}成功`);
                      afterSure();
                    }}
                  />
                );
              case 3:
                return (
                  <LostItContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('作废成功');
                      afterSure();
                    }}
                  />
                );
              case 4:
                return (
                  <RebindingContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('重新绑定成功');
                      afterSure();
                    }}
                  />
                );
              case 6:
                return (
                  <EditSimpleContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('修改成功');
                      afterSure();
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
