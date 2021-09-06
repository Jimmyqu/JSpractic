import allList from './data/home-town.json';

export { allList };

/**
 * 省份列表
 */
export const provinceList = getListByPid(0);

/**
 * 通过id查询项目
 * @param {*} id
 */
export function find(id) {
  return allList.find(item => item.id === id);
}

/**
 * 通过name查询项目
 * @param {*} name
 * @param {*} list
 */
export function findByName(name, list) {
  return (list || allList).filter(item => item.name === name);
}

/**
 * 通过name查询项目id
 * @param {*} name
 * @param {*} list
 */
export function findIdByName(name, list) {
  const arr = findByName(name, list);
  if (arr.length === 0) {
    return null;
  }
  return arr[0].id;
}

/**
 * 通过父id或者下一级列表项目
 * @param {*} pid
 */
export function getListByPid(pid) {
  return allList.filter(item => item.pid === pid);
}

/**
 * 集联结构数组
 */
export const cascaderData = provinceList.map(province => ({
  value: province.id,
  label: province.name,
  children: getListByPid(province.id).map(city => ({
    value: city.id,
    label: city.name,
    children: getListByPid(city.id).map(dist => ({
      value: dist.id,
      label: dist.name,
    })),
  })),
}));

export function optionsMapper(model) {
  if (model == null) {
    return null;
  }
  const { value, label, children } = model;
  return {
    key: value,
    text: label,
    subOptions: children,
  };
}

/**
 * 省市区名称逆向获得id
 * @param {*} province
 * @param {*} city
 * @param {*} district
 */
export function lookup(province, city, district) {
  const obj = {};
  const p = findIdByName(province);
  if (p) {
    obj.province = p;
    const c = findIdByName(city, getListByPid(p));
    if (c) {
      obj.city = c;
      const d = findIdByName(district, getListByPid(c));
      if (d) {
        obj.district = d;
      }
    }
  }
  return obj;
}
