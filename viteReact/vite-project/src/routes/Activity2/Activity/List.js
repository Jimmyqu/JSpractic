import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import ExtFormItem from '@/components/Form/FormItem/ExtFormItem';
import TimeLineModal from '@/components/Activity2/TimeLineModal';
import IconFont from '@/components/Icon';
import { formatDateHM, formatDateHMCsvt, formatDateTime, formatHomeTown, formatModel } from '@/utils/format';
import { cascaderData, optionsMapper } from '@/commons/lib/home-town';
import { getPageQuery, modelMapToOption } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import styles from '@/components/Activity2/index.less';

const StateMap = {
  Pass: {
    key: 0,
    value: '审核通过',
  },
  InEdit: {
    key: 1,
    value: '编辑中',
  },
  Wait: {
    key: 2,
    value: '待审核',
  },
  Disabled: {
    key: 3,
    value: '禁用',
  },
};

export default () => {
  const { reportCompanyListId } = getPageQuery();
  const dispatch = useDispatch();
  const { Industries } = useSelector(state => state.venue);
  const { FileTypeKeys } = useSelector(state => state.extfield2);
  const { ExerciseTypes, CheckStatus, DeclareNodeAuditStatus, DeclareNodeTypes, DeclareNodeDataTypes } = useSelector(
    state => state.activity2
  );
  const logFetching = useSelector(state => state.loading.effects['activity2/fetchActivityLog']);
  const configFetching = useSelector(state => state.loading.effects['activity2/fetchExportDetailFieldsConfig']);
  const [logs, setLogs] = useState([]);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState();
  const [table, setTableInit] = useState();
  const [exportDetailFieldsConfig, setExportDetailFieldsConfig] = useState();

  useEffect(() => {
    if (logModalVisible) {
      dispatch({
        type: 'activity2/fetchActivityLog',
        payload: {
          exerciseId: selectedRows[0].id,
        },
      }).then(res => {
        setLogs(
          res.map(item => {
            return {
              ...item,
              gmtCreate: item.createTime,
              createRealName: item.createUserName,
            };
          })
        );
      });
    }
  }, [logModalVisible]);

  const formatNodeState = useCallback(nodeList => {
    // 节点审核状态: 0审核通过 1编辑中 2待审核 3禁用
    let nodeState = StateMap.InEdit.key;
    // 用some是为了方便提前结束减少不必要循环次数
    nodeList.some(({ nodeSubmitData, nodeAuditState }, index) => {
      if (!nodeSubmitData) {
        // 如果其中某节点没有提交记录(未审核 未提交) 就是提前的结束条件
        return true;
      }
      if (index === 0) {
        nodeState = StateMap.InEdit.key;
        return false;
      }
      switch (nodeAuditState) {
        case DeclareNodeAuditStatus.Disabled.key:
          nodeState = StateMap.Disabled.key;
          break;
        case DeclareNodeAuditStatus.Retrail.key:
        case DeclareNodeAuditStatus.Rejected.key:
          nodeState = StateMap.InEdit.key;
          break;
        case DeclareNodeAuditStatus.Wait.key:
          nodeState = StateMap.Wait.key;
          break;
        case DeclareNodeAuditStatus.Pass.key:
          nodeState = StateMap.Pass.key;
          break;
        default:
      }
      return false;
    });

    return (
      <span
        className={classNames({
          [styles.yes]: nodeState === StateMap.Pass.key,
          [styles.no]: nodeState === StateMap.Disabled.key,
          [styles.pending]: nodeState === StateMap.InEdit.key || nodeState === StateMap.Wait.key,
        })}
      >
        {formatModel(StateMap, nodeState)}
      </span>
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '活动编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '审核进程',
        dataIndex: 'nodeListReps',
        render: value => {
          return (value || []).map((item, i) => {
            let color;
            if (
              item.nodeSubmitData === 1 && // nodeSubmitData 1:有数据 0:无数据
              (item.nodeAuditState === DeclareNodeAuditStatus.Wait.key || item.nodeAuditState === null)
            ) {
              // 已填写资料 且 节点状态是待审核
              color = '#00c0ef';
            } else if (item.nodeAuditState === DeclareNodeAuditStatus.Pass.key) {
              // 通过
              color = '#69c375';
            } else if (
              item.nodeAuditState === DeclareNodeAuditStatus.Disabled.key ||
              item.nodeAuditState === DeclareNodeAuditStatus.Rejected.key ||
              item.nodeAuditState === DeclareNodeAuditStatus.Retrail.key
            ) {
              // 驳回禁用 || 驳回 || 驳回重填
              color = '#d94e3d';
            } else {
              color = '#ccc';
            }
            return (
              <svg
                // 暂没有唯一字段有值可用在key
                // eslint-disable-next-line react/no-array-index-key
                key={`${color}-${Date.now()}-${i}`}
                width="8"
                height="8"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{ margin: '0 3px' }}
              >
                <circle cx="4" cy="4" r="4" fill={color} />
              </svg>
            );
          });
        },
        width: 120,
      },
      {
        title: '申报项目',
        dataIndex: 'reportName',
        width: 150,
      },
      {
        title: '申报项目编号',
        dataIndex: 'reportConfigId',
        width: 120,
      },
      {
        title: '节点审核状态',
        key: 'state',
        render: (value, r) => {
          return formatNodeState(r.nodeListReps);
        },
        width: 110,
      },
      {
        title: '活动审核状态',
        key: 'checkState',
        render: (value, r) => {
          return formatModel(CheckStatus, r.checkState);
        },
        width: 110,
      },
      {
        title: '活动类型',
        dataIndex: 'exerciseType',
        render: value => formatModel(ExerciseTypes, value),
        width: 90,
      },
      {
        title: '活动/项目名称',
        dataIndex: 'exerciseName',
        width: 300,
      },
      {
        title: '活动时间',
        dataIndex: 'startDate',
        render: (value, { endDate }) => {
          return `${formatDateHM(value) || ''}${endDate ? ` 至 ${formatDateHMCsvt(endDate)}` : ''}`;
        },
        width: 300,
      },
      {
        title: '活动地区',
        key: 'area',
        render: (_, { province, city, district }) => {
          return [province, city, district].filter(Boolean).map(formatHomeTown).join('/');
        },
        width: 200,
      },
      {
        title: '活动地址',
        dataIndex: 'exerciseAddress',
        width: 150,
      },
      {
        title: '联系人',
        dataIndex: 'exerciseContacts',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'exerciseTel',
        width: 130,
      },
      {
        title: '行业',
        dataIndex: 'exerciseObjExt1',
        render: value => formatModel(Industries, value),
        width: 90,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 150,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: formatDateTime,
        width: 190,
      },
    ],
    [formatNodeState]
  );

  const formSearch = useMemo(
    () => ({
      onSearch: setFormData,
      fields: [
        {
          label: '活动编号',
          name: 'exerciseId',
        },
        {
          label: '活动/项目名称',
          name: 'exerciseName',
        },
        {
          label: '审核状态',
          name: 'checkState',
          options: modelMapToOption(CheckStatus),
          type: ItemTypes.Select,
        },
        {
          label: '活动类型',
          name: 'exerciseType',
          options: modelMapToOption(ExerciseTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        // {
        //   label: '项目类型',
        //   name: 'exerciseId',
        // },
        {
          label: '手机号',
          name: 'exerciseTel',
          defHidden: true,
        },
        {
          label: '联系人',
          name: 'exerciseContacts',
          defHidden: true,
        },
        [
          {
            label: '活动开始(从)',
            name: 'startExerciseTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '活动开始(到)',
            name: 'endExerciseTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '创建时间(从)',
            name: 'startTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '创建时间(到)',
            name: 'endTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '更新时间(从)',
            name: 'startUpdateTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '更新时间(到)',
            name: 'endUpdateTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        {
          label: '申报项目',
          name: 'reportName',
          defHidden: true,
        },
        {
          label: '申报项目编号',
          name: 'reportConfigId',
          defHidden: true,
        },
        [
          {
            label: '省/市/区',
            name: 'province',
            options: cascaderData,
            optionsMapper,
            type: ItemTypes.CascaderLevels[0],
            defHidden: true,
          },
          {
            label: '市/地区',
            name: 'city',
            optionsMapper,
            type: ItemTypes.CascaderLevels[1],
            defHidden: true,
          },
          {
            label: '区/县',
            name: 'district',
            optionsMapper,
            type: ItemTypes.CascaderLevels[2],
            defHidden: true,
          },
        ],
        {
          label: '单位资质编号',
          name: 'reportCompanyListId',
          initialValue: reportCompanyListId,
          defHidden: true,
        },
        // {
        //   label: '项目行业',
        //   name: 'b',
        //   options: modelMapToOption(Industries),
        //   type: ItemTypes.Select,
        //   defHidden: true,
        // },
        // {
        //   label: '类型',
        //   name: 'a',
        //   options: modelMapToOption(ExerciseTypes),
        //   type: ItemTypes.Select,
        //   defHidden: true,
        // },
      ],
    }),
    []
  );

  useEffect(() => {
    // 清空
    setExportDetailFieldsConfig();
    if (formData == null) {
      return;
    }
    const { reportConfigId, reportName } = formData;
    if (reportConfigId || reportName) {
      dispatch({
        type: 'activity2/fetchExportDetailFieldsConfig',
        payload: {
          reportConfigId,
          reportName,
        },
      }).then(setExportDetailFieldsConfig);
    }
  }, [formData?.reportConfigId, formData?.reportName]);

  const genFieldRender = useCallback(field => {
    const { extDataType, extKeyName } = field;
    return value => {
      if (FileTypeKeys.includes(extDataType)) {
        return value?.filter(Boolean).join(' ');
      }
      return <ExtFormItem key={extKeyName} isView field={field} initialValue={value} />;
    };
  }, []);

  const operation = useMemo(() => {
    const { productConfig, nodeConfig, reportConfigNodes } = exportDetailFieldsConfig || {};

    const dataNodeCfgList = reportConfigNodes?.filter(node => node.nodeType === DeclareNodeTypes.DATA.key);
    return {
      buttons: [
        {
          text: '编辑',
          icon: <IconFont type="editor" />,
          auth: 'edit',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { checkState } = rows[0];
            return checkState !== CheckStatus.Approved.key && checkState !== CheckStatus.Disabled.key;
          },
          action() {
            window.open(`./info?id=${selectedRows[0].id}`);
          },
        },
        {
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'single',
          action: () => {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'activity2/delActivity',
                  payload: selectedRows[0].id,
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          text: '审核日志',
          auth: 'logs',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { checkState } = rows[0];
            return checkState !== CheckStatus.Wait.key;
          },
          action() {
            setLogModalVisible(true);
          },
        },
        {
          text: '详情',
          forRow: 'single',
          action() {
            window.open(`./info?id=${selectedRows[0].id}`);
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
        {
          text: '导出全部资料',
          auth: 'export-detail',
          forRow: () => {
            return exportDetailFieldsConfig != null;
          },
          loading: configFetching,
          btnType: ButtonTypes.Export,
          url: '/reportExercise/excelNewLoad.do',
          columns: [
            {
              title: '活动编号',
              dataIndex: 'id',
              width: 120,
            },
            {
              title: '节点状态',
              dataIndex: 'exerciseDetailNodeRes',
              render: formatNodeState,
              width: 100,
            },
            {
              title: '申报单位信息',
              children: [
                {
                  title: '单位名称',
                  dataIndex: 'reportCompanyListFiledRes.companyName',
                  width: 200,
                },
                {
                  title: '邮箱地址',
                  dataIndex: 'reportCompanyListFiledRes.email',
                  width: 150,
                },
                {
                  title: '联系人',
                  dataIndex: 'reportCompanyListFiledRes.contentEs',
                  width: 100,
                },
                {
                  title: '联系人手机号',
                  dataIndex: 'reportCompanyListFiledRes.mobile',
                  width: 130,
                },
              ],
            },
            productConfig?.length > 0 && {
              title: '申报资质',
              children: productConfig.map(field => {
                const { extShowName, extKeyName } = field;
                return {
                  title: extShowName || extKeyName,
                  dataIndex: `reportCompanyListFiledRes.fieldMap.${extKeyName}`,
                  render: genFieldRender(field),
                  width: 200,
                };
              }),
            },
            nodeConfig?.length > 0 && {
              title: '活动基本信息',
              children: nodeConfig.map(field => {
                const { extShowName, extKeyName } = field;
                return {
                  title: extShowName || extKeyName,
                  // 第一个节点认死是基础信息
                  dataIndex: `exerciseDetailNodeRes.[0].fieldMap.${extKeyName}`,
                  render: genFieldRender(field),
                  width: 200,
                };
              }),
            },
            dataNodeCfgList?.length > 0 && {
              title: '已上传资料节点',
              children: dataNodeCfgList.map(item => {
                const { nodeName, id } = item;
                return {
                  title: nodeName,
                  // 第一个节点认死是基础信息
                  key: id,
                  render: (_, { exerciseDetailNodeRes }) => {
                    const node = exerciseDetailNodeRes?.find(n => n.reportConfigNodeId === id);
                    if (node) {
                      const { nodeDataType, nodeDataId, fileItemVOList } = node;
                      switch (nodeDataType) {
                        case DeclareNodeDataTypes.RICH_TEXT.key:
                          if (nodeDataId) {
                            return `https://cs.ydmap.cn/page.shtml?id=102471&dataId=${nodeDataId}&dataType=17`;
                          }
                          break;
                        case DeclareNodeDataTypes.ALBUM.key:
                          if (nodeDataId) {
                            return `https://cs.ydmap.cn/page.shtml?id=101607&dataId=${nodeDataId}&dataType=23`;
                          }
                          break;
                        // 导出时视频本身想链接到播放功能https://www.ydmap.cn/video-collect/player/100016?progress=on
                        // 但是实际新版活动报备没有做视频的兼容，暂按文件处理
                        case DeclareNodeDataTypes.VIDEO.key:
                        case DeclareNodeDataTypes.IMAGE.key:
                        case DeclareNodeDataTypes.FILE.key:
                          if (fileItemVOList?.length > 0) {
                            return fileItemVOList.map(file => file.url).join(' ');
                          }
                          break;
                        default:
                      }
                    }
                    return null;
                  },
                  width: 200,
                };
              }),
            },
          ].filter(Boolean),
          export: {
            ignoreSelectedRow: true,
            // 找到所有数据的fileKey并替换为url
            dataSourceAllFetchDoneRender: async list => {
              // 审核资质的文件类字段
              const fileFields1 = productConfig?.filter(field => FileTypeKeys.includes(field?.extDataType));
              const fileFields2 = nodeConfig?.filter(field => FileTypeKeys.includes(field?.extDataType));

              const allFileKeys = list?.reduce((prev, { reportCompanyListFiledRes, exerciseDetailNodeRes }) => {
                const fileKeys = [];

                fileFields1?.forEach(field => {
                  const fileKey = reportCompanyListFiledRes?.fieldMap?.[field.extKeyName];
                  if (Array.isArray(fileKey)) {
                    fileKeys.push(...fileKey.filter(Boolean));
                  }
                });

                fileFields2?.forEach(field => {
                  // 第一个节点认死是基础信息
                  const fileKey = exerciseDetailNodeRes?.[0]?.fieldMap?.[field.extKeyName];
                  if (Array.isArray(fileKey)) {
                    fileKeys.push(...fileKey.filter(Boolean));
                  }
                });

                return [...prev, ...fileKeys];
              }, []);

              // 去重
              const searchKeys = [...new Set(allFileKeys)];
              if (searchKeys.length > 0) {
                const filesMap = await dispatch({
                  type: 'global/fetchFilesByKey',
                  payload: searchKeys,
                });
                return list.map(item => {
                  const { reportCompanyListFiledRes, exerciseDetailNodeRes } = item;

                  if (reportCompanyListFiledRes?.fieldMap || exerciseDetailNodeRes?.[0].filesMap) {
                    const newItem = {
                      ...item,
                    };
                    fileFields1?.forEach(({ extKeyName }) => {
                      const fileKeys = newItem.reportCompanyListFiledRes?.fieldMap?.[extKeyName];
                      if (Array.isArray(fileKeys)) {
                        Object.assign(newItem.reportCompanyListFiledRes?.fieldMap, {
                          [extKeyName]: fileKeys.map(fileKey => filesMap[fileKey]?.url).filter(Boolean),
                        });
                      }
                    });
                    fileFields2?.forEach(({ extKeyName }) => {
                      const fileKeys = newItem.exerciseDetailNodeRes?.[0].fieldMap?.[extKeyName];
                      if (Array.isArray(fileKeys)) {
                        Object.assign(newItem.exerciseDetailNodeRes?.[0].fieldMap, {
                          [extKeyName]: fileKeys.map(fileKey => filesMap[fileKey]?.url).filter(Boolean),
                        });
                      }
                    });
                    return newItem;
                  }

                  return item;
                });
              }
              return list;
            },
          },
        },
      ],
    };
  }, [selectedRows, table, configFetching, exportDetailFieldsConfig, formatNodeState, genFieldRender]);

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          onSelectedChange={(_, rows) => {
            setSelectedRows(rows);
          }}
          url="/reportExercise/dataList.do"
          columns={columns}
          rowKey="id"
          formSearch={formSearch}
          operation={operation}
          onInit={setTableInit}
        />
        <TimeLineModal
          visible={logModalVisible}
          log={{ logs, loading: logFetching }}
          onVisibleChange={setLogModalVisible}
        />
      </Card>
    </PageHeaderLayout>
  );
};
