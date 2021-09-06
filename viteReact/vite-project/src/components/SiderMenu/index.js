import { Drawer } from 'antd';
import SiderMenu from './SiderMenu';

// TODO https://github.com/ant-design/ant-design-pro/commit/a2368883a54e792faea4a6531f3de53b6bcf2e40
const SiderMenuWrapper = props => {
  const { isMobile, onCollapse, collapsed } = props;
  return isMobile ? (
    <Drawer
      bodyStyle={{
        padding: 0,
      }}
      getContainer={false}
      placement="left"
      width={200}
      visible={!collapsed}
      closable={false}
      onClose={() => {
        onCollapse(true);
      }}
    >
      <SiderMenu {...props} collapsed={isMobile ? false : collapsed} />
    </Drawer>
  ) : (
    <SiderMenu {...props} />
  );
};

export default SiderMenuWrapper;
