import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Form, Input, Divider } from 'antd';
import { isNumerical } from '@/utils/utils';
import FetchUserSelect from '@/components/FetchUser/FetchUserSelect';

export default () => {
  const dispatch = useDispatch();
  const userByIdFetching = useSelector(state => state.loading.effects['pubuser/fetchById']);
  const userByKeyFetching = useSelector(state => state.loading.effects['pubuser/fetchUserByKey']);
  const [searchByIdState, setSearchByIdState] = useState({
    validateStatus: undefined,
    help: undefined,
  });

  const { value: idValue, ...searchByIdStateProps } = searchByIdState;

  const itemSelect = useCallback(id => {
    if (id) {
      dispatch(push(`/basic/pub/info/${id}`));
    }
  }, []);

  const onSearch = useCallback(() => {
    setSearchByIdState({});
  }, []);
  return (
    <Form>
      <Form.Item>
        <FetchUserSelect
          placeholder="按会员姓名搜索"
          searchFieldName="realName"
          onChange={itemSelect}
          onSearch={onSearch}
          allowClear={false}
          itemRender={item => {
            return `${item.id}/${item.realName}/${item.mobile}`;
          }}
        />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FetchUserSelect
          placeholder="按会员手机号搜索"
          searchFieldName="mobile"
          onChange={itemSelect}
          onSearch={onSearch}
          allowClear={false}
          itemRender={item => {
            return `${item.id}/${item.realName}/${item.mobile}`;
          }}
        />
      </Form.Item>
      <Divider />
      <Form.Item {...searchByIdStateProps}>
        <Input.Search
          enterButton="查询"
          placeholder="请填写会员编号"
          disabled={userByIdFetching || userByKeyFetching}
          loading={userByIdFetching}
          value={idValue}
          onChange={e => {
            const ok = isNumerical(e.target.value);
            setSearchByIdState({
              ...searchByIdState,
              validateStatus: ok ? 'success' : 'error',
              help: ok ? undefined : '请填写有效编号',
              value: e.target.value,
            });
          }}
          onSearch={async v => {
            if (isNumerical(v)) {
              // 这个接口查询不到自己会报异常
              const result = await dispatch({
                type: 'pubuser/fetchById',
                payload: v,
              });
              const { publicAccount } = result || {};
              const { id } = publicAccount || {};
              if (id) {
                dispatch(push(`/basic/pub/info/${id}`));
              }
            }
          }}
        />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FetchUserSelect
          placeholder="按会员备注搜索"
          searchFieldName="descr"
          onChange={itemSelect}
          onSearch={onSearch}
          allowClear={false}
          itemRender={item => {
            return ` ${item.descr}/${item.id}/${item.realName}/${item.mobile}`;
          }}
        />
      </Form.Item>
    </Form>
  );
};
