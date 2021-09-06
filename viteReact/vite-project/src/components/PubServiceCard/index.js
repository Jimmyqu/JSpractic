import { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Row, Col, Card, Icon } from 'antd';
import { formatMoney, formatDate, formatDateCsvt } from '@/utils/format';
import DataContent from './DataContent';
import style from './index.less';

@connect(({ loading }) => ({
  calculatIng: loading.effects['orderprocessing/calcPubServicePrice'],
}))
class PubServiceCard extends Component {
  render() {
    const { data, selected, onClick = () => {}, calculatIng, showWhy } = this.props;
    const {
      id,
      cardNo,
      serviceName,
      surplusAmount,
      startDate,
      endDate,
      pubServiceDataList,
      serviceUseMode,
      serviceState,
      serviceStateValue,
      publicServiceStudyList,
    } = data || {};

    const amountValue = formatMoney(surplusAmount);
    const dueDateValue = startDate && endDate ? `${formatDate(startDate)}至${formatDateCsvt(endDate)}` : '不限';
    const dataContent = <DataContent pubServiceDataList={pubServiceDataList} serviceUseMode={serviceUseMode} />;
    const disabled = serviceState !== 0;
    const loading = selected && calculatIng;
    return (
      <Card
        bodyStyle={{ padding: 0 }}
        bordered={false}
        className={classNames(style.card, {
          [style.cardShowError]: showWhy,
        })}
        loading={loading}
      >
        <div
          className={classNames(style.container, {
            [style.disabled]: disabled,
            [style.selected]: selected,
          })}
          onClick={() => {
            if (disabled || loading) {
              return;
            }
            onClick(selected ? null : id);
          }}
        >
          <div className={style.header}>
            <Row title={serviceName}>
              <Col className="text-overflow" style={{ fontSize: 18 }}>
                {serviceName}
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Row title={`卡号：${id}`}>
                  <Col span={7}>卡号:</Col>
                  <Col span={17} className="text-overflow text-right">
                    {id}
                  </Col>
                </Row>
              </Col>
              <Col span={1} />
              <Col span={12}>
                <Row title={`余额：${amountValue}`}>
                  <Col span={7}>余额:</Col>
                  <Col span={17} className="text-overflow text-right">
                    {amountValue}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row title={`有效期:${dueDateValue}`}>
              <Col span={6}>有效期:</Col>
              <Col span={18} className="text-overflow text-right">
                {dueDateValue}
              </Col>
            </Row>
          </div>
          <div className={style.body}>
            <Row>
              <Col className="text-overflow-line2" style={{ float: 'left' }}>
                {dataContent}
              </Col>
            </Row>
          </div>
          {(cardNo || publicServiceStudyList?.length > 0) && (
            <div className={classNames(style.body, style.binding)}>
              <Row>
                <Col>
                  <div>IC/物理卡号:{cardNo}</div>
                  {publicServiceStudyList?.map(item => {
                    return (
                      <div key={item.id}>
                        绑定人员: {item.realName}&nbsp;&nbsp;
                        {item.mobile}
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </div>
          )}
          <div
            className={classNames('text-overflow', style.disabledReason, {
              [style.isDisabled]: disabled,
            })}
            title={serviceStateValue}
          >
            {disabled ? (
              <>
                <Icon type="exclamation-circle" />
                &nbsp;
                {serviceStateValue}
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </Card>
    );
  }
}

export default PubServiceCard;
