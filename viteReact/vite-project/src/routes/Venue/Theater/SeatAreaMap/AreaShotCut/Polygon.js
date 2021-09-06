// 注释掉这种css用法

// import classNames from 'classnames';
// import styles from './index.less';

// export default ({ editing, polygon, dotWidth, dotClick, isEnClosed }) => {
//   if (polygon == null) {
//     return null;
//   }
//   const offset = dotWidth / 2;
//   const { id, areaExtSettings } = polygon;
//   const { dots } = areaExtSettings || {};
//   // 目前闭合多边形采用的是把第一个dot实例在列表最后再放一次的方式
//   const enClosed = isEnClosed(polygon);
//   const lines = [];
//   dots.forEach((dot, index) => {
//     // dots是点的集合 : Array<{ x: number; y: number; }>
//     // 最后一个点没有连线
//     if (!dots[index + 1]) {
//       return;
//     }

//     const AB = {
//       x: dots[index + 1].x - dot.x,
//       y: dots[index + 1].y - dot.y,
//     };
//     // const BC = {
//     //   x: 0,
//     //   y: 1,
//     // };

//     // 向量的模
//     const a = Math.sqrt(AB.x ** 2 + AB.y ** 2);
//     // const b = Math.sqrt(BC.x ** 2 + BC.y ** 2);

//     // const aXb = AB.x * BC.x + AB.y * BC.y;
//     // const cosAb = aXb / (a * b);

//     // 求出偏转角度
//     const angle = Math.atan2(AB.y, AB.x);

//     // r是点的半径, 根据点的大小修改
//     lines.push({
//       x: dot.x,
//       y: dot.y,
//       width: a,
//       angle: angle * (180 / Math.PI),
//     });
//   });

//   return (
//     <>
//       {lines.map(line => {
//         return (
//           <div
//             key={`${line.x}-${line.y}`}
//             className={classNames(styles.line, {
//               [styles.editing]: editing,
//               [styles.enClosed]: enClosed,
//             })}
//             style={{ left: line.x, top: line.y, width: line.width, transform: `rotate(${line.angle}deg)` }}
//           />
//         );
//       })}
//       {editing &&
//         dots.map((dot, idx) => {
//           // 目前闭合多边形采用的是把第一个dot实例在列表最后再放一次的方式
//           const isLast = idx === dots.length - 1;
//           return (
//             <div
//               key={`${dot.x}-${dot.y}${isLast ? '-last' : ''}`}
//               className={classNames(styles.dot, {
//                 [styles.lastDot]: isLast,
//                 [styles.enClosed]: enClosed,
//               })}
//               onMouseMove={e => {
//                 e.stopPropagation();
//               }}
//               // 与图形上的点击监听使用同一个事件名
//               onMouseUp={e => {
//                 e.stopPropagation();
//                 // e.nativeEvent.stopImmediatePropagation();
//                 if (enClosed) {
//                   return;
//                 }
//                 dotClick(dot, id);
//               }}
//               style={{ width: dotWidth, height: dotWidth, left: dot.x - offset, top: dot.y - offset }}
//             />
//           );
//         })}
//     </>
//   );
// };
