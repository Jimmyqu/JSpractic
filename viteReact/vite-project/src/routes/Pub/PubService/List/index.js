import { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, Row, Col, Button, Icon } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DataContent from '@/components/PubServiceCard/DataContent';
import MarginBar from '@/components/MarginBar';
import {
  formatMoney,
  formatTimeDuration,
  formatDate,
  formatDateTime,
  formatDateCsvt,
  formatModel,
  formatMoneyLen2,
} from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import styles from './index.less';

@connect(({ pubservice, venue }) => ({
  pubservice,
  venue,
}))
class PubService extends Component {
  state = {
    selectedRows: undefined,
    cardStyle: true,
    formData: null,
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'pubService.id',
      width: 100,
    },
    {
      title: '服务标签',
      dataIndex: 'pubService.serviceTag',
      render: value => {
        const {
          pubservice: { ServiceTagTypes },
        } = this.props;
        return formatModel(ServiceTagTypes, value);
      },
      width: 90,
    },
    {
      title: '服务分类',
      dataIndex: 'pubService.serviceCategoryName',
      width: 110,
    },
    {
      title: '服务名称',
      dataIndex: 'pubService.serviceName',
      width: 250,
    },
    {
      title: '服务内容',
      dataIndex: 'pubServiceDataList',
      render: (value, { pubService: { serviceUseMode } }) => (
        <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />
      ),
      width: 400,
    },
    {
      title: '价格(元)',
      dataIndex: 'pubService.price',
      render: formatMoneyLen2,
      width: 100,
    },
    {
      title: '储值金额(元)',
      dataIndex: 'pubService.serviceAmount',
      render: formatMoneyLen2,
      width: 120,
    },
    {
      title: '有效场馆',
      dataIndex: 'pubService.serviceValidSalesName',
      width: 300,
    },
    {
      title: '服务状态',
      dataIndex: 'pubService.state',
      render: value => {
        const {
          pubservice: { ServiceStatus },
        } = this.props;
        return formatModel(ServiceStatus, value);
      },
      width: 100,
    },
    {
      title: '服务计费方式',
      dataIndex: 'pubService.analysisCalcMode',
      render: value => {
        const {
          pubservice: { AnalysisCalcModeTypes },
        } = this.props;
        return formatModel(AnalysisCalcModeTypes, value);
      },
      width: 110,
    },
    {
      title: '服务记入方式',
      dataIndex: 'pubService.analysisWriteMode',
      render: value => {
        const {
          pubservice: { AnalysisWriteModeTypes },
        } = this.props;
        return formatModel(AnalysisWriteModeTypes, value);
      },
      width: 110,
    },
    {
      title: '使用服务值时是否需要余额',
      dataIndex: 'pubService.serviceIsAmount',
      render: value => ['否', '是'][value],
      width: 200,
    },
    {
      title: '服务值是否相加',
      dataIndex: 'pubService.serviceIsAdd',
      render: value => {
        const {
          pubservice: { PubServiceCalcTypes },
        } = this.props;
        return formatModel(PubServiceCalcTypes, value);
      },
      width: 140,
    },
    {
      title: '有效类型',
      dataIndex: 'pubService.serviceType',
      render: value => {
        const {
          pubservice: { ServiceTypes },
        } = this.props;
        return formatModel(ServiceTypes, value);
      },
      width: 90,
    },
    {
      title: '有效期/天',
      dataIndex: 'pubService.serviceValid',
      render: value => formatTimeDuration(value),
      width: 80,
    },
    {
      title: '有效开始日期',
      dataIndex: 'pubService.startDate',
      render: formatDate,
      width: 130,
    },
    {
      title: '有效结束日期',
      dataIndex: 'pubService.endDate',
      render: formatDate,
      width: 130,
    },
    {
      title: '服务描述',
      dataIndex: 'pubService.descr',
      width: 300,
    },
    {
      title: '排序',
      dataIndex: 'pubService.ranks',
      width: 60,
    },
    {
      title: '创建时间',
      dataIndex: 'pubService.createTime',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '更新时间',
      dataIndex: 'pubService.updateTime',
      render: formatDateTime,
      width: 190,
    },
  ];

  columnsCard = [
    {
      title: '票务',
      key: 'id',
      render: (_, { _all }) => {
        const {
          pubservice: { ServiceTypes, ServiceTagTypes, CouponStyleConfigs, DefaultCouponStyleConfig },
        } = this.props;
        const { selectedRows } = this.state;
        const now = moment().valueOf();
        return (
          <Row gutter={10}>
            {(_all || []).map(item => {
              const { pubService, pubServiceDataList } = item || {};
              const {
                serviceName,
                serviceTag,
                serviceAmount,
                serviceType,
                serviceValid,
                startDate,
                price,
                serviceUseMode,
                endDate,
                id,
              } = pubService;
              const styleCfg = CouponStyleConfigs[serviceTag] || DefaultCouponStyleConfig;
              return (
                <Col sm={24} md={12} lg={8} xl={6} key={id}>
                  <MarginBar top={12} left={5} right={5} bottom={16}>
                    <div
                      className={classNames(styles.serviceCard, {
                        [styles.expired]: serviceType === ServiceTypes.FIXATIONINVISIBLE.key && endDate <= now,
                        [styles.selected]: (selectedRows || []).find(it => it === item),
                      })}
                      onClick={() => this.serviceCardSelect(item)}
                    >
                      <div className={styles.serviceCardTop}>
                        <div className={styles.serviceId}>服务编号：{id}</div>
                        <div className="text-overflow">{serviceName}</div>
                        <Row>
                          <Col span={12}>销售价格：{formatMoney(price)}</Col>
                          <Col span={12}>储值金额：{formatMoney(serviceAmount)}</Col>
                        </Row>
                        <div>
                          有效期：
                          {(() => {
                            switch (serviceType) {
                              case ServiceTypes.UNLIMITEDVALIDITY.key:
                                return '不限';
                              case ServiceTypes.FIXATIONINVISIBLE.key:
                                return `${formatDate(startDate)} 至 ${formatDateCsvt(endDate)}`;
                              case ServiceTypes.DYNAMICINVISIBLE.key:
                                return formatTimeDuration(serviceValid);
                              default:
                                return '';
                            }
                          })()}
                        </div>
                      </div>
                      <div className="clip-section">
                        <div className="clip-gap clip-gap-left" />
                        <div className="clip-line" />
                        <div className="clip-line" style={{ backgroundColor: styleCfg.contentBgColor }} />
                        <div className="clip-gap clip-gap-right" />
                      </div>
                      <div className={styles.serviceCardBottom} style={{ backgroundColor: styleCfg.contentBgColor }}>
                        <div className="text-overflow-line2">
                          <DataContent pubServiceDataList={pubServiceDataList} serviceUseMode={serviceUseMode} />
                        </div>
                      </div>
                      {serviceTag > 0 && (
                        <div
                          className={classNames(styles.serviceCardTag, {
                            [styles.serviceCardTagSp]: [
                              ServiceTagTypes.PACKAGE_TICKET.key,
                              ServiceTagTypes.MONTHLY_CARD.key,
                              ServiceTagTypes.SEASON_CARD.key,
                              ServiceTagTypes.YEAR_CARD.key,
                              ServiceTagTypes.ALL_IN_ONE.key,
                            ].includes(serviceTag),
                          })}
                          style={{ backgroundColor: styleCfg.labelBgColor }}
                        >
                          {formatModel(ServiceTagTypes, serviceTag)}
                        </div>
                      )}
                    </div>
                  </MarginBar>
                </Col>
              );
            })}
          </Row>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pubservice/fetchServiceCategory',
    });
  }

  formSearch = () => {
    const {
      pubservice: { AnalysisWriteModeTypes, ServiceTagTypes, AnalysisCalcModeTypes, categoryList },
      venue: { currentVenue },
    } = this.props;
    return {
      onSearch: formData => {
        this.setState({
          formData,
        });
      },
      fields: [
        {
          label: '营销中心',
          name: 'salesId',
          initialValue: (currentVenue || {}).id,
          type: ItemTypes.CascaderVenue,
        },
        {
          label: '服务标签',
          name: 'serviceTag',
          options: modelMapToOption(ServiceTagTypes),
          type: ItemTypes.Select,
        },
        {
          label: '服务分类',
          name: 'serviceCategoryId',
          options: modelMapToOption(categoryList),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '服务名称',
          placeholder: '服务名称',
          name: 'serviceName',
        },
        {
          label: '编号',
          placeholder: '服务编号',
          name: 'id',
          defHidden: true,
        },
        {
          label: '服务计费方式',
          name: 'analysisCalcMode',
          options: modelMapToOption(AnalysisCalcModeTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '服务记入方式',
          name: 'analysisWriteMode',
          options: modelMapToOption(AnalysisWriteModeTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
      ],
    };
  };

  operation = () => {
    const { cardStyle } = this.state;
    return {
      buttons: [
        {
          text: '销售',
          icon: <IconFont type="cart" />,
          auth: 'edit',
          type: 'danger',
          forRow: 'single',
          action: () => {
            const { dispatch } = this.props;
            const { selectedRows, formData } = this.state;
            dispatch({
              type: 'venue/changeVenueId',
              payload: formData?.salesId,
            });
            dispatch(push(`./${selectedRows[0].pubService.id}`));
          },
        },
        {
          text: '购买记录',
          icon: <IconFont type="menu-deal-store" />,
          auth: 'buyService',
          forRow: 'single',
          action: () => {
            const { dispatch } = this.props;
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: '/basic/deal/pubservice',
                search: `serviceId=${selectedRows[0].pubService.id}`,
              })
            );
          },
        },
        {
          text: '服务计费结算', // 售前
          auth: 'analysis-checkout',
          forRow: 'multi',
          action: () => {
            const { selectedRows } = this.state;
            modal.confirm(
              '您确认要结算该服务吗？结算后服务金额、优惠、次数将清零，在本次结算的消费中全部支付并计入统计?',
              {
                onOk: async () => {
                  //
                  const { dispatch } = this.props;
                  await dispatch({
                    type: 'pubservice/analysisCheckout',
                    payload: selectedRows.map(item => item.pubService.id),
                  });
                  this.table.reload();
                },
              }
            );
          },
        },
        {
          text: '可用服务',
          icon: <IconFont type="menu-stat-biz-pubservice" />,
          auth: 'purchasedService',
          forRow: 'single',
          action: () => {
            const { dispatch } = this.props;
            const { selectedRows } = this.state;
            dispatch(push(`../pubservicesold?pubServiceId=${selectedRows[0].pubService.id}`));
          },
        },
        !cardStyle && {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ].filter(Boolean),
      extContentRender: () => {
        return (
          <Button.Group>
            <Button type={cardStyle ? undefined : 'primary'} onClick={() => this.switchStyle()}>
              <Icon type="ordered-list" />
              列表
            </Button>
            <Button type={cardStyle ? 'primary' : undefined} onClick={() => this.switchStyle(true)}>
              <Icon type="appstore" />
              卡片
            </Button>
          </Button.Group>
        );
      },
    };
  };

  switchStyle = cardStyle => {
    this.setState(
      () => ({
        cardStyle,
      }),
      () => {
        this.table.reload();
      }
    );
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleLoadData = list => {
    const { dispatch } = this.props;
    const { cardStyle } = this.state;
    dispatch({
      type: 'pubservice/flushData',
      // eslint-disable-next-line no-underscore-dangle
      payload: cardStyle ? (list[0] || {})._all : list,
    });
  };

  handleTableInit = table => {
    this.table = table;
  };

  dataSourceRender = data => {
    const { cardStyle } = this.state;
    const { rows } = data || {};
    if (cardStyle && Array.isArray(rows) && rows.length > 0) {
      // 合成一行
      return [
        {
          pubService: {
            id: Date.now(),
          },
          _all: rows,
        },
      ];
    }
    return rows;
  };

  selectHolder = () => {
    const { cardStyle } = this.state;
    return !cardStyle;
  };

  serviceCardSelect = item => {
    this.setState(({ selectedRows }) => {
      const list = [...selectedRows];
      const idx = list.indexOf(item);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
      return {
        selectedRows: list,
      };
    });
  };

  render() {
    const { cardStyle, selectedRows } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            bordered={!cardStyle}
            select={cardStyle ? undefined : 'multi'}
            rowClassName={cardStyle ? 'single-row' : undefined}
            onSelectedChange={this.handleSelectedChange}
            rowSelection={{
              selectedRows,
            }}
            url="/pubService/dataList.do"
            showHeader={!cardStyle}
            columns={cardStyle ? this.columnsCard : this.columns}
            rowKey={record => record.pubService.id}
            dataSourceRender={this.dataSourceRender}
            selectHolder={this.selectHolder}
            formSearch={this.formSearch()}
            operation={this.operation()}
            onLoadData={this.handleLoadData}
            onInit={this.handleTableInit}
            pagination={{
              pageSizeOptions: ['16', '30', '50', '100', '200', '500', '1000'],
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default PubService;
