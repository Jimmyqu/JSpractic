import { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import MarginBar from '@/components/MarginBar';
import Content from '@/components/Datatable/Content';
import { getQueryPath, baseURL } from '@/utils/utils';

class QRCodeImgDownloadContent extends Component {
  render() {
    const {
      cancel,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    return (
      <Content
        title="下载二维码"
        {...restProps}
        buttons={[
          {
            text: '返回',
            action: cancel,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Row>
              <Col xs={8}>二维码边长(cm)</Col>
              <Col xs={8}>建议扫描距离(m)</Col>
              <Col xs={8}>下载链接</Col>
            </Row>
            <MarginBar top>
              <Row>
                <Col xs={8}>8</Col>
                <Col xs={8}>0.5</Col>
                <Col xs={8}>
                  <a
                    href={getQueryPath(`${baseURL}/itemStock/downloadItemCode.do`, {
                      itemStockId: selectedRows[0].id,
                      size: 258,
                    })}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon type="download" style={this.iconStyle} />
                  </a>
                </Col>
              </Row>
            </MarginBar>
            <MarginBar top>
              <Row>
                <Col xs={8}>12</Col>
                <Col xs={8}>0.8</Col>
                <Col xs={8}>
                  <a
                    href={getQueryPath(`${baseURL}/itemStock/downloadItemCode.do`, {
                      itemStockId: selectedRows[0].id,
                      size: 344,
                    })}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon type="download" style={this.iconStyle} />
                  </a>
                </Col>
              </Row>
            </MarginBar>
            <MarginBar top>
              <Row>
                <Col xs={8}>15</Col>
                <Col xs={8}>1</Col>
                <Col xs={8}>
                  <a
                    href={getQueryPath(`${baseURL}/itemStock/downloadItemCode.do`, {
                      itemStockId: selectedRows[0].id,
                      size: 430,
                    })}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon type="download" style={this.iconStyle} />
                  </a>
                </Col>
              </Row>
            </MarginBar>
            <MarginBar top>
              <Row>
                <Col xs={8}>30</Col>
                <Col xs={8}>1.5</Col>
                <Col xs={8}>
                  <a
                    href={getQueryPath(`${baseURL}/itemStock/downloadItemCode.do`, {
                      itemStockId: selectedRows[0].id,
                      size: 860,
                    })}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon type="download" style={this.iconStyle} />
                  </a>
                </Col>
              </Row>
            </MarginBar>
            <MarginBar top>
              <Row>
                <Col xs={8}>50</Col>
                <Col xs={8}>2.5</Col>
                <Col xs={8}>
                  <a
                    href={getQueryPath(`${baseURL}/itemStock/downloadItemCode.do`, {
                      itemStockId: selectedRows[0].id,
                      size: 1280,
                    })}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon type="download" style={this.iconStyle} />
                  </a>
                </Col>
              </Row>
            </MarginBar>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default QRCodeImgDownloadContent;
