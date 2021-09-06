import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConfigProvider, Modal, Descriptions } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './app.less';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';
import { formatDateTime } from './utils/format';

const { AuthorizedRoute } = Authorized;

// 版本号存储
let versionData;

export default ({ app }) => {
  const vertionCheckTimer = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const check = async () => {
      let newVersionData;
      try {
        // 该请求是抓取dist下的json文件，开发环境没有，会fallback到index.html, 并且无法成功转化为json, 最终得到 undefined
        newVersionData = await dispatch({
          type: 'global/fetchBuildVersion',
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      }
      if (newVersionData) {
        if (versionData && versionData.version !== newVersionData.version) {
          // 版本刷新了
          // 由于SPA设计，当我的页面已经打开的过程中，发布了新版本
          Modal.info({
            className: 'upgrade-tip-modal',
            title: '系统更新公告',
            content: (
              <Descriptions column={1}>
                <Descriptions.Item label="【更新时间】">{formatDateTime(newVersionData.timestamp)}</Descriptions.Item>
                <Descriptions.Item label="【版本号】">{newVersionData.version}</Descriptions.Item>
                {/* <Descriptions.Item label="【更新内容】">Cloud Database</Descriptions.Item> */}
                <Descriptions.Item>系统已经发布更新，点击【确认】后，本页面将重新加载到新版本！</Descriptions.Item>
              </Descriptions>
            ),
            okText: '确认',
            onCancel: () => {
              window.location.reload(true);
            },
            onOk: () => {
              window.location.reload(true);
            },
          });
          return;
        }
        versionData = newVersionData;
      }
      vertionCheckTimer.current = setTimeout(check, 1000 * 60);
    };
    check();
    return () => {
      if (vertionCheckTimer.current) {
        clearTimeout(vertionCheckTimer.current);
      }
    };
  }, []);

  const Roles = useSelector(state => state.user?.Roles || {});
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;

  const roles = Object.keys(Roles).filter(key => Roles[key].key >= 0);
  return (
    <ConfigProvider locale={zhCN}>
      <Switch>
        <Route path="/user" component={UserLayout} />
        {/* <AuthorizedRoute
          path="/"
          component={BasicLayout}
          authority={roles.length > 0 ? roles : undefined}
          redirectPath={getQueryPath('/user/login', {
            redirect: window.location.href,
          })}
        /> */}
        <AuthorizedRoute
          path="/"
          render={props => <BasicLayout {...props} />}
          authority={roles}
          redirectPath={getQueryPath('/user/login', {
            redirect: window.location.href,
          })}
        />
      </Switch>
    </ConfigProvider>
  );
};
