/* eslint-disable max-classes-per-file */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import uniqWith from 'lodash/unionWith';
import { Input, Select, DatePicker, TimePicker, Button, Icon } from 'antd';
import { FIELD_META_PROP } from 'antd/es/form/constants';
import { formatHM } from '@/utils/format';
import { clearHMS, isNumber } from '@/utils/utils';
import DatePickerRangePreset from './DatePickerRangePreset';
import style from './search-form.less';

const { MonthPicker } = DatePicker;

const cascaderLevelPrefix = 'cascader-level-';

export const ItemTypes = {
  Select: 'select',
  DateTypeSelect: 'select-type-select',
  DateTypePicker: 'select-type-picker',
  DatePicker: 'date-picker',
  DatePickerRangePreset: 'date-range-picker-preset',
  DatePickerRangeStart: 'date-range-picker-start',
  DatePickerRangeEnd: 'date-range-picker-end',
  TimePickerRangeStart: 'time-range-picker-start',
  TimePickerRangeEnd: 'time-range-picker-end',

  TimePickerRangeStart2: 'time-range-picker-start-2',
  TimePickerRangeEnd2: 'time-range-picker-end-2',

  // 之所以不直接使用Cascader是因为搜索的位置可能需要不选子项来过滤出想要的数据, 暂支持3级
  CascaderLevels: Array.from({ length: 3 })
    .fill({})
    .map((_, i) => `${cascaderLevelPrefix}${i}`),

  CascaderVenue: 'cascader-venue',
  CascaderProfessional: 'cascader-professional',
  CascaderPlatform: 'cascader-platform',
  CascaderServiceUser: 'cascader-service-user',
};

@connect(({ venue }) => ({
  venue,
}))
class Item extends Component {
  defaultMinuteStep = 15;

  static contextTypes = {
    getComposeFieldByType: PropTypes.func,
  };

  state = {
    // 内部的open控制，不和composeStateMapping关联，除非功能需要，则挪出去
    open: false,
  };

