import { useSelector } from 'react-redux';
import PropertiesTableView from './PropertiesTableView';

export default ({ state: s, data, title }) => {
  const { ExtDataTypes } = useSelector(state => state.extfield2);
  const fields = [
    { extShowName: '审核状态', extKeyName: 'auditState', extDataType: ExtDataTypes.Text.key },
    { extShowName: '审核备注', extKeyName: 'auditDescription', extDataType: ExtDataTypes.Text.key },
  ];
  if (data?.fileItemVOList?.length > 0) {
    fields.push({
      extShowName: '文件',
      extKeyName: 'fileItemVOList',
      extDataType: ExtDataTypes.DocFile.key,
    });
  }
  return <PropertiesTableView state={s} title={title || '审核'} fields={fields} data={data} />;
};
