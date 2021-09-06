import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd';
import Content from '@/components/Datatable/Content';
import Datatable from '@/components/Datatable';
import { formatGender, formatFaceImgInTable } from '@/utils/format';

export default ({ form, cancel, selectedRows, sure, ...restProps }) => {
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['pubservice/linkStudy']);
  const [contactSelectRows, setContactSelectRows] = useState([]);
  const [listRows, setListRows] = useState();

  const { id, pubAccountId, publicServiceStudyList, serviceSharedUse } = (selectedRows || [])[0] || {};

  const onSelectedChange = useCallback((_, rows) => {
    setContactSelectRows(rows);
  }, []);

  useEffect(() => {
    if (publicServiceStudyList && publicServiceStudyList.length > 0) {
      setContactSelectRows(
        (listRows || []).filter(item => publicServiceStudyList.some(it => it.pubStudyId === item.id))
      );
    }
  }, [listRows]);

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '人脸认证照片',
        dataIndex: 'picUrl',
        render: formatFaceImgInTable,
        width: 90,
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        width: 110,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: formatGender,
        width: 80,
      },
    ],
    []
  );

  return (
    <Content
      title="关联人员"
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
          disabled: contactSelectRows == null || contactSelectRows.length === 0,
          loading: saving,
          async action() {
            await dispatch({
              type: 'pubservice/linkStudy',
              payload: {
                pubServiceAccountId: id,
                pubStudyId: contactSelectRows.map(item => item.id),
              },
            });
            sure();
          },
        },
      ]}
    >
      <Row>
        <Col lg={12}>
          请选择
          {pubAccountId && (
            <Datatable
              personalization={false}
              select={serviceSharedUse ? 'multi' : 'single'}
              url={`/publicStudy/studyList.do?pubAccountId=${pubAccountId}`}
              onSelectedChange={onSelectedChange}
              columns={columns}
              rowKey="id"
              onLoadData={setListRows}
              rowSelection={{
                selectedRows: contactSelectRows,
              }}
            />
          )}
        </Col>
      </Row>
    </Content>
  );
};
