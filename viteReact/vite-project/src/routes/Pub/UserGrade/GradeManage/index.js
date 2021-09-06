import { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, message } from 'antd';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import Datatable from '@/components/Datatable';
import { modal } from '@/utils/feedback';
import { formatDateTime, formatDate, formatImageUrl, formatModel } from '@/utils/format';
import { getDayByTimeStamp } from '@/utils/utils';
import LevelView from '@/components/LevelView';
import ColorPicker from '@/components/Form/FormItem/ColorPicker';
import EditContent from './GradeManageEditContent';
import DetailsContent from './InfoDetailsContent';
import ThreeGradeSetting from './ThreeGradeSetting';

export default function () {
  const [showContentMode, setShowContentMode] = useState();
  const [originUpgradeMode, setOriginUpgradeMode] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [table, setTableInit] = useState();
  const [levelView, setLevelView] = useState();
  const { UserStatus } = useSelector(state => state.pubuser);
  const { ServiceTypes } = useSelector(state => state.pubservice);
  const deleting = useSelector(state => state.loading.effects['pubuser/deleteMemberLevel']);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'pubuser/fetchSrvList',
    });
    dispatch({
      type: 'pubuser/getMemberUpgradeMode',
    }).then(res => {
      setOriginUpgradeMode(res);
    });
  }, []);

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleEditOrNewFormSubmit = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const operation = useMemo(
    () => ({
      buttons: [
        {
          text: '添加',
          icon: 'plus',
          disabled: deleting,
          action() {
            setShowContentMode(1);
          },
        },
        {
          text: '编辑',
          type: 'primary',
          icon: 'edit',
          forRow: 'single',
          disabled: deleting,
          action() {
            setShowContentMode(2);
          },
        },
        {
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'single',
          loading: deleting,
          async action() {
            modal.confirm('确认删除吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'pubuser/deleteMemberLevel',
                  payload: {
                    id: selectedRows[0].memberLevelConfig.id,
                  },
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          text: '等级权益',
          forRow: 'single',
          action() {
            const { id, levelName } = selectedRows[0].memberLevelConfig;
            dispatch(
              push({
                pathname: '/basic/pub/grade',
                search: `id=${id}&name=${levelName}`,
              })
            );
          },
        },
        {
          text: '详细信息',
          forRow: 'single',
          action() {
            setShowContentMode(3);
          },
        },
        {
          text: '第三方等级设置',
          forRow: 'single',
          action() {
            levelView.pushView(
              <LevelView.SubView title="等级权益">
                <ThreeGradeSetting data={selectedRows} />
              </LevelView.SubView>,
              () => {
                table.reload();
              }
            );
          },
        },
      ],
    }),
    [showContentMode, selectedRows]
  );

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'memberLevelConfig.id',
        width: 80,
      },
      {
        title: '级别',
        dataIndex: 'memberLevelConfig.levelWeight',
        width: 50,
      },
      {
        title: '等级名称',
        dataIndex: 'memberLevelConfig.levelName',
        width: 150,
      },
      {
        title: '等级图标',
        dataIndex: 'levelPic.url',
        render: value => <img src={formatImageUrl(value, 'album_preview')} alt="img" className="img-max" />,
        width: 90,
      },
      {
        title: '背景色',
        dataIndex: 'memberLevelConfig.backgroundColor',
        render: value => (value ? <ColorPicker value={value} disabled /> : null),
        width: 70,
      },
      {
        title: '背景图片',
        dataIndex: 'backdropPic.url',
        render: value => <img src={formatImageUrl(value, 'album_preview')} alt="img" className="img-max" />,
        width: 90,
      },
      {
        title: '升级方式',
        dataIndex: 'memberLevelConfig.upgradeMode',
        render: value => {
          return originUpgradeMode[value];
        },
        width: 90,
      },
      // {
      //   title: '成长值',
      //   dataIndex: 'levelId',
      //   width: 90,
      // },
      // {
      //   title: '升级金额',
      //   dataIndex: 'levelId',
      //   width: 90,
      // },
      {
        title: '有效期类型',
        dataIndex: 'memberLevelConfig.validType',
        render: value => formatModel(ServiceTypes, value),
        width: 90,
      },
      {
        title: '有效期',
        render: (value, record) => {
          const { validType, validStartDate, validEndDate, validLength } = record.memberLevelConfig;
          switch (validType) {
            case ServiceTypes.UNLIMITEDVALIDITY.key:
              return '永久';
            case ServiceTypes.DYNAMICINVISIBLE.key:
              return getDayByTimeStamp(validLength);
            case ServiceTypes.FIXATIONINVISIBLE.key:
              return `${formatDate(validStartDate)} 至 ${formatDate(validEndDate)}`;
            default:
          }
        },
        width: 190,
      },
      {
        title: '会员权益',
        dataIndex: 'equity',
        width: 150,
      },
      // {
      //   title: '备注',
      //   dataIndex: 'remark',
      //   width: 90,
      // },
      {
        title: '状态',
        dataIndex: 'memberLevelConfig.configState',
        render: value => formatModel(UserStatus, value),
        width: 70,
      },
      {
        title: '排序',
        dataIndex: 'memberLevelConfig.ranks',
        width: 60,
      },
      // {
      //   title: '更新人',
      //   dataIndex: 'levelId',
      //   width: 90,
      // },
      {
        title: '更新时间',
        dataIndex: 'memberLevelConfig.gmtModified',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建人',
        dataIndex: 'memberLevelConfig.createRealName',
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'memberLevelConfig.gmtCreate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '业务名称',
        dataIndex: 'memberLevelConfig.srvName',
        width: 90,
      },
      {
        title: '单位名称',
        dataIndex: 'memberLevelConfig.companyName',
        width: 150,
      },
    ],
    [originUpgradeMode]
  );
  return (
    <LevelView ref={setLevelView}>
      <Card bordered={false}>
        <Datatable
          url="/memberLevelAction/dataList.do"
          columns={columns}
          rowKey={record => record.memberLevelConfig.id}
          operation={operation}
          select="multi"
          onInit={setTableInit}
          onSelectedChange={(_, rows) => {
            setSelectedRows(rows);
            cancelContent();
          }}
          content={(() => {
            switch (showContentMode) {
              case 1:
              case 2:
                return (
                  <EditContent
                    edit={showContentMode === 2}
                    originUpgradeMode={originUpgradeMode}
                    cancel={cancelContent}
                    sure={handleEditOrNewFormSubmit}
                  />
                );
              case 3:
                return <DetailsContent cancel={cancelContent} sure={handleEditOrNewFormSubmit} />;
              default:
                return null;
            }
          })()}
        />
      </Card>
    </LevelView>
  );
}
