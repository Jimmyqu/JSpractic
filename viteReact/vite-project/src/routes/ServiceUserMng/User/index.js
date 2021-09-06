import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthTabsPageHeaderLayout from '@/layouts/AuthTabsPageHeaderLayout';

export default props => {
  const dispatch = useDispatch();

  const [careerList, setCareerList] = useState();
  const { Careers } = useSelector(state => state.venue);
  const fetching = useSelector(state => state.loading.effects['pubserviceuser/fetchSysUserCertCareerList']);

  useEffect(() => {
    dispatch({
      type: 'pubserviceuser/fetchSysUserCertCareerList',
    }).then(data => {
      setCareerList(
        (data || [])
          .map(item => {
            switch (item.careerId) {
              case Careers.SPORTS_TEACHER.key:
                return {
                  key: 'teacher',
                  tab: '老师',
                  auth: 'tab-teacher',
                };
              case Careers.SPORTS_TEACH.key:
                return {
                  key: 'coach',
                  tab: '教练员',
                  auth: 'tab-coach',
                };
              case Careers.SPORTS_TRAINER.key:
                return {
                  key: 'referee',
                  tab: '裁判员',
                  auth: 'tab-referee',
                };
              case Careers.SPORTS_ATHLETE.key:
                return {
                  key: 'athlete',
                  tab: '运动员',
                  auth: 'tab-athlete',
                };
              default:
                return null;
            }
          })
          .filter(Boolean)
      );
    });
  }, []);

  return (
    <AuthTabsPageHeaderLayout
      {...props}
      loading={careerList == null || fetching}
      // title="人员列表"
      authScopePath="/basic/serviceusermng/user"
      tabList={careerList}
    />
  );
};
