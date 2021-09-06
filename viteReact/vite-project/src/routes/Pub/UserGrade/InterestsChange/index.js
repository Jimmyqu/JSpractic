import { useEffect, useState } from 'react';
import { Card } from 'antd';
import { useDispatch } from 'react-redux';
import Datatable, { ItemTypes } from '@/components/Datatable';

import { formatDateTime } from '@/utils/format';

export default function () {
  const [levelList, setlevelList] = useState();
  const [originUpgradeMode, setOriginUpgradeMode] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'pubuser/getLevelList',
    }).then(value => {
      setlevelList(value);
    });
    dispatch({
      type: 'pubuser/getAllMemberUpgradeMode',
    }).then(res => {
      setOriginUpgradeMode(res);
    });
  }, []);

  const formSearch = {
    fields: [
      {
        label: '会员名',
        name: 'realName',
      },
      {
        label: '会员手机',
        name: 'mobile',
      },
      [
        {
          label: '创建时间(始)',
          name: 'gmtCreate',
          placeholder: '开始时间',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '创建时间(止)',
          name: 'gmtCreateEnd',
          placeholder: '结束时间',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      {
        label: '升级方式',
        name: 'upgradeMode',
        options: Object.entries(originUpgradeMode).map(item => ({
          key: item[0],
          text: item[1],
        })),
        type: ItemTypes.Select,
      },
      {
        label: '会员等级',
        name: 'levelId',
        type: ItemTypes.Select,
        options: (levelList || []).map(item => ({
          key: item.id,
          text: item.name,
        })),
        defHidden: true,
      },
    ],
  };

  return (
    <Card bordered={false}>
      <Datatable
        url="/memberLevelRecordAction/dataList.do"
        formSearch={formSearch}
        rowKey="id"
        columns={[
          {
            title: '编号',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '变更动作',
            dataIndex: 'upgradeDesc',
            width: 310,
          },
          {
            title: '升级方式',
            dataIndex: 'upgradeMode',
            render: value => originUpgradeMode[value],
            width: 100,
          },
          {
            title: '会员等级',
            dataIndex: 'levelConfigName',
            width: 150,
          },
          {
            title: '会员权益',
            dataIndex: 'levelEquityData',
            render: value => {
              try {
                return JSON.parse(value)
                  .map(item => item.equityName)
                  .join('、');
              } catch (e) {
                // eslint-disable-next-line no-console
                console.warn(e);
                return null;
              }
            },
            width: 120,
          },
          {
            title: '备注',
            dataIndex: 'remark',
            width: 100,
          },
          {
            title: '会员名',
            dataIndex: 'realName',
            width: 100,
          },
          {
            title: '会员手机号',
            dataIndex: 'mobile',
            width: 120,
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
            width: 150,
          },
        ]}
      />
    </Card>
  );
}
