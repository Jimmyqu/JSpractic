import { getPageQuery } from '@/utils/utils';
import AuthTabsPageHeaderLayout from '@/layouts/AuthTabsPageHeaderLayout';
import GradeInterestsDetails from './GradeManage/GradeInterestsDetails';

export default props => {
  const { id } = getPageQuery();
  return id ? (
    <GradeInterestsDetails />
  ) : (
    <AuthTabsPageHeaderLayout
      {...props}
      authScopePath="/basic/pub/grade"
      tabList={[
        {
          key: 'grade-manage',
          tab: '等级管理',
          auth: 'tab-grade-manage',
        },
        {
          key: 'interests-manage',
          tab: '权益管理',
          auth: 'tab-interests-manage',
        },
        {
          key: 'interests-change',
          tab: '等级权益变更表',
          auth: 'tab-interests-change',
        },
        {
          key: 'three-grade-relation',
          tab: '第三方等级关系',
          auth: 'tab-three-grade-relation',
        },
      ]}
    />
  );
};
