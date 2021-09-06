import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, message, Row, Tabs } from 'antd';
import Datatable, { ItemTypes } from '@/components/Datatable';
import MarginBar from '@/components/MarginBar';
import Drawer from '@/components/Drawer';
import { formatStudyList, formatSeatData, formatDate, formatHM, formatModel } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

const TabKey = {
  ByOrder: '1',
  ByIdle: '2',
};

export default ({ dealId, dealInfo, ...rest }) => {
  const visible = dealId != null;
  const { dealTicketList } = dealInfo || {};
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['pubticket/saveReplaceSeat']);
  const [activeKey, setActiveKey] = useState(TabKey.ByOrder);
  const [selectRows, setSelectRows] = useState();
  const [dealTargetSelectRows, setDealTargetSelectRows] = useState();
  const [seatTargetSelectRows, setSeatTargetSelectRows] = useState();
  const { CalendarTypes, SeatStatus, DealStatus } = useSelector(state => state.pubticket);

  const useTargetSelectRows = activeKey === TabKey.ByOrder ? dealTargetSelectRows : seatTargetSelectRows;
  return (
    <Drawer
      title="更换座位"
      width={1024}
      visible={visible}
      {...rest}
      onOk={() => {
        const payload = {
          usedDealTicketId: selectRows[0].id,
        };
        if (activeKey === TabKey.ByOrder) {
          payload.seatDataId = dealTargetSelectRows[0].dealTicket.seatDataId;
          payload.newDealTicketId = dealTargetSelectRows[0].dealTicket.id;
        } else {
          payload.seatDataId = seatTargetSelectRows[0].id;
        }
        const promise = dispatch({
          type: 'pubticket/saveReplaceSeat',
          payload,
        });
        promise.then(() => {
          message.success('更换成功');
          rest.onOk?.();
        });
        return promise;
      }}
      footer={[
        <Button key="close" link="cancel" disabled={saving} />,
        <Button key="ok" link="ok" disabled={!(useTargetSelectRows?.length > 0)} loading={saving} />,
      ]}
    >
      {dealId && (
        <Row>
          <Col span={12}>请选择要更换的座位:</Col>
          <Col span={12} className="text-right">
            已选订单 <Link to={`/basic/deal/${dealId}`}>{dealId}</Link>
          </Col>
        </Row>
      )}
      <MarginBar top>
        <Datatable
          select="single"
          columns={[
            {
              title: '主订单号',
              dataIndex: 'dealId',
              width: 110,
            },
            {
              title: '票务订单号',
              dataIndex: 'id',
              width: 110,
            },
            {
              title: '会员姓名',
              dataIndex: 'publicRealName',
              render: (value, { publicMobile }) => [value, publicMobile].filter(Boolean).join('/'),
              width: 170,
            },
            {
              title: '入场人员/学员信息',
              dataIndex: 'dealTicketStudyList',
              render: formatStudyList,
              width: 260,
            },
            {
              title: '座位号',
              dataIndex: 'seatDataName',
              render: formatSeatData,
              width: 170,
            },
            {
              title: '演出/可用日期',
              dataIndex: 'orderDate',
              render: (value, { calendarType }) => {
                if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
                  return null;
                }
                return formatDate(value);
              },
              width: 110,
            },
            {
              title: '开始时间',
              dataIndex: 'startTime',
              render: (value, { calendarType }) => {
                if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
                  return null;
                }
                return formatHM(value);
              },
              width: 80,
            },
          ]}
          onSelectedChange={(_, rows) => {
            setSelectRows(rows);
          }}
          dataList={dealTicketList || []}
          personalization={false}
          pagination={false}
          rowKey="id"
        />
      </MarginBar>
      {selectRows?.length === 1 && (
        <MarginBar top bottom>
          <Row>
            <Col span={12}>更换为:</Col>
          </Row>
          <Tabs defaultActiveKey={TabKey.ByOrder} activeKey={activeKey} onChange={setActiveKey}>
            <Tabs.TabPane tab="订单互换" key={TabKey.ByOrder}>
              <Datatable
                select="single"
                url={`/dealTicket/dataList.do?scheduleDetailId=${selectRows[0].scheduleDetailId}&dealState=${DealStatus.DEAL_PASS.key}`}
                personalization={false}
                columns={[
                  {
                    title: '主订单号',
                    dataIndex: 'deal.id',
                    render: value => <Link to={`/basic/deal/${value}`}>{value}</Link>,
                    width: 110,
                  },
                  {
                    title: '票务订单号',
                    dataIndex: 'dealTicket.id',
                    width: 110,
                  },
                  {
                    title: '会员姓名',
                    dataIndex: 'dealTicket.publicRealName',
                    render: (value, { publicMobile }) => [value, publicMobile].filter(Boolean).join('/'),
                    width: 170,
                  },
                  {
                    title: '入场人员/学员信息',
                    dataIndex: 'dealTicket.dealTicketStudyList',
                    render: formatStudyList,
                    width: 260,
                  },
                  {
                    title: '座位号',
                    dataIndex: 'dealTicket.seatDataName',
                    render: formatSeatData,
                    width: 170,
                  },
                  {
                    title: '演出/可用日期',
                    dataIndex: 'dealTicket.orderDate',
                    render: (value, { calendarType }) => {
                      if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
                        return null;
                      }
                      return formatDate(value);
                    },
                    width: 110,
                  },
                  {
                    title: '开始时间',
                    dataIndex: 'dealTicket.startTime',
                    render: (value, { calendarType }) => {
                      if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
                        return null;
                      }
                      return formatHM(value);
                    },
                    width: 80,
                  },
                ]}
                formSearch={{
                  col: {
                    sm: 24,
                    md: 8,
                  },
                  fields: [
                    {
                      label: '主订单号',
                      name: 'dealId',
                    },
                    {
                      label: '手机号',
                      name: 'publicMobile',
                    },
                    {
                      label: '座位号',
                      name: 'seatDataName',
                      placeholder: '请填写座位号数字',
                      defHidden: true,
                    },
                    // {
                    //   label: '排数',
                    //   name: 'rowsNum',
                    // },
                    {
                      label: '票务订单号',
                      name: 'id',
                      defHidden: true,
                    },
                    {
                      label: '会员姓名',
                      name: 'publicRealName',
                      defHidden: true,
                    },
                    // {
                    //   label: '区域名称',
                    //   name: 'areaCategoryName',
                    //   defHidden: true,
                    // },
                    // {
                    //   label: '楼层名称',
                    //   name: 'floorCategoryName',
                    //   defHidden: true,
                    // },
                    // {
                    //   label: '等级名称',
                    //   name: 'levelCategoryName',
                    //   defHidden: true,
                    // },
                    {
                      label: '入场人员',
                      name: 'pubStudyRealName',
                      defHidden: true,
                    },
                    {
                      label: '入场人员手机',
                      name: 'pubStudyMobile',
                      defHidden: true,
                    },
                  ],
                }}
                onSelectedChange={(_, rows) => {
                  setDealTargetSelectRows(rows);
                }}
                rowSelection={{
                  checkboxShouldBeDisable: record => {
                    const { seatDataId } = record.dealTicket;
                    return !seatDataId || dealTicketList?.some(item => item.seatDataId === seatDataId);
                  },
                }}
                rowKey={record => record.dealTicket.id}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="空位换座" key={TabKey.ByIdle}>
              <Datatable
                select="single"
                url={`/seatData/getListPage.do?scheduleDetailId=${selectRows[0].scheduleDetailId}`}
                personalization={false}
                columns={[
                  {
                    title: '座位状态',
                    dataIndex: 'seatState',
                    render: value => formatModel(SeatStatus, value),
                    width: 110,
                  },
                  {
                    title: '座位号',
                    dataIndex: 'seatValue',
                    width: 110,
                  },
                  {
                    title: '排数',
                    dataIndex: 'rowsNum',
                    width: 110,
                  },
                  {
                    title: '区域名称',
                    dataIndex: 'areaCategoryName',
                    width: 110,
                  },
                  {
                    title: '等级名称',
                    dataIndex: 'levelCategoryName',
                    width: 110,
                  },
                  {
                    title: '楼层名称',
                    dataIndex: 'floorCategoryName',
                    width: 110,
                  },
                  {
                    title: '座位说明',
                    dataIndex: 'descr',
                    width: 250,
                  },
                  {
                    title: '座位编号',
                    dataIndex: 'id',
                    width: 110,
                  },
                ]}
                formSearch={{
                  col: {
                    sm: 24,
                    md: 8,
                  },
                  fields: [
                    {
                      label: '座位状态',
                      name: 'seatStates',
                      mode: 'multiple',
                      options: modelMapToOption(SeatStatus),
                      initialValue: [SeatStatus.Available.key],
                      type: ItemTypes.Select,
                    },
                    {
                      label: '座位号',
                      placeholder: '请填写座位号数字',
                      name: 'seatValue',
                    },
                    {
                      label: '排数',
                      name: 'rowsNum',
                      placeholder: '请填写排数数字',
                      defHidden: true,
                    },
                    {
                      label: '区域名称',
                      name: 'areaCategoryName',
                      defHidden: true,
                    },
                    {
                      label: '楼层名称',
                      name: 'floorCategoryName',
                      defHidden: true,
                    },
                    {
                      label: '等级名称',
                      name: 'levelCategoryName',
                      defHidden: true,
                    },
                  ],
                }}
                rowKey="id"
                onSelectedChange={(_, rows) => {
                  setSeatTargetSelectRows(rows);
                }}
                rowSelection={{
                  checkboxShouldBeDisable: record => {
                    return record.seatState !== SeatStatus.Available.key;
                  },
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </MarginBar>
      )}
    </Drawer>
  );
};
