import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { goBack } from 'connected-react-router';
import { Card, Button, List, Icon } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Result from '@/components/Result';
import TicketCheckResultModal from '@/components/Modal/TicketCheckResultModal';
import { formatDate, formatHM } from '@/utils/format';
import { getPageQuery } from '@/utils/utils';
import Datatable from '@/components/Datatable';
import style from './index.less';

@connect(({ pubticket, global: { QrCodeMatrixActions } }) => ({
  pubticket,
  QrCodeMatrixActions,
}))
class ExerciseProfile extends Component {
  static contextTypes = {
    scanQRCode: PropTypes.func,
    playVerifyAudio: PropTypes.func,
  };

  state = {
    ticketCheckResultVisible: false,
    ticketCheckResult: undefined,

    selectedId: null,
  };

  columns = [
    {
      title: '验票',
      key: 'id',
      render: (_, { _all }) => {
        return <List dataSource={_all} renderItem={this.renderItem} />;
      },
    },
  ];

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  dataSourceRender = data => {
    const { rows } = data || {};
    if (rows && rows.length > 0) {
      return [
        {
          id: Date.now(),
          _all: rows,
        },
      ];
    }
    return [];
  };

  handleToScan = scheduleId => {
    const { selectedId } = this.state;
    if (scheduleId) {
      this.setState({
        selectedId: scheduleId,
      });
    }
    const sid = scheduleId || selectedId;
    const { scanQRCode } = this.context;
    scanQRCode(code => {
      this.handleScanResult(sid, code);
    }, true);
  };

  handleScanResult = (sid, code) => {
    const { dispatch, QrCodeMatrixActions } = this.props;
    const { playVerifyAudio } = this.context;
    dispatch({
      type: 'global/wxScan',
      payload: {
        scheduleId: sid,
        // 不提供action则不要求匹配，反之要求匹配
        action: QrCodeMatrixActions.CheckTicket.key,
        scanValue: code,
        checkedNumState: !!getPageQuery().all,
      },
    })
      .catch(() => {
        playVerifyAudio(false);
      })
      .then(result => {
        if (result == null) {
          return;
        }
        playVerifyAudio(result.success);
        this.setState({
          ticketCheckResultVisible: true,
          ticketCheckResult: {
            ...result,
            isVerify: true,
          },
        });
      });
  };

  handleTicketCheckResultVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      ticketCheckResultVisible: visible,
    });
  };

  renderItem = ({
    id,
    picUrl,
    descr,
    salesName,
    platformName,
    calendarType,
    startDate,
    startTime,
    fromDate,
    toDate,
  }) => {
    const {
      pubticket: { CalendarTypes },
    } = this.props;
    const { selectedId } = this.state;
    return (
      <List.Item
        className={classNames(style.listItem, {
          [style.selected]: selectedId === id,
        })}
        onClick={() => this.handleToScan(id)}
      >
        <List.Item.Meta
          avatar={<img src={picUrl} alt="ticket img" />}
          title={descr}
          description={
            <>
              <div>
                {salesName}-{platformName}
              </div>
              {calendarType === CalendarTypes.FIXEDSCHEDULE.key && (
                <div>
                  {formatDate(startDate)} {formatHM(startTime)}
                </div>
              )}
              {calendarType === CalendarTypes.VALIDITYSCHEDULE.key && (
                <div>
                  {formatDate(fromDate)}至{formatDate(toDate)}
                </div>
              )}
            </>
          }
        />
        <Icon type="right" theme="outlined" />
      </List.Item>
    );
  };

  render() {
    const { match, dispatch } = this.props;
    const { ticketCheckResultVisible, ticketCheckResult } = this.state;
    const { id } = match.params || {};
    const invalid = !/^\d+$/.test(id);
    return (
      <PageHeaderLayout title="验票">
        {invalid ? (
          <Card bordered={false}>
            <Result
              type="error"
              title="错误"
              description="id参数错误"
              actions={
                <Button type="primary" onClick={() => dispatch(goBack())}>
                  返回
                </Button>
              }
            />
          </Card>
        ) : (
          <Card bordered={false} title="请选择票务信息进入扫码验证" headStyle={{ textAlign: 'center' }}>
            <Datatable
              rowClassName="single-row"
              bordered={false}
              showHeader={false}
              url={`/exerciseList/querySchedule.do?exerciseId=${id}`}
              columns={this.columns}
              rowKey="id"
              dataSourceRender={this.dataSourceRender}
            />
          </Card>
        )}
        <TicketCheckResultModal
          visible={ticketCheckResultVisible}
          result={ticketCheckResult}
          onOk={this.handleToScan}
          onVisibleChange={this.handleTicketCheckResultVisibleChange}
        />
      </PageHeaderLayout>
    );
  }
}

export default ExerciseProfile;
