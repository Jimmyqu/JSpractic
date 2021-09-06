import DataContent from '@/components/PubServiceCard/DataContent';
import { formatMoney } from '@/utils/format';
import InfomationField from './InfomationField';

export default ({ data }) => {
  const { id, pubServiceId, serviceName, surplusAmount, pubServiceDataList, serviceUseMode } = data || {};

  const itemList = [
    {
      label: '服务编号',
      value: pubServiceId,
    },
    {
      label: '服务账户编号',
      value: id,
    },
    {
      label: '服务名称',
      value: serviceName,
    },
    {
      label: '服务值',
      value: <DataContent pubServiceDataList={pubServiceDataList} serviceUseMode={serviceUseMode} />,
    },
    {
      label: '服务储值金额',
      value: formatMoney(surplusAmount),
    },
  ];

  return itemList.map(item => <InfomationField key={item.label} data={item} />);
};
