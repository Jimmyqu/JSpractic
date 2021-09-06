import { useState, useEffect, forwardRef } from 'react';
import { ChromePicker } from 'react-color';
import { Popover } from 'antd';
import styles from './color-picker.less';

const Transparent = 'transparent';

function ColorPicker({ value, onChange = () => {}, disabled }, ref) {
  const [stateColor, setstateColor] = useState(value || Transparent);

  useEffect(() => {
    setstateColor(value || Transparent);
  }, [value]);

  const block = (
    <div
      ref={ref}
      className={styles.picker}
      style={{ background: stateColor === Transparent ? undefined : stateColor }}
    />
  );

  if (disabled) {
    return block;
  }

  return (
    <Popover
      content={
        <div className={styles.popoverContent}>
          <ChromePicker
            color={stateColor}
            onChange={color => {
              setstateColor(color.hex);
              onChange(color.hex);
            }}
            // onChangeComplete={color => {
            //   //
            // }}
          />
        </div>
      }
      trigger="click"
    >
      {block}
    </Popover>
  );
}

ColorPicker.Transparent = Transparent;

export default forwardRef(ColorPicker);
