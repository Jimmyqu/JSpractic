import { parse, stringify } from 'qs';
import { DEFAULT_USER_AVATAR_PIC_PATH, DEFAULT_GIFT_PIC_PATH, DEFAULT_SALES_PIC_PATH } from '@/commons/lib/utils';
import { WeekDays } from '@/utils/format';
import { optionsMapper } from '@/commons/lib/models';
import { genericPrint } from '@/commons/lib/pda';

export * from '@/commons/lib/utils';

export const baseURL = '/v3';

export const DEFAULT_USER_AVATAR_PIC_FULLPATH = `${DEFAULT_USER_AVATAR_PIC_PATH}/200X200.jpg`;
export const DEFAULT_GIFT_PIC_FULLPATH = `${DEFAULT_GIFT_PIC_PATH}/200X200.jpg`;
export const DEFAULT_SALES_PIC_FULLPATH = `${DEFAULT_SALES_PIC_PATH}/58X58.gif`;

function getRelation(str1, str2) {
  if (str1 === str2) {
    // eslint-disable-next-line no-console
    console.warn('Two path are equal!');
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

function findSomePath(list = [], path) {
  return list.some(item => {
    if (item.path === path) {
      return true;
    }
    if (item.children) {
      return findSomePath(item.children, path);
    }
    return false;
  });
}

// 无需授权白名单
const noAuth = ['/user', '/exception', '/dashboard'];

function isAvailableRouterData(routePath, menuData) {
  if (menuData == null) {
    // 没值视为不过滤
    return true;
  }
  if (routePath === '/' || noAuth.some(item => routePath.startsWith(item))) {
    return true;
  }
  return findSomePath(menuData, routePath);
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, allRouterData, menuData) {
  // const reservePathList = Object.keys(routerData).filter(path => {
  //   return path === '/' || path.startsWith('/user') || path.startsWith('/exception')
  // })
  // if (menuData) {
  //   if (menuData.length)
  // }
  const router403 = allRouterData['/exception/403'];
  const routerData = {};
  Object.keys(allRouterData).forEach(routePath => {
    const orignRouter = allRouterData[routePath];
    if (isAvailableRouterData(routePath, menuData)) {
      routerData[routePath] = orignRouter;
      return;
    }
    if (router403) {
      routerData[routePath] = {
        ...router403,
        name: orignRouter.name, // 保留名字
      };
    }
  });
  let routes = Object.keys(routerData).filter(routePath => routePath.indexOf(path) === 0 && routePath !== path);
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery(search = window.location.href) {
  return parse(search.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length > 0) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[\w$&+,:;=-]+@)?[\d.A-Za-z-]+(?::\d+)?|(?:www.|[\w$&+,:;=-]+@)[\d.A-Za-z-]+)((?:\/[%+./~\w-_]*)?\??[\w%&+.;=@-]*#?\w*)?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function createMarkup(html) {
  return { __html: html };
}

export function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`;
  });
}

export function modelMapToOption(model) {
  return optionsMapper(model);
}

export function weekDaysMapToOption() {
  return WeekDays.slice(1).map((item, i) => ({
    key: i + 1,
    text: item,
  }));
}

export const formItemLayoutNormal = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export const formItemLayoutFull = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export const submitFormLayoutNormal = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 6 },
  },
};

/**
 * 常规剧中纵向大表单
 */
export const formItemLayoutBasic = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

export function mergeUrlParams(str, newQuery, delKeys = []) {
  let url = str || '';
  const params = newQuery || {};
  const hashSp = url.split('#');
  const hash = hashSp[1];
  [url] = hashSp;
  // 合并地址栏参数和对象参数
  const sps = url.split('?');
  const params0 = getPageQuery(url);
  Object.assign(params0, params);
  delKeys.forEach(key => {
    delete params0[key];
  });
  const search = stringify(params0);
  url = `${sps[0]}${search.length > 0 ? `?${search}` : ''}${hash ? `#${hash}` : ''}`;
  return url;
}

/**
 * 当使用pda支持的打印方式时，需要dealInfo，否则不需要
 * @param {*} dealInfo
 */
export function print(dealInfo) {
  return genericPrint(dealInfo);
}
