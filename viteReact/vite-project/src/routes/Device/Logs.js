import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatModel, formatSubSeq } from '@/utils/format';
import { modelMapToOption, getPageQuery } from '@/utils/utils';

export default function () {
  const query = getPageQuery();
  const { CheckModeTypes, CheckModeDealTypes } = useSelector(state => state.pubticket);
  const { SubSeqTypes } = useSelector(state => state.deal);

  const columns = useMemo(
    () => [
      {
        title: '核验类型',
        dataIndex: 'checkMode',
        render: value => formatModel(CheckModeTypes, value),
        width: 130,
      },
      {
        title: '核验状态',
        dataIndex: 'responseCode',
        render: value => (+value === 200 ? '成功' : <span className="red">失败</span>),
        width: 90,
      },
      {
        title: '核验人',
        dataIndex: 'checkRealName',
        width: 90,
      },
      {
        title: '核验人手机',
        dataIndex: 'checkMobile',
        width: 130,
      },
      {
        title: '核验时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '下单类型',
        dataIndex: 'dealType',
        render: value => formatModel(CheckModeDealTypes, value),
        width: 90,
      },
      {
        title: '业务类型',
        dataIndex: 'relType',
        render: formatSubSeq,
        width: 90,
      },
      {
        title: '主订单号',
        dataIndex: 'dealId',
        render: value => <Link to={`/basic/deal/${value}/detail`}>{value}</Link>,
        width: 90,
      },
      {
        title: '人脸图片',
        dataIndex: 'faceUrl',
        render: value => value && <img src={value} alt="头像" style={{ width: '50px' }} />,
        width: 90,
      },
      {
        title: '验证码',
        dataIndex: 'qrCode',
        width: 90,
      },
      {
        title: '营销中心',
        dataIndex: 'salesName',
        width: 130,
      },
      {
        title: '核验信息',
        dataIndex: 'checkData',
        render: (value, { checkTotalNum, checkNum, responseCode, responseMsg }) => (
          <span>
            {value}&nbsp;
            {checkNum > 0 && (
              <span className="red">
                已核验 {checkTotalNum > 1 && checkTotalNum > checkNum && <span>{checkNum} 张</span>}
              </span>
            )}
            {+responseCode !== 200 && <span className="red">{responseMsg}</span>}
          </span>
        ),
        width: 300,
      },
      {
        title: '订单信息',
        dataIndex: 'dealDescr',
        width: 300,
      },
      {
        title: '服务名称',
        dataIndex: 'pubServiceName',
        width: 180,
      },
      {
        title: '会员姓名',
        dataIndex: 'pubRealName',
        width: 90,
      },
      {
        title: '会员手机',
        dataIndex: 'pubMobile',
        width: 130,
      },
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        width: 130,
      },
      {
        title: '设备组名称',
        dataIndex: 'deviceGroupName',
        width: 130,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 250,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '核验状态',
          name: 'responseCode',
          options: [
            { key: 200, text: '成功' },
            { key: 500, text: '失败' },
          ],
          type: ItemTypes.Select,
        },
        {
          label: '核验类型',
          name: 'checkMode',
          options: Object.values(CheckModeTypes).map(item => ({
            key: item.key,
            text: item.value,
          })),
          type: ItemTypes.Select,
        },
        {
          label: '业务类型',
          name: 'relType',
          options: [
            SubSeqTypes.DEAL_PLATFORM,
            SubSeqTypes.DEAL_TICKET,
            SubSeqTypes.DEAL_COURSE,
            SubSeqTypes.DEAL_SPORTPLATFORMTICKET,
          ].map(item => ({
            key: item.key,
            text: item.value,
          })),
          type: ItemTypes.Select,
        },
        {
          label: '下单类型',
          name: 'dealType',
          options: modelMapToOption(CheckModeDealTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        [
          {
            name: 'presetDate',
            // initialValue: 2,
            type: ItemTypes.DatePickerRangePreset,
          },
          {
            label: '核验时间(始)',
            name: 'startGmtCreate',
            placeholder: '开始',
            type: ItemTypes.DatePickerRangeStart,
            initialValue: moment(),
            defHidden: true,
          },
          {
            label: '核验时间(止)',
            name: 'endGmtCreate',
            placeholder: '结束',
            type: ItemTypes.DatePickerRangeEnd,
            initialValue: moment(),
            defHidden: true,
          },
        ],
        {
          label: '核验人',
          name: 'checkRealName',
          defHidden: true,
        },
        {
          label: '核验人手机',
          name: 'checkMobile',
          defHidden: true,
        },
        {
          label: '主订单号',
          name: 'dealId',
          initialValue: query.dealId,
          defHidden: true,
        },
        {
          label: '营销中心',
          name: 'salesId',
          type: ItemTypes.CascaderVenue,
          defHidden: true,
        },
        {
          label: '核验信息',
          name: 'checkData',
          defHidden: true,
        },
        {
          label: '会员姓名',
          name: 'pubRealName',
          defHidden: true,
        },
        {
          label: '会员手机',
          name: 'pubMobile',
          defHidden: true,
        },
        {
          label: '设备名称',
          name: 'deviceName',
          defHidden: true,
        },
        {
          label: '设备组名称',
          name: 'deviceGroupName',
          defHidden: true,
        },
      ],
    }),
    []
  );

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          url="/iotCheckLog/dataList.do"
          columns={columns}
          rowKey="id"
          formSearch={formSearch}
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
            ],
          }}
        />
      </Card>
    </PageHeaderLayout>
  );
}
