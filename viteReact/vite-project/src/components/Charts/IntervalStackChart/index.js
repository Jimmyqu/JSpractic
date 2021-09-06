import { useState, useImperativeHandle, forwardRef } from 'react';
import { Chart, Tooltip, Geom, Coord, G2, Legend, Guide } from 'bizcharts';
import { formatPercent, formatMoney } from '@/utils/format';
import styles from './index.less';

const IntervalStackChart = forwardRef((props, ref) => {
  const {
    title,
    height = 400,
    padding = 'auto',
    data: dataParam,
    legendVisible = true,
    legendHtml,
    colors,
    isMonery,
    ...restProps
  } = props;
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [percent, setPercent] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState('');

  useImperativeHandle(ref, () => ({
    changeValue: data => {
      setType(data[0].type);
      setValue(data[0].value);
    },
  }));

  const { Html } = Guide;
  const sliceNumber = 0.01;
  G2.Shape.registerShape('interval', 'sliceShape', {
    draw(cfg, container) {
      const { points, color } = cfg;
      let path = [];
      path.push(
        ['M', points[0].x, points[0].y],
        ['L', points[1].x, points[1].y - sliceNumber],
        ['L', points[2].x, points[2].y - sliceNumber],
        ['L', points[3].x, points[3].y],
        'Z'
      );
      // eslint-disable-next-line react/no-this-in-sfc
      path = this.parsePath(path);
      return container.addShape('path', {
        attrs: {
          fill: color,
          path,
        },
      });
    },
  });
  const sum = dataParam.reduce((pre, cur) => {
    return pre + cur.value;
  }, 0);
  const content = isMonery ? `¥ ${formatMoney(value)}` : `${percent}`;

  return (
    <div {...restProps}>
      <Chart
        data={dataParam}
        forceFit
        padding={padding}
        height={height}
        onGetG2Instance={chart => {
          const geom = chart.get('geoms')[0];
          const items = geom.get('data');
          setType(items[0].type);
          setValue(items[0].value);
          setPercent(formatPercent(items[0].value / sum));
          chart.on('afterrender', () => {
            const getGeom = chart.get('geoms')[0];
            const getItems = getGeom.get('data');
            geom.setSelected(getItems[selectedIdx]);
          });
        }}
        onIntervalClick={ev => {
          // eslint-disable-next-line no-underscore-dangle
          const item = ev.data._origin;
          const index = dataParam.findIndex(i => {
            return i.type === item.type;
          });
          if (item) {
            setType(item.type);
            setValue(item.value);
            setPercent(formatPercent(item.value / sum));
            setSelectedIdx(index);
          }
        }}
      >
        <Coord type="theta" innerRadius={0.75} />
        <Guide>
          <Html
            position={['50%', '50%']}
            html={`<div class=${styles.guideHtml}>${type}<br><span class=${styles.txt}>${content}</span></div>`}
            alignX="middle"
            alignY="middle"
          />
        </Guide>
        <Tooltip
          showTitle={false}
          itemTpl="<div>{type}<br />{percent}<br />{value}</div>"
          g2-tooltip={{
            position: 'absolute',
            visibility: 'hidden',
            textAlign: 'left',
            fontSize: '14px',
            backgroundColor: '#000',
            lineHeight: '1.5',
            color: '#fff',
            opacity: '0.8',
            minWidth: '100px',
            padding: '8px 16px',
            transition: 'top 200ms,left 200ms',
          }}
        />
        <Geom
          type="intervalStack"
          position="value"
          color={['type', colors]}
          shape="sliceShape"
          tooltip={[
            'type*value',
            // eslint-disable-next-line no-shadow
            (type, value) => {
              return {
                type,
                value: isMonery ? `¥ ${formatMoney(value)}` : `${value}`,
                percent: formatPercent(value / sum),
              };
            },
          ]}
          active={[
            true,
            {
              style: {
                opacity: 0.8,
              },
            },
          ]}
        />
        <Legend position="bottom" itemGap={40} visible={legendVisible} textStyle={{ fontSize: '16' }} />
      </Chart>
      {!legendVisible ? legendHtml : ''}
    </div>
  );
});

export default IntervalStackChart;
