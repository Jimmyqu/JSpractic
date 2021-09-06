import { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, message, Modal, Button } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import LevelView from '@/components/LevelView';
import { formatDateHM, formatDateTime, formatModel } from '@/utils/format';
import { baseURL, mergeUrlParams, modelMapToOption } from '@/utils/utils';
import { drawQrCode } from '@/commons/lib/qrcode';
import { modal } from '@/utils/feedback';
import PicView from './Pics';
import LayoutView from './Layouts';
import EditContent from './EditContent';
import styles from './index.less';

const { confirm } = Modal;

function showConfirm(url) {
  confirm({
    title: '请用手机扫二维码查看',
    content: (
      <div>
        <div className={styles.wrapper}>
          <canvas
            ref={node => {
              if (!node) return;
              drawQrCode(node.getContext('2d'), url, 200);
            }}
            width={200}
            height={200}
            style={{
              width: 200,
              height: 200,
            }}
          >
            您的浏览器不支持HTML5 Canvas画布元素。
          </canvas>
        </div>
        <div className={styles.wrapper}>
          <Button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard
                  .writeText(url)
                  .then(() => {
                    message.success('复制成功');
                  })
                  .catch(e => {
                    message.info(`复制失败, ${e}`);
                  });
              } else {
                message.info(`当前浏览器不支持clipboard`);
              }
            }}
          >
            复制链接
          </Button>
        </div>
      </div>
    ),
    onOk() {},
  });
}

