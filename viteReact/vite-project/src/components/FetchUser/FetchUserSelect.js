import { useEffect, useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { Select, Spin } from 'antd';
import { useDelayDispatch } from '@/utils/hooks';

export default forwardRef(
  ({ onChange, onSearch, data, onLoadData, itemRender = item => item.id, searchFieldName, ...props }, ref) => {
    if (searchFieldName == null) {
      return null;
    }
    const delayDispatch = useDelayDispatch(500);
    const userByKeyFetching = useSelector(state => state.loading.effects['pubuser/fetchUserByKey']);
    const [userList, setUserList] = useState();

    useEffect(() => {
      setUserList(data);
    }, [data]);

    return (
      <Select
        placeholder="请输入关键字"
        notFoundContent={userByKeyFetching ? <Spin /> : undefined}
        allowClear
        {...props}
        ref={ref}
        showSearch
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={async str => {
          const v = str?.trim();
          let result = [];
          if (v) {
            result = await delayDispatch({
              type: 'pubuser/fetchUserByKey',
              payload: {
                [searchFieldName]: v,
              },
            });
          }
          onChange?.();
          setUserList(result);
          onLoadData?.([...result]);
          onSearch?.(v);
        }}
        onChange={onChange}
      >
        {userList?.map(item => (
          <Select.Option key={item.id} value={item.id}>
            {itemRender?.(item)}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
