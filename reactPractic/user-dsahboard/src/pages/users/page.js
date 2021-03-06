import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import UserModal from '../components/addUser';
import { routerRedux } from 'dva/router';

function Users({ dispatch, list: dataSource,loading,total,page }) {
  console.log(loading)

  function createHandler(values) {
    console.log(`dispatch create`)
    dispatch({
      type: 'users/create',
      payload: values,
    });
  }

  function editHandler(id, values) {
    dispatch({
      type: 'users/patch',
      payload: { id, values },
    });
  }

  function createHandler(values) {
    dispatch({
      type: 'users/create',
      payload: values,
    });
  }
  function deleteHandler(id) {
    console.log(id)
    dispatch({
      type: 'users/remove',
      payload: id,
    });
  }

  let pageChangeHandler=function(page){
    dispatch(routerRedux.push({
      pathname: '/users',
      query: { page },
    }));
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="">{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span >
          <UserModal record={record} onOk={editHandler.bind(null, record.id)}>
            <a>Edit</a>
          </UserModal>
          <Popconfirm title="确认删除?" onConfirm={deleteHandler.bind(null, record.id)}>
            <a href="">Delete</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  console.log('total',total)
  return (

    <div>
      <div>
        <div >
          <UserModal record={{}} onOk={createHandler}>
            <Button type="primary">Create User</Button>
          </UserModal>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource.data}
          rowKey={item => item.id}
          pagination={false}
        />
        <Pagination
          className="ant-table-pagination"
          total={total}
          current={page}
          pageSize={5}
          onChange={pageChangeHandler}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { list, total,page } = state.users;
  return {
    list,
    total,
    page,
    loading: state.loading.models.users,  //dva包装的loading
  };
}

export default connect(mapStateToProps)(Users);