export default function () {
  const dispatch = useDispatch();
  const [table, setTableInit] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [levelView, setLevelView] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const { PaperTypes, NewspaperEditStatus } = useSelector(state => state.digital);
  const { currentUser } = useSelector(state => state.user);
  const saving = useSelector(state => state.loading.effects['digital/postEditOrAddNewspaper']);
  const deleting = useSelector(state => state.loading.effects['digital/deleteNewspaper']);
  const layoutDataFetching = useSelector(state => state.loading.effects['digital/fetchLayoutList']);

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleEditOrNewFormSubmit = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const onSelectedChange = useCallback((_, rows) => {
    setSelectedRows(rows);
    setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
  }, []);

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '编号',
          name: 'id',
        },
        {
          label: '报纸名称',
          name: 'newspaperName',
        },
        {
          label: '备注',
          name: 'descr',
        },
        [
          {
            label: '报纸日期(始)',
            name: 'newpaperStartTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '报纸日期(止)',
            name: 'newspaperEndTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        {
          label: '报纸状态',
          name: 'publishState',
          options: modelMapToOption(NewspaperEditStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '更新人',
          name: 'updateRealName',
          defHidden: true,
        },
        {
          label: '创建人',
          name: 'createRealName',
          defHidden: true,
        },
        [
          {
            label: '更新日期(始)',
            name: 'updateStartTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '更新日期(止)',
            name: 'updateEndTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        {
          label: '单位名称',
          name: 'companyName',
          defHidden: true,
        },
      ],
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '媒体名称',
        dataIndex: 'mediaName',
        width: 150,
      },
      {
        title: '名称',
        dataIndex: 'newspaperName',
        width: 160,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 180,
      },
      {
        title: '发布日期',
        dataIndex: 'newspaperDate',
        sorter: true,
        render: formatDateHM,
        width: 170,
      },
      {
        title: '上传页数',
        dataIndex: 'totalUploadPages',
        width: 90,
      },
      {
        title: '已编辑页数',
        dataIndex: 'totalPages',
        width: 90,
      },
      {
        title: '总新闻条数',
        dataIndex: 'totalNewsNum',
        width: 90,
      },
      {
        title: '媒体类型',
        dataIndex: 'mediaType',
        render: value => formatModel(PaperTypes, value),
        width: 100,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        sorter: true,
        width: 80,
      },
      {
        title: '报纸状态',
        dataIndex: 'publishState',
        render: value => formatModel(NewspaperEditStatus, value),
        width: 90,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 130,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '添加',
          icon: 'plus',
          disabled: deleting || saving || layoutDataFetching,
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit',
          text: '编辑',
          icon: 'edit',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            return rows[0].publishState !== NewspaperEditStatus.PUBLISHED.key;
          },
          disabled: deleting || saving,
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'remove',
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'multi',
          loading: deleting,
          disabled: saving || layoutDataFetching,
          action() {
            modal.confirm('您确认要删除此份报纸所有数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'digital/deleteNewspaper',
                  payload: {
                    ids: (selectedRows || []).map(item => item.id),
                  },
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'edit-layout',
          text: '编辑页面',
          type: 'primary',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            return rows[0].publishState !== NewspaperEditStatus.PUBLISHED.key;
          },
          disabled: deleting || saving,
          action() {
            levelView.pushView(
              <LevelView.SubView title="版面列表">
                <LayoutView newspaperId={selectedRows[0].id} currentMediaId={selectedRows[0].mediaId} />
              </LevelView.SubView>,
              () => {
                table.reload();
              }
            );
          },
        },
        {
          auth: 'pics',
          text: '封面图片',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            return rows[0].publishState !== NewspaperEditStatus.PUBLISHED.key;
          },
          disabled: deleting || saving,
          action() {
            levelView.pushView(
              <LevelView.SubView title="封面图片">
                <PicView linkId={selectedRows[0].id} />
              </LevelView.SubView>,
              () => {
                table.reload();
              }
            );
          },
        },
        {
          auth: 'publish',
          text: '发布',
          type: 'primary',
          disabled: deleting || layoutDataFetching,
          loading: saving,
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            return rows[0].publishState !== NewspaperEditStatus.PUBLISHED.key;
          },
          async action() {
            await dispatch({
              type: 'digital/postEditPublishState',
              payload: {
                id: selectedRows[0].id,
                mediaId: selectedRows[0].mediaId,
                publishState: NewspaperEditStatus.PUBLISHED.key,
              },
            });
            message.success('发布成功');
            table.reload();
          },
        },
        {
          auth: 'unpublish',
          text: '撤销发布',
          disabled: deleting || layoutDataFetching,
          loading: saving,
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            return rows[0].publishState !== NewspaperEditStatus.EDITING.key;
          },
          async action() {
            await dispatch({
              type: 'digital/postEditPublishState',
              payload: {
                id: selectedRows[0].id,
                mediaId: selectedRows[0].mediaId,
                publishState: NewspaperEditStatus.EDITING.key,
              },
            });
            message.success('发布撤销成功');
            table.reload();
          },
        },
        {
          text: '预览',
          disabled: deleting || saving,
          loading: layoutDataFetching,
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { publishState } = rows[0];
            return publishState !== NewspaperEditStatus.EDITING.key;
          },
          async action() {
            const { id, mediaId } = selectedRows[0];
            const { srvInfoVO } = currentUser;
            const result = await dispatch({
              type: 'digital/fetchLayoutList',
              payload: {
                newspaperId: id,
              },
            });
            if (result == null || result.length === 0) {
              message.info(`没有查询到报纸,请检查配置`);
              return;
            }
            const firstLayout = result.find(item => item.pageNo === 1) || result[0];
            const url = `${srvInfoVO.requestProtocol}://${srvInfoVO.srvUrl}/digital/newspaper/${firstLayout.id}?newspaperId=${id}&mediaId=${mediaId}`;
            showConfirm(url);
            window.open(url);
          },
        },
        {
          text: '下载PDF',
          auth: 'download-pdf',
          forRow: 'single',
          action() {
            const { id } = selectedRows[0];
            window.open(
              mergeUrlParams(`${baseURL}/digitalNewspaperLayout/pdfList.do`, {
                newspaperId: id,
              })
            );
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    [showContentMode, selectedRows]
  );

  return (
    <PageHeaderLayout>
      <LevelView ref={setLevelView}>
        <Card bordered={false}>
          <Datatable
            select="multi"
            url="/digitalNewspaper/dataList.do"
            columns={columns}
            rowKey="id"
            formSearch={formSearch}
            operation={operation}
            onInit={setTableInit}
            onSelectedChange={onSelectedChange}
            content={(() => {
              switch (showContentMode) {
                case 1:
                case 2:
                  return (
                    <EditContent
                      isEdit={showContentMode === 2}
                      cancel={cancelContent}
                      sure={handleEditOrNewFormSubmit}
                    />
                  );
                default:
                  return null;
              }
            })()}
          />
        </Card>
      </LevelView>
    </PageHeaderLayout>
  );
}
