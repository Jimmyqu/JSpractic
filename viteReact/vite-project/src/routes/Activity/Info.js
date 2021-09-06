import { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Card, Button, Divider, Spin, Row, Col } from 'antd';
import { getPageQuery } from '@/utils/utils';
import { getIndustryByUrl, defaultCategoryField, defaultConfigField } from '@/components/ActivityDeclare';
import Step from '@/components/ActivityDeclare/Step';
import Basic from '@/components/ActivityDeclare/Basic';
import Audit from '@/components/ActivityDeclare/Audit';
import Tab from '@/components/ActivityDeclare/Tab';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Modal from '@/components/Modal';
import Datatable, { ItemTypes } from '@/components/Datatable';
import NewsIframe from '@/components/Iframe/NewsIframe';
import styles from './index.less';

@connect(({ activity, loading, global }) => ({
  activity,
  RelTypes: global.RelTypes,
  fetchDetailIng: loading.effects['activity/fetchNodeDetail'],
  fetchDeclareFillListIng: loading.effects['activity/fetchExerciseDeclareFillList'],
  fetchDeclareFieldsIng: loading.effects['activity/fetchDeclareFields'],
  fetchDeclareFixedFieldsIng: loading.effects['activity/fetchDeclareFixedFields'],
  fetchDeclareTypesIng: loading.effects['activity/fetchDeclareTypes'],
}))
class ActivityInfo extends Component {
  columns = [
    {
      title: '操作',
      width: 90,
      key: 'cz',
      align: 'center',
      render: (_, { id }) => (
        <Button type="primary" onClick={e => this.handleProjectGroupSelect(e, id)}>
          申报
        </Button>
      ),
    },
    {
      title: '编号',
      dataIndex: 'id',
      width: 70,
    },
    {
      title: '项目编号',
      dataIndex: 'projectNo',
      width: 70,
    },
    {
      title: '活动名称',
      dataIndex: 'projectName',
      width: 100,
    },
    {
      title: '项目分类',
      dataIndex: 'projectCategory',
      width: 70,
    },
    {
      title: '项目组别',
      dataIndex: 'projectGroupName',
      width: 100,
    },
    {
      title: '资助标准',
      dataIndex: 'subsidizeExplain',
      width: 100,
    },
    {
      title: '项目要求及说明',
      dataIndex: 'conditionExplain',
      width: 240,
    },
    {
      title: '要求举办时间',
      dataIndex: 'datetimeExplain',
      width: 110,
    },
    {
      title: '要求举办地点',
      dataIndex: 'addressExplain',
      width: 110,
    },
    {
      title: '申办单位资质要求',
      dataIndex: 'companyDeclareExplain',
      width: 130,
    },
    {
      title: '申报审核单位名称',
      dataIndex: 'auditCompanyName',
      width: 130,
    },
  ];

  constructor(props) {
    super(props);
    this.industry = getIndustryByUrl(props.activity);

    this.state = {
      nodeDetailData: undefined,
      fixedStaticFields: undefined,

      editMode: false,

      selectVisible: false,

      projectGroupList: undefined,

      declareFillList: undefined,
      tabOptions: null,
    };
  }

