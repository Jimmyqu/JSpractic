import { PureComponent } from 'react';
import { Icon, Tooltip } from 'antd';
import style from './index.less';

export default class Ellipsis extends PureComponent {
  render() {
    const { title } = this.props;
    return (
      <Tooltip title={title}>
        <Icon className={style.ellipsis} type="ellipsis" />
      </Tooltip>
    );
  }
}
