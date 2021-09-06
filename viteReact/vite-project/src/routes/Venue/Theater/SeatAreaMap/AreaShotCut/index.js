import { useMemo } from 'react';
import SVGPolygon from './SVGPolygon';
import styles from './index.less';

export default ({ editAreaData, allPolygons, ...restProps }) => {
  const editing = editAreaData != null;

  const polygons = useMemo(() => {
    if (editAreaData) {
      return editAreaData.polygons;
    }
    return allPolygons;
  }, [editAreaData, allPolygons]);

  // 在编辑时，以非编辑样式显示一下其他条件(楼层/区域/等级)的数据，方便用户识别区域冲突等, 根据必须闭合才能保存的限制，他们一定是闭合的
  const others = editing
    ? // editAreaData.polygons 里可能有正在编辑的、来自allPolygons的数据
      allPolygons.filter(p => {
        if (!restProps.isEnClosed(p)) {
          return false;
        }
        return !editAreaData.polygons?.some(ep => ep.id === p.id);
      })
    : [];

  // polygons 表示单个业务区域配置中的一个或者多个物理线框区域
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className={styles.svg}>
      {/* 即使是编辑模式，此时others这些也是非可编辑的 */}
      {others.map(polygon => (
        <SVGPolygon {...restProps} key={polygon.id} polygon={polygon} editing={editing} isOther />
      ))}
      {/* 这里是编辑的 */}
      {polygons?.map(polygon => (
        <SVGPolygon {...restProps} key={polygon.id} polygon={polygon} editing={editing} />
      ))}
    </svg>
  );
};
