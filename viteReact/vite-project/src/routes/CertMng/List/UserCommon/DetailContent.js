import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Content from '@/components/Datatable/Content';
import RichTextEditor from '@/components/RichTextEditor';

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
  const saving = useSelector(state => state.loading.effects['pubserviceuser/updateCertDataDetailInfo']);

  const [detail, setDetail] = useState(selectedRows[0].detail);

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
              type: 'pubserviceuser/updateCertDataDetailInfo',
              payload: {
                detail,
                id: selectedRows[0].id,
              },
            });
            sure();
          },
        },
      ]}
    >
      <RichTextEditor onChange={v => setDetail(v)} value={selectedRows[0].detail} />
      {/* <Input.TextArea placeholder="请填写" rows={4} value={detail} onChange={v => setDetail(v.target.value)} /> */}
    </Content>
  );
};
