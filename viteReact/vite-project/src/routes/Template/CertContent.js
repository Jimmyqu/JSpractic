import { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import PropTypes from 'prop-types';
import LevelView from '@/components/LevelView';
import Datatable, { ItemTypes } from '@/components/Datatable';
import { modal } from '@/utils/feedback';
import { modelMapToOption } from '@/utils/utils';
import { formatModel, formatDateHMCsvt } from '@/utils/format';
import DrawBoard from '@/components/Template/DrawBoard';
import EidtModal from '@/components/Template/EidtModal';

const templateState = [
  { key: 0, value: '可用' },
  { key: 1, value: '禁用' },
];

const wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
  if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
    return;
  }
  const { canvas } = ctx;

  if (typeof maxWidth === 'undefined') {
    // eslint-disable-next-line no-param-reassign
    maxWidth = (canvas && canvas.width) || 300;
  }

  // 字符分隔为数组
  const arrText = text.split('');
  let line = '';
  for (let n = 0; n < arrText.length; n += 1) {
    const testLine = line + arrText[n];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, lineHeight + y);
      line = arrText[n];
      // eslint-disable-next-line no-param-reassign
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, lineHeight + y);
};

const loadImg = ({ ctx, url, top, left, width, height }) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.addEventListener('load', function () {
      ctx.drawImage(img, left, top, width, height);
      resolve('suc');
    });
    img.src = url;
    img.addEventListener('error', function () {
      reject(new Error('img error'));
    });
  });
};

const mergeLoadImg = function (asyncArr) {
  // 只接受配置 顺序执行loadImg
  async function run() {
    const res = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const cfg of asyncArr) {
      // eslint-disable-next-line no-await-in-loop
      const val = await loadImg(cfg);
      res.push(val);
    }
    return res;
  }
  return run();
};

