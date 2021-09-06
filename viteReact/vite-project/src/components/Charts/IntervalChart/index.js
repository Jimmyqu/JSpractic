import { Component } from 'react';
import { Chart, Tooltip, Geom, Axis } from 'bizcharts';
import FullChartModal from '@/components/Charts/FullChartModal';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
class IntervalChart extends Component {
  render() {
    const {
      title,
      height = 400,
      padding = [20, 30, 20, 50],
      color = '#3aa0ff',
      label = {
        fontSize: '12',
      },
      minWidth = '700px',
      size,
      fullClassName,
      data: dataParam,
      ...restProps
    } = this.props;

    const cols = {
      sales: {
        tickCount: 5,
      },
    };

    const chartData = (
      <div className={styles.IntervalWrapper}>
        <div style={{ minWidth }}>
          <Chart padding={padding} height={height} data={dataParam} scale={cols} forceFit>
            <Axis name="x" label={label} />
            <Axis name="value" />
            <Tooltip
              itemTpl='<div class="g2-tooltip-list-item">{value}</div>'
              g2-tooltip={{
                position: 'absolute',
                visibility: 'hidden',
                textAlign: 'center',
                fontSize: '14px',
                backgroundColor: '#000',
                color: '#fff',
                opacity: '0.8',
                padding: '5px 15px',
                transition: 'top 200ms,left 200ms',
              }}
              g2-tooltip-title={{
                fontSize: '16px',
              }}
            />
            <Geom type="interval" position="x*value" color={color} size={size} />
          </Chart>
        </div>
      </div>
    );

    return (
      <div {...restProps}>
        <FullChartModal modalTitle={title} chartData={chartData} fullClassName={fullClassName} />
        {chartData}
      </div>
    );
  }
}

export default IntervalChart;
