import { PureComponent } from 'react';
import { Link, Redirect, Switch, Route } from 'react-router-dom';
import GlobalFooter from '@/components/GlobalFooter';
import { getRoutes, getPageQuery, getQueryPath } from '@/utils/utils';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

const links = [
  //  {
  //     key: 'help',
  //     title: '帮助',
  //     href: '//help.ydmap.cn',
  //   },
  //   {
  //     key: 'privacy',
  //     title: '隐私',
  //     href: '',
  //   },
  //   {
  //     key: 'terms',
  //     title: '条款',
  //     href: '',
  //   },
];

function getLoginPathWithRedirectPath() {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

class UserLayout extends PureComponent {
  componentDidMount() {
    this.setPageTitle();
  }

  componentDidUpdate() {
    this.setPageTitle();
  }

  setPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '管理控制台';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${title}`;
    }
    document.title = title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>YDMAP Cloud</span>
              </Link>
            </div>
            <div className={styles.desc}>管理控制台</div>
          </div>
          <Switch>
            {getRoutes(match.path, routerData).map(item => (
              <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
            ))}
            <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
          </Switch>
        </div>
        <GlobalFooter links={links} />
      </div>
    );
  }
}

export default UserLayout;
