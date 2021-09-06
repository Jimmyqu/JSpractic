import { Card } from 'antd';
import { useSelector } from 'react-redux';
import { formatDateTime } from '@/utils/format';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { modelMapToOption, getPageQuery } from '@/utils/utils';

function WechatMessage() {
  const { WechatSendStatus } = useSelector(state => state.message);
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '群发编号',
      dataIndex: 'dataId',
      width: 100,
    },
    {
      title: '发送状态',
      dataIndex: 'wechatErrCode',
      render: value => (+value === 0 ? '发送成功' : '发送失败'),
      width: 100,
    },
    {
      title: '会员编号',
      dataIndex: 'pubAccountId',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 100,
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      width: 120,
    },
    {
      title: '消息模板编号',
      dataIndex: 'messageTemplateId',
      width: 120,
    },
    {
      title: '消息模板名称',
      dataIndex: 'messageTemplateName',
      width: 180,
    },
    {
      title: '消息模板code',
      dataIndex: 'messageTemplateCode',
      width: 150,
    },
    {
      title: '消息内容',
      dataIndex: 'messageContent',
      width: 300,
    },
    {
      title: '微信配置编号',
      dataIndex: 'wechatMsgId',
      width: 200,
    },
    {
      title: '微信msg',
      dataIndex: 'wechatErrMsg',
      width: 120,
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
      title: '业务编号',
      dataIndex: 'srvId',
      width: 120,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 140,
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
        label: '手机号码',
        name: 'mobile',
      },
      {
        label: '消息内容',
        name: 'msg',
      },
      {
        label: '群发编号',
        name: 'dataId',
        initialValue: (() => {
          const { id } = getPageQuery();
          return id;
        })(),
        defHidden: true,
      },
      {
        label: '编号',
        name: 'id',
        defHidden: true,
      },
      {
        label: '业务编号',
        name: 'srvInfoId',
        defHidden: true,
      },
      {
        label: '消息模板code',
        name: 'messageTemplateCode',
        defHidden: true,
      },
      {
        label: '微信模板编号',
        name: 'messageTemplateId',
        defHidden: true,
      },
      {
        label: '业务名称',
        name: 'srvInfoName',
        defHidden: true,
      },
      [
        {
          label: '更新时间(始)',
          name: 'startTime',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'endTime',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
    ],
  };

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        url="/wechatMessagePush/dataList.do"
        columns={columns}
        rowKey="id"
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

export default WechatMessage;
