import { useState } from 'react';
import { Card, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import { formatMoneyLen2, formatDateTime, formatModel, formatFaceImgInTable } from '@/utils/format';
// import { CommonFileLinkTypes } from '@/utils/upload';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { modelMapToOption } from '@/utils/utils';
import BindingSimpleContent from '../../Device/BindingSimpleContent';

export default function () {
  const dispatch = useDispatch();
  const [showContentMode, setShowContentMode] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [table, setTable] = useState();
  const { UserStatus, PubAccountTypes } = useSelector(state => state.pubuser);
  const { RelTypes } = useSelector(state => state.global);
  // const type = CommonFileLinkTypes.PUBACCOUNT_FACE_AVATAR.key;

  function cancelContent() {
    setShowContentMode(null);
  }

  function afterSure() {
    cancelContent();
    table.reload();
  }

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          onSelectedChange={(_, rows) => {
            setSelectedRows(rows);
            setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
          }}
          url="/publicAccount/dataList.do"
          columns={[
            {
              title: '会员编号',
              dataIndex: 'id',
              width: 100,
            },
            {
              title: '头像',
              dataIndex: 'picUrl',
              render: formatFaceImgInTable,
              width: 100,
            },
            {
              title: '注册来源',
              dataIndex: 'srvName',
              width: 80,
            },
            {
              title: '姓名',
              dataIndex: 'realName',
              width: 100,
            },
            {
              title: '手机号码',
              dataIndex: 'mobile',
              width: 130,
            },
            {
              title: '可用余额',
              dataIndex: 'amountAvail',
              render: formatMoneyLen2,
              collect: true,
              width: 100,
            },
            {
              title: '充值总余额',
              dataIndex: 'amountTotal',
              render: formatMoneyLen2,
              collect: true,
              width: 100,
            },
            {
              title: '可用信用余额',
              dataIndex: 'creditBalance',
              render: formatMoneyLen2,
              collect: true,
              width: 120,
            },
            {
              title: '最大信用额度',
              dataIndex: 'creditLimit',
              render: formatMoneyLen2,
              collect: true,
              width: 120,
            },
            {
              title: '账户积分',
              dataIndex: 'accountFee',
              render: formatMoneyLen2,
              collect: true,
              width: 100,
            },
            {
              title: '账户总积分',
              dataIndex: 'accountTotalFee',
              render: formatMoneyLen2,
              collect: true,
              width: 100,
            },
            {
              title: '备注',
              dataIndex: 'descr',
              width: 150,
            },
            {
              title: '登陆次数',
              dataIndex: 'loginCount',
              collect: true,
              width: 80,
            },
            {
              title: '用户状态',
              dataIndex: 'status',
              render: value => formatModel(UserStatus, value),
              width: 80,
            },
            {
              title: '会员等级',
              dataIndex: 'levelConfigName',
              width: 80,
            },
            {
              title: '会员类型',
              dataIndex: 'pubAccountType',
              render: value => formatModel(PubAccountTypes, value),
              width: 120,
            },
            {
              title: '创建人',
              dataIndex: 'createRealName',
              width: 120,
            },
            {
              title: '最后登陆时间',
              dataIndex: 'loginTime',
              render: formatDateTime,
              width: 190,
            },
            {
              title: '开户/创建时间',
              dataIndex: 'createTime',
              render: formatDateTime,
              width: 190,
            },
            {
              title: '单位名称',
              dataIndex: 'companyName',
              width: 200,
            },
          ]}
          onInit={setTable}
          rowKey="id"
          formSearch={{
            fields: [
              {
                label: '手机号',
                name: 'mobile',
              },
              {
                label: '姓名',
                name: 'realName',
              },
              {
                label: '会员编号',
                name: 'id',
              },
              {
                label: '单位名称',
                name: 'companyName',
                defHidden: true,
              },
              {
                label: '备注',
                name: 'descr',
                defHidden: true,
              },
              [
                {
                  label: '注册时间(始)',
                  name: 'startTime',
                  placeholder: '开始',
                  type: ItemTypes.DatePickerRangeStart,
                  defHidden: true,
                },
                {
                  label: '注册时间(止)',
                  name: 'endTime',
                  placeholder: '结束',
                  type: ItemTypes.DatePickerRangeEnd,
                  defHidden: true,
                },
              ],
              {
                label: '会员类型',
                name: 'pubAccountType',
                placeholder: '默认全部',
                options: modelMapToOption(PubAccountTypes),
                type: ItemTypes.Select,
                defHidden: true,
              },
              {
                label: '用户状态',
                name: 'status',
                placeholder: '默认全部',
                options: modelMapToOption(UserStatus),
                type: ItemTypes.Select,
                defHidden: true,
              },
            ],
          }}
          operation={{
            buttons: [
              {
                type: 'primary',
                icon: <IconFont type="User-" />,
                auth: 'edit',
                text: '会员信息',
                forRow: 'single',
                action: () => {
                  dispatch(push(`/basic/pub/info/${selectedRows[0].id}`));
                },
              },
              // {
              //   text: '认证图片',
              //   forRow: 'single',
              //   action: () => {
              //     dispatch(
              //       push({
              //         pathname: '/basic/device/afr/pics',
              //         search: `type=${type}&id=${selectedRows[0].id}`,
              //       })
              //     );
              //   },
              // },
              {
                text: '绑定IC/物理卡',
                auth: 'binding',
                type: 'primary',
                forRow: 'single',
                action: () => {
                  setShowContentMode(1);
                },
              },
              {
                auth: 'export',
                btnType: ButtonTypes.Export,
              },
            ],
          }}
          content={(() => {
            switch (showContentMode) {
              case 1:
                return (
                  <BindingSimpleContent
                    cancel={cancelContent}
                    userId={selectedRows[0].id}
                    relType={RelTypes.PUBACCOUNT_USER.key}
                    sure={() => {
                      message.success('绑定成功');
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
