import { Form, Select } from 'antd';
import { formItemLayoutFull } from '@/utils/utils';
import { NoneOption, NoneKey } from '../../utils';

function AttrForm({ form, floorList, areaList, levelList, imgFileUploading, editing, disabled }) {
  return (
    <Form {...formItemLayoutFull}>
      <Form.Item label="楼层">
        {form.getFieldDecorator('floorCategoryId', {
          initialValue: NoneKey,
        })(
          <Select placeholder="请选择" disabled={disabled || imgFileUploading || editing}>
            {NoneOption}
            {floorList.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.categoryName}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="区域">
        {form.getFieldDecorator('areaCategoryId', {
          initialValue: NoneKey,
        })(
          <Select placeholder="请选择" disabled={disabled || imgFileUploading || editing}>
            {NoneOption}
            {areaList.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.categoryName}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="等级">
        {form.getFieldDecorator('levelCategoryId', {
          initialValue: NoneKey,
        })(
          <Select placeholder="请选择" disabled={disabled || imgFileUploading || editing}>
            {NoneOption}
            {levelList.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.categoryName}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Form>
  );
}

export default AttrForm;
