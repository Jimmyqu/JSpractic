import { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatSrvId, formatMoneyLen2, formatDate, formatDateTime, encodeMoney, formatModel } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { isNumerical } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import Verifier from './Verifier';
import EditContent from './EditContent';

const tableCollapseKey = '1';

export default () => {
  const dispatch = useDispatch();
  const { IssueTypes } = useSelector(state => state.coupon);
  const [collapseState, setCollapseState] = useState([tableCollapseKey]);
  const [table, setTableInit] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showContentMode, setShowContentMode] = useState();

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
        title: '优惠码',
        dataIndex: 'couponCode',
        width: 300,
      },
      {
        title: '核验时间',
        dataIndex: 'checkDataTime',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '核验人',
        dataIndex: 'checkRealName',
        width: 100,
      },
      {
        title: '核验营销中心',
        dataIndex: 'checkSalesName',
        width: 170,
      },
      {
        title: '核验单位',
        dataIndex: 'checkCompanyName',
        width: 150,
      },
      // {
      //   title: '数量',
      //   dataIndex: 'checkRealName',
      //   width: 100,
      // },
      {
        title: '会员名',
        dataIndex: 'pubRealName',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'pubMobile',
        width: 130,
      },
      {
        title: '微信商户号',
        dataIndex: 'issueWechatPayNo',
        width: 200,
      },
      {
        title: '商户订单号',
        dataIndex: 'consumeDealId',
        width: 100,
      },
      {
        title: '消费金额',
        dataIndex: 'consumeTotalPrice',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '消费备注',
        dataIndex: 'consumeContent',
        width: 200,
      },
      // {
      //   title: '发行时间',
      //   dataIndex: 'gmtCreate',
      //   render: formatDateTime,
      //   width: 190,
      // },
      // {
      //   title: '发行方式',
      //   dataIndex: 'issueMode',
      //   width: 100,
      // },
      {
        title: '有效期',
        dataIndex: 'startDate',
        render: (value, { endDate }) => {
          return `${formatDate(value)}至${formatDate(endDate)}`;
        },
        width: 200,
      },
      {
        title: '优惠码/券名称',
        dataIndex: 'couponName',
        width: 130,
      },
      {
        title: '金额',
        dataIndex: 'couponPrice',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '优惠码/券描述',
        dataIndex: 'descr',
        width: 200,
      },
      {
        title: '微信优惠券批次号',
        dataIndex: 'issueWechatStockId',
        width: 200,
      },
      {
        title: '发行类型',
        dataIndex: 'issueType',
        render: value => formatModel(IssueTypes, value),
        width: 100,
      },
      {
        title: '发行单位',
        dataIndex: 'companyName',
        width: 150,
      },
      {
        title: '业务来源',
        dataIndex: 'srvId',
        render: formatSrvId,
        width: 100,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '优惠码',
          name: 'couponCode',
        },
        {
          label: '优惠码/券名称',
          name: 'couponName',
        },
        {
          label: '会员名',
          name: 'pubRealName',
        },
        {
          label: '手机号',
          name: 'pubMobile',
          defHidden: true,
        },
        {
          label: '商户订单号',
          name: 'consumeDealId',
          defHidden: true,
        },
        {
          label: '消费备注',
          name: 'consumeContent',
          defHidden: true,
        },
        {
          label: '核验营销中心',
          name: 'checkSalesId',
          type: ItemTypes.CascaderVenue,
          defHidden: true,
        },
        {
          label: '金额',
          name: 'consumeTotalPrice',
          searchFieldRender(val) {
            if (isNumerical(val)) {
              return encodeMoney(+val);
            }
            return val;
          },
          defHidden: true,
        },
        {
          label: '核验人',
          name: 'checkRealName',
          defHidden: true,
        },
        {
          label: '核验单位',
          name: 'checkCompanyName',
          defHidden: true,
        },
        [
          {
            label: '核验日期（始）',
            name: 'startCheckDataValue',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '核验日期（止）',
            name: 'endCheckDataValue',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '有效期（始）',
            name: 'startDateValue',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '有效期（止）',
            name: 'endDateValue',
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
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
        {
          auth: 'update',
          text: '修改核验信息',
          forRow: 'single',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'cancel',
          text: '退回',
          type: 'danger',
          forRow: 'multi',
          action() {
            modal.confirm('确认取消这些优惠码的核验状态吗？', {
              async onOk() {
                await dispatch({
                  type: 'coupon/cancelVerify',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('操作成功');
                table.reload();
              },
            });
          },
        },
      ],
    }),
    [selectedRows]
  );

  return (
    <PageHeaderLayout>
      <Verifier
        onShowQueryResult={show => {
          if (show) {
            setCollapseState([]);
            return;
          }
          setCollapseState([tableCollapseKey]);
        }}
        onSuccess={() => {
          table.reload();
        }}
      />
      <MarginBar top={50}>
        <Collapse defaultActiveKey={collapseState} activeKey={collapseState} onChange={setCollapseState}>
          <Collapse.Panel header="查询已核验优惠码/券" key="1">
            <Datatable
              select="multi"
              onSelectedChange={onSelectedChange}
              url="/couponCodeList/checkList.do"
              columns={columns}
              rowKey="id"
              formSearch={formSearch}
              operation={operation}
              onInit={setTableInit}
              // onLoadData={this.handleLoadData}
              content={(() => {
                switch (showContentMode) {
                  case 1:
                    return (
                      <EditContent
                        cancel={() => setShowContentMode(null)}
                        sure={() => {
                          message.success('操作成功');
                          setShowContentMode(null);
                          table.reload();
                        }}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            />
          </Collapse.Panel>
        </Collapse>
      </MarginBar>
    </PageHeaderLayout>
  );
};
