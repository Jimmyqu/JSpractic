import { PureComponent } from 'react';
import EllipsisIcon from '@/components/Icon/Ellipsis';

export default class EllipsisCell extends PureComponent {
  render() {
    const { children, width = '100%' } = this.props;
    if (!children) {
      return null;
    }
    return (
      <div className="text-overflow" style={{ maxWidth: width }}>
        <EllipsisIcon title={children} />
        <span style={{ paddingLeft: 2 }}>{children}</span>
      </div>
    );
  }
}
