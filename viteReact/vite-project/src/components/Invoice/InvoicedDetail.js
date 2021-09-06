import { Component } from 'react';
import classNames from 'classnames';
import { Icon, Card } from 'antd';
import { connect } from 'react-redux';
import VerticalPairColumnTable from '@/components/VerticalPairColumnTable';
import MarginBar from '@/components/MarginBar';
import Table from '@/components/Datatable/BaseTable';
import { formatMoney, formatDateTime, formatSubSeq, formatMoneyLen2, formatModel } from '@/utils/format';
import styles from './index.less';

const { PairColumn } = VerticalPairColumnTable;

@connect(({ pubinvoice, deal }) => ({
  pubinvoice,
  deal,
}))
class InvoicedDetail extends Component {
  columns = [
    {
      title: '主订单号',
      dataIndex: 'dealId',
      width: 90,
    },
    {
      title: '订单类型',
      dataIndex: 'containSubSeq',
      render: formatSubSeq,
      width: 100,
    },
    {
      title: '订单金额',
      dataIndex: 'invoiceMoney',
      render: formatMoneyLen2,
      width: 90,
    },
    {
      title: '账单信息',
      dataIndex: 'invoiceInfo',
      width: 250,
    },
    {
      title: '业务来源',
      dataIndex: 'srvName',
      width: 130,
    },
    {
      title: '支付时间',
      dataIndex: 'payDatetime',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 130,
    },
    // {
    //   title: '下单/创建时间',
    //   dataIndex: 'gmtCreate',
    //   render: formatDateTime,
    //   width: 190,
    // },
    {
      title: '申请时间',
      dataIndex: 'gmtCreate',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '会员姓名',
      dataIndex: 'pubRealName',
      width: 130,
    },
    {
      title: '会员手机号',
      dataIndex: 'pubMobile',
      width: 130,
    },
  ];

  render() {
    const {
      data = {},
      pubinvoice: { InvoiceIssueTypes, InvoiceModeTypes, InvoiceStatus, InvoiceTypes, InvoiceReceiveModeTypes },
    } = this.props;
    return (
      <Card bordered={false}>
        <VerticalPairColumnTable per={2}>
          <PairColumn label="开票总额">{formatMoney(data.invoiceMoney)}</PairColumn>
          <PairColumn label="开具类型">{formatModel(InvoiceIssueTypes, data.issueType)}</PairColumn>
          <PairColumn label="开票方式">{formatModel(InvoiceModeTypes, data.invoiceMode)}</PairColumn>
          <PairColumn label="发票状态">
            <span
              className={classNames({
                [styles.cancelColor]: data.invoiceStatus === InvoiceStatus.CANCEL.key,
              })}
            >
              {formatModel(InvoiceStatus, data.invoiceStatus)}
              {data.invoiceStatus === InvoiceStatus.CANCEL.key && <>（{data.cancelNote}）</>}
            </span>
          </PairColumn>
          <PairColumn label="发票类型">{formatModel(InvoiceTypes, data.invoiceType)}</PairColumn>

          {data.issueType === InvoiceIssueTypes.ENTERPRISE.key && (
            <>
              <PairColumn label="发票抬头">{data.invoiceName}</PairColumn>
              <PairColumn label="税务登记证号">{data.registerNo}</PairColumn>
              <PairColumn label="开户银行">{data.bankName}</PairColumn>
              <PairColumn label="开户账号">{data.bankAccount}</PairColumn>
              <PairColumn label="注册单位地址">{data.regAddress}</PairColumn>
              <PairColumn label="单位电话">{data.contact}</PairColumn>
            </>
          )}

          <PairColumn label="备注">{data.invoiceNote}</PairColumn>
          <PairColumn label="开票时间">{formatDateTime(data.invoiceDate)}</PairColumn>
          <PairColumn label="申请时间">{formatDateTime(data.gmtCreate)}</PairColumn>
          <PairColumn label="发票号码">
            {Array.isArray(data.invoiceNo) ? data.invoiceNo.join(' ; ') : data.invoiceNo}
          </PairColumn>
          <PairColumn label="编号">{data.id}</PairColumn>
          <PairColumn label="收取方式">{formatModel(InvoiceReceiveModeTypes, data.receiveMode)}</PairColumn>
          <PairColumn label="收件邮箱">{data.email}</PairColumn>
          <PairColumn label="会员信息">
            {data.pubRealName}/{data.pubMobile}
          </PairColumn>
          <PairColumn label="创建人">{data.createRealName}</PairColumn>
          <PairColumn label="单位名称">{data.companyName}</PairColumn>
          <PairColumn label="创建时间">{formatDateTime(data.gmtCreate)}</PairColumn>
          <PairColumn label="更新时间">{formatDateTime(data.gmtModified)}</PairColumn>
        </VerticalPairColumnTable>

        {data.invoiceDetailList && data.invoiceDetailList.length > 0 && (
          <MarginBar top={32}>
            <MarginBar bottom>
              您的发票关联了以下 {data.invoiceDetailList.length} 个账单，合计金额 &nbsp;
              <span className={styles.cancelColor}>
                {formatMoney(data.invoiceDetailList.reduce((prev, { invoiceMoney }) => prev + invoiceMoney, 0))}
              </span>
              {data.fileItemVOList && data.fileItemVOList.length > 0 && (
                <>
                  &nbsp;发票文件：
                  {data.fileItemVOList.map(({ id, cdnUrl, fileName }) => (
                    <a className={styles.fileLink} key={id} href={cdnUrl} target="_blank" rel="noopener noreferrer">
                      {fileName} <Icon type="download" />
                    </a>
                  ))}
                </>
              )}
            </MarginBar>

            <Table
              columns={this.columns}
              rowKey="id"
              bordered
              dataSource={data.invoiceDetailList}
              pagination={false}
              scroll={{ x: true }}
            />
            <MarginBar top className="text-right">
              共 {data.invoiceDetailList.length} 条
            </MarginBar>
          </MarginBar>
        )}
      </Card>
    );
  }
}

export default InvoicedDetail;
