import React from 'react';
import { InputNumber, Button } from 'antd';
import 'antd/dist/antd.css';
import styles from './index.css';

console.log(styles)
export default class CountInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  focus = () => this.input.current?.inputNumberRef?.focus();

  blur = () => this.input.current?.inputNumberRef?.blur();

  handleMinus(e, step) {
    const innerInputRef = this.input.current?.inputNumberRef;
    if (innerInputRef) {
      innerInputRef.down(e, step);
      innerInputRef.stop();
    }
  }

  handleAdd(e, step) {
    const innerInputRef = this.input.current?.inputNumberRef;
    console.log(this.input.current)
    if (innerInputRef) {
      innerInputRef.up(e, step);
      innerInputRef.stop();
    }
  }

  render() {
    const { width, step: s, min, max, value, className, ...resProps } = this.props;
    const step = s >= 0 ? Math.ceil(s) : 1;
    const verifyMin = Math.ceil(min >= 0 ? min : 0);
    const verifyMax = max >= 0 ? Math.floor(max) : undefined;
    return (
      <div className={'warraper'} style={{ width }}>
        <InputNumber
          className={'inputNumber'}
          {...resProps}
          value={value}
          min={verifyMin}
          max={verifyMax}
          ref={this.input}
          precision={0}

        />
        <Button disabled={value <= verifyMin} className={'minusBtn'} onClick={e => this.handleMinus(e, step)}>
          -
        </Button>
        <Button disabled={value >= verifyMax} className={'addBtn'} onClick={e => this.handleAdd(e, step)}>
          +
        </Button>
      </div>
    );
  }
}

