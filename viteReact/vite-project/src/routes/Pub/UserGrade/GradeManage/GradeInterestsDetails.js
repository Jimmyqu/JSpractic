import { useDispatch, useSelector } from 'react-redux';
import { Card, Button } from 'antd';
import { goBack } from 'connected-react-router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable from '@/components/Datatable';
import { getPageQuery } from '@/utils/utils';
import { formatModel } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import styles from '../index.less';

function GradeInterestsDetails() {
  const { id, name, realName, mobile } = getPageQuery();
  const { MemberIntersts = {} } = useSelector(state => state.pubuser);
  const dispatch = useDispatch();
  return (
    <PageHeaderLayout title="等级权益">
      <Card bordered={false}>
        <div>
          <Button onClick={() => dispatch(goBack())}>返回</Button>
          <span className={styles.goBack} onClick={() => dispatch(goBack())}>
            {mobile && `${realName} / ${mobile}`}
          </span>
          <MarginBar left right inline>
            {name}
          </MarginBar>
          <span>等级权益</span>
        </div>
        <Datatable
          url={`/MemberLevelConfigEquityRelAction/dataList.do?id=${id}`}
          pagination={false}
          columns={[
            {
              title: '编号',
              dataIndex: 'id',
              width: 100,
            },
            {
              title: '会员等级',
              dataIndex: 'levelName',
              width: 100,
            },
            {
              title: '权益名称',
              dataIndex: 'equityName',
              width: 170,
            },
            {
              title: '权益分类',
              dataIndex: 'equityTag',
              render: value => formatModel(MemberIntersts, value),
              width: 150,
            },
            {
              title: '权益说明',
              dataIndex: 'equityDesc',
              width: 300,
            },
          ]}
          rowKey="id"
        />
      </Card>
    </PageHeaderLayout>
  );
}

export default GradeInterestsDetails;
