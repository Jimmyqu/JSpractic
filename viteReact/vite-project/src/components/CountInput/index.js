import { Component, createRef, forwardRef } from 'react';
import { InputNumber, Button, Icon } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

class CountInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.input = createRef();
    const { value, defaultValue } = this.props;
    this.state = {
      value: value || defaultValue,
    };
  }

  handleMinus(e, step) {
    const innerInputRef = this.input.current?.inputNumberRef;
    if (innerInputRef) {
      innerInputRef.down(e, step);
      innerInputRef.stop();
    }
  }

  handleAdd(e, step) {
    const innerInputRef = this.input.current?.inputNumberRef;
    if (innerInputRef) {
      innerInputRef.up(e, step);
      innerInputRef.stop();
    }
  }

  focus = () => this.input.current?.inputNumberRef?.focus();

  blur = () => this.input.current?.inputNumberRef?.blur();

  render() {
    const { width, size, step: s, min, max, className, onChange, fullWidth, forwardedRef, ...resProps } = this.props;
    const step = s >= 0 ? Math.ceil(s) : 1;
    const verifyMin = Math.ceil(min >= 0 ? min : 0);
    const verifyMax = max >= 0 ? Math.floor(max) : undefined;
    const { value } = this.state;
    return (
      <div
        ref={forwardedRef}
        className={classNames(
          styles.wrapper,
          {
            'full-width': fullWidth,
          },
          styles[size],
          className
        )}
        style={{ width }}
      >
        <InputNumber
          placeholder="请填写"
          className={styles.inputNumber}
          {...resProps}
          value={value}
          size={size}
          min={verifyMin}
          max={verifyMax}
          ref={this.input}
          precision={0}
          onChange={val => {
            this.setState({
              value: val,
            });
            if (typeof onChange === 'function') {
              onChange(val);
            }
          }}
        />
        <Button disabled={value <= verifyMin} className={styles.minusBtn} onClick={e => this.handleMinus(e, step)}>
          <Icon type="minus" />
        </Button>
        <Button disabled={value >= verifyMax} className={styles.addBtn} onClick={e => this.handleAdd(e, step)}>
          <Icon type="plus" />
        </Button>
      </div>
    );
  }
}

export default forwardRef((props, ref) => <CountInput {...props} forwardedRef={ref} />);
