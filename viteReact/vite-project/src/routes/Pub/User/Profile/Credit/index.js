import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, Row, Col, message } from 'antd';
import { formatMoney, formatDateTime, formatMoneyLen2, formatModel } from '@/utils/format';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import MarginBar from '@/components/MarginBar';
import { modelMapToOption } from '@/utils/utils';
import AdjustmentContent from './AdjustmentContent';
import PaybackContent from './PaybackContent';
import style from '../credit.less';

@connect(({ pubuser }) => ({
  pubuser,
}))
class ProfileDealFlow extends Component {
  columns = [
    // {
    //   title: '主订单号',
    //   dataIndex: 'id',
    // },
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '操作类型',
      dataIndex: 'creditType',
      render: value => {
        const {
          pubuser: { CreditTypes },
        } = this.props;
        return formatModel(CreditTypes, value);
      },
      width: 80,
    },
    {
      title: '白条使用额度',
      dataIndex: 'creditValue',
      render: formatMoneyLen2,
      width: 130,
    },
    {
      title: '白条可用额度',
      dataIndex: 'creditBalance',
      render: formatMoneyLen2,
      width: 130,
    },
    {
      title: '白条总额度',
      dataIndex: 'creditLimit',
      render: formatMoneyLen2,
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 300,
    },
    {
      title: '业务编号',
      dataIndex: 'srvId',
      width: 130,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 130,
    },
    {
      title: '操作时间',
      dataIndex: 'gmtCreate',
      render: formatDateTime,
      width: 190,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '操作类型',
        name: 'creditType',
        options: (() => {
          const {
            pubuser: { CreditTypes },
          } = this.props;
          return modelMapToOption(CreditTypes);
        })(),
        type: ItemTypes.Select,
      },
    ],
  };

  operation = {
    buttons: [
      {
        text: '调整额度',
        icon: <IconFont type="editor" />,
        action: () => {
          this.setState({
            showContentMode: 1,
          });
        },
      },
      {
        text: '快速还款',
        icon: <IconFont type="menu-pubuser-service" />,
        action: () => {
          this.setState({
            showContentMode: 2,
          });
        },
      },
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  state = {
    showContentMode: null,
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};
    dispatch({
      type: 'pubuser/fetch',
      payload: pubAccountId,
    });
  }

  cancelContent = () => {
    this.setState({
      showContentMode: null,
    });
  };

  handleTableInit = table => {
    this.table = table;
  };

  handleAdjustmentFormSubmit = () => {
    message.success('调整成功');
    this.cancelContent();
    const { reload } = this.table;
    reload();
  };

  handlePaybackFormSubmit = id => {
    if (id) {
      const { dispatch } = this.props;
      dispatch(
        push({
          pathname: `/basic/deal/${id}/summary`,
        })
      );
    }
  };

  handleSelectedChange = (_, rows) => {
    this.setState(({ showContentMode }) => ({
      showContentMode: rows == null || rows.length === 0 ? null : showContentMode,
    }));
  };

  render() {
    const { pubuser, match } = this.props;
    const { showContentMode } = this.state;

    const { id: pubAccountId } = match.params || {};
    const { userInfoCache = {} } = pubuser;
    const viewUserInfo = userInfoCache[pubAccountId] || {};
    const { publicAccount = {} } = viewUserInfo || {};

    return (
      <>
        <Card>
          <Row className={style.topbox}>
            <Col md={6}>
              <TopTip title="会员姓名" value={publicAccount.realName} />
            </Col>
            <Col md={6}>
              <TopTip title="会员手机号" value={publicAccount.mobile} />
            </Col>
            <Col md={6}>
              <TopTip title="白条总额度(元)" value={formatMoney(publicAccount.creditLimit)} />
            </Col>
            <Col md={6}>
              <TopTip title="白条可用额度(元)" value={formatMoney(publicAccount.creditBalance)} />
            </Col>
          </Row>
        </Card>
        <MarginBar top={24}>
          <Card>
            <Datatable
              url={`/publicAccountCredit/dataList.do?publicAccountId=${pubAccountId}`}
              columns={this.columns}
              formSearch={this.formSearch}
              operation={this.operation}
              rowKey="id"
              onInit={this.handleTableInit}
              onSelectedChange={this.handleSelectedChange}
              content={(() => {
                switch (showContentMode) {
                  case 1:
                    return (
                      <AdjustmentContent
                        match={match}
                        cancel={this.cancelContent}
                        sure={this.handleAdjustmentFormSubmit}
                      />
                    );
                  case 2:
                    return (
                      <PaybackContent match={match} cancel={this.cancelContent} sure={this.handlePaybackFormSubmit} />
                    );
                  default:
                    return null;
                }
              })()}
            />
          </Card>
        </MarginBar>
      </>
    );
  }
}

export default ProfileDealFlow;

const TopTip = ({ title, value }) => {
  return (
    <div className={style.toptip}>
      <div>{title}</div>
      <div className={style.bottom}>{value}</div>
    </div>
  );
};
