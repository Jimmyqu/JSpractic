import { useState } from 'react';
import { Card, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatDateTime, formatMoneyLen2, formatModel } from '@/utils/format';
import PurchaseContent from '../List/Stock/PurchaseContent';
import BreakContent from '../List/Stock/BreakContent';
import TransferContent from '../List/Stock/TransferContent';
import MakeAnInventoryContent from './MakeAnInventoryContent';
import CorrectStockModal from './CorrectStockModal';
import ModifyPriceModal from './ModifyPriceModal';

export default function () {
  const dispatch = useDispatch();
  const { currentVenue } = useSelector(state => state.venue);
  const { StockStatus } = useSelector(state => state.store);
  const [selectedRows, setSelectedRows] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [table, setTable] = useState();
  const [visible, SetVisible] = useState(false);
  const [isModifyShow, setModifyShow] = useState(false);

  function cancelContent() {
    setShowContentMode(null);
  }

  const handleVisibleChange = v => {
    SetVisible(v);
  };

  const correctStock = ({ close }, formData) => {
    dispatch({
      type: 'store/correctStock',
      payload: {
        ...formData,
        itemStockId: selectedRows[0].id,
      },
    }).then(() => {
      message.success('更新成功');
      close();
      table.reload();
    });
  };

  return (
    <PageHeaderLayout>
      <CorrectStockModal visible={visible} onVisibleChange={handleVisibleChange} onOk={correctStock} />
      <ModifyPriceModal
        visible={isModifyShow}
        selectedRows={selectedRows}
        onVisibleChange={v => setModifyShow(v)}
        sure={() => {
          message.success('调价成功');
          setModifyShow(false);
          table.reload();
        }}
      />
      <Card bordered={false}>
        <Datatable
          select="multi"
          onSelectedChange={(_, rows) => {
            setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
            setSelectedRows(rows);
          }}
          url="/itemStock/dataList.do"
          rowKey="id"
          columns={[
            {
              title: '商品编号',
              dataIndex: 'itemId',
              width: 90,
            },
            {
              title: '库存编号',
              dataIndex: 'id',
              width: 120,
            },
            {
              title: '商品名称',
              dataIndex: 'itemName',
              width: 120,
            },
            {
              title: '库存',
              dataIndex: 'stockCount',
              width: 90,
            },
            {
              title: '单位',
              dataIndex: 'stockUnit',
              width: 90,
            },
            {
              title: '状态',
              dataIndex: 'state',
              render: value => formatModel(StockStatus, value),
              width: 90,
            },
            {
              title: '销售数量',
              dataIndex: 'stockSoldCount',
              width: 90,
            },
            {
              title: '销售单价',
              dataIndex: 'salesPrice',
              render: formatMoneyLen2,
              width: 120,
            },
            {
              title: '进货价',
              dataIndex: 'buyPrice',
              render: formatMoneyLen2,
              width: 120,
            },
            {
              title: '商品原价',
              dataIndex: 'marketPrice',
              render: formatMoneyLen2,
              width: 120,
            },
            {
              title: '营销中心',
              dataIndex: 'salesName',
              width: 150,
            },
            {
              title: '更新时间',
              dataIndex: 'updateTime',
              render: formatDateTime,
              width: 190,
            },
            {
              title: '创建人',
              dataIndex: 'createRealName',
              width: 120,
            },
            {
              title: '单位名称',
              dataIndex: 'companyName',
              width: 120,
            },
          ]}
          formSearch={{
            fields: [
              {
                label: '营销中心',
                name: 'salesId',
                initialValue: (() => {
                  if (currentVenue) {
                    return currentVenue.id;
                  }
                })(),
                type: ItemTypes.CascaderVenue,
              },
              {
                label: '商品名称',
                name: 'itemName',
              },
              {
                label: '商品编号',
                name: 'itemId',
              },
              {
                label: '库存编号',
                name: 'id',
                defHidden: true,
              },
              {
                label: '销售单价',
                name: 'salesPrice',
                defHidden: true,
              },
            ],
          }}
          operation={{
            buttons: [
              {
                text: '进货',
                auth: 'purchase',
                forRow: 'single',
                action: () => {
                  setShowContentMode(1);
                },
              },
              {
                text: '报损',
                auth: 'breakage',
                forRow: 'single',
                action: () => {
                  setShowContentMode(2);
                },
              },
              {
                text: '调货',
                auth: 'stockmove',
                forRow: 'single',
                action: () => {
                  setShowContentMode(3);
                },
              },
              {
                text: '操作流水',
                icon: <IconFont type="menu-activity-s-list" />,
                forRow: 'single',
                // disabled: deleting,
                action: () => {
                  dispatch(
                    push({
                      pathname: '/basic/mall/stockflow',
                      search: `itemId=${selectedRows[0].itemId}`,
                    })
                  );
                },
              },
              {
                text: '盘点',
                type: 'primary',
                auth: 'inventory',
                forRow: 'single',
                action: () => {
                  setShowContentMode(4);
                },
              },
              {
                auth: 'export',
                btnType: ButtonTypes.Export,
              },
              {
                text: '更正库存',
                auth: 'correctStock',
                forRow: 'single',
                action: () => {
                  handleVisibleChange(true);
                },
              },
              {
                text: '调整价格',
                auth: 'correctStock',
                forRow: 'single',
                action: () => {
                  setModifyShow(true);
                },
              },
            ],
          }}
          onInit={setTable}
          content={(() => {
            switch (showContentMode) {
              case 1:
                return (
                  <PurchaseContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('进货成功');
                      cancelContent();
                      table.reload();
                    }}
                  />
                );
              case 2:
                return (
                  <BreakContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('报损成功');
                      cancelContent();
                      table.reload();
                    }}
                  />
                );
              case 3:
                return (
                  <TransferContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('调货成功');
                      cancelContent();
                      table.reload();
                    }}
                  />
                );
              case 4:
                return (
                  <MakeAnInventoryContent
                    cancel={cancelContent}
                    sure={() => {
                      message.success('盘点成功');
                      cancelContent();
                      table.reload();
                    }}
                  />
                );
              default:
                return null;
            }
          })()}
        />
      </Card>
    </PageHeaderLayout>
  );
}
