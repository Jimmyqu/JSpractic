import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import { Card, Button, message } from 'antd';
import Datatable from '@/components/Datatable';
import { formatGender, formatAge, formatIDCardType, formatDate } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import FooterToolbar from '@/components/FooterToolbar';
import { modal } from '@/utils/feedback';
import { isIDNumberAndMatchBirthday, isHKIDNumber, isIDNumber, CDN_STATIC_HOST, pureFunc } from '@/utils/utils';
import { CommonFileLinkTypes } from '@/utils/upload';
import { checkExtField } from '@/commons/lib/validator';
import FillEditor from './Editor';
import styles from './index.less';

@connect(({ orderprocessing, contact, pubuser, loading }) => ({
  orderprocessing,
  contact,
  pubuser,
  validFieldFetching: loading.effects['contact/getValidField'],
  contactDeleting: loading.effects['contact/delete'],
  contactSaving: loading.effects['contact/newOrEdit'],
  dealSaving: loading.effects['orderprocessing/saveOrder'],
}))
class OrderContactFill extends Component {
  state = {
    expandId: undefined,

    fieldsConfig: undefined,

    editInfo: undefined,

    tableLoading: false,

    selectedRows: undefined,
    // 头像存储
    filesCache: [],
  };

  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    isSummaryPath: PropTypes.func,
    // selectPubStudy: PropTypes.bool,
    validPubStudy: PropTypes.bool,
    validFace: PropTypes.bool,
  };

  async componentDidMount() {
    const { checkOpFailedAndGoBack } = this.context;
    if (checkOpFailedAndGoBack()) {
      return;
    }
    const { dispatch, relType, dataId } = this.props;
    const result = await dispatch({
      type: 'contact/getValidField',
      payload: {
        dataId,
        relType,
      },
    });
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      fieldsConfig: result,
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  columns = filesCache => {
    return [
      {
        title: '联系人',
        dataIndex: 'id',
        render: (_, record) => {
          const {
            contact: { ContactOrderFields },
          } = this.props;
          const {
            id,
            [ContactOrderFields.RealName.key]: realName,
            [ContactOrderFields.Mobile.key]: mobile,
            [ContactOrderFields.Gender.key]: sex,
            [ContactOrderFields.Birthday.key]: birthday,
          } = record;
          const { expandId } = this.state;

          const allFields = Object.values(ContactOrderFields);

          const file = filesCache.find(f => f.linkId === id);
          return (
            <>
              {expandId === id ? (
                <div className={styles.expand}>
                  {allFields.map(field => {
                    let format = pureFunc;
                    switch (field) {
                      case ContactOrderFields.Gender:
                        format = formatGender;
                        break;
                      case ContactOrderFields.Birthday:
                        format = formatAge;
                        break;
                      case ContactOrderFields.CardType:
                        format = val => formatIDCardType(val);
                        break;
                      default:
                      // No default
                    }
                    const { key, value } = field;
                    return (
                      <div key={key}>
                        <div>{value}：</div>
                        <div>{format(record[key])}</div>
                      </div>
                    );
                  })}
                  {/* {(extFields || []).map(({ extDataType, extName, extShowName }) => {
                    if (extDataType === ExtDataTypes.Contact.key) {
                      return null;
                    }
                    return (
                      <div key={extName}>
                        <div>{extShowName || extName}：</div>
                        <div>{record[extName]}</div>
                      </div>
                    );
                  })} */}
                </div>
              ) : (
                <span>
                  <img
                    className={styles.faceImg}
                    src={file?.url || `${CDN_STATIC_HOST}/images/camera-capture-bg.png`}
                    alt="face img"
                  />
                  &nbsp;
                  {realName} {mobile} {formatGender(sex)} {formatAge(birthday)}
                </span>
              )}
            </>
          );
        },
        // width: 200,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'right',
        render: (_, record) => {
          const { id } = record;
          const { contactDeleting, contactSaving, dealSaving } = this.props;
          return (
            <>
              <MarginBar inline left top>
                <Button size="small" disabled={contactDeleting || dealSaving} onClick={e => this.switchExpand(e, id)}>
                  详情
                </Button>
              </MarginBar>
              <MarginBar inline left top>
                <Button
                  size="small"
                  disabled={contactDeleting || contactSaving || dealSaving}
                  onClick={e => this.toEdit(e, record)}
                >
                  编辑
                </Button>
              </MarginBar>
              <MarginBar inline left top>
                <Button
                  size="small"
                  type="danger"
                  disabled={dealSaving}
                  loading={contactDeleting || contactSaving}
                  onClick={e => this.toDelete(e, id)}
                >
                  删除
                </Button>
              </MarginBar>
            </>
          );
        },
        // width: 150,
      },
    ];
  };

  switchExpand = (e, id) => {
    e.stopPropagation();
    if (id) {
      this.setState(({ expandId }) => ({
        expandId: expandId === id ? undefined : id,
      }));
    }
  };

  toEdit = (e, record) => {
    if (e) {
      e.stopPropagation();
    }
    this.setState({
      editInfo: record,
    });
  };

  toClear = () => {
    this.toEdit(null, {});
  };

  afterEdit = () => {
    this.table.reload();
    this.toClear();
  };

  updateFile = (id, file) => {
    if (id && file) {
      // 放前面，取用的时候按先找到的为最新，之所以这么干，是为了不丢弃从list移除的头像，缓存使用
      this.setState(({ filesCache }) => ({
        filesCache: [
          {
            linkId: id,
            ...file,
          },
          ...filesCache,
        ],
      }));
    }
  };

  toDelete = async (e, id) => {
    e.stopPropagation();
    modal.confirm('确认删除吗？', {
      onOk: async () => {
        const { dispatch } = this.props;
        await dispatch({
          type: 'contact/delete',
          payload: [id],
        });
        this.table.reload();
        this.toClear();
      },
    });
  };

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  toSummary = () => {
    this.fillNextStep(true);
  };

  fillNextStep = summary => {
    const {
      onFillNext,
      contact: { ContactOrderFields },
    } = this.props;
    const { selectedRows } = this.state;

    onFillNext(
      selectedRows.map(
        ({ id: pubStudyId, [ContactOrderFields.Mobile.key]: mobile, [ContactOrderFields.RealName.key]: realName }) => ({
          // 冗余一些字段给人脸采集时用
          pubStudyId,
          [ContactOrderFields.Mobile.key]: mobile,
          [ContactOrderFields.RealName.key]: realName,
        })
      ),
      summary
    );
  };

  onTableLoadingStateChange = loading => {
    this.setState({
      tableLoading: loading,
    });
  };

  handleTableInit = table => {
    this.table = table;
  };

  dataSourceRender = data => {
    return (data || []).map(item => {
      const extValues = {};
      if (Array.isArray(item.extValueList)) {
        item.extValueList.forEach(it => {
          extValues[it.name] = it.value;
        });
      }
      return {
        ...item,
        ...extValues,
      };
    });
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleLoadData = list => {
    if (list == null || list.length === 0) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchFiles',
      payload: {
        linkType: CommonFileLinkTypes.PUBLICSTUDY_FACE_AVATAR.key,
        linkId: (list || []).map(item => item.id),
      },
    }).then(arr => {
      if (arr) {
        // 放前面，取用的时候按先找到的为最新，之所以这么干，是为了不丢弃从list移除的头像，缓存使用
        this.setState(({ filesCache }) => ({
          filesCache: [...arr, ...filesCache],
        }));
      }
    });
  };

  // 检查规则和人脸, 不合法返回true
  checkSelectInvalid = info => {
    if (info == null) {
      return true;
    }

    const {
      contact: { ContactOrderFields, CertificateTypes },
    } = this.props;
    const { validFace } = this.context;
    const allFields = Object.values(ContactOrderFields);
    const { fieldsConfig, filesCache } = this.state;
    const { contactValidCfgs, extFields } = fieldsConfig || {};

    const { id } = info;
    // 每个字段校验
    if (
      contactValidCfgs.some(({ fieldName, optionList, maxValue, minValue }) => {
        const value = info[fieldName];
        // 不满足条件的
        const defineField = allFields.find(({ key }) => key === fieldName) || {};
        if (value == null || value === '') {
          message.error(`你选择的联系人${defineField.value || '?'}不能为空，请补充资料后再试`);
          return true;
        }
        // 证件类型
        if (
          fieldName === ContactOrderFields.CardType.key &&
          Array.isArray(optionList) &&
          optionList.length > 0 &&
          !optionList.includes(value.toString())
        ) {
          message.error('证件类型不符合要求，请更改后再试');
          return true;
        }
        const findCardTypeCfg = contactValidCfgs.find(item => item.fieldName === ContactOrderFields.CardType.key);
        if (fieldName === ContactOrderFields.Birthday.key) {
          // 出生日期
          if ((minValue && value < minValue) || (maxValue && value > maxValue)) {
            message.error(
              `你选择的联系人${defineField.value || '?'}年龄必须是${
                maxValue ? `${formatAge(maxValue, true)}岁及以上(出生日期不晚于${formatDate(maxValue)})` : ''
              }${
                minValue
                  ? `${maxValue ? '且' : ''}不大于${formatAge(minValue, true)}岁(出生日期不早于${formatDate(minValue)})`
                  : ''
              }，请重新选择`
            );
            return true;
          }
          // 且选了身份证
          if (findCardTypeCfg && info[findCardTypeCfg.fieldName] === CertificateTypes.IDCard.key) {
            const findCfg = contactValidCfgs.find(item => item.fieldName === ContactOrderFields.CardNum.key);
            if (findCfg && !isIDNumberAndMatchBirthday(info[findCfg.fieldName], value)) {
              message.error('身份证号码与生日不匹配，请重新维护数据后再试');
              return true;
            }
          }
        }
        if (fieldName === ContactOrderFields.CardNum.key && findCardTypeCfg) {
          if (info[findCardTypeCfg.fieldName] === CertificateTypes.IDCard.key) {
            if (!isIDNumber(value)) {
              message.error('身份证号码不正确，请重新维护数据后再试');
              return true;
            }
            // 有生日
            const findCfg = contactValidCfgs.find(item => {
              return item.fieldName === ContactOrderFields.Birthday.key;
            });
            if (findCfg && !isIDNumberAndMatchBirthday(value, info[findCfg.fieldName])) {
              message.error('身份证号码与生日不匹配，请重新维护数据后再试');
              return true;
            }
          }
          // 且选了香港身份证
          else if (info[findCardTypeCfg.fieldName] === CertificateTypes.HKIDCard.key && !isHKIDNumber(value)) {
            message.error('香港身份证号码不正确，请重新维护数据后再试');
            return true;
          }
        }
        return false;
      })
    ) {
      return true;
    }

    if (
      Array.isArray(extFields) &&
      extFields.some(field => {
        const { required, extName, extShowName, validAlert } = field;
        // buildInValidator 的联系人选人版
        const value = info[extName];
        if (required && (value == null || value.toString().trim().length === 0)) {
          message.error(`请完善该联系人${extShowName || extName}`);
          return true;
        }
        // 失败true
        if (checkExtField({}, value, () => {}, {}, {}, field)) {
          message.error(validAlert || `${extShowName}填写无效，请重新编辑修改`);
          return true;
        }
        return false;
      })
    ) {
      return true;
    }
    if (validFace) {
      const file = filesCache.find(f => f.linkId === id);
      if (file == null) {
        message.error('你选择的人员需要补充录入人脸信息, 请点击右侧编辑后，在下方拍摄上传');
        return true;
      }
    }
    return false;
  };

  selectHolder = rows => {
    if (rows.length > 0) {
      const { selectedRows } = this.state;
      const oldList = selectedRows || [];
      // 如果准备勾选的项目有原来列表不存在的，则校验
      const addList = rows.filter(item => !oldList.some(({ id }) => item.id === id));
      if (addList.some(this.checkSelectInvalid)) {
        // 有失败的，阻止选中
        return false;
      }
    }
    return true;
  };

  render() {
    const { getNextStepPath, isSummaryPath, checkOpFailed, validPubStudy } = this.context;
    if (checkOpFailed()) {
      return null;
    }
    const {
      orderprocessing: { dealInfo },
      validFieldFetching,
      contactDeleting,
      contactSaving,
      dealSaving,
      relType,
      dataId,
      bookingNum,
      // 需要结算按钮
      canSummary,
    } = this.props;
    const { deal } = dealInfo;
    const { fieldsConfig, editInfo, tableLoading, selectedRows, filesCache } = this.state;

    const selectedLength = (selectedRows || []).length;

    const nextPathIsSummary = isSummaryPath(getNextStepPath());

    const btnDisabled = tableLoading || validFieldFetching || contactDeleting || contactSaving;

    // 数量匹配, 非 validPubStudy 时可以少选
    const countOk = validPubStudy ? selectedLength === bookingNum : selectedLength <= bookingNum;
    return (
      <>
        <Card bordered={false} title="请选择人员">
          <Datatable
            select="multi"
            showHeader={false}
            pagination={false}
            url={`/publicStudy/studyListPersonnelAll.do?&pubAccountId=${deal.pubAccountId || ''}&relType=${
              relType || ''
            }&dataId=${dataId || ''}`}
            columns={this.columns(filesCache)}
            rowKey="id"
            onTableLoadingStateChange={this.onTableLoadingStateChange}
            onInit={this.handleTableInit}
            dataSourceRender={this.dataSourceRender}
            selectHolder={this.selectHolder}
            onSelectedChange={this.handleSelectedChange}
            onLoadData={this.handleLoadData}
            // formSearch={this.formSearch}
            // operation={this.operation}
          />
        </Card>
        <Card bordered={false} title="添加/编辑" loading={validFieldFetching} className={styles.edtorCard}>
          <FillEditor
            filesCache={filesCache}
            updateFile={this.updateFile}
            pubAccountId={deal.pubAccountId}
            fieldsConfig={fieldsConfig}
            editInfo={editInfo}
            clear={this.toClear}
            afterEdit={this.afterEdit}
          />
        </Card>
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={btnDisabled || dealSaving} onClick={this.handleGoBack}>
              返回修改
            </Button>
          </MarginBar>
          {!nextPathIsSummary && (
            <MarginBar left top inline>
              <Button
                type="primary"
                disabled={btnDisabled || !countOk}
                loading={dealSaving}
                onClick={() => this.fillNextStep()}
              >
                下一步({selectedLength}/{bookingNum})
              </Button>
            </MarginBar>
          )}
          {(nextPathIsSummary || canSummary) && (
            <MarginBar left top inline>
              <Button type="danger" disabled={btnDisabled || !countOk} loading={dealSaving} onClick={this.toSummary}>
                结算({selectedLength}/{bookingNum})
              </Button>
            </MarginBar>
          )}
        </FooterToolbar>
      </>
    );
  }
}

export default OrderContactFill;
