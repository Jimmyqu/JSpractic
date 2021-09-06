import { Component, useEffect, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Button, Icon, Breadcrumb } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;

function SubView({ children, title, setStackTitle = () => {} }) {
  useEffect(() => {
    setStackTitle(title);
  }, [title]);

  return children;
}

/**
 * 多层显示，始终控制在最后一层，添加层始终新初始化，返回上层不会，因为上层Tabs都是保留的
 */
class LevelView extends Component {
  defaultKey = 'default';

  static childContextTypes = {
    pushView: PropTypes.func,
    popView: PropTypes.func,
  };

  state = {
    stacks: [],
  };

  getChildContext() {
    return {
      pushView: this.pushView,
      popView: this.popView,
    };
  }

  pushView = (item, onSelfResume) => {
    this.setState(({ stacks }) => ({
      stacks: [
        ...stacks,
        {
          key: Date.now().toString(),
          content: Children.map(item, child => {
            if (child.type === SubView) {
              const index = stacks.length;
              return cloneElement(child, {
                ...child.props,
                setStackTitle: title => {
                  this.setState(({ stacks: stacks2 }) => {
                    const list = [...stacks2];
                    const current = list[index];
                    list[index] = {
                      ...current,
                      title,
                    };
                    return {
                      stacks: list,
                    };
                  });
                },
              });
            }
            return child;
          }),
          onSelfResume,
        },
      ],
    }));
  };

  popView = (...args) => {
    const { stacks: list } = this.state;
    const popStack = list.length === 0 ? null : list[list.length - 1];
    this.setState(
      ({ stacks }) => ({
        stacks: stacks.length === 0 ? stacks : stacks.slice(0, -1),
      }),
      () => {
        if (popStack) {
          const { onSelfResume } = popStack;
          if (typeof onSelfResume === 'function') {
            onSelfResume(...args);
          }
        }
        // const { children } = this.props;
        // const { stacks } = this.state;
        // const resumeView = stacks.length === 0 ? children : stacks[stacks.length - 1];
        // console.log(resumeView);
        // const { onResume } = resumeView.props;
        // if (typeof onResume === 'function') {
        //   onResume();
        // }
      }
    );
  };

  render() {
    const { children } = this.props;
    const { stacks = [] } = this.state;
    return (
      <>
        {stacks.length > 0 && (
          <div className={styles.topWrapper}>
            <Button onClick={() => this.popView()}>
              <Icon type="left" />
              返回
            </Button>
            <Breadcrumb className={styles.subBreadcrumb}>
              {stacks.map(item => (
                <Breadcrumb.Item key={item.title || item.key}>{item.title}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
        )}
        <Tabs
          defaultActiveKey={this.defaultKey}
          activeKey={stacks.length === 0 ? this.defaultKey : stacks[stacks.length - 1].key}
          renderTabBar={() => <></>}
        >
          <TabPane key={this.defaultKey}>{children}</TabPane>
          {stacks.map(({ key, content }) => (
            <TabPane key={key}>{content}</TabPane>
          ))}
        </Tabs>
      </>
    );
  }
}

LevelView.SubView = SubView;

export default LevelView;
