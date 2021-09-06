import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, message } from 'antd';
import Content from '@/components/Datatable/Content';
import RichTextEditor from '@/components/RichTextEditor';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubuser, loading }) => ({
  pubuser,
  fetching: loading.effects['pubuser/getLevelInfo'],
  saveing: loading.effects['pubuser/saveLevelInfo'],
}))
@Form.create()
class DetailsContent extends Component {
  state = {
    richInfo: null,
  };

  componentDidMount() {
    const { dispatch, selectedRows } = this.props;
    dispatch({
      type: 'pubuser/getLevelInfo',
      payload: {
        memberLevelId: selectedRows[0].memberLevelConfig.id,
      },
    }).then(result => {
      this.setState({
        richInfo: result,
      });
    });
  }

  handleRichTextChange = val => {
    this.setState({
      richInfo: val,
    });
  };

  doSure = () => {
    const { form, dispatch, sure = () => {}, edit, selectedRows } = this.props;
    const { richInfo } = this.state;
    form.validateFieldsAndScroll(async err => {
      if (err) {
        return;
      }
      const { id, levelName } = selectedRows[0].memberLevelConfig;
      await dispatch({
        type: 'pubuser/saveLevelInfo',
        payload: {
          body: richInfo,
          memberLevelId: id,
          memberLevelName: levelName,
        },
      });
      if (edit) {
        message.success('编辑成功');
      } else {
        message.success('添加成功');
      }
      sure();
    });
  };

  render() {
    const { form, dispatch, cancel, sure, editing, fetching, edit, ...restProps } = this.props;
    const { richInfo } = this.state;

    return (
      <Content
        title="详细信息"
        loading={fetching}
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: editing,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: editing,
            action: this.doSure,
          },
        ]}
      >
        <Form {...formItemLayoutNormal}>
          <Row>
            <Col>
              <RichTextEditor onChange={this.handleRichTextChange} value={richInfo} />
            </Col>
          </Row>
        </Form>
      </Content>
    );
  }
}

export default DetailsContent;
