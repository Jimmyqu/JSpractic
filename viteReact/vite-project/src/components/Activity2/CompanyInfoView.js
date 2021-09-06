import { useSelector } from 'react-redux';
import PropertiesTableView from './PropertiesTableView';

export default ({ data }) => {
  const { ExtDataTypes } = useSelector(state => state.extfield2);
  return (
    <PropertiesTableView
      state={PropertiesTableView.States.Yes}
      title="申报单位信息"
      fields={[
        { extShowName: '单位名称', extKeyName: 'companyName', extDataType: ExtDataTypes.Text.key },
        { extShowName: '联系人', extKeyName: 'contentEs', extDataType: ExtDataTypes.Text.key },
        { extShowName: '邮箱地址', extKeyName: 'email', extDataType: ExtDataTypes.Text.key },
        { extShowName: '联系人手机号', extKeyName: 'mobile', extDataType: ExtDataTypes.Text.key },
      ]}
      data={data}
    />
  );
};
