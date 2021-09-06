import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { Button, Cascader, DatePicker, Input, InputNumber, Select, Upload } from 'antd';
import ethnicList from '@/commons/lib/data/ethnic';
import { cascaderData } from '@/commons/lib/home-town';
import { useUploadImgRequest, useUploadDocRequest } from '@/utils/hooks';
import { FileAccept, fileTransfer } from '@/utils/upload';
import ImageUploader from '../ImageUploader';

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
}

function disabledDateTime() {
  return {
    // 0 -> 60 OK Button is not work
    disabledSeconds: () => range(1, 60),
  };
}

export default forwardRef(({ form, field, className, ...props }, ref) => {
  if (field == null) {
    return null;
  }
  const dispatch = useDispatch();
  // extfield2 是默认加载的模块
  const { ExtDataTypes, InTypes } = useSelector(state => state.extfield2);

  const { extDataType, fieldPlaceholder, optionList, single, readyOnly, hidden } = field;
  // single 改为integer
  const isMulti = single === InTypes.Multi.key;

  // 统一的props
  const itemProps = {
    ...props,
    className: classNames(className, {
      hidden,
    }),
  };
  switch (extDataType) {
    // 1.文本
    // 11.身份证
    case ExtDataTypes.Text.key:
    case ExtDataTypes.IDCard.key:
      return <Input placeholder={fieldPlaceholder || '请填写'} disabled={readyOnly} {...itemProps} ref={ref} />;
    // 2.数字
    case ExtDataTypes.Number.key:
      return (
        <InputNumber
          placeholder={fieldPlaceholder || '请填写'}
          disabled={readyOnly}
          {...itemProps}
          className={classNames(itemProps.className, 'full-width')}
          ref={ref}
        />
      );
    // 3.下拉
    case ExtDataTypes.Select.key:
      return (
        <Select
          placeholder={fieldPlaceholder || '请选择'}
          disabled={readyOnly}
          {...itemProps}
          mode={isMulti ? 'multiple' : undefined}
          ref={ref}
        >
          {optionList?.map(item => (
            <Select.Option key={item.value} value={item.value}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      );
    // 4.图片上传
    case ExtDataTypes.ImgFile.key:
      return (
        <ImageUploader
          disabled={readyOnly}
          {...itemProps}
          // 内部处理
          // fileList={fileTransfer(itemProps.fileList)}
          placeholder={fieldPlaceholder}
          customRequest={useUploadImgRequest({ dispatch })}
          multiple={!single}
          ref={ref}
        />
      );
    // 5.文档
    case ExtDataTypes.DocFile.key:
      return (
        <Upload
          disabled={readyOnly}
          {...itemProps}
          fileList={fileTransfer(itemProps.fileList)}
          accept={FileAccept.DOC}
          customRequest={useUploadDocRequest({ dispatch })}
          multiple={!single}
          ref={ref}
        >
          <Button icon="upload">上传</Button>
          &nbsp;
          {fieldPlaceholder}
          &nbsp; 上传附件格式为：xls,xlsx,ppt,pptx,docx,doc,pdf
        </Upload>
      );
    // 6.及联 // TODO: 待实现
    // 7.文本域
    case ExtDataTypes.TextArea.key:
      return (
        <Input.TextArea
          placeholder={fieldPlaceholder || '请填写'}
          disabled={readyOnly}
          {...itemProps}
          autoSize={{ minRows: 3 }}
          ref={ref}
        />
      );
    // 8.日期
    case ExtDataTypes.Date.key:
      return (
        <DatePicker
          placeholder={fieldPlaceholder || '请选择'}
          disabled={readyOnly}
          {...itemProps}
          className={classNames(itemProps.className, 'full-width')}
          ref={ref}
        />
      );
    // 9.时分
    case ExtDataTypes.HourAndMinute.key:
      return (
        <DatePicker
          placeholder={fieldPlaceholder || '请选择'}
          disabled={readyOnly}
          {...itemProps}
          format="YYYY-MM-DD HH:mm"
          className={classNames(itemProps.className, 'full-width')}
          showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
          disabledTime={disabledDateTime}
          ref={ref}
        />
      );
    // 10.日期时间
    case ExtDataTypes.DateTime.key:
      return (
        <DatePicker
          placeholder={fieldPlaceholder || '请选择'}
          disabled={readyOnly}
          {...itemProps}
          className={classNames(itemProps.className, 'full-width')}
          showTime
          ref={ref}
        />
      );
    // 12.联系人 // TODO: 待实现
    // 13.民族
    case ExtDataTypes.Ethnic.key:
      return (
        <Select
          placeholder={fieldPlaceholder || '请选择'}
          disabled={readyOnly}
          {...itemProps}
          mode={single ? undefined : 'multiple'}
          ref={ref}
        >
          {ethnicList.map(item => (
            <Select.Option key={item.id} value={item.id}>
              {item.text}
            </Select.Option>
          ))}
        </Select>
      );
    // 14.视频 // TODO: 待实现
    // 15.省市区及联
    case ExtDataTypes.Pcd.key:
      return (
        <Cascader
          placeholder={fieldPlaceholder || '请选择省市区'}
          disabled={readyOnly}
          {...itemProps}
          options={cascaderData}
          ref={ref}
        />
      );
    // 16.日期范围
    case ExtDataTypes.DateRange.key:
      return (
        <DatePicker.RangePicker
          placeholder={fieldPlaceholder || '请选择'}
          disabled={readyOnly}
          {...itemProps}
          ref={ref}
        />
      );
    // 17.日期时分范围 // TODO: 待实现
    // 18.时刻范围 // TODO: 待实现
    default:
  }
  return null;
});
