import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from 'antd';
import Content from '@/components/Datatable/Content';

export default props => {
  const {
    form,
    cancel,
    sure,
    pubserviceuser,
    //
    selectedRows,
    composeStateMapping,
    handleComposeStateChange,
    ...restProps
  } = props;
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['pubserviceuser/updateCertUserDetailInfo']);

  const [detail, setDetail] = useState(selectedRows?.[0].detail);

  return (
    <Content
      title="简介"
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: saving,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: saving,
          async action() {
            await dispatch({
              type: 'pubserviceuser/updateCertUserDetailInfo',
              payload: {
                detail,
                id: selectedRows?.[0].id,
              },
            });
            sure();
          },
        },
      ]}
    >
      <Input.TextArea placeholder="请填写" rows={4} value={detail} onChange={v => setDetail(v.target.value)} />
    </Content>
  );
};
