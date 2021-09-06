import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Button, Form, Input, Select, message, Cascader } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import Modal from '@/components/Modal';
import MarginBar from '@/components/MarginBar';
import RichTextEditor from '@/components/RichTextEditor';
import { uuid, trimHTML, screenSize } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import Pic from './Pic';
import styles from './index.less';

const getFiniteNum = num => {
  return Number(num.toFixed(2));
};

function EditLayout({ form, mediaId, layoutId, doneEdit }) {
  const { getFieldValue, getFieldDecorator, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const [layoutImgNode, setLayoutImgNode] = useState(null);
  const [curLayoutData, setCurLayoutData] = useState([]);
  const [pageNo, setPageNo] = useState(+layoutId);
  const [curLayoutInfo, setCurLayoutInfo] = useState({
    layoutInfo: null,
    parentTemplateNames: [],
    areaBorderNode: null,
  });
  const [curAreaInfo, setCurAreaInfo] = useState({});
  const [richInfo, setRichInfo] = useState({
    body: '',
    richText: '',
  });
  const [modalInfo, setModalInfo] = useState({
    modalVisible: false,
    modalWidth: '',
    useOcr: true,
    scale: 1, // 缩放比例
  });
  const [musicTemplates, setMusicTemplates] = useState([]);
  const [musicTemplateValue, setMusicTemplateValue] = useState([]);
  const [curFocus, setCurFocus] = useState('richText');
  const [pageNoList, setPageNoList] = useState([]);
  const { LayoutUrlType, PaperConfigurations, pageIds } = useSelector(state => state.digital);
  const saving = useSelector(state => state.loading.effects['digital/postEditOrAddNewspaperNews']);
  const fetchNewsDataLoading = useSelector(state => state.loading.effects['digital/fetchNewspaperNewsData']);
  const fetchCurLayoutLoading = useSelector(state => state.loading.effects['digital/fetchNewspaperLayoutDetail']);
  const fetchAreaDetailLoading = useSelector(state => state.loading.effects['digital/fetchNewspaperNewsDetai']);
  const areaDetailDeleting = useSelector(state => state.loading.effects['digital/deleteNewspaperNews']);
  const layoutStateSaving = useSelector(state => state.loading.effects['digital/postEditOrAddNewspaperLayout']);

  const urlTypeValue = getFieldValue('urlType');
  const previousBtnDisable = pageIds.length === 0 || pageIds[0] === pageNo;
  const nextBtnDisable = pageIds.length === 0 || pageIds[pageIds.length - 1] === pageNo;
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const { width: screenWidth } = screenSize();
  const layoutObj = curLayoutInfo.layoutInfo || {};

  const handleReset = flag => {
    form.resetFields();
    setRichInfo({
      body: '',
      richText: '',
    });
    if (!flag) {
      setCurAreaInfo({});
      return;
    }
    setCurAreaInfo(({ id, commonAreaUrl }) => ({ id, commonAreaUrl }));
  };

  const getAreaDetail = areaId => {
    dispatch({
      type: 'digital/fetchNewspaperNewsDetail',
      payload: {
        id: areaId,
      },
    }).then(result => {
      if (result == null) {
        return;
      }
      setRichInfo({
        ...richInfo,
        body: result.body,
      });
    });
  };

  const getCurLayoutAreaList = flag => {
    dispatch({
      type: 'digital/fetchNewspaperNewsData',
      payload: {
        layoutId: pageNo,
      },
    }).then(data => {
      if (data == null) {
        return;
      }
      const validList = data.filter(row => row.commonAreaUrl);
      if (validList.length === 0) {
        setCurLayoutData([]);
        handleReset();
        return;
      }
      setCurLayoutData(validList);
      // 先渲染出表单信息，再查富文本数据
      setCurAreaInfo(validList[0]);
      if (flag === 'update') {
        return;
      }
      // 新增、修改的时候，无需再查新闻详情
      getAreaDetail(validList[0].id);
    });
  };

  const getCurLayoutDetail = async () => {
    const result = await dispatch({
      type: 'digital/fetchNewspaperLayoutDetail',
      payload: {
        id: pageNo,
      },
    });
    if (result == null) {
      return;
    }

    let parentTemplateNames = [];
    const { templateVersionId } = result;
    if (templateVersionId) {
      const data = await dispatch({
        type: 'digital/fetchMediaTemplateData',
        payload: {
          parentId: templateVersionId,
          templateType: PaperConfigurations.COLUMN.key,
        },
      });
      if (data == null) {
        return;
      }
      parentTemplateNames = (data || []).map(item => {
        return {
          id: item.id,
          templateName: item.templateName,
        };
      });
    }
    setCurLayoutInfo({
      layoutInfo: result,
      parentTemplateNames,
    });
  };

  const getMusicTemplateValue = (list, ids = [], templateMusicId) => {
    for (let i = 0; i < list.length; i += 1) {
      const { id: value, children } = list[i];
      if (value === templateMusicId) {
        setMusicTemplateValue([...ids, value]);
        break;
      }
      if (Array.isArray(children) && children.length > 0) {
        getMusicTemplateValue(children, [...ids, value], templateMusicId);
      }
    }
  };

  const handleQueryAreaDetail = (e, areaId) => {
    if (areaId == null) {
      return;
    }
    const fond = curLayoutData.find(item => item.id === areaId);
    // form表单部分字段不更新，所以先清空
    form.resetFields();
    setCurAreaInfo(fond);
    // 暂时没有存入数据库
    if (fond.temp) {
      setRichInfo({
        richText: '',
        body: '',
      });
      return;
    }
    // 先渲染出表单信息，再查富文本数据
    getAreaDetail(areaId);
  };

  const bulidAreaBorder = () => {
    if (layoutImgNode == null) {
      return;
    }
    if (curLayoutData.length === 0) {
      return;
    }

    const areaList = curLayoutData
      .map(item => {
        return JSON.parse(item.commonAreaUrl.areaData).map(child => {
          return {
            areaId: item.id,
            ...child,
          };
        });
      })
      .flat(2);

    setCurLayoutInfo({
      ...curLayoutInfo,
      areaBorderNode: (
        <div className={styles.areaWrap}>
          {areaList.map(({ startX, startY, width, height, canvasWidth, areaId }) => {
            const scale = getFiniteNum(canvasWidth / layoutImgNode.width);
            const w = Math.abs(width);
            const h = Math.abs(height);
            const t = height < 0 ? height + startY : startY;
            const l = width < 0 ? width + startX : startX;
            const styleWrap = {
              width: getFiniteNum(w / scale),
              height: getFiniteNum(h / scale),
              position: 'absolute',
              top: getFiniteNum(t / scale),
              left: getFiniteNum(l / scale),
              border: areaId === curAreaInfo.id ? '2px dashed #f5222d' : '2px dashed #00b200',
            };
            return <div key={uuid()} style={styleWrap} onClick={e => handleQueryAreaDetail(e, areaId)} />;
          })}
        </div>
      ),
    });
  };

  const handleRichTextChange = val => {
    setRichInfo(({ body }) => ({
      body,
      richText: val,
    }));
  };

  const doTransform = ({ content, url }, flag) => {
    switch (curFocus) {
      case 'quoteName':
      case 'mainTitle':
      case 'subTitle':
        if (flag === 'justText') {
          // eslint-disable-next-line no-case-declarations
          const val = trimHTML(`${curAreaInfo[curFocus] || ''}${content || ''}`);
          setCurAreaInfo({
            ...curAreaInfo,
            [curFocus]: val,
          });
          form.setFieldsValue({
            [curFocus]: val,
          });
        }
        break;
      default:
        // https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/error-codes.html#error-datacontroller-set-non-existent-root
        setRichInfo(({ richText }) => ({
          richText,
          body: {
            main:
              flag === 'justImg'
                ? ` ${richText}
                    <img src="${url}" />
                  `
                : ` ${richText}
                    ${content}
                  `,
          },
        }));
    }

    setModalInfo({
      ...modalInfo,
      modalVisible: false,
    });
  };

  const doBuildArea = trimPositionMap => {
    setCurLayoutData(() => {
      const data = {
        id: uuid(), // 临时id，暂未存到数据库
        commonAreaUrl: {
          areaData: JSON.stringify(trimPositionMap),
        },
        temp: true,
      };
      setCurAreaInfo(data);
      return [...curLayoutData, data];
    });
    setModalInfo({
      ...modalInfo,
      modalVisible: false,
    });
  };

  const handleGrapPic = flag => {
    setModalInfo(({ scale }) => ({
      modalVisible: true,
      modalWidth: screenWidth - 200, // 左右各留100px间距
      useOcr: flag === 'useOcr',
      scale,
    }));
    // 抓取图文时不重置
    if (flag === 'useOcr') {
      return;
    }
    handleReset();
  };

  const handleDeleteAreaInfo = () => {
    if (curAreaInfo.temp) {
      setCurLayoutData(prevData => {
        prevData.pop();
        if (prevData.length === 0) {
          setCurAreaInfo({});
          return [];
        }

        setCurAreaInfo(prevData[0]);
        const fond = prevData.find(item => item.id != null);
        if (fond && !fond.temp) {
          getAreaDetail(fond.id);
        }
        return prevData;
      });
      return;
    }

    modal.confirm('确认要删除吗？', {
      onOk: () => {
        dispatch({
          type: 'digital/deleteNewspaperNews',
          payload: {
            ids: [curAreaInfo.id],
          },
        }).then(() => {
          message.success('删除成功');
          getCurLayoutAreaList();
        });
      },
    });
  };

  const handlePlus = () => {
    setModalInfo(({ scale }) => ({
      ...modalInfo,
      scale: scale >= 2 ? 2 : scale + 0.2,
    }));
  };

  const handleMinus = () => {
    setModalInfo(({ scale }) => ({
      ...modalInfo,
      scale: scale <= 0.4 ? 0.4 : scale - 0.2,
    }));
  };

  const handleCancel = () => {
    setModalInfo({
      ...modalInfo,
      modalVisible: false,
    });
  };

  const handlePreviousPage = () => {
    const no = pageIds.indexOf(pageNo) - 1;
    setPageNo(pageIds[no]);
  };

  const handleNextPage = () => {
    const no = pageIds.indexOf(pageNo) + 1;
    setPageNo(pageIds[no]);
  };

  const doSave = () => {
    validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const { templateMusicId } = formData;
      let areaData;
      try {
        areaData = JSON.parse(curAreaInfo.commonAreaUrl.areaData);
      } catch {
        message.error('请建立/选择热点区域');
        return;
      }
      dispatch({
        type: 'digital/postEditOrAddNewspaperNews',
        payload: {
          ...formData,
          id: curAreaInfo.temp ? null : curAreaInfo.id,
          mediaId,
          layoutId: pageNo,
          templateMusicId:
            templateMusicId == null ? curAreaInfo.templateMusicId : templateMusicId[templateMusicId.length - 1],
          body: richInfo.richText,
          areaData,
        },
      }).then(() => {
        message.success('保存成功');
        getCurLayoutAreaList('update');
      });
    });
  };

  useEffect(() => {
    getCurLayoutDetail();
    getCurLayoutAreaList();
  }, [pageNo]);

  useEffect(() => {
    dispatch({
      type: 'digital/fetchMediaTemplateData',
      payload: {
        templateType: PaperConfigurations.BG_MUSIC.key,
      },
    }).then(data => {
      if (data == null) {
        return;
      }
      setMusicTemplates(data);
    });
  }, []);

  useEffect(() => {
    const { templateMusicId } = curAreaInfo;
    if (templateMusicId == null || templateMusicId === 0) {
      setMusicTemplateValue([]);
      return;
    }
    if (musicTemplates.length === 0) {
      return;
    }
    getMusicTemplateValue(musicTemplates, [], templateMusicId);
  }, [curAreaInfo]);

  useEffect(() => {
    window.addEventListener('resize', bulidAreaBorder);
    bulidAreaBorder();

    return () => {
      window.removeEventListener('resize', bulidAreaBorder);
    };
  }, [layoutImgNode, curAreaInfo, pageNo]);

  useEffect(() => {
    if (urlTypeValue === LayoutUrlType.PAGE.key) {
      dispatch({
        type: 'digital/fetchLayoutList',
        payload: {
          newspaperId: curLayoutInfo?.layoutInfo?.newspaperId,
        },
      }).then(res => {
        setPageNoList(res.map(item => ({ pageNo: item.pageNo, id: item.id })));
      });
    }
  }, [urlTypeValue, curLayoutInfo?.layoutInfo?.newspaperId]);
  return (
    <Card
      bordered={false}
      bodyStyle={{
        paddingBottom: 2,
      }}
    >
      <Row gutter={10}>
        <MarginBar top>
          <Col md={7}>
            {layoutObj.sourceImg && (
              <div className={styles.layout}>
                <div className={styles.layoutImage}>
                  <img ref={setLayoutImgNode} src={layoutObj.sourceImg.url} alt="layout" />
                  {curLayoutInfo.areaBorderNode}
                </div>
              </div>
            )}
          </Col>
        </MarginBar>
        <MarginBar top>
          <Col
            className={styles.ckEditorWrap}
            md={9}
            onClick={() => {
              setCurFocus('richText');
            }}
          >
            <RichTextEditor onChange={handleRichTextChange} value={richInfo.body} />
          </Col>
        </MarginBar>
        <MarginBar top>
          <Col md={8}>
            <Form className={styles.formWrap} {...formItemLayout}>
              <Form.Item label="引题">
                {getFieldDecorator('quoteName', {
                  initialValue: curAreaInfo.quoteName,
                })(
                  <Input
                    onClick={() => {
                      setCurFocus('quoteName');
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item label="标题">
                {getFieldDecorator('mainTitle', {
                  initialValue: curAreaInfo.mainTitle,
                  rules: [
                    {
                      required: true,
                      message: '请输入标题',
                    },
                  ],
                })(
                  <Input
                    onClick={() => {
                      setCurFocus('mainTitle');
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item label="副题">
                {getFieldDecorator('subTitle', {
                  initialValue: curAreaInfo.subTitle,
                })(
                  <Input
                    onClick={() => {
                      setCurFocus('subTitle');
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item label="记者">
                {getFieldDecorator('journalist', {
                  initialValue: curAreaInfo.journalist,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="稿件来源">
                {getFieldDecorator('newsSource', {
                  initialValue: curAreaInfo.newsSource,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="栏目">
                {getFieldDecorator('templateColumnId', {
                  initialValue:
                    curAreaInfo.templateColumnId ||
                    (curLayoutInfo.parentTemplateNames.length > 0 ? curLayoutInfo.parentTemplateNames[0].id : null),
                })(
                  <Select placeholder="请选择">
                    {curLayoutInfo.parentTemplateNames.map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.templateName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="背景音频">
                {getFieldDecorator('templateMusicId', {
                  initialValue: musicTemplateValue,
                })(
                  <Cascader
                    fieldNames={{ label: 'templateName', value: 'id', children: 'children' }}
                    options={musicTemplates}
                    placeholder="请选择背景音频"
                    allowClear={false}
                  />
                )}
              </Form.Item>
              <Form.Item label="排序">
                {getFieldDecorator('ranks', {
                  initialValue: curAreaInfo.ranks,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="跳转">
                {getFieldDecorator('urlType', {
                  initialValue:
                    (curAreaInfo.commonAreaUrl && curAreaInfo.commonAreaUrl.urlType) || LayoutUrlType.DETAIL.key,
                  rules: [
                    {
                      required: true,
                      message: '请选择跳转',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(LayoutUrlType)
                      .filter(i => i.key !== LayoutUrlType.PAGE.key)
                      .map(item => (
                        <Select.Option value={item.key} key={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                    {curLayoutInfo?.layoutInfo?.mediaType === LayoutUrlType.PAGE.key ? (
                      <Select.Option value={LayoutUrlType.PAGE.key} key={LayoutUrlType.PAGE.key}>
                        跳转到页面
                      </Select.Option>
                    ) : null}
                  </Select>
                )}
              </Form.Item>
              {urlTypeValue === LayoutUrlType.OUTSIDE.key && (
                <Form.Item label="跳转链接">
                  {getFieldDecorator('outsideUrl', {
                    initialValue: curAreaInfo.outsideUrl,
                    rules: [
                      {
                        required: true,
                        message: '请输入跳转链接',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              )}
              {urlTypeValue === LayoutUrlType.PAGE.key && (
                <Form.Item label="页码">
                  {getFieldDecorator('redirectPage', {
                    initialValue: curAreaInfo.commonAreaUrl && curAreaInfo.commonAreaUrl.redirectPage,
                    rules: [
                      {
                        required: true,
                        message: '请选择跳转',
                      },
                    ],
                  })(
                    <Select placeholder="请选择">
                      {pageNoList.map(item => (
                        <Select.Option value={item.pageNo} key={item.pageNo}>
                          {item.pageNo}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              )}
            </Form>
          </Col>
        </MarginBar>
      </Row>
      {layoutObj.sourceImg && (
        <Modal
          width={modalInfo.modalWidth}
          visible={modalInfo.modalVisible}
          footer={[
            <Button key="plus" type="primary" icon="plus" disabled={modalInfo.scale >= 2} onClick={handlePlus}>
              放大
            </Button>,
            <Button key="minus" icon="minus" disabled={modalInfo.scale <= 0.4} onClick={handleMinus}>
              缩小
            </Button>,
          ]}
          onCancel={handleCancel}
        >
          <Pic
            file={layoutObj.sourceImg}
            useOcr={modalInfo.useOcr}
            scale={modalInfo.scale}
            onTransform={doTransform}
            onBuildArea={doBuildArea}
          />
        </Modal>
      )}
      <FooterToolbar>
        <MarginBar top right inline>
          <Button
            type="primary"
            disabled={saving || areaDetailDeleting || layoutStateSaving}
            loading={
              fetchNewsDataLoading || fetchCurLayoutLoading || fetchAreaDetailLoading || saving || areaDetailDeleting
            }
            onClick={handleGrapPic}
          >
            新建热点选区
          </Button>
        </MarginBar>
        {curLayoutData.length > 0 && (
          <MarginBar left top right inline>
            <Button
              disabled={saving || areaDetailDeleting || layoutStateSaving}
              loading={
                fetchNewsDataLoading || fetchCurLayoutLoading || fetchAreaDetailLoading || saving || areaDetailDeleting
              }
              onClick={handleDeleteAreaInfo}
            >
              删除当前选区
            </Button>
          </MarginBar>
        )}
        <MarginBar left top right inline>
          <Button
            type="danger"
            disabled={saving || areaDetailDeleting || layoutStateSaving}
            loading={
              fetchNewsDataLoading || fetchCurLayoutLoading || fetchAreaDetailLoading || saving || areaDetailDeleting
            }
            onClick={() => handleGrapPic('useOcr')}
          >
            抓取识别图文
          </Button>
        </MarginBar>
        <MarginBar left top right inline>
          <Button
            disabled={saving || areaDetailDeleting || layoutStateSaving}
            loading={
              fetchNewsDataLoading || fetchCurLayoutLoading || fetchAreaDetailLoading || saving || areaDetailDeleting
            }
            onClick={() => handleReset('notAll')}
          >
            清空图文
          </Button>
        </MarginBar>
        <MarginBar left top right inline>
          <Button
            type="primary"
            disabled={saving || areaDetailDeleting || layoutStateSaving}
            loading={
              fetchNewsDataLoading || fetchCurLayoutLoading || fetchAreaDetailLoading || saving || areaDetailDeleting
            }
            onClick={doSave}
          >
            保存图文
          </Button>
        </MarginBar>
        <MarginBar left top right inline>
          <Button
            disabled={saving || previousBtnDisable || areaDetailDeleting || layoutStateSaving}
            loading={
              fetchNewsDataLoading || fetchCurLayoutLoading || fetchAreaDetailLoading || saving || areaDetailDeleting
            }
            onClick={handlePreviousPage}
          >
            上一页
          </Button>
        </MarginBar>
        <MarginBar left top right inline>
          <Button
            disabled={saving || nextBtnDisable || areaDetailDeleting || layoutStateSaving}
            loading={
              fetchNewsDataLoading || fetchCurLayoutLoading || fetchAreaDetailLoading || saving || areaDetailDeleting
            }
            onClick={handleNextPage}
          >
            下一页
          </Button>
        </MarginBar>
        <MarginBar left top right inline>
          <Button
            type="primary"
            disabled={saving || areaDetailDeleting}
            loading={
              fetchNewsDataLoading ||
              fetchCurLayoutLoading ||
              fetchAreaDetailLoading ||
              saving ||
              areaDetailDeleting ||
              layoutStateSaving
            }
            onClick={doneEdit}
          >
            编辑完成
          </Button>
        </MarginBar>
      </FooterToolbar>
    </Card>
  );
}

export default Form.create()(EditLayout);
