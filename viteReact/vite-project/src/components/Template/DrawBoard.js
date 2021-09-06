import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, InputNumber, Button, Card, Input, Upload, Icon, Select, message } from 'antd';
import omit from 'omit.js';
import { useUploadImgRequest, useHistoryData } from '@/utils/hooks';
import { FileAccept } from '@/commons/lib/upload';
import { uuid } from '@/utils/utils';
import Drag from './Darg';
import ContextMenu from './ContextMenu';
import styles from './index.less';

export default ({ templateId, relType }) => {
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['pubserviceuser/saveCertTemplate']);
  const [mapZone, setMapZone] = useState({ width: 400, height: 400 });
  const [keyData, setKeyData] = useState({
    textList: [],
    imageList: [],
  });
  const [currentData, setCurrentData] = useState({});
  const [isStatic, setIsStatic] = useState(false);

  const [historyData, dataIndex, historyLength, historyDispatch] = useHistoryData({
    imgList: [],
    textList: [],
    textKeyList: [],
    imgKeyList: [],
  });

  const { TextArea } = Input;
  const onContextMenu = function (e, data) {
    if (isStatic) return;
    e.preventDefault();
    setCurrentData({ ...data, isMenuOpen: !currentData.isMenuOpen });
  };

  const onDoubleClick = function (e, id) {
    if (isStatic) return;
    const newList = historyData?.textList.map(item => {
      if (item.uid === id) {
        return {
          ...item,
          isEdit: !item.isEdit,
        };
      }
      return item;
    });
    historyDispatch({
      type: useHistoryData.PUSH,
      payload: {
        ...historyData,
        textList: newList,
      },
    });
  };

  const delData = useCallback(
    (data, type) => {
      let newList;
      switch (type) {
        case 'text':
          newList = historyData.textList.filter(item => item.uid !== data.uid);
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...historyData,
              textList: newList,
            },
          });
          break;
        case 'img':
          newList = historyData.imgList.filter(item => item.uid !== data.uid);
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...historyData,
              imgList: newList,
            },
          });
          break;
        case 'key':
          newList = historyData.textKeyList.filter(item => item.uid !== data.uid);
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...historyData,
              textKeyList: newList,
            },
          });
          break;
        case 'imgKey':
          newList = historyData.imgKeyList.filter(item => item.uid !== data.uid);
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...historyData,
              imgKeyList: newList,
            },
          });
          break;
        default:
          break;
      }
      setCurrentData({});
    },
    [historyData]
  );

  const editData = useCallback(
    function (val) {
      const currentList = val.type === 'text' ? historyData?.textList : historyData?.textKeyList;
      const currentKey = val.type === 'text' ? 'textList' : 'textKeyList';
      const newList = currentList.map(item => {
        if (item.uid === val.uid) {
          return {
            ...item,
            css: {
              ...item.css,
              ...val.css,
            },
          };
        }
        return item;
      });
      historyDispatch({
        type: useHistoryData.PUSH,
        payload: {
          ...historyData,
          [currentKey]: newList,
        },
      });
    },
    [currentData]
  );
  const handleAddText = function () {
    historyDispatch({
      type: useHistoryData.PUSH,
      payload: {
        ...historyData,
        textList: [
          ...historyData.textList,
          {
            uid: uuid(),
            placeholder: '双击输入文本，右键编辑样式',
            val: '',
            isEdit: false,
            isMenuOpen: false,
            type: 'text',
            contentStyle: {
              width: 100,
              height: 50,
              left: 0,
              top: 0,
            },
            css: {
              fontFamily: 'Microsoft YaHei',
              fontWeight: 'normal',
              color: '#000',
              lineHeight: 1,
              fontSize: 14,
              textAlign: 'left',
            },
          },
        ],
      },
    });
  };

  const handleAddTextKeys = function () {
    historyDispatch({
      type: useHistoryData.PUSH,
      payload: {
        ...historyData,
        textKeyList: [
          ...historyData.textKeyList,
          {
            uid: uuid(),
            val: '',
            isEdit: false,
            isMenuOpen: false,
            type: 'key',
            contentStyle: {
              width: 150,
              height: 50,
              left: 0,
              top: 0,
            },
            css: {
              fontFamily: 'Microsoft YaHei',
              fontWeight: 'normal',
              color: '#000',
              fontSize: 14,
            },
          },
        ],
      },
    });
  };

  const handleAddImgKeys = function () {
    historyDispatch({
      type: useHistoryData.PUSH,
      payload: {
        ...historyData,
        imgKeyList: [
          ...historyData.imgKeyList,
          {
            uid: uuid(),
            val: '',
            isEdit: false,
            isMenuOpen: false,
            type: 'imgKey',
            contentStyle: {
              width: 50,
              height: 50,
              left: 0,
              top: 0,
            },
            css: {
              width: '100%',
            },
          },
        ],
      },
    });
  };

  const handlePreviewMap = function () {
    setIsStatic(!isStatic);
    setCurrentData({});
  };

  const handleSaveMap = function () {
    dispatch({
      type: 'pubserviceuser/saveCertTemplate',
      payload: {
        templateId,
        mapZone,
        textList: historyData.textList,
        imgList: historyData.imgList.map(img => ({
          url: img.response?.url,
          ...omit(img, ['lastModified', 'lastModifiedDate', 'originFileObj', 'percent', 'response', 'size', 'xhr']),
        })),
        textKeyList: historyData.textKeyList,
        imgKeyList: historyData.imgKeyList,
      },
    }).then(() => {
      message.success('保存成功!');
    });
  };

  useEffect(() => {
    dispatch({
      type: 'pubserviceuser/fetchtImageKeysByTemplateId',
      payload: {
        templateId,
      },
    }).then(res => {
      setMapZone(JSON.parse(res.mapzone));
      historyDispatch({
        type: useHistoryData.INIT,
        payload: {
          imgList: res.imgList.map(img => ({ ...img, contentStyle: JSON.parse(img.contentStyle) })),
          textList: res.textList.map(text => ({
            ...text,
            contentStyle: JSON.parse(text.contentStyle),
            css: JSON.parse(text.css),
          })),
          textKeyList: res.textKeyList.map(key => ({
            ...key,
            contentStyle: JSON.parse(key.contentStyle),
            css: JSON.parse(key.css),
          })),
          imgKeyList: res.imgKeyList.map(key => ({
            ...key,
            contentStyle: JSON.parse(key.contentStyle),
            css: JSON.parse(key.css),
          })),
        },
      });
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'pubserviceuser/fetchKeyListByRelTypeAndImg',
      payload: {
        relType,
      },
    }).then(res => {
      setKeyData(res);
    });
  }, [relType]);

  return (
    <>
      <Card loading={saving}>
        <Row>设置画板大小</Row>
        <Row className={styles.mt10}>
          <Col md={4} xs={12}>
            宽:
            <InputNumber
              precision={0}
              step={50}
              min={400}
              value={mapZone.width}
              placeholder="最小400px"
              onChange={val => setMapZone({ ...mapZone, width: val })}
            />
          </Col>
          <Col md={4} xs={12}>
            高:
            <InputNumber
              precision={0}
              step={50}
              min={400}
              value={mapZone.height}
              placeholder="最小400px"
              onChange={val => setMapZone({ ...mapZone, height: val })}
            />
          </Col>
          <Col md={2} xs={12}>
            <Button onClick={() => handleSaveMap()}>保存</Button>
          </Col>
          <Col md={2} xs={12}>
            <Button onClick={() => handlePreviewMap()}>{isStatic ? '取消' : '预览'}</Button>
          </Col>
          <Col md={2} xs={12}>
            <Button
              disabled={!(dataIndex > 0)}
              onClick={() => {
                historyDispatch({
                  type: useHistoryData.BACK,
                });
              }}
            >
              回退
            </Button>
          </Col>
          <Col md={2} xs={12}>
            <Button
              disabled={!(dataIndex < historyLength - 1)}
              onClick={() => {
                historyDispatch({
                  type: useHistoryData.FORWARD,
                });
              }}
            >
              前进
            </Button>
          </Col>
        </Row>
        <Row className={styles.mt10} gutter={20}>
          <Col md={18} xs={24}>
            <div className={styles.bg}>
              <div style={mapZone} id="container" className={styles.zone}>
                {historyData?.imgList.map(file => (
                  <Drag
                    contentStyle={file.contentStyle}
                    currentItem={file}
                    isStatic={isStatic}
                    container="#container"
                    key={file.uid}
                    onContextMenu={e => onContextMenu(e, file)}
                  >
                    <img draggable="false" className={styles.img} src={file.response?.url || file.url} alt="" />
                  </Drag>
                ))}
                {historyData?.textList.map(text => (
                  <div key={text.uid}>
                    <Drag
                      currentItem={text}
                      isStatic={isStatic}
                      contentStyle={text.contentStyle}
                      onDoubleClick={e => onDoubleClick(e, text.uid)}
                      container="#container"
                      onContextMenu={e => onContextMenu(e, text)}
                    >
                      {text.isEdit && !isStatic ? (
                        <TextArea
                          placeholder="请输入"
                          disabled={isStatic}
                          style={text.css}
                          value={text.val}
                          onChange={e => {
                            e.persist();
                            const newList = historyData?.textList.map(item => {
                              if (item.uid === text.uid) {
                                return {
                                  ...item,
                                  val: e.target.value,
                                };
                              }
                              return item;
                            });
                            historyDispatch({
                              type: useHistoryData.PUSH,
                              payload: {
                                ...historyData,
                                textList: newList,
                              },
                            });
                          }}
                          onPressEnter={() => {
                            const newList = historyData?.textList.map(item => {
                              if (item.uid === text.uid) {
                                return {
                                  ...item,
                                  isEdit: false,
                                };
                              }
                              return item;
                            });
                            historyDispatch({
                              type: useHistoryData.PUSH,
                              payload: {
                                ...historyData,
                                textList: newList,
                              },
                            });
                          }}
                        />
                      ) : (
                        <div style={text.css}>{isStatic ? text.val : text.placeholder}</div>
                      )}
                    </Drag>
                  </div>
                ))}
                {historyData?.textKeyList.map(key => (
                  <div key={key.uid}>
                    <Drag
                      currentItem={key}
                      isStatic={isStatic}
                      contentStyle={key.contentStyle}
                      onDoubleClick={e => onDoubleClick(e, key.uid)}
                      container="#container"
                      onContextMenu={e => onContextMenu(e, key)}
                    >
                      {!isStatic ? (
                        <Select
                          disabled={isStatic}
                          placeholder="请选择"
                          defaultValue={key.val}
                          style={{ width: 150 }}
                          onChange={val => {
                            const newList = historyData?.textKeyList.map(item => {
                              if (item.uid === key.uid) {
                                return {
                                  ...item,
                                  val,
                                };
                              }
                              return item;
                            });
                            historyDispatch({
                              type: useHistoryData.PUSH,
                              payload: {
                                ...historyData,
                                textKeyList: newList,
                              },
                            });
                          }}
                        >
                          {keyData?.textList.map(item => (
                            <Select.Option key={item.key} value={item.key}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      ) : (
                        <div style={key.css}>{keyData?.textList.find(i => i.key === key.val)?.name}</div>
                      )}
                    </Drag>
                  </div>
                ))}
                {historyData?.imgKeyList.map(key => (
                  <div key={key.uid}>
                    <Drag
                      currentItem={key}
                      isStatic={isStatic}
                      contentStyle={key.contentStyle}
                      onDoubleClick={e => onDoubleClick(e, key.uid)}
                      container="#container"
                      onContextMenu={e => onContextMenu(e, key)}
                    >
                      {!isStatic ? (
                        <Select
                          disabled={isStatic}
                          placeholder="请选择"
                          defaultValue={key.val}
                          style={{ width: 150 }}
                          onChange={val => {
                            const newList = historyData?.imgKeyList.map(item => {
                              if (item.uid === key.uid) {
                                return {
                                  ...item,
                                  val,
                                };
                              }
                              return item;
                            });
                            historyDispatch({
                              type: useHistoryData.PUSH,
                              payload: {
                                ...historyData,
                                imgKeyList: newList,
                              },
                            });
                          }}
                        >
                          {keyData?.imageList.map(item => (
                            <Select.Option key={item.key} value={item.key}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      ) : (
                        <img
                          style={key.css}
                          src="http://image-test.ydmap.cn/default_file/default_user_avatar.jpg"
                          alt={key.name}
                        />
                      )}
                    </Drag>
                  </div>
                ))}
                <ContextMenu
                  handleDelData={delData}
                  handleEditData={editData}
                  currentData={currentData}
                  setCurrentData={setCurrentData}
                />
              </div>
            </div>
          </Col>
          <Col md={6} xs={24}>
            <Row>
              <Upload
                accept={FileAccept.IMG}
                multiple
                fileList={historyData?.imgList}
                customRequest={useUploadImgRequest({ dispatch })}
                onChange={({ fileList }) => {
                  historyDispatch({
                    type: useHistoryData.PUSH,
                    payload: {
                      ...historyData,
                      imgList: fileList.map(item => ({
                        ...item,
                        isMenuOpen: false,
                        type: 'img',
                        contentStyle: item.contentStyle || {
                          width: 100,
                          height: 100,
                          left: 0,
                          top: 0,
                        },
                      })),
                    },
                  });
                }}
              >
                <Button>
                  <Icon type="upload" /> 上传图层
                </Button>
              </Upload>
            </Row>
            <Row className={styles.mt10}>
              <Button onClick={() => handleAddText()}>添加文本</Button>
            </Row>
            <Row className={styles.mt10}>
              <Button onClick={() => handleAddTextKeys()}>添加文本字段</Button>
            </Row>
            <Row className={styles.mt10}>
              <Button onClick={() => handleAddImgKeys()}>添加图片字段</Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </>
  );
};
