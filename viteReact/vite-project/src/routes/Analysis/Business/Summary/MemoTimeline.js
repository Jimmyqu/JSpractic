import { memo } from 'react';
import isEqual from 'lodash/isEqual';
import TimelineChart from '@/components/Charts/TimelineChart';

export default memo(
  ({ data, ...restProps }) => <TimelineChart data={data} {...restProps} />,
  (prevProps, nextProps) =>
    [...new Set([...Object.keys(prevProps), ...Object.keys(nextProps)])].every(key => {
      const prev = prevProps[key];
      const next = nextProps[key];
      if (key === 'titleMap') {
        return isEqual(prev, next);
      }
      return prev === next;
    })
);