  componentDidMount() {
    const { type, name, id, initialValue } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const meta = this.props[FIELD_META_PROP];
    // 这里初始化initialValue是为了避免在form里配置了一次initialValue还得在<Item></Item>上再配置一次initialValue才能正常初始化默认值的问题
    const formName = name || id;
    const firstValue = initialValue == null ? meta.initialValue : initialValue;
    if (firstValue == null) {
      return;
    }
    switch (type) {
      case ItemTypes.DatePickerRangeStart:
        this.onStartChange(formName, clearHMS(firstValue));
        break;
      case ItemTypes.TimePickerRangeStart:
      case ItemTypes.TimePickerRangeStart2:
        this.onStartChange(formName, firstValue);
        break;
      case ItemTypes.DatePickerRangeEnd:
        this.onEndChange(formName, clearHMS(firstValue));
        break;
      case ItemTypes.TimePickerRangeEnd:
      case ItemTypes.TimePickerRangeEnd2:
        this.onEndChange(formName, firstValue);
        break;
      case ItemTypes.DatePickerRangePreset:
        this.onPresetChange(formName, firstValue);
        break;
      case ItemTypes.CascaderVenue:
        this.onVenueChange(formName, firstValue, true);
        break;
      case ItemTypes.CascaderProfessional:
        // 由于默认运动类型的是由场馆列表加载出来的，可能会延迟给initialValue赋值，所以componentDidMount初始化可能不会执行
        this.onProfessionalChange(formName, firstValue);
        break;
      case ItemTypes.CascaderPlatform:
        // 由于默认场地列表的是由场馆列表加载出来的，可能会延迟给initialValue赋值，所以componentDidMount初始化可能不会执行
        this.onPlatformChange(formName, firstValue);
        break;
      case ItemTypes.CascaderServiceUser:
        // 由于默认场地列表的是由场馆列表加载出来的，可能会延迟给initialValue赋值，所以componentDidMount初始化可能不会执行
        this.onServiceUserChange(formName, firstValue);
        break;
      default:
        if (ItemTypes.CascaderLevels.includes(type)) {
          const level = Number(type.replace(cascaderLevelPrefix, ''));
          this.onCascaderLevelChange(formName, firstValue, level);
        }
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { initialValue, composeStateMapping, type, name, id, compose } = this.props;
    const { initialValue: nextInitialValue } = nextProps;
    const { professionalValue } = composeStateMapping[compose] || {};
    if (nextInitialValue && initialValue == null) {
      switch (type) {
        case ItemTypes.CascaderProfessional:
          // 由于默认运动类型的是由场馆列表加载出来的，可能会延迟给initialValue赋值，所以componentDidMount对Professional的初始化可能不会执行
          // professionalValue不为空表示已经手动修改过了，不需要再在这里辅助初始化
          // // eslint-disable-next-line react/destructuring-assignment
          // const meta = this.props[FIELD_META_PROP];
          // const firstValue = initialValue == null ? meta.initialValue : initialValue;
          // eslint-disable-next-line react/destructuring-assignment
          // const nextMeta = nextProps[FIELD_META_PROP];
          // const nextFirstValue = nextInitialValue == null ? nextMeta.initialValue : nextInitialValue;
          if (professionalValue == null) {
            // 这里初始化initialValue是为了避免在form里配置了一次initialValue还得在<Item></Item>上再配置一次initialValue才能正常初始化默认值的问题
            const formName = name || id;
            this.onProfessionalChange(formName, nextInitialValue);
          }
          break;
        // 理论上不会配置默认值
        // case ItemTypes.CascaderPlatform:
        //   // 由于默认场地列表的是由场馆列表加载出来的，可能会延迟给initialValue赋值，所以componentDidMount对platform的初始化可能不会执行
        //   // professionalValue不为空表示已经手动修改过了，不需要再在这里辅助初始化
        //   // // eslint-disable-next-line react/destructuring-assignment
        //   // const meta = this.props[FIELD_META_PROP];
        //   // const firstValue = initialValue == null ? meta.initialValue : initialValue;
        //   // eslint-disable-next-line react/destructuring-assignment
        //   // const nextMeta = nextProps[FIELD_META_PROP];
        //   // const nextFirstValue = nextInitialValue == null ? nextMeta.initialValue : nextInitialValue;
        //   if (platformValue == null) {
        //     // 这里初始化initialValue是为了避免在form里配置了一次initialValue还得在<Item></Item>上再配置一次initialValue才能正常初始化默认值的问题
        //     const formName = name || id;
        //     this.onPlatformChange(formName, nextInitialValue);
        //   }
        //   break;
        default:
      }
    }
  }

  onRangePickerChange = (field, name, value) => {
    this.setStateChange(
      {
        [field]: value,
      },
      name,
      value
    );
  };

  // 集联时按level存的mapping
  onCascaderLevelChange = (name, value, level) => {
    const {
      composeStateMapping,
      options,
      optionsFilter = () => true,
      optionsMapper = item => item,
      compose,
    } = this.props;
    const cascaderLevelStates = { ...composeStateMapping[compose] };
    const { levelOptions } = cascaderLevelStates[level] || {};
    for (let l = level; l < ItemTypes.CascaderLevels.length; l += 1) {
      const cascaderLevelState = cascaderLevelStates[l] || {};
      cascaderLevelStates[l] = {
        ...cascaderLevelState,
        value: l === level ? value : null, // 清空后代的值，写null而不是undefined是为了给后面识别不要使用默认值
        levelOptions: l === level ? cascaderLevelState.levelOptions : undefined, // 清空选项后代的值
      };
    }
    // 补充下一个后代的options
    if (value != null && value !== '' && level + 1 < ItemTypes.CascaderLevels.length) {
      const currentOptions = options || levelOptions || [];
      cascaderLevelStates[level + 1].levelOptions =
        (
          currentOptions
            .filter(optionsFilter)
            .map(optionsMapper)
            .find(item => item.key === value) || {}
        ).subOptions || [];
    }
    this.setStateChange(cascaderLevelStates, name, value);
  };

  onStartChange = (name, value, preset) => {
    this.onRangePickerChange('startValue', name, value);
    if (!preset) {
      return;
    }
    this.resetPreset();
  };

  onEndChange = (name, value, preset) => {
    this.onRangePickerChange('endValue', name, value);
    if (!preset) {
      return;
    }
    this.resetPreset();
  };

  setStateChange(obj, name, value, fromOther) {
    const { handleComposeStateChange, form, onChange, compose } = this.props;
    if (name) {
      form.setFieldsValue({
        [name]: value,
      });
    }
    if (handleComposeStateChange) {
      handleComposeStateChange(obj, compose);
    }
    if (fromOther) {
      return;
    }
    if (typeof onChange === 'function') {
      onChange(value);
    }
  }

  buildStepList = stepReferDateByValue => {
    const { minuteStep = this.defaultMinuteStep, min, max, stepReferDate } = this.props;
    const now = Date.now();
    // list 参考日期，需要与逻辑处使用同一天，避免初始值无法匹配的问题
    let referDate = stepReferDate || stepReferDateByValue;
    // stepReferDate没提供的话就参考min或者max，理论上它们是同一天
    if (referDate == null) {
      referDate = now;
      if (min != null) {
        referDate = min;
      } else if (max != null) {
        referDate = max;
      }
    }

    const startMmt =
      min == null
        ? clearHMS(referDate)
        : clearHMS(referDate)
            .hour(min.hours())
            .minute(min.minutes())
            .second(min.seconds())
            .millisecond(min.milliseconds());

    const endMmt =
      max == null
        ? clearHMS(referDate).add(1, 'days')
        : clearHMS(referDate)
            .hour(max.hours())
            .minute(max.minutes())
            .second(max.seconds())
            .millisecond(max.milliseconds());

    const list = [];
    const startTime = startMmt.valueOf();
    const endTime = endMmt.valueOf();
    let temp = startTime;

    const loop = [];
    if (isNumber(minuteStep)) {
      loop.push({
        startTime,
        endTime,
        step: minuteStep,
      });
    } else if (Array.isArray(minuteStep)) {
      loop.push(
        ...minuteStep.map(({ startTime: f, endTime: t, step: s }) => {
          const from = moment(f);
          const stepFrom = clearHMS(referDate)
            .hour(from.hours())
            .minute(from.minutes())
            .second(from.seconds())
            .millisecond(from.milliseconds());

          const to = moment(t);
          const stepTo = clearHMS(referDate)
            .hour(to.hours())
            .minute(to.minutes())
            .second(to.seconds())
            .millisecond(to.milliseconds());
          return {
            startTime: stepFrom.valueOf(),
            endTime: stepTo.valueOf(),
            step: s,
          };
        })
      );
    }

    loop.forEach(({ startTime: from, endTime: to, step: s }) => {
      temp = from;
      const last = list[list.length - 1];
      if (last == null || last.key !== temp) {
        list.push({
          key: temp,
          value: formatHM(temp),
        });
      }
      do {
        temp += (s || this.defaultMinuteStep) * 60 * 1000;
        list.push({
          key: temp,
          value: formatHM(temp), // 上面默认了24点
        });
      } while (temp < to);
    });

    if (list.length > 1) {
      // 如果只有一个是0点不用替换所以大于1
      const last = list[list.length - 1];
      // 最后一个是0点
      if (last.key === clearHMS(referDate).add(1, 'days').valueOf()) {
        list[list.length - 1] = {
          ...last,
          value: '24:00',
        };
      }
    }
    return list;
  };

  resetPreset = () => {
    const { compose } = this.props;
    const { getComposeFieldByType } = this.context;
    // SearchForm 提供，外置使用自行提供
    if (getComposeFieldByType == null) {
      return;
    }
    const field = getComposeFieldByType(ItemTypes.DatePickerRangePreset, compose);
    if (field) {
      this.onPresetChange(field.name);
    }
  };

  onPresetChange = (name, value, self) => {
    this.setStateChange(
      {
        presetValue: value,
      },
      name,
      value,
      true
    );
    if (!self) {
      return;
    }
    const { form, compose } = this.props;
    const { getComposeFieldByType } = this.context;
    const startField = getComposeFieldByType(ItemTypes.DatePickerRangeStart, compose);
    const endField = getComposeFieldByType(ItemTypes.DatePickerRangeEnd, compose);

    let startValue;
    let endValue;
    const now = moment();
    const weekOfday = now.format('E');
    const monthOfday = now.format('D');

    const startNowValue = startField ? form.getFieldValue(startField.name) : null;
    const endNowValue = endField ? form.getFieldValue(endField.name) : null;
    switch (value) {
      case 1:
        // eslint-disable-next-line no-case-declarations
        let refDay = now;
        if (
          (startNowValue == null && endNowValue == null) ||
          (startNowValue ? startNowValue.valueOf() : Number.NaN) === (endNowValue ? endNowValue.valueOf() : Number.NaN)
        ) {
          refDay = startNowValue || now;
        }
        // eslint-disable-next-line no-case-declarations
        const prevDay = clearHMS(refDay).clone().subtract(1, 'days');
        startValue = prevDay;
        endValue = prevDay;
        break;
      case 2:
        // eslint-disable-next-line no-case-declarations
        let refDay2 = now;
        if (
          (startNowValue == null && endNowValue == null) ||
          (startNowValue ? startNowValue.valueOf() : Number.NaN) === (endNowValue ? endNowValue.valueOf() : Number.NaN)
        ) {
          refDay2 = startNowValue || now;
        }
        // eslint-disable-next-line no-case-declarations
        const nextDay = clearHMS(refDay2).clone().add(1, 'days');
        startValue = nextDay;
        endValue = nextDay;
        break;
      case 3:
        // eslint-disable-next-line no-case-declarations
        const tomorrow = clearHMS(now).clone().subtract(1, 'days');
        startValue = tomorrow;
        endValue = tomorrow;
        break;
      case 4:
        startValue = clearHMS(now);
        endValue = clearHMS(now);
        break;
      case 5:
        startValue = clearHMS(now).subtract(weekOfday - 1, 'days');
        endValue = startValue.clone().add(7, 'days').subtract(1, 'days');
        break;
      case 6:
        startValue = clearHMS(now).subtract(monthOfday - 1, 'days');
        endValue = startValue.clone().add(1, 'month').subtract(1, 'days');
        break;
      default:
        return;
    }
    if (startField && startValue) {
      this.onStartChange(startField.name, startValue);
    }
    if (endField && endValue) {
      this.onEndChange(endField.name, endValue);
    }
  };

  onVenueChange = (name, value, init) => {
    this.setStateChange(
      {
        venueValue: value,
      },
      name,
      value
    );
    const { dispatch, professionalFieldName, platformFieldName, serviceUserFieldName } = this.props;
    let newProfessionalValue = [];
    if (professionalFieldName) {
      if (!init) {
        (value || []).forEach(salesId => {
          dispatch({
            type: 'venue/getItem',
            payload: salesId,
          });
        });
      }
      newProfessionalValue = this.flushProfessionalValue(value);
    }
    if (platformFieldName) {
      (value || []).forEach(salesId => {
        dispatch({
          type: 'venue/fetchPlatformList',
          payload: salesId,
        });
      });
      this.flushPlatformValue(value, newProfessionalValue);
    }
    if (serviceUserFieldName) {
      (value || []).forEach(salesId => {
        dispatch({
          type: 'venue/fetchServiceUserList',
          payload: salesId,
        });
      });
      this.flushServiceUser(value, newProfessionalValue);
    }
  };

  flushProfessionalValue = venueValue => {
    const {
      professionalFieldName,
      compose,
      composeStateMapping,
      venue: { itemListCache },
    } = this.props;
    const { venueValue: stateVenueValue, professionalValue = [] } = composeStateMapping[compose] || {};
    const targetVenueValue = venueValue || stateVenueValue || [];
    const itemList = uniqWith(
      targetVenueValue.reduce((prev, current) => [...prev, ...(itemListCache[current] || [])], []),
      (a, b) => a.itemId === b.itemId
    );
    const pv = professionalValue.filter(id => itemList.some(item => item.itemId === id));
    this.onProfessionalChange(professionalFieldName, pv, true, venueValue);
    return pv;
  };

  onProfessionalChange = (name, value, fromOther, venueValue) => {
    this.setStateChange(
      {
        professionalValue: value,
      },
      name,
      value,
      fromOther
    );

    if (fromOther) {
      return;
    }

    const { platformFieldName, serviceUserFieldName } = this.props;
    if (platformFieldName) {
      this.flushPlatformValue(venueValue, value);
    }
    if (serviceUserFieldName) {
      this.flushServiceUser(venueValue, value);
    }
  };

  flushPlatformValue = (venueValue, professionalValue) => {
    const {
      composeStateMapping,
      compose,
      platformFieldName,
      venue: { platformListMapping },
    } = this.props;
    const {
      venueValue: stateVenueValue,
      professionalValue: stateProfessionalValue,
      platformValue = [],
    } = composeStateMapping[compose] || {};

    const targetVenueValue = venueValue || stateVenueValue || [];
    const targetProfessionalValue = professionalValue || stateProfessionalValue || [];
    const platformList = uniqWith(
      targetVenueValue.reduce((prev, current) => [...prev, ...(platformListMapping[current] || [])], []),
      (a, b) => a.id === b.id
    ).filter(item =>
      Array.isArray(targetProfessionalValue) && targetProfessionalValue.length > 0
        ? targetProfessionalValue.includes(item.professionalId)
        : true
    );
    const pv = platformValue.filter(id => platformList.some(item => item.id === id));
    this.onPlatformChange(platformFieldName, pv, true);
  };

  onPlatformChange = (name, value, fromOther) => {
    this.setStateChange(
      {
        platformValue: value,
      },
      name,
      value,
      fromOther
    );
  };

  flushServiceUser = (venueValue, professionalValue) => {
    const {
      composeStateMapping,
      compose,
      serviceUserFieldName,
      venue: { serviceUserListMapping },
    } = this.props;
    const {
      venueValue: stateVenueValue,
      professionalValue: stateProfessionalValue,
      serviceUserValue = [],
    } = composeStateMapping[compose] || {};

    const targetVenueValue = venueValue || stateVenueValue || [];
    const targetProfessionalValue = professionalValue || stateProfessionalValue || [];
    const serviceUserList = uniqWith(
      targetVenueValue.reduce((prev, current) => [...prev, ...(serviceUserListMapping[current] || [])], []),
      (a, b) => a.platformUserId === b.platformUserId
    ).filter(item =>
      Array.isArray(targetProfessionalValue) && targetProfessionalValue.length > 0
        ? targetProfessionalValue.includes(item.professionalId)
        : true
    );
    const pv = serviceUserValue.filter(id => serviceUserList.some(item => item.platformUserId === id));
    this.onServiceUserChange(serviceUserFieldName, pv, true);
  };

  onServiceUserChange = (name, value, fromOther) => {
    this.setStateChange(
      {
        serviceUserValue: value,
      },
      name,
      value,
      fromOther
    );
  };

  disabledDate = value => {
    if (value == null) {
      return false;
    }
    const { min, max, disabledDate } = this.props;
    if (typeof disabledDate === 'function' && disabledDate(value)) {
      return true;
    }
    if (min == null && max == null) {
      return false;
    }
    const long = clearHMS(moment(value.valueOf())).valueOf();
    return (min && long < clearHMS(min).valueOf()) || (max && long > clearHMS(max).valueOf());
  };

  disabledStartDate = value => {
    const startValue = value == null ? null : clearHMS(value);
    const { composeStateMapping = {}, compose } = this.props;
    const { endValue } = composeStateMapping[compose] || {};
    if (this.disabledDate(startValue)) {
      return true;
    }
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = value => {
    const endValue = value == null ? null : clearHMS(value);
    const { composeStateMapping = {}, compose } = this.props;
    const { startValue } = composeStateMapping[compose] || {};
    if (this.disabledDate(endValue)) {
      return true;
    }
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() < startValue.valueOf();
  };

  disabledStartTimeHours = () => {
    const { composeStateMapping = {}, min, compose } = this.props;
    const { endValue } = composeStateMapping[compose] || {};
    const minHour = min ? min.hours() : -1; // 比0小的
    const maxHour = endValue ? endValue.hours() : 24; // 比23大的
    return Array.from({ length: 24 }, (v, k) => k).filter(hour => hour < minHour || hour > maxHour);
  };

  disabledEndTimeHours = () => {
    const { composeStateMapping = {}, max, compose } = this.props;
    const { startValue } = composeStateMapping[compose] || {};
    const minHour = startValue ? startValue.hours() : -1; // 比0小的
    const maxHour = max ? max.hours() : 24; // 比23大的
    return Array.from({ length: 24 }, (v, k) => k).filter(hour => hour < minHour || hour > maxHour);
  };

  disabledStartTimeMinutes = startSelectedHour => {
    const { composeStateMapping = {}, min, compose } = this.props;
    const { endValue } = composeStateMapping[compose] || {};
    const minMinutes = min && startSelectedHour <= min.hours() ? min.minutes() : -1; // 比0小的
    const maxMinutes = endValue && startSelectedHour >= endValue.hours() ? endValue.minutes() : 60; // 比59大的
    return Array.from({ length: 60 }, (v, k) => k).filter(minutes => minutes < minMinutes || minutes > maxMinutes);
  };

  disabledEndTimeMinutes = endSelectedHour => {
    const { composeStateMapping = {}, max, compose } = this.props;
    const { startValue } = composeStateMapping[compose] || {};
    const minMinutes = startValue && endSelectedHour <= startValue.hours() ? startValue.minutes() : -1; // 比0小的
    const maxMinutes = max && endSelectedHour >= max.hours() ? max.minutes() : 60; // 比59大的
    return Array.from({ length: 60 }, (v, k) => k).filter(minutes => minutes < minMinutes || minutes > maxMinutes);
  };

  disabledStartTimeSeconds = () => {
    // TODO 待实现 console.log(selectedHour, selectedMinute);
    return [];
  };

  disabledEndTimeSeconds = () => {
    // TODO 待实现 console.log(selectedHour, selectedMinute);
    return [];
  };

  handleOpenChange = open => {
    this.setState({
      open,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handlerDateTypeChange = (value, option) => {
    const { form, onChange, childName } = this.props;
    form.setFieldsValue({
      [childName]: undefined,
    });
    if (onChange) {
      onChange(value, option);
    }
  };

  render() {
    const {
      type,
      options,
      optionAll = true,
      label,
      name,
      id,
      defHidden,
      compose,
      composeStateMapping = {},
      handleComposeStateChange,
      form,
      initialValue,
      min,
      max,
      optionsFilter = () => true,
      optionsMapper = item => item,
      // [FIELD_META_PROP]: meta, // 这种方式突然就不行了
      searchFieldRender,
      childName,
      parentName,
      fields,
      professionalFieldName,
      platformFieldName,
      serviceUserFieldName,
      venue: { listAndOther, itemListCache, platformListMapping, serviceUserListMapping },
      dispatch,
      ...props
    } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const meta = this.props[FIELD_META_PROP];

    const formName = name || id;
    const firstValue = initialValue == null ? meta.initialValue : initialValue;
    // 集联时按level存的mapping
    const composeState = composeStateMapping[compose] || {};
    const { startValue, endValue, presetValue, venueValue, professionalValue, platformValue, serviceUserValue } =
      composeState;
    const { open } = this.state;
    // 前置追加
    const prefix = optionAll
      ? [
          {
            key: '',
            text: '全部',
          },
        ]
      : [];
    const multiplePrefix = props.mode === 'multiple' ? [] : prefix;
    switch (type) {
      case ItemTypes.TimePickerRangeStart2:
        return (
          <Select
            placeholder="请选择"
            allowClear
            suffixIcon={<Icon type="clock-circle" theme="outlined" />}
            {...props}
            onChange={ev => this.onStartChange(formName, ev)}
          >
            {this.buildStepList(startValue || endValue)
              .filter(item => (endValue ? item.key < endValue : true))
              .map(item => (
                <Select.Option value={item.key} key={item.key}>
                  {item.value}
                </Select.Option>
              ))}
          </Select>
        );
      case ItemTypes.TimePickerRangeEnd2:
        return (
          <Select
            placeholder="请选择"
            allowClear
            suffixIcon={<Icon type="clock-circle" theme="outlined" />}
            {...props}
            onChange={ev => this.onEndChange(formName, ev)}
          >
            {this.buildStepList(startValue || endValue)
              .filter(item => (startValue ? item.key > startValue : true))
              .map(item => (
                <Select.Option value={item.key} key={item.key}>
                  {item.value}
                </Select.Option>
              ))}
          </Select>
        );
      case ItemTypes.CascaderVenue:
        return (
          <Select placeholder="请选择" {...props} onChange={value => this.onVenueChange(formName, value)}>
            {/** 不能通过 options 指定 */}
            {[
              ...multiplePrefix,
              ...(listAndOther || []).filter(optionsFilter).map(item => ({
                key: item.id,
                text: item.salesName,
              })),
            ]
              // .map(optionsMapper)
              .map(option => (
                <Select.Option key={option.key} value={option.key}>
                  {option.text}
                </Select.Option>
              ))}
          </Select>
        );
      case ItemTypes.CascaderProfessional:
        // eslint-disable-next-line no-case-declarations
        const itemList = uniqWith(
          (venueValue || []).reduce((prev, current) => [...prev, ...(itemListCache[current] || [])], []),
          (a, b) => a.itemId === b.itemId
        );
        return (
          <Select
            placeholder="请选择"
            {...props}
            value={
              // eslint-disable-next-line unicorn/no-nested-ternary
              professionalValue === undefined ? firstValue : professionalValue == null ? undefined : professionalValue
            }
            onChange={value => this.onProfessionalChange(formName, value)}
          >
            {/** 不能通过 options 指定  */}
            {[
              ...multiplePrefix,
              ...itemList.filter(optionsFilter).map(item => ({
                key: item.itemId,
                text: item.itemIdValue,
              })),
            ]
              // .map(optionsMapper)
              .map(option => (
                <Select.Option key={option.key} value={option.key}>
                  {option.text}
                </Select.Option>
              ))}
          </Select>
        );
      case ItemTypes.CascaderPlatform:
        // eslint-disable-next-line no-case-declarations
        const platformList = uniqWith(
          (venueValue || []).reduce((prev, current) => [...prev, ...(platformListMapping[current] || [])], []),
          (a, b) => a.id === b.id
        ).filter(item =>
          Array.isArray(professionalValue) && professionalValue.length > 0
            ? professionalValue.includes(item.professionalId)
            : true
        );
        return (
          <Select
            placeholder="请选择"
            {...props}
            value={platformValue}
            onChange={value => this.onPlatformChange(formName, value)}
          >
            {/** 不能通过 options 指定  */}
            {[
              ...multiplePrefix,
              ...platformList.filter(optionsFilter).map(item => ({
                key: item.id,
                text: `${item.parentPlatformName || ''}${item.parentPlatformName ? '-' : ''}${item.platformName}`,
              })),
            ]
              // .map(optionsMapper)
              .map(option => (
                <Select.Option key={option.key} value={option.key}>
                  {option.text}
                </Select.Option>
              ))}
          </Select>
        );
      case ItemTypes.CascaderServiceUser:
        // eslint-disable-next-line no-case-declarations
        const serviceUserList = uniqWith(
          (venueValue || []).reduce((prev, current) => [...prev, ...(serviceUserListMapping[current] || [])], []),
          (a, b) => a.platformUserId === b.platformUserId
        ).filter(item =>
          Array.isArray(professionalValue) && professionalValue.length > 0
            ? professionalValue.includes(item.professionalId)
            : true
        );
        return (
          <Select
            placeholder="请选择"
            {...props}
            value={serviceUserValue}
            onChange={value => this.onServiceUserChange(formName, value)}
          >
            {/** 不能通过 options 指定  */}
            {[
              ...multiplePrefix,
              ...serviceUserList.filter(optionsFilter).map(item => ({
                key: item.platformUserId,
                text: item.realName,
              })),
            ]
              // .map(optionsMapper)
              .map(option => (
                <Select.Option key={option.key} value={option.key}>
                  {option.text}
                </Select.Option>
              ))}
          </Select>
        );
      case ItemTypes.Select:
        return (
          <Select placeholder="请选择" {...props}>
            {/* 多选时没有全部 */}
            {[...multiplePrefix, ...(options || []).filter(optionsFilter).map(optionsMapper)].map(option => (
              <Select.Option key={option.key} value={option.key}>
                {option.text}
              </Select.Option>
            ))}
          </Select>
        );
      case ItemTypes.DateTypeSelect:
        return (
          <Select placeholder="请选择" {...props} onChange={this.handlerDateTypeChange}>
            {/* 没有全部 */}
            <Select.Option value={0}>按日期</Select.Option>
            <Select.Option value={1}>按月份</Select.Option>
            <Select.Option value={2}>按年份</Select.Option>
          </Select>
        );
      case ItemTypes.DateTypePicker:
        switch (form.getFieldValue(parentName)) {
          case 0:
            return <DatePicker placeholder="请选择" {...props} disabledDate={this.disabledDate} />;
          case 1:
            return <MonthPicker placeholder="请选择" {...props} disabledDate={this.disabledDate} />;
          case 2:
            return (
              <Select placeholder="请选择" {...props}>
                {[2016, 2017, 2018].map(year => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            );
          default:
            return <Input placeholder="请先选择时间类型" {...props} disabled />;
        }
      case ItemTypes.DatePicker:
        return <DatePicker placeholder="请选择" {...props} disabledDate={this.disabledDate} />;
      case ItemTypes.DatePickerRangePreset:
        return (
          <DatePickerRangePreset
            options={[
              {
                key: 1,
                text: '上一天',
              },
              {
                key: 2,
                text: '下一天',
              },
              {
                key: 3,
                text: '昨天',
              },
              {
                key: 4,
                text: '今天',
              },
              {
                key: 5,
                text: '本周',
              },
              {
                key: 6,
                text: '本月',
              },
            ]}
            {...props}
            // eslint-disable-next-line unicorn/no-nested-ternary
            value={presetValue === undefined ? firstValue : presetValue == null ? undefined : presetValue}
            onChange={sv => this.onPresetChange(formName, sv, true)}
          />
        );
      case ItemTypes.DatePickerRangeStart:
        return (
          <DatePicker
            placeholder="请选择"
            {...props}
            showToday={false}
            // eslint-disable-next-line unicorn/no-nested-ternary
            value={startValue === undefined ? firstValue : startValue == null ? undefined : startValue}
            disabledDate={this.disabledStartDate}
            onChange={sv => this.onStartChange(formName, sv == null ? null : clearHMS(sv), true)}
          />
        );
      case ItemTypes.DatePickerRangeEnd:
        return (
          <DatePicker
            placeholder="请选择"
            {...props}
            showToday={false}
            // eslint-disable-next-line unicorn/no-nested-ternary
            value={endValue === undefined ? firstValue : endValue == null ? undefined : endValue}
            disabledDate={this.disabledEndDate}
            onChange={ev => this.onEndChange(formName, ev == null ? null : clearHMS(ev), true)}
          />
        );
      case ItemTypes.TimePickerRangeStart:
        return (
          <TimePicker
            placeholder="请选择"
            hideDisabledOptions
            popupClassName={style.timepickerPopup}
            {...props}
            open={open}
            onOpenChange={this.handleOpenChange}
            // eslint-disable-next-line unicorn/no-nested-ternary
            value={startValue === undefined ? firstValue : startValue == null ? undefined : startValue}
            defaultOpenValue={min}
            disabledHours={this.disabledStartTimeHours}
            disabledMinutes={this.disabledStartTimeMinutes}
            disabledSeconds={this.disabledStartTimeSeconds}
            onChange={ev => this.onStartChange(formName, ev)}
            addon={() => (
              <Button size="small" type="primary" onClick={this.handleClose}>
                Ok
              </Button>
            )}
          />
        );
      case ItemTypes.TimePickerRangeEnd:
        return (
          <TimePicker
            placeholder="请选择"
            hideDisabledOptions
            popupClassName={style.timepickerPopup}
            {...props}
            open={open}
            onOpenChange={this.handleOpenChange}
            // eslint-disable-next-line unicorn/no-nested-ternary
            value={endValue === undefined ? firstValue : endValue == null ? undefined : endValue}
            defaultOpenValue={max}
            disabledHours={this.disabledEndTimeHours}
            disabledMinutes={this.disabledEndTimeMinutes}
            disabledSeconds={this.disabledEndTimeSeconds}
            onChange={ev => this.onEndChange(formName, ev)}
            addon={() => (
              <Button size="small" type="primary" onClick={this.handleClose}>
                Ok
              </Button>
            )}
          />
        );
      default:
        if (ItemTypes.CascaderLevels.includes(type)) {
          const level = Number(type.replace(cascaderLevelPrefix, ''));
          // 集联时按level存的mapping
          const { levelOptions, value } = composeState[level] || {};
          return (
            // 优先options
            <Select
              placeholder="请选择"
              {...props}
              mode={undefined} // 不允许多选
              // eslint-disable-next-line unicorn/no-nested-ternary
              value={value === undefined ? firstValue : value == null ? undefined : value}
              onChange={v => this.onCascaderLevelChange(formName, v, level)}
            >
              {[...prefix, ...(options || levelOptions || []).filter(optionsFilter).map(optionsMapper)].map(option => (
                <Select.Option key={option.key} value={option.key}>
                  {option.text}
                </Select.Option>
              ))}
            </Select>
          );
        }
        return <Input placeholder="请填写" {...props} />;
    }
  }
}

// why ItemWrapper? https://github.com/react-component/form/issues/287
// export default Item;

// eslint-disable-next-line react/prefer-stateless-function
export default class ItemWrapper extends Component {
  render() {
    const { children, ...props } = this.props;
    return <Item {...props}>{children}</Item>;
  }
}

/**
 * 生成ComposeStateChangeHandler函数处理更新composeStateMapping, 适用于this.setState
 */
export function genClassComposeStateChangeHandler(key = 'composeStateMapping') {
  // eslint-disable-next-line unicorn/no-this-assignment
  const that = this;
  return (obj, compose) => {
    if (compose == null) {
      return;
    }
    // 使用函数方式setState, 兼容初始化值并发修改
    that.setState(({ [key]: composeStateMapping }) => ({
      [key]: {
        ...composeStateMapping,
        [compose]: {
          ...composeStateMapping[compose],
          ...obj,
        },
      },
    }));
  };
}