const renderCanvas = (obj, cb) => {
  return new Promise(resolve => {
    const { imgList, textList, textKeyList, imgKeyList, mapzone } = obj;
    const { width: mapWidth, height: mapHeight } = JSON.parse(mapzone);
    const canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const ctx = canvas.getContext('2d');

    mergeLoadImg([
      ...imgList.map(pic => {
        const { top, left, width, height } = JSON.parse(pic.contentStyle);
        return { ctx, url: pic.url, top, left, width, height };
      }),
      ...imgKeyList.map(pic => {
        const { top, left, width, height } = JSON.parse(pic.contentStyle);
        return { ctx, url: pic.val, top, left, width, height };
      }),
    ])
      .then(() => {
        textList.forEach(text => {
          const { top, left, width } = JSON.parse(text.contentStyle);
          const { fontFamily, color, lineHeight, fontSize, fontWeight } = JSON.parse(text.css);
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = `${color}`;
          wrapText(ctx, text.val, left, top, width, lineHeight * fontSize);
        });
        textKeyList.forEach(key => {
          const { top, left, width } = JSON.parse(key.contentStyle);
          const { fontFamily, color, fontSize, fontWeight } = JSON.parse(key.css);
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = `${color}`;
          wrapText(ctx, key.val, left, top, width, fontSize);
        });
        resolve(canvas.toDataURL());
      })
      .catch(e => {
        message.warn(`导出错误,${e}`);
        cb(false);
      });
  });
};
function CertContent(props, { pushView }) {
  const dispatch = useDispatch();
  const deleting = useSelector(state => state.loading.effects['pubserviceuser/delCertTemplate']);
  const exportImg = useSelector(state => state.loading.effects['pubserviceuser/downloadExportImage']);
  const exportExcel = useSelector(state => state.loading.effects['pubserviceuser/downloadExportExcel']);
  const [exporting, setExporting] = useState(false);
  const loading = exportImg || exportExcel || deleting || exporting;
  const { CertTypes, CertTemplateType } = useSelector(state => state.pubserviceuser);

  const [table, setTableInit] = useState();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleToChildView = useCallback((id, relType) => {
    pushView(
      <LevelView.SubView title="模板编辑">
        <DrawBoard templateId={id} relType={relType} />
      </LevelView.SubView>
    );
  }, []);

  const handleTableReload = useCallback(() => {
    setIsEdit(false);
    table.reload();
  }, [table]);

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '模板名称',
        dataIndex: 'templateName',
        width: 100,
      },
      {
        title: '类型',
        dataIndex: 'relType',
        render: value => {
          return formatModel(CertTypes, value);
        },
        width: 150,
      },
      {
        title: '关联数据',
        dataIndex: 'dataName',
        width: 150,
      },
      {
        title: '生成类型',
        dataIndex: 'exportType',
        render: value => {
          return formatModel(CertTemplateType, value);
        },
        width: 130,
      },
      {
        title: '模板备注',
        dataIndex: 'remark',
        width: 150,
      },
      {
        title: '模板状态',
        dataIndex: 'templateState',
        render: value => {
          return formatModel(templateState, value);
        },
        width: 100,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 80,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: formatDateHMCsvt,
        width: 150,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: formatDateHMCsvt,
        width: 150,
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        width: 150,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 150,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '认证类型',
          name: 'relType',
          options: modelMapToOption(CertTypes),
          type: ItemTypes.Select,
        },
        {
          label: '生成类型',
          name: 'exportType',
          options: modelMapToOption(CertTemplateType),
          type: ItemTypes.Select,
        },
        {
          label: '模板名称',
          name: 'templateName',
        },
        {
          label: '模板编号',
          name: 'templateId',
        },
        {
          label: '更新人',
          name: 'operatorName',
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '添加',
          disabled: loading,
          action() {
            setIsModalShow(true);
          },
        },
        {
          auth: 'edit',
          text: '修改',
          forRow: 'single',
          disabled: loading,
          action() {
            setIsEdit(true);
            setSelectedRows(selectedRows);
            setIsModalShow(true);
          },
        },
        {
          auth: 'remove',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          disabled: loading,
          action() {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'pubserviceuser/delCertTemplate',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                handleTableReload();
              },
            });
          },
        },
        {
          auth: 'config',
          text: '编辑模板',
          forRow: 'single',
          disabled: loading,
          action() {
            if (selectedRows[0].exportType === CertTemplateType.Img.key) {
              handleToChildView(selectedRows[0].id, selectedRows[0].relType);
            } else {
              message.info('生成类型是图片时才可以编辑图片模板!');
            }
          },
        },
        {
          auth: 'export-data',
          text: '导出模板数据',
          forRow: 'single',
          disabled: deleting,
          loading: exporting || exportImg || exportExcel,
          action() {
            if (selectedRows[0].exportType === CertTemplateType.Img.key) {
              // 图片导出
              dispatch({
                type: 'pubserviceuser/downloadExportImage',
                payload: {
                  templateId: selectedRows[0].id,
                },
              }).then(res => {
                setExporting(true);
                const exportList = res.exportList || [];
                const promiseList = exportList.map(itme => {
                  return renderCanvas(itme, setExporting);
                });
                Promise.all(promiseList).then(base64List => {
                  dispatch({
                    type: 'pubserviceuser/postToImageZip',
                    payload: {
                      base64Array: base64List,
                      templateId: exportList[0]?.templateId,
                      imgNameArray: exportList.map(e => e.imgName),
                    },
                  }).then(zipRes => {
                    const dlLink = document.createElement('a');
                    dlLink.download = '模板.zip';
                    dlLink.href = zipRes;
                    document.body.appendChild(dlLink);
                    dlLink.click();
                    document.body.removeChild(dlLink);
                    setExporting(false);
                  });
                });
              });
            } else {
              dispatch({
                type: 'pubserviceuser/downloadExportExcel',
                payload: {
                  templateId: selectedRows[0].id,
                },
              }).then(res => {
                const dlLink = document.createElement('a');
                dlLink.href = res;
                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
              });
              // 表格导出
            }
          },
        },
      ],
    }),
    [selectedRows, isModalShow, loading]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        url="/exportTemplate/getListPage.do"
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
      />
      <EidtModal
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        selectedRow={isEdit ? selectedRows[0] : {}}
        certTemplateType={CertTemplateType}
        visible={isModalShow}
        onDone={handleTableReload}
        setIsModalShow={setIsModalShow}
      />
    </Card>
  );
}

CertContent.contextTypes = {
  pushView: PropTypes.func,
  popView: PropTypes.func,
};

export default CertContent;
