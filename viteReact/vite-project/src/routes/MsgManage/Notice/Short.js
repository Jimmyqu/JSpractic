import { Card } from 'antd';
import { useSelector } from 'react-redux';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime } from '@/utils/format';
import { modelMapToOption, getPageQuery } from '@/utils/utils';

function ShortMessage() {
  const { WechatSendStatus } = useSelector(state => state.message);
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 170,
    },
    {
      title: '群发编号',
      dataIndex: 'dataId',
      width: 100,
    },
    {
      title: '发送状态',
      dataIndex: 'respStatus',
      render: value => (+value === 0 ? '发送成功' : '发送失败'),
      width: 100,
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      width: 120,
    },
    {
      title: '短信类型',
      dataIndex: 'codeTypeName',
      width: 120,
    },
    {
      title: '发送内容',
      dataIndex: 'msg',
      width: 300,
    },
    {
      title: '发送条数',
      align: 'center',
      render: (_, { msg }) => {
        const { length } = msg;
        const base = length > 70 ? 67 : 70;
        return Math.ceil(length / base);
      },
      width: 80,
    },
    {
      title: '短信ID',
      dataIndex: 'msgId',
      width: 160,
    },
    {
      title: '发送时间',
      dataIndex: 'respTime',
      render: formatDateTime,
      width: 150,
    },
    {
      title: '业务名称',
      dataIndex: 'srvInfoName',
      width: 150,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 150,
    },
  ];

  const formSearch = {
    fields: [
      {
        label: '发送状态',
        name: 'respStatus',
        options: modelMapToOption(WechatSendStatus),
        type: ItemTypes.Select,
      },
      {
        label: '编号',
        name: 'id',
        defHidden: true,
      },
      [
        {
          label: '发送时间(始)',
          name: 'startTime',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '发送时间(止)',
          name: 'endTime',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      {
        label: '群发编号',
        name: 'dataId',
        initialValue: (() => {
          const { id } = getPageQuery();
          return id;
        })(),
      },
      {
        label: '发送内容',
        name: 'msg',
        defHidden: true,
      },
      {
        label: '业务名称',
        name: 'srvInfoName',
        defHidden: true,
      },
      {
        label: '手机号码',
        name: 'mobile',
      },
    ],
  };

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        url="/messageSms/dataList.do"
        columns={columns}
        rowKey={record => `${record.mobile}-${record.respTime}`}
        formSearch={formSearch}
        operation={{
          buttons: [
            {
              auth: 'export',
              btnType: ButtonTypes.Export,
            },
          ],
        }}
      />
    </Card>
  );
}

export default ShortMessage;
