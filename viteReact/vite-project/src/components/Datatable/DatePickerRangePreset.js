import { Component } from 'react';
import classNames from 'classnames';
import styles from './search-form.less';

class DatePickerRangePreset extends Component {
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

    const value = props.value || {};
    this.state = {
      value,
    };
  }

  handChange = (e, value) => {
    e.preventDefault();
    this.setState(
      () => ({
        value,
      }),
      () => {
        this.triggerChange(value);
      }
    );
  };

  triggerChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { options, value } = this.props;
    const { value: stateValue } = this.state;
    const val = value === undefined ? stateValue : value;
    const list = options || [];
    return (
      <span className={styles.presetWrapper}>
        {list.map(({ key, text }) => (
          <span
            key={key}
            onClick={e => this.handChange(e, key)}
            className={classNames(styles.preset, {
              'primary-color': val === key,
            })}
          >
            {text}
          </span>
        ))}
      </span>
    );
  }
}

export default DatePickerRangePreset;
