import { useSelector } from 'react-redux';
import MarginBar from '@/components/MarginBar';
import { formatDate, formatDateHM, formatDateTime, formatEthnic, formatHomeTown } from '@/utils/format';
import ImageUploader from '../ImageUploader';

export default ({ field, value: v }) => {
  const { ExtDataTypes, VolatileValueTypeKeys } = useSelector(state => state.extfield2);
  const { extDataType, extValue, optionList } = field;
  const value = v == null ? extValue : v;
  if (value == null || value === '') {
    return null;
  }
  // 对于支持单个值又可以支持多个值的，统一多值处理的类型，本身只支持单个值，和只支持多个值的之外的那些
  // 但是如果不是多直数组，属于意外值，忽略它
  if (VolatileValueTypeKeys.includes(extDataType) && !Array.isArray(value)) {
    return null;
  }
  switch (extDataType) {
    // 3.下拉
    case ExtDataTypes.Select.key:
      return value.map(val => optionList?.find(item => item.value === val)?.name).join('; ');
    // 4.图片上传
    case ExtDataTypes.ImgFile.key:
      if (value.length === 0) {
        return null;
      }
      return <ImageUploader disabled fileList={value} />;
    // 5.文档
    // 14.视频
    case ExtDataTypes.DocFile.key:
    case ExtDataTypes.VideoFile.key:
      return value?.map(file => (
        <MarginBar key={file.fileKey || file.uid} right inline>
          <a href={file.url}>{file.fileName || file.name}</a>
        </MarginBar>
      ));
    // 6.及联 // TODO: 待实现
    // 8.日期
    case ExtDataTypes.Date.key:
      return formatDate(value);
    // 9.时分
    case ExtDataTypes.HourAndMinute.key:
      return formatDateHM(value);
    // 10.日期时间
    case ExtDataTypes.DateTime.key:
      return formatDateTime(value);
    // 12.联系人 // TODO: 待实现
    // 13.民族
    case ExtDataTypes.Ethnic.key:
      return formatEthnic(value);
    // return value?.map(key => fileCacheByKeyMapping[key]);
    // 15.省市区及联
    case ExtDataTypes.Pcd.key:
      return value?.map(formatHomeTown).join('/');
    // 16.日期范围
    case ExtDataTypes.DateRange.key:
      return value?.map(formatDate).join('至');
    // 17.日期时分范围
    case ExtDataTypes.HourAndMinuteRange.key:
      return value?.map(formatDateHM).join('至');
    // 18.时刻范围
    case ExtDataTypes.DateTimeRange.key:
      return value?.map(formatDateTime).join('至');
    default:
  }
  return value;
};
