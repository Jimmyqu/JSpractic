import { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, message } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getIndustryByUrl, getSortedFields, fieldsSortFn } from '@/components/ActivityDeclare';
import { formatHomeTown, formatDateTime, formatModel, formatDateHM } from '@/utils/format';
import { cascaderData, optionsMapper } from '@/commons/lib/home-town';
import { modelMapToOption } from '@/utils/utils';
import TimeLineModal from './TimeLineModal';

@connect(({ activity, loading }) => ({
  activity,
  deleting: loading.effects['activity/delete'],
}))
class ActivityList extends Component {
  constructor(props) {
    super(props);
    this.industry = getIndustryByUrl(props.activity);

    this.state = {
      fixedStaticFields: undefined,
      declareFields: undefined,
      selectedRows: undefined,
      tlModalVisible: false,
      formSearch: {
        onSearch: async ({ configId }) => {
          const declareFields = await props.dispatch({
            type: 'activity/fetchDeclareFields',
            payload: configId,
          });
          if (this.isUnmounted) {
            return;
          }
          this.setState({
            declareFields,
          });
        },
      },
    };

    this.init();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleTableInit = table => {
    this.table = table;
  };

  buildOperation = () => {
    const { deleting } = this.props;
    return {
      export: {
        columnsInsert: {
          insertKey: 'exerciseTel',
          columns: [
            {
              title: '项目编号',
              dataIndex: 'field4',
              width: 90,
            },
            {
              title: '项目类型',
              dataIndex: 'field2',
              width: 90,
            },
          ],
        },
        settings: {
          processHTML: {
            render: (value, record) => {
              const {
                activity: { DeclareNodeTypes, AuditStates },
              } = this.props;
              return (record.nodeList || [])
                .filter(item => {
                  return item.nodeType === DeclareNodeTypes.AUDIT.key;
                })
                .map(item => {
                  const stateText = formatModel(AuditStates, item.auditState);
                  return `${item.nodeName}${stateText ? `(${stateText})` : ''}`;
                })
                .join('-');
            },
          },
        },
      },
      buttons: [
        {
          text: '编辑',
          icon: <IconFont type="editor" />,
          auth: 'edit',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            const { selectedRows } = this.state;
            window.open(`./info?id=${selectedRows[0].id}&step=1`);
          },
        },
        {
          text: '删除',
          icon: 'delete',
          auth: 'remove',
          forRow: 'multi',
          loading: deleting,
          action: () => {
            const { dispatch } = this.props;
            const { selectedRows } = this.state;
            dispatch({
              type: 'activity/delete',
              payload: selectedRows.map(item => item.id),
            }).then(() => {
              message.success('删除成功');
              this.table.reload();
            });
          },
        },
        {
          text: '审核',
          icon: <IconFont type="audit" />,
          auth: 'audit',
          type: 'primary',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            const { selectedRows } = this.state;
            window.open(`./info?id=${selectedRows[0].id}`);
          },
        },
        {
          text: '审核日志',
          icon: <IconFont type="Log-" />,
          auth: 'auditLog',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            this.handleTimelineVisibleChange(true);
          },
        },
        {
          auth: 'export',
          disabled: deleting,
          btnType: ButtonTypes.Export,
        },
      ],
    };
  };

  handleTimelineVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      tlModalVisible: visible,
    });
  };

  async init() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'activity/fetchDeclareTypes',
      payload: {
        industry: this.industry,
        needHtml: false, // 不要html
        notFilter: true, // 不过滤
      },
    });
    const fixedStaticFields = await dispatch({
      type: 'activity/fetchDeclareFixedFields',
      payload: {
        industry: this.industry,
        needFilter: false,
      },
    });
    // 此判断表示上面的加载ok
    if (fixedStaticFields == null) {
      return;
    }
    if (this.isUnmounted) {
      return;
    }
    this.setState(
      () => ({
        fixedStaticFields,
      }),
      () => {
        this.buildFormSearch();
      }
    );
  }

  buildColumns() {
    const {
      activity: { categoryDataListMapping },
    } = this.props;
    const categoryList = categoryDataListMapping[this.industry] || [];
    const { fixedStaticFields = [], declareFields = [] } = this.state;
    const columns = [
      {
        title: '活动名称',
        dataIndex: 'exerciseName',
        width: 200,
      },
      {
        title: '审核进程',
        ranks: -3,
        width: 90,
        dataIndex: 'processHTML',
        render: (value, record) => {
          const {
            activity: { DeclareNodeTypes, AuditStates },
          } = this.props;
          return (record.nodeList || [])
            .filter(item => {
              return item.nodeType === DeclareNodeTypes.AUDIT.key;
            })
            .map((item, i) => {
              // if (item.auditState == null) {
              //   item.auditState = calcAuditState(item, list)
              // }
              const auditState = Object.values(AuditStates).find(it => it.key === item.auditState);
              let color = '#ccc';
              switch ((auditState || {}).key) {
                case 1:
                  color = '#69c375';
                  break;
                case 2:
                  color = '#d94e3d';
                  break;
                case 3:
                  color = '#00c0ef';
                  break;
                default:
              }
              return (
                <svg
                  key={`${color}-${Date.now() + i}`}
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
      },
      {
        title: '审核状态',
        ranks: -2,
        width: 80,
        render: (value, record) => {
          const found = (record.nodeList || []).find(item => {
            return item.nodeStep === record.currentNodeStep;
          });
          if (found == null || found.auditState == null) {
            return null;
          }
          const {
            activity: { AuditStates },
          } = this.props;
          const auditState = Object.values(AuditStates).find(item => item.key === found.auditState);
          if (auditState == null) {
            return '?';
          }
          let color = '#000';
          switch (auditState.key) {
            case AuditStates.Yes.key:
              color = '#69c375';
              break;
            case AuditStates.No.key:
              color = '#d94e3d';
              break;
            case AuditStates.Wait.key:
              color = '#00c0ef';
              break;
            default:
          }
          return <span style={{ color }}>{auditState.value}</span>;
        },
      },
      {
        title: '申报结果',
        dataIndex: 'declareResult',
        ranks: -1,
        width: 80,
        render: value => {
          const {
            activity: { DeclareResultStates },
          } = this.props;
          return formatModel(DeclareResultStates, value);
        },
      },
      {
        title: '活动开始时间',
        dataIndex: 'startDate',
        render: formatDateHM,
        width: 150,
      },
      {
        title: '活动结束时间',
        dataIndex: 'endDate',
        render: formatDateHM,
        width: 150,
      },
      {
        title: '省份',
        dataIndex: 'province',
        render: formatHomeTown,
        width: 80,
      },
      {
        title: '市/地区',
        dataIndex: 'city',
        render: formatHomeTown,
        width: 80,
      },
      {
        title: '区/县',
        dataIndex: 'district',
        render: formatHomeTown,
        width: 80,
      },
      {
        title: '活动地址',
        dataIndex: 'exerciseAddress',
        width: 180,
      },
      {
        title: '联系人',
        dataIndex: 'exerciseContacts',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'exerciseTel',
        width: 120,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        subField: 'companyId',
        width: 170,
      },
    ];

    const list = getSortedFields(declareFields, fixedStaticFields);
    // 手工处理一些顺序
    // 手工处理省市区靠紧
    const provinceFieldCfg = list.find(fieldCfg => {
      return fieldCfg.extName === 'province';
    });
    if (provinceFieldCfg && provinceFieldCfg.ranks != null) {
      // 如果有省份
      // 让城市/地区紧跟
      (
        columns.find(col => {
          return col.dataIndex === 'city';
        }) || {}
      ).ranks = provinceFieldCfg.ranks + 0.1;
      (
        columns.find(col => {
          return col.dataIndex === 'district';
        }) || {}
      ).ranks = provinceFieldCfg.ranks + 0.2;
    }
    // 手工处理开始结束时间靠紧
    const startDateFieldCfg = list.find(fieldCfg => {
      return fieldCfg.extName === 'startDate';
    });
    if (startDateFieldCfg && startDateFieldCfg.ranks != null) {
      (
        columns.find(col => {
          return col.dataIndex === 'endDate';
        }) || {}
      ).ranks = startDateFieldCfg.ranks + 0.1;
    }

    // 和静态字段的配置一起
    list.forEach(fieldCfg => {
      const found = columns.find(col => {
        return col.dataIndex === fieldCfg.extName || col.subField === fieldCfg.extName;
      });

      if (found) {
        // console.log(2, fieldCfg.extShowName || fieldCfg.extName)
        // 上面有
        found.title = fieldCfg.extShowName || found.name;
        found.ranks = fieldCfg.ranks; // 多冗余一个rank字段
      } else {
        // console.log(1, fieldCfg.extShowName || fieldCfg.extName)
        // 没有的先放进去
        columns.push({
          dataIndex: fieldCfg.extName,
          title: fieldCfg.extShowName || fieldCfg.extName,
          ranks: fieldCfg.ranks, // 多冗余一个rank字段
          width: 130,
        });
      }
    });
    // 再columns排序一次
    columns.sort(fieldsSortFn);

    let c = 0;

    if (
      !(
        (fixedStaticFields.find(item => item.extName === 'category') || {}).hidden &&
        categoryList &&
        categoryList.length === 1
      )
    ) {
      columns.splice(1, 0, {
        title: '活动类型',
        dataIndex: 'categoryValue',
        width: 80,
      });
      c += 1;
    }

    if (
      !(
        (fixedStaticFields.find(item => item.extName === 'configId') || {}).hidden &&
        categoryList &&
        categoryList.length === 1 &&
        ((categoryList[0] || {}).configList || []).length === 1
      )
    ) {
      columns.splice(1 + c, 0, {
        title: '项目类型',
        dataIndex: 'typeName',
        width: 140,
      });
    }

    // 前置
    columns.unshift({
      title: '活动编号',
      dataIndex: 'id',
      width: 80,
    });

    // 追加
    columns.push(
      {
        title: '项目名称',
        dataIndex: 'field1',
        width: 170,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: formatDateTime,
        width: 170,
      }
    );
    // 排出这俩字段是因为前面根据情况强制插入某个位置显示了
    return columns.filter(({ dataIndex }) => !(dataIndex === 'category' || dataIndex === 'configId'));
  }

  buildFormSearch() {
    const {
      activity: { categoryDataListMapping },
    } = this.props;
    const categoryList = categoryDataListMapping[this.industry] || [];
    const { fixedStaticFields } = this.state;
    if (this.isUnmounted) {
      return;
    }
    this.setState(({ formSearch }) => ({
      formSearch: {
        ...formSearch,
        fields: [
          {
            label: '活动编号',
            name: 'id',
          },
          {
            label: '活动名称',
            name: 'exerciseName',
          },
          {
            label: '单位名称',
            name: 'companyName',
          },
          {
            label: '审核状态',
            name: 'auditState',
            options: (() => {
              const {
                activity: { AuditStates },
              } = this.props;
              return modelMapToOption(AuditStates);
            })(),
            type: ItemTypes.Select,
            defHidden: true,
          },
          [
            {
              label: '活动类型',
              name: 'category',
              options: categoryList,
              optionsMapper: ({ category, categoryName, configList }) => ({
                key: category,
                text: categoryName,
                subOptions: configList,
              }),
              type: ItemTypes.CascaderLevels[0],
              hidden:
                (fixedStaticFields.find(item => item.extName === 'category') || {}).hidden &&
                categoryList &&
                categoryList.length === 1,
              defHidden: true,
            },
            {
              label: '项目类型',
              name: 'configId',
              optionsMapper: ({ configId, typeName }) => ({
                key: configId,
                text: typeName,
              }),
              type: ItemTypes.CascaderLevels[1],
              hidden:
                (fixedStaticFields.find(item => item.extName === 'configId') || {}).hidden &&
                categoryList &&
                categoryList.length === 1 &&
                ((categoryList[0] || {}).configList || []).length === 1,
              defHidden: true,
            },
          ],
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
          // TODO fixedStaticFields时需要时分
          [
            {
              label: '活动开始(从)',
              name: 'startDateFrom',
              placeholder: '开始时间',
              type: ItemTypes.DatePickerRangeStart,
              defHidden: true,
            },
            {
              label: '活动开始(到)',
              name: 'startDateTo',
              placeholder: '结束时间',
              type: ItemTypes.DatePickerRangeEnd,
              defHidden: true,
            },
          ],
          [
            {
              label: '创建时间(从)',
              name: 'createDateFrom',
              placeholder: '开始时间',
              type: ItemTypes.DatePickerRangeStart,
              defHidden: true,
            },
            {
              label: '创建时间(到)',
              name: 'createDateTo',
              placeholder: '结束时间',
              type: ItemTypes.DatePickerRangeEnd,
              defHidden: true,
            },
          ],
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
            label: '项目名称',
            name: 'projectName',
            defHidden: true,
          },
        ],
      },
    }));
  }

  render() {
    // const {
    //   activity: { categoryDataListMapping },
    // } = this.props;
    // const categoryList = categoryDataListMapping[this.industry] || [];
    const {
      formSearch,
      tlModalVisible,
      selectedRows = [],
      //  fixedStaticFields
    } = this.state;
    // const { fields } = formSearch || {};
    // const query = { industry: this.industry };
    // FIXME 按现有实现，表格和表格的查询表单是一起初始化的，如果表单需要有默认值，则表单的默认值初始化好之前表单就查询了一次，第二次查询才取到表单默认值
    // // 这里先采取临时方案
    // if (fixedStaticFields && fixedStaticFields.length) {
    //   // 表单字段配置好了再初始化
    //   if (fields == null) {
    //     return null;
    //   }
    //   // 默认第一个，这种场景一般只有一个，艺文汇
    //   const categoryInfo = categoryList[0] || {};
    //   query.category = categoryInfo.category;
    //   const configInfo = (categoryInfo.configList || [])[0] || {};
    //   query.configId = configInfo.configId;
    // }
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url={`/exerciseList/list.do?industry=${this.industry}`}
            columns={this.buildColumns()}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="id"
            formSearch={formSearch}
            operation={this.buildOperation()}
            onInit={this.handleTableInit}
          />
        </Card>
        <TimeLineModal
          footer={<Button key="summary" link="ok" type="primary" />}
          dataInfo={selectedRows[0]}
          visible={tlModalVisible}
          onVisibleChange={this.handleTimelineVisibleChange}
        />
      </PageHeaderLayout>
    );
  }
}

export default ActivityList;
