import { getPageQuery } from '@/utils/utils';

export function getActiveStep({ declareDetail }) {
  const query = getPageQuery();
  const { step } = query;
  return +(step || (declareDetail || {}).currentNodeStep || 1);
}

export function getIndustryByUrl({ IndustryTypes, PathReg }) {
  const pathname = window.location.pathname || '';
  const list = pathname.match(PathReg);
  if (list) {
    const entry = Object.entries(IndustryTypes).find(([path]) => path === list[1]);
    if (entry) {
      return entry[1].key;
    }
  }
  return null;
}

// 计算某步的状态
export function calcAuditState({ DeclareNodeTypes }, stepItem, nodeList) {
  if (stepItem == null || nodeList == null) {
    return null;
  }
  if (stepItem.nodeType === DeclareNodeTypes.AUDIT.key) {
    return stepItem.auditState;
  }
  const i = nodeList.indexOf(stepItem);
  return calcAuditState({ DeclareNodeTypes }, nodeList[i + 1], nodeList);
}

// 固定字段（按表单行）
export const staticFields = [
  'companyId',
  'category',
  'configId',
  'exerciseName',
  'startDate', // 含结束时间
  'exerciseContacts',
  'exerciseTel',
  'province', // 含市/区
  'exerciseAddress',
];

export const staticFieldTitles = {
  category: '活动类型',
  configId: '项目类型',
  companyId: '单位名称',
  exerciseName: '活动名称',
  startDate: '活动时间',
  exerciseContacts: '联系人',
  exerciseTel: '手机号',
  province: '活动地区',
  exerciseAddress: '活动地址',
};

export const defaultCategoryField = {
  extName: 'category',
  ranks: 100,
  required: true,
  hidden: true,
};

export const defaultConfigField = {
  extName: 'configId',
  ranks: 101,
  required: true,
  hidden: true,
};

// rank排序方法
export function fieldsSortFn(fieldCfg1 = {}, fieldCfg2 = {}) {
  if (fieldCfg1.ranks == null) {
    return -1;
  }
  if (fieldCfg2.ranks == null) {
    return 1;
  }
  return fieldCfg1.ranks - fieldCfg2.ranks;
}

// 固定字段+扩展字段混合排序
export function getSortedFields(declareFields = [], fixedStaticFields = [], excludeFieldNames = []) {
  // 固定的
  const fixedStaticFieldCfg = {};
  (fixedStaticFields || []).forEach(item => {
    // 展开数组为对象，方便使用
    fixedStaticFieldCfg[item.extName] = item;
  });
  // 扩展的/动态的
  const dynamicDeclareFieldCfg = {};
  declareFields.forEach(item => {
    // 展开数组为对象，方便使用
    dynamicDeclareFieldCfg[item.extName] = item;
  });
  let list = [
    ...Object.keys(fixedStaticFieldCfg),
    ...declareFields.map(item => {
      return item.extName;
    }),
  ];
  if (excludeFieldNames.length > 0) {
    list = list.filter(name => {
      return !excludeFieldNames.includes(name);
    });
  }
  return list
    .map(extName => {
      return (
        fixedStaticFieldCfg[extName] ||
        dynamicDeclareFieldCfg[extName] || { extName, extShowName: staticFieldTitles[extName] }
      );
    })
    .sort(fieldsSortFn);
}

/**
 * 是否需要确认
 * @param {*} activity state
 * @param {*} nodeDetail data，至少需要currentStep、listNode
 */
export function needConfirm({ DeclareNodeTypes, nodeListMapping }, data) {
  const { declareNodeList, declareDetail } = data || {};
  const { configId } = declareDetail || {};
  let list = declareNodeList;
  const dataOverride = {};
  if (list == null) {
    const { listNode: stateList, currentNodeStep } = nodeListMapping[configId] || {};
    list = stateList;
    dataOverride.currentNodeStep = currentNodeStep;
  }
  if (list == null) {
    return false;
  }
  return list.some(
    item =>
      item.nodeStep === getActiveStep({ ...data, dataOverride }) + 1 && item.nodeType === DeclareNodeTypes.AUDIT.key
  ); // 下一个是审核节点
}
