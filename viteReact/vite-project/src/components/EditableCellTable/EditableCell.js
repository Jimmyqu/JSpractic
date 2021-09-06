import { cloneElement, Component } from 'react';
import { findDOMNode } from 'react-dom';
import lodashSet from 'lodash/set';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import EditableContext from './context';
import styles from './index.less';

export default class EditableCell extends Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    const { editable } = this.props;
    if (editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { editable: nextEditable } = nextProps;
    const { editable } = this.props;
    if (editable && !nextEditable) {
      document.removeEventListener('click', this.handleClickOutside, true);
      return;
    }
    if (!editable && nextEditable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    const { editable } = this.props;
    if (editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const { editable } = this.props;
    if (editable && editable.disabled) {
      // 显示成编辑痕迹，但禁用编辑
      return;
    }
    const { editing } = this.state;
    const newEditing = !editing;
    this.setState({ editing: newEditing }, () => {
      if (newEditing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = e => {
    const { editing } = this.state;
    if (!editing) {
      return;
    }
    // 组件内点击
    if (this.input) {
      if (this.input instanceof Element && this.input.contains(e.target)) {
        return;
      }
      // 如果点击在组件外面
      // eslint-disable-next-line react/no-find-dom-node
      if (e.target.contains(findDOMNode(this.input))) {
        this.save();
        return;
      }
    }
    if (this.cell === e.target || !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, index, dataIndex, handleSave } = this.props;
    this.form.validateFields([`${index}-${dataIndex}`], (error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      const formValues = {};
      Object.keys(values).forEach(key => {
        const kv = key.split('-');
        if (kv.length !== 2) {
          return;
        }
        const idx = +kv[0];
        const name = kv[1];
        if (idx === index && name === dataIndex) {
          formValues[name] = values[key];
        }
      });
      handleSave({ ...record, ...formValues });
    });
  };

  render() {
    const { editing } = this.state;
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;

    let children;
    if (editable) {
      children = record.noEditable ? (
        restProps.children
      ) : (
        <EditableContext.Consumer>
          {form => {
            this.form = form;
            return editing ? (
              <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(`${index}-${dataIndex}`, {
                  validateFirst: true,
                  rules: [
                    ...(editable.required
                      ? [
                          {
                            required: true,
                            message: `请填写${title}`,
                          },
                        ]
                      : []),
                    ...(editable.rules || []).map(rule => {
                      if (rule.validator == null) {
                        return rule;
                      }
                      return {
                        ...rule,
                        validator(...args) {
                          // 补一个参数
                          const useRecord = {
                            ...record,
                          };
                          lodashSet(useRecord, dataIndex, args[1]);
                          return rule.validator(...args, useRecord);
                        },
                      };
                    }),
                  ],
                  initialValue: record[dataIndex],
                })(
                  editable === true || editable.node == null ? (
                    <Input
                      ref={node => {
                        this.input = node;
                      }}
                      onPressEnter={this.save}
                    />
                  ) : (
                    cloneElement(editable.node, {
                      ...(typeof editable.onNode === 'function' ? editable.onNode(record) : {}),
                      ref: node => {
                        this.input = node;
                      },
                      onKeyDown: e => {
                        if (e.keyCode === 13) {
                          this.save();
                        }
                      },
                    })
                  )
                )}
              </Form.Item>
            ) : (
              <div
                className={classNames(styles.cellValueWrap, {
                  'ant-input-number-disabled': editable.disabled,
                })}
                onClick={this.toggleEdit}
              >
                {restProps.children}
              </div>
            );
          }}
        </EditableContext.Consumer>
      );
    } else {
      children = restProps.children;
    }
    return (
      <td
        ref={node => {
          this.cell = node;
        }}
        {...restProps}
      >
        {children}
      </td>
    );
  }
}
