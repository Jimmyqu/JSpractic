import { Select } from 'antd';

export const NoneKey = 0;

export const NoneOption = (
  <Select.Option key={NoneKey} value={NoneKey}>
    无
  </Select.Option>
);
