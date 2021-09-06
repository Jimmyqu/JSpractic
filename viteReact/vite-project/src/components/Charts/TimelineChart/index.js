import { Component } from 'react';
import classNames from 'classnames';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import FullChartModal from '@/components/Charts/FullChartModal';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
class TimelineChart extends Component {
  render() {
    const {
      title,
      height = 400,
      padding = [60, 60, 40, 80],
      titleMap: titleMapParam,
      borderWidth = 2,
      data: dataParam,
      yAxis,
      className,
      type = 'line',
      color = 'key',
      textStyle = {
        fontSize: '12',
      },
      position = 'top',
      isFullChart = false,
      modalTitle,
      fullClassName,
      offsetX = 0,
      ...restProps
    } = this.props;

    const titleMap = titleMapParam || {};
    if (Object.keys(titleMap).length === 0) {
      titleMap.y1 = 'y1';
    }
    const data = dataParam || [];

    if (data.length === 0) {
      data.push({
        x: 0,
      });
    }

    data.sort((a, b) => a.x - b.x);

    const max = Math.max(...Object.keys(titleMap).map(key => [...data].sort((a, b) => b[key] - a[key])[0][key] || 0));

    const ds = new DataSet({
      state: {
        start: data[0].x,
        end: data[data.length - 1].x,
      },
    });

    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'filter',
        callback: obj => {
          const date = obj.x;
          return date <= ds.state.end && date >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          Object.keys(titleMap).forEach(key => {
            newRow[titleMap[key]] = row[key];
          });
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        // fields: [titleMap.y1, titleMap.y2], // 展开字段集
        fields: Object.values(titleMap), // 是否有顺序问题
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const timeScale = {
      type: 'time',
      tickInterval: 60 * 60 * 1000,
      mask: 'HH:mm',
      range: [0, 1],
    };

    const cols = {
      x: timeScale,
      value: {
        max,
        min: 0,
      },
    };

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis={yAxis}
        scales={{ x: timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );

    const chartData = (
      <div className={styles.timelineChartWrapper}>
        <div className={classNames(styles.timelineChart, className)} {...restProps}>
          {title && <h4>{title}</h4>}
          <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
            <Axis name="x" />
            <Tooltip />
            <Legend name="key" position={position} textStyle={textStyle} offsetX={offsetX} />
            <Geom type={type} position="x*value" size={borderWidth} color={color} />
          </Chart>
          <SliderGen />
        </div>
      </div>
    );

    return (
      <>
        {isFullChart && <FullChartModal modalTitle={modalTitle} chartData={chartData} fullClassName={fullClassName} />}
        {chartData}
      </>
    );
  }
}

export default TimelineChart;
