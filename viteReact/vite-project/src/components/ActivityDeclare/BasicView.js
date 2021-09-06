import { Component } from 'react';
import { connect } from 'react-redux';
import { calcAuditState, getSortedFields } from '@/components/ActivityDeclare';
import MarginBar from '@/components/MarginBar';
import VerticalPairColumnTable from '@/components/VerticalPairColumnTable';
import { formatDateHM, formatHomeTown, formatDateTime } from '@/utils/format';
import ViewHeader from './ViewHeader';
import style from './index.less';

const { PairColumn } = VerticalPairColumnTable;

@connect(({ activity }) => ({
  activity,
}))
class ActivityBasicView extends Component {
  reportValue = value => {
    if (Array.isArray(value)) {
      return value.map(item => (
        <a key={item.fileKey || item.fileName} href={item.url}>
          {item.fileName || item.fileKey}
        </a>
      ));
    }
    return value;
  };

  render() {
    const { data, declareFields, fixedStaticFields, activity } = this.props;
    const { declareDetail: info, declareNodeList } = data;
    const declareDetail = info || {};
    const auditState = calcAuditState(activity, declareNodeList[0], declareNodeList);
    const { id, createTime, createdRealName } = declareDetail;
    const sortList = getSortedFields(declareFields, fixedStaticFields);
    // const extFields = declareFields || [];
    const dateFormatFn = formatDateHM;

    // FIXME
    // // 添加两个
    // defaultList.splice(2, 0, 'category');
    // defaultList.splice(4, 0, 'configId');

    // 删除province，因为省市区都在地址的字段上显示了
    const idx = sortList.indexOf('province');
    if (idx >= 0) {
      sortList.splice(idx, 1);
    }
    return (
      <div>
        <ViewHeader auditState={auditState}>基本信息</ViewHeader>
        <MarginBar top className={style.tableRowWrapper}>
          <VerticalPairColumnTable per={2}>
            <PairColumn label="活动编号">{id}</PairColumn>
            <PairColumn label="创建时间">{formatDateTime(createTime)}</PairColumn>
            <PairColumn label="创建人">{createdRealName}</PairColumn>
            {sortList.map(item => (
              <PropsPairList
                key={item.extName}
                dateFormatFn={dateFormatFn}
                declareDetail={declareDetail}
                reportValue={this.reportValue}
                data={item}
              />
            ))}
          </VerticalPairColumnTable>
        </MarginBar>
        {/* {extFields.length > 0 && (
          <MarginBar top className={style.tableRowWrapper}>
            <VerticalPairColumnTable per={2}>
              {extFields.map(({ extName, extShowName }) => (
                <PairColumn key={extName} label={extShowName}>
                  {this.reportValue(declareDetail[extName])}
                </PairColumn>
              ))}
            </VerticalPairColumnTable>
          </MarginBar>
        )} */}
      </div>
    );
  }
}

const PropsPairList = ({ data: { extName, extShowName }, declareDetail, dateFormatFn, reportValue, ...restProps }) => {
  const {
    companyName,
    exerciseName,
    categoryValue,
    startDate,
    endDate,
    configName,
    province,
    city,
    district,
    exerciseAddress,
    exerciseTel,
    exerciseContacts,
    descr,
  } = declareDetail;

  switch (extName) {
    case 'companyName':
    case 'companyId':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '单位名称'}>
          {companyName}
        </PairColumn>
      );
    case 'exerciseName':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '活动名称'}>
          {exerciseName}
        </PairColumn>
      );
    case 'categoryValue':
    case 'category':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '活动类型'}>
          {categoryValue}
        </PairColumn>
      );
    case 'startDate':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '活动时间'}>
          {`${dateFormatFn(startDate)}至${dateFormatFn(endDate)}`}
        </PairColumn>
      );
    case 'configName':
    case 'configId':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '项目类型'}>
          {configName}
        </PairColumn>
      );
    case 'exerciseAddress':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '活动地点'}>
          {`${formatHomeTown(province)}${formatHomeTown(city)}${formatHomeTown(district)}${exerciseAddress}`}
        </PairColumn>
      );
    case 'province':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '活动地区'}>
          {formatHomeTown(province)}
        </PairColumn>
      );
    case 'exerciseTel':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '手机号'}>
          {exerciseTel}
        </PairColumn>
      );
    case 'exerciseContacts':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '联系人'}>
          {exerciseContacts}
        </PairColumn>
      );
    case 'descr':
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || '备注'}>
          {descr}
        </PairColumn>
      );
    default:
      return (
        <PairColumn {...restProps} key={extName} label={extShowName || extName}>
          {reportValue(declareDetail[extName])}
        </PairColumn>
      );
  }
};

export default ActivityBasicView;
