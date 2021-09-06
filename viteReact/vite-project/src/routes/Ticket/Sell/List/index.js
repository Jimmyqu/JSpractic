import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Card, Row, Col, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ItemTypes } from '@/components/Datatable';
import MarginBar from '@/components/MarginBar';
import { modelMapToOption } from '@/utils/utils';
import { formatModel, formatImageUrl } from '@/commons/lib/format';
import styles from './index.less';

@connect(({ pubticket, loading }) => ({
  pubticket,
  fetching: loading.effects['pubticket/fetchList'],
}))
class TicketList extends Component {
  columns = [
    {
      title: '票务',
      key: 'id',
      render: (_, { _all }) => {
        const {
          pubticket: { ViewStatus },
        } = this.props;
        return (
          <Row gutter={10}>
            {_all.map(({ id, fileItemVO, descr, ticketName, salesName, viewStatus, ticketTag, relType }) => {
              const selling = viewStatus === ViewStatus.Selling.key;
              return (
                <Col sm={24} md={12} lg={8} xl={6} key={id}>
                  <Link to={`${id}`}>
                    <MarginBar top className={styles.ticket}>
                      <div className={styles.img}>
                        <i
                          className={classNames({
                            [styles.viewTag]: selling || ticketTag > 0,
                            [styles[`viewTag${ticketTag}`]]: !selling && ticketTag > 0,
                          })}
                        />
                        <img
                          src={formatImageUrl(
                            (fileItemVO || {}).url,
                            'img_ticket_list_prew',
                            '//image.ydmap.cn/default_file/default_load_img.png'
                          )}
                          alt="img"
                        />
                      </div>
                      <div className={styles.right}>
                        <div className={classNames('text-overflow-line3', styles.title)}>{ticketName}</div>
                        <div className={styles.time}>演出时间：{descr}</div>
                        <Row className={styles.bottom}>
                          <Col span={16}>{salesName}</Col>
                          <Col span={8} className="text-right">
                            {viewStatus !== ViewStatus.SoldOut.key ? (
                              <Button size="small" type="primary" onClick={e => this.handleSell(e, id, relType)}>
                                售票
                              </Button>
                            ) : (
                              formatModel(ViewStatus, viewStatus)
                            )}
                          </Col>
                        </Row>
                      </div>
                    </MarginBar>
                  </Link>
                </Col>
              );
            })}
          </Row>
        );
      },
    },
  ];

  formSearch = {
    fields: [
      {
        label: '票务编号',
        name: 'ticketId',
      },
      {
        label: '票务名称',
        name: 'ticketName',
      },
      {
        label: '票务状态',
        name: 'viewStatus',
        options: (() => {
          const {
            pubticket: { ViewStatus },
          } = this.props;
          return modelMapToOption(ViewStatus);
        })(),
        type: ItemTypes.Select,
      },
    ],
  };

  dataSourceRender = data => {
    const { rows } = data || {};
    if (rows && rows.length > 0) {
      // 合成一行
      return [
        {
          id: Date.now(),
          _all: rows,
        },
      ];
    }
    return [];
  };

  handleSell = (e, id, relType) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(push(`./${id}/user?reltype=${relType || ''}`));
  };

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            // 去掉行hover样式
            rowClassName="single-row"
            showHeader={false}
            url="/ticket/ticketListToIcon.do"
            columns={this.columns}
            rowKey="id"
            dataSourceRender={this.dataSourceRender}
            formSearch={this.formSearch}
            operation={this.operation}
            pagination={{
              pageSizeOptions: ['16', '30', '50', '100', '200', '500', '1000'],
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default TicketList;
