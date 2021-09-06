import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Card, Tree, Input, message } from 'antd';
import Content from '@/components/Datatable/Content';
import MarginBar from '@/components/MarginBar';
import AmountInput from '@/components/Amount/Input';
import { decodeMoney, encodeMoney } from '@/utils/format';
import style from '../index.less';

const { TreeNode } = Tree;

@connect(({ store, loading }) => ({
  store,
  treeLoading: loading.effects['store/fetchcategoryListByParent'],
  editing: loading.effects['store/edit'],
}))
@Form.create()
class EditProfile extends Component {
  constructor(props) {
    super(props);
    const { selectedRows = [], edit } = props;
    this.state = {
      treeSelectedKeys: selectedRows.length > 0 && edit ? [selectedRows[0].categoryId?.toString()] : undefined,
      treeSelectedName: undefined,
    };
  }

  handleTreeSelect = (treeSelectedKeys, { selected, node }) => {
    // 不给取消选中
    if (selected) {
      const { title } = node.props;
      this.setState({
        treeSelectedKeys,
        treeSelectedName: title,
      });
      //
    }
  };

  buildTreeNode = (parentId, list) => {
    if (list == null || list.length === 0) {
      return null;
    }
    const remaining = [];
    const nodes = [];
    list.forEach(item => {
      if (item.parentId === parentId) {
        nodes.push(item);
      } else {
        remaining.push(item);
      }
    });

    return nodes.map(item => (
      <TreeNode title={item.categoryName} key={`${item.id}`} data={item}>
        {this.buildTreeNode(item.id, remaining)}
      </TreeNode>
    ));
  };

  doSure = () => {
    const { form, dispatch, sure = () => {}, edit, selectedRows } = this.props;
    const { treeSelectedKeys } = this.state;
    if (treeSelectedKeys == null || treeSelectedKeys.length === 0) {
      message.error('请选择商品分类');
      return;
    }
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'store/edit',
        payload: {
          ...formData,
          marketPrice: encodeMoney(formData.marketPrice),
          salesPrice: encodeMoney(formData.salesPrice),
          buyPrice: encodeMoney(formData.buyPrice),
          id: edit ? selectedRows[0].id : null,
          categoryId: treeSelectedKeys[0],
        },
      });
      sure();
    });
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      edit,
      store: { categoryListByParent },
      treeLoading,
      editing,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { treeSelectedKeys, treeSelectedName } = this.state;
    return (
      <Content
        title={`${edit ? '编辑' : '添加'}商品`}
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: editing || treeLoading,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: editing || treeLoading,
            action: this.doSure,
          },
        ]}
      >
        <Card loading={treeLoading} bordered={false}>
          <Row gutter={16}>
            <Col md={8}>
              <MarginBar top>
                <Tree
                  className={style.tree}
                  // defaultSelectedKeys={defaultTreeSelectedKeys}
                  selectedKeys={treeSelectedKeys}
                  defaultExpandedKeys={treeSelectedKeys}
                  onSelect={this.handleTreeSelect}
                >
                  {this.buildTreeNode(0, categoryListByParent)}
                </Tree>
              </MarginBar>
            </Col>
            <Col md={16}>
              <MarginBar top>
                <Form>
                  <Row gutter={16}>
                    <Col md={12}>
                      <Form.Item label="名称">
                        {form.getFieldDecorator('itemName', {
                          initialValue: edit ? selectedRows[0].itemName : null,
                          rules: [
                            {
                              required: true,
                              message: '请填写商品名称',
                            },
                          ],
                        })(<Input placeholder="请填写" />)}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="单位">
                        {form.getFieldDecorator('unit', {
                          initialValue: edit ? selectedRows[0].unit : null,
                          rules: [
                            {
                              required: true,
                              message: '请填写商品单位',
                            },
                          ],
                        })(<Input placeholder="请填写" />)}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="分类">
                        <Input
                          value={
                            edit || treeSelectedName
                              ? treeSelectedName ||
                                (
                                  (categoryListByParent || []).find(item => item.id === selectedRows[0].categoryId) ||
                                  {}
                                ).categoryName
                              : treeSelectedName
                          }
                          readOnly
                          disabled
                          placeholder="请选择分类"
                        />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="进货价">
                        {form.getFieldDecorator('buyPrice', {
                          initialValue: edit ? decodeMoney(selectedRows[0].buyPrice) : 0,
                          rules: [
                            {
                              required: true,
                              message: '请填写商品进货价',
                            },
                          ],
                        })(<AmountInput placeholder="请填写" min={0} precision={2} fullWidth />)}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="商品原价">
                        {form.getFieldDecorator('marketPrice', {
                          initialValue: edit ? decodeMoney(selectedRows[0].marketPrice) : 0,
                          rules: [
                            {
                              required: true,
                              message: '请填写商品原价',
                            },
                          ],
                        })(<AmountInput placeholder="请填写" min={0} precision={2} fullWidth />)}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="销售价">
                        {form.getFieldDecorator('salesPrice', {
                          initialValue: edit ? decodeMoney(selectedRows[0].salesPrice) : 0,
                          rules: [
                            {
                              required: true,
                              message: '请填写商品销售价',
                            },
                          ],
                        })(<AmountInput placeholder="请填写" min={0} precision={2} fullWidth />)}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="编码">
                        {form.getFieldDecorator('itemCode', {
                          initialValue: edit ? selectedRows[0].itemCode : null,
                        })(<Input placeholder="请填写" />)}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="条码">
                        {form.getFieldDecorator('label', {
                          initialValue: edit ? selectedRows[0].label : null,
                        })(<Input placeholder="请填写" />)}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="标签">
                        {form.getFieldDecorator('keywords', {
                          initialValue: edit ? selectedRows[0].keywords : null,
                        })(<Input placeholder="请填写" />)}
                      </Form.Item>
                    </Col>
                    <Col md={24}>
                      <Form.Item label="描述">
                        {form.getFieldDecorator('descs', {
                          initialValue: edit ? selectedRows[0].descs : null,
                        })(<Input.TextArea placeholder="请填写" maxLength={60} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </MarginBar>
            </Col>
          </Row>
        </Card>
      </Content>
    );
  }
}

export default EditProfile;