  async componentDidMount() {
    const {
      dispatch,
      activity: { DeclareNodeTypes },
    } = this.props;
    const [fixedStaticFields, nodeDetailData] = await Promise.all([
      dispatch({
        type: 'activity/fetchDeclareFixedFields',
        payload: {
          industry: this.industry,
        },
      }),
      dispatch({
        type: 'activity/fetchNodeDetail',
      }),
    ]);
    // 此判断表示上面的加载不ok
    if (fixedStaticFields == null) {
      return;
    }
    if (this.isUnmounted) {
      return;
    }
    const categoryDataList = await dispatch({
      type: 'activity/fetchDeclareTypes',
      payload: {
        industry: this.industry,
        needHtml: true, // 要html
        notFilter: nodeDetailData != null, // 不过滤
      },
    });
    if (!fixedStaticFields.some(item => item.extName === 'category')) {
      fixedStaticFields.push(defaultCategoryField);
    }
    if (!fixedStaticFields.some(item => item.extName === 'configId')) {
      fixedStaticFields.push(defaultConfigField);
    }
    const data = {};
    // 添加fromServer标记
    if (nodeDetailData == null) {
      const { defaultCity, defaultDistrict, defaultProvince } = await this.fetchDefaultHomeTown();
      data.declareCurrentNode = {
        // declareCurrentNode 里的canEdit表示有编辑权限，和组件的canEdit可编辑状态不是一回事
        canEdit: true,
      };
      data.declareDetail = {
        city: defaultCity,
        district: defaultDistrict,
        province: defaultProvince,
        industry: this.industry,
        category: categoryDataList.length === 1 ? categoryDataList[0].category : undefined,
        configId:
          categoryDataList.length === 1 && (categoryDataList[0].configList || []).length === 1
            ? categoryDataList[0].configList[0].configId
            : undefined,
      };
    }
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      nodeDetailData: nodeDetailData || data,
      fixedStaticFields,
    });
    // // 默认有数据的config拉取数据
    const { declareNodeList, declareDetail } = nodeDetailData || data;

    const query = getPageQuery();
    const { step } = query;
    const { configId, currentNodeStep, projectConfigId } = declareDetail || {};
    if (projectConfigId) {
      this.handleProjectGroupSelect(null, projectConfigId);
    }
    const found = (declareNodeList || []).find(item => {
      return item.nodeStep === (step || currentNodeStep);
    });
    if (
      found == null ||
      found.nodeType === DeclareNodeTypes.BASIC.key ||
      found.nodeType === DeclareNodeTypes.AUDIT.key
    ) {
      this.fetchDeclareFields(configId);
    }
  }

  // eslint-disable-next-line camelcase
  async UNSAFE_componentWillUpdate({ location: nextLocation, dispatch }) {
    const { location } = this.props;
    const { step: nextStep, id: nextExerciseId, flag: nextFlag } = getPageQuery(nextLocation.search);
    const { step, id: exerciseId, flag } = getPageQuery(location.search);
    if (nextStep !== step || nextExerciseId !== exerciseId || nextFlag !== flag) {
      let nodeDetailData = await dispatch({
        type: 'activity/fetchNodeDetail',
        payload: { step: nextStep },
      });
      if (this.isUnmounted) {
        return;
      }
      nodeDetailData = nodeDetailData || {
        declareCurrentNode: {
          // declareCurrentNode 里的canEdit表示有编辑权限，和组件的canEdit可编辑状态不是一回事
          canEdit: true,
        },
      };
      const stateOverride = {};
      let configId;
      if (!nextExerciseId) {
        //   const { fixedStaticFields } = this.state;
        Object.assign(stateOverride, {
          declareFillList: undefined,
          projectConfigId: undefined,
        });
        nodeDetailData.declareDetail = {};
        const { defaultCity, defaultDistrict, defaultProvince } = await this.fetchDefaultHomeTown();
        Object.assign(nodeDetailData.declareDetail, {
          city: defaultCity,
          district: defaultDistrict,
          province: defaultProvince,
          industry: this.industry,
        });
        // TODO Tab和Audit不使用的话需要优化为此处或者Basic自己加载
        const categoryDataList = await dispatch({
          type: 'activity/fetchDeclareTypes',
          payload: {
            industry: this.industry,
            needHtml: true, // 要html
            notFilter: false, // 过滤
          },
        });
        if (categoryDataList && categoryDataList.length === 1) {
          const categoryInfo = categoryDataList[0];
          nodeDetailData.declareDetail.category = categoryInfo.category;
          const configList = categoryInfo.configList || [];
          if (configList.length === 1) {
            nodeDetailData.declareDetail.configId = configList[0].configId;
            this.fetchDeclareFields(configId);
          }
        }
      }
      if (nodeDetailData && nodeDetailData.declareDetail && nodeDetailData.declareDetail.projectConfigId) {
        // step=1时的数据结构取得到，其他的结构不同如auth在detailItemList下，但是只需要step=1时重新加载即可其他位置不需要显示
        this.handleProjectGroupSelect(null, nodeDetailData.declareDetail.projectConfigId);
      }
      // eslint-disable-next-line react/no-will-update-set-state
      this.setState({
        nodeDetailData,
        editMode: false,
        selectVisible: false,
        ...stateOverride,
      });
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleProjectGroupSelect = async (e, id) => {
    if (e) {
      e.stopPropagation();
    }
    if (id == null) {
      return;
    }
    this.setState(({ nodeDetailData }) => ({
      nodeDetailData: {
        ...nodeDetailData,
        declareDetail: {
          ...nodeDetailData.declareDetail,
          projectConfigId: id,
        },
      },
      selectVisible: false,
    }));
    // this.handleSelectVisibleChange(false);
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'activity/fetchExerciseDeclareFillList',
      payload: id,
    });
    const startDate = result.findIndex(item => item.name === 'startDate');
    const endDate = result.findIndex(item => item.name === 'endDate');
    const dateIndex = Math.max(startDate, endDate);
    if (dateIndex >= 0) {
      result[dateIndex] = {
        ...result[dateIndex],
        name: 'startDate',
        value: [
          (result[startDate] || {}).value == null ? undefined : moment((result[startDate] || {}).value),
          (result[endDate] || {}).value == null ? undefined : moment((result[endDate] || {}).value),
        ],
      };
      const minDateIndex = Math.min(startDate, endDate);
      if (minDateIndex >= 0) {
        result.splice(minDateIndex, 1);
      }
    }
    const province = result.findIndex(item => item.name === 'province');
    const city = result.findIndex(item => item.name === 'city');
    const district = result.findIndex(item => item.name === 'district');
    const pcdIndex = Math.max(province, city, district);
    if (pcdIndex >= 0) {
      result[pcdIndex] = {
        ...result[pcdIndex],
        name: 'province',
        value: [
          (result[province] || {}).value || undefined,
          (result[city] || {}).value || undefined,
          (result[district] || {}).value || undefined,
        ],
      };
      let c = 0;
      [province, city, district].forEach(idx => {
        if (idx === pcdIndex) {
          return;
        }
        result.splice(idx - c, 1);
        c += 1;
      });
    }
    if (result) {
      this.setState({
        declareFillList: result,
      });
    }
  };

  formSearch = () => {
    const { projectGroupList } = this.state;
    return {
      fields: [
        {
          label: '项目组别',
          name: 'projectGroupId',
          initialValue: '',
          options: projectGroupList,
          optionsMapper: ({ id, groupName }) => ({
            key: id,
            text: groupName,
          }),
          type: ItemTypes.Select,
        },
        {
          label: '项目编号',
          name: 'projectNo',
        },
        {
          label: '活动名称',
          name: 'projectName',
        },
        {
          label: '项目分类',
          name: 'projectCategory',
        },
      ],
    };
  };

  handleSelectedChange = ids => {
    this.handleProjectGroupSelect(null, ids[0]);
  };

  // config变化拉取数据
  handleConfigChange = configId => {
    this.fetchDeclareFields(configId);
    const {
      activity: { categoryDataListMapping },
      RelTypes,
      // dispatch,
    } = this.props;
    const categoryDataList = [...(categoryDataListMapping[this.industry] || [])];
    let config;
    categoryDataList.some(categoryInfo => {
      config = (categoryInfo.configList || []).find(cf => cf.configId === configId);
      if (config) {
        return true;
      }
      return false;
    });
    const mustUseProjectGroup = config && config.relType === RelTypes.EXERCISE_PROJECT_CONFIG.key;
    this.handleSelectVisibleChange(mustUseProjectGroup, configId);
  };

  handleEditClick = editMode => {
    this.setState({
      editMode,
    });
  };

  handleTabInit = opts => {
    this.setState({
      tabOptions: opts,
    });
  };

  updateBasicInfoAfterEdit = (mergeObj = {}) => {
    this.setState(({ nodeDetailData }) => ({
      editMode: false,
      nodeDetailData: {
        ...nodeDetailData,
        declareDetail: {
          ...(nodeDetailData || {}).declareDetail,
          ...mergeObj,
        },
      },
    }));
  };

  handleSelectVisibleChange = async (selectVisible, configId) => {
    this.setState({
      selectVisible,
    });
    const { dispatch } = this.props;
    if (selectVisible) {
      const { editMode } = this.state;
      const query = getPageQuery();
      const id = +query.id;
      if (editMode || id > 0) {
        return;
      }
      const result = await dispatch({
        type: 'activity/fetchProjectGroupList',
        payload: configId,
      });
      if (result) {
        this.setState({
          projectGroupList: result,
        });
      }
    }
  };

  fetchDeclareFields(configId) {
    this.setState(({ nodeDetailData }) => ({
      nodeDetailData: {
        ...nodeDetailData,
        declareDetail: {
          ...nodeDetailData.declareDetail,
          configId,
        },
      },
      declareFillList: undefined,
    }));
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/fetchDeclareFields',
      payload: configId,
    });
  }

  async fetchDefaultHomeTown() {
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'global/queryDefaultHomeTown',
      payload: 'CLOUD_EXERCISE_DECLARE',
    });
    return result || {};
  }

  render() {
    const query = getPageQuery();
    const step = +query.step;
    const id = +query.id;
    const {
      activity,
      fetchDetailIng = false,
      fetchDeclareFillListIng = false,
      fetchDeclareFixedFieldsIng = false,
      fetchDeclareFieldsIng = false,
      fetchDeclareTypesIng = false,
    } = this.props;
    const { DeclareNodeTypes, categoryDataListMapping } = activity;
    const { nodeDetailData, fixedStaticFields, editMode, selectVisible, declareFillList, tabOptions } = this.state;
    const { declareCurrentNode, declareDetail, declareNodeList } = nodeDetailData || {};
    const { configId } = declareDetail || {};
    let found = (declareNodeList || []).find(item => item.nodeStep === (step || (declareDetail || {}).currentNodeStep));
    if (found == null) {
      found = id ? {} : { nodeType: DeclareNodeTypes.BASIC.key };
    }

    let newsId;
    if (declareCurrentNode && declareCurrentNode.fromServer) {
      ({ newsId } = declareCurrentNode);
    } else {
      const categoryDataList = categoryDataListMapping[this.industry] || [];
      categoryDataList.some(categoryInfo => {
        const config = (categoryInfo.configList || []).find(cf => cf.configId === configId);
        if (config) {
          ({ newsId } = config);
          return true;
        }
        return false;
      });
    }

    return (
      <PageHeaderLayout
        title="申报"
        content={
          <div className={styles.stepWrapper}>
            <Step
              data={nodeDetailData}
              editMode={editMode}
              step={step}
              onEditModeChange={this.handleEditClick}
              tabOptions={tabOptions}
            />
          </div>
        }
      >
        <Card bordered={false}>
          <Spin
            spinning={
              fetchDetailIng ||
              fetchDeclareFillListIng ||
              fetchDeclareFixedFieldsIng ||
              fetchDeclareFieldsIng ||
              fetchDeclareTypesIng
            }
          >
            {(() => {
              switch (found.nodeType) {
                case DeclareNodeTypes.DATA.key:
                  return <Tab data={nodeDetailData} onInit={this.handleTabInit} />;
                case DeclareNodeTypes.AUDIT.key:
                  return (
                    <Audit data={nodeDetailData} onInit={this.handleTabInit} fixedStaticFields={fixedStaticFields} />
                  );
                case DeclareNodeTypes.BASIC.key:
                  return (
                    <Basic
                      data={nodeDetailData}
                      fixedStaticFields={fixedStaticFields}
                      editMode={editMode}
                      onConfigChange={this.handleConfigChange}
                      onBasicInfoEdit={this.updateBasicInfoAfterEdit}
                      declareFillList={declareFillList}
                      onProjectConfigClick={() => {
                        this.handleSelectVisibleChange(true, configId);
                      }}
                      onInit={this.handleTabInit}
                    />
                  );
                default:
                  return null;
              }
            })()}
            {newsId && (
              <Row>
                <Col md={4} />
                <Col md={16}>
                  <Divider />
                  <NewsIframe newsId={newsId} />
                </Col>
                <Col md={4} />
              </Row>
            )}
          </Spin>
        </Card>
        {editMode || id > 0 ? null : (
          <Modal
            title="请选择"
            width={1440}
            visible={selectVisible}
            footer={null}
            onVisibleChange={v => this.handleSelectVisibleChange(v, configId)}
          >
            <Datatable
              url={`/exerciseProject/dataList.do?declareConfigId=${configId}`}
              columns={this.columns}
              rowKey="id"
              formSearch={this.formSearch()}
              // operation={this.operation}
              // onInit={this.handleTableInit}
              onSelectedChange={this.handleSelectedChange}
            />
          </Modal>
        )}
      </PageHeaderLayout>
    );
  }
}

export default ActivityInfo;
