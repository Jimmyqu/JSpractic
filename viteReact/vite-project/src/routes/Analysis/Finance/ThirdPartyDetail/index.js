import { useState } from 'react';
import { Card, Tooltip, Icon } from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatMoney, formatMoneyLen2, formatModel, formatTransfer } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

const tradeWayModel = {
  Wechat: {
    key: 1,
    value: '微信',
  },
  Zfb: {
    key: 2,
    value: '支付宝',
  },
};

const SrvTypes = {
  PC: {
    key: 0,
    value: 'PC端',
  },
  PORTAL: {
    key: 1,
    value: '无线端',
  },
};

const tradeTypeModel = {
  PAYMENT: {
    key: 1,
    value: '支付',
  },
  REFUND: {
    key: 101,
    value: '退款',
  },
};

export default function () {
  const [selectedRows, setSelectedRows] = useState([]);
  const dispatch = useDispatch();
  const handleToDetail = (record, path, query, newWindow) => {
    if (newWindow) {
      window.open(`${path}`);
      return;
    }
    dispatch(
      push({
        pathname: path,
        search: stringify(query),
      })
    );
  };
  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          url="/analysis/thirdParty/payTradeList.do"
          columns={[
            {
              title: '支付明细编号',
              dataIndex: 'id',
              width: 110,
            },
            {
              title: '营销中心',
              dataIndex: 'salesName',
              width: 180,
            },
            {
              title: '主订单号',
              dataIndex: 'dealId',
              render: value => <Link to={`../finance/detail?dealId=${value}`}>{value}</Link>,
              width: 90,
            },
            {
              title: '业务来源',
              dataIndex: 'srvName',
              width: 90,
            },
            {
              title: '会员编号',
              dataIndex: 'memberId',
              render: (v, r) => {
                return (
                  <span
                    className="link"
                    onClick={() => handleToDetail(r, `../../../basic/pub/info/${v}/base`, {}, true)}
                  >
                    {v}
                  </span>
                );
              },
              width: 100,
            },
            {
              title: '支付方式',
              dataIndex: 'tradeWay',
              render: value => formatModel(tradeWayModel, value),
              width: 100,
            },
            {
              title: '支付类型',
              dataIndex: 'payType',
              render: value => formatModel(tradeTypeModel, value),
              width: 100,
            },
            {
              title: '发生额',
              dataIndex: 'tradeAmount',
              render: formatMoneyLen2,
              collect: true,
              width: 100,
            },
            {
              title: '手续费',
              dataIndex: 'serviceCharge',
              render: value => (
                <span
                  className={classNames({
                    red: !value,
                  })}
                >
                  {formatMoney(value)}
                </span>
              ),
              collect: true,
              width: 100,
            },
            {
              title: '手续费率',
              dataIndex: 'mchRate',
              render: value => <span>{formatTransfer(value)}</span>,
              collect: false,
              width: 100,
            },
            {
              title: '支付订单号',
              dataIndex: 'payOrderId',
              width: 300,
            },
            {
              title: (
                <>
                  商家订单号 &nbsp;
                  <Tooltip key="icon" title="微信是微信商户单号，支付宝是支付宝商家订单号">
                    <Icon type="info-circle" theme="twoTone" />
                  </Tooltip>
                </>
              ),
              dataIndex: 'payTradeId',
              width: 300,
            },
            {
              title: (
                <>
                  交易单号 &nbsp;
                  <Tooltip key="icon" title="交易类型为退款时值为退款交易单号、其他则为支付交易单单号">
                    <Icon type="info-circle" theme="twoTone" />
                  </Tooltip>
                </>
              ),
              dataIndex: 'tradeId',
              width: 300,
            },
            {
              title: '操作人',
              dataIndex: 'operatorName',
              width: 100,
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
            {
              title: '所属单位',
              dataIndex: 'companyName',
              width: 130,
            },
          ]}
          rowKey="id"
          formSearch={{
            fields: [
              {
                label: '营销中心',
                name: 'salesId',
                type: ItemTypes.CascaderVenue,
              },
              [
                {
                  name: 'presetDate',
                  type: ItemTypes.DatePickerRangePreset,
                },
                {
                  name: 'startCreateTime',
                  label: '创建时间(始)',
                  initialValue: moment(),
                  type: ItemTypes.DatePickerRangeStart,
                },
                {
                  name: 'endCreateTime',
                  label: '创建时间(止)',
                  initialValue: moment(),
                  type: ItemTypes.DatePickerRangeEnd,
                },
              ],
              {
                label: '主订单号',
                name: 'dealId',
              },
              {
                label: '会员编号',
                name: 'memberId',
              },
              {
                label: '商家订单号',
                name: 'payTradeId',
              },
              {
                label: '支付订单号',
                name: 'payOrderId',
              },
              {
                label: '退款单号',
                name: 'tradeId',
              },
              {
                label: '支付方式',
                name: 'tradeWay',
                initialValue: '',
                options: (() => {
                  return modelMapToOption(tradeWayModel);
                })(),
                type: ItemTypes.Select,
              },
              {
                label: '支付类型',
                name: 'payType',
                initialValue: '',
                options: (() => {
                  return modelMapToOption(tradeTypeModel);
                })(),
                type: ItemTypes.Select,
              },
              {
                label: '操作终端',
                name: 'srvType',
                options: (() => {
                  return modelMapToOption(SrvTypes);
                })(),
                type: ItemTypes.Select,
                defHidden: true,
              },
            ],
          }}
          operation={{
            export: {
              settings: {
                dealId: {
                  // override
                  render: value => value,
                },
              },
            },
            buttons: [
              {
                auth: 'export',
                btnType: ButtonTypes.Export,
              },
              {
                text: '订单详情',
                forRow: 'single',
                action() {
                  dispatch(push(`/basic/deal/${selectedRows[0].dealId}`));
                },
              },
            ],
          }}
          select="multi"
          onSelectedChange={(_, rows) => {
            setSelectedRows(rows);
          }}
        />
      </Card>
    </PageHeaderLayout>
  );
}
