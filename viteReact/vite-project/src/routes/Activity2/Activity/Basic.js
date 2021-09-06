import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Form, Spin } from 'antd';
import ExtFormItem from '@/components/Form/FormItem/ExtFormItem';
import ProjectReqDataView from '@/components/Activity2/ProjectReqDataView';
import PropertiesTableView from '@/components/Activity2/PropertiesTableView';
import { formItemLayoutBasic } from '@/utils/utils';
import { converFormDataToServerReady2 } from '@/utils/form';

@connect(({ loading }) => ({
  fieldsLoading: loading.effects['activity2/fetchBasicFields'],
}))
@Form.create()
class Basic extends Component {
  state = {
    fields: null,
  };

  componentDidMount() {
    const { dispatch, node, initTabOptions } = this.props;
    initTabOptions({
      dataSave: this.dataSave,
    });
    dispatch({
      type: 'activity2/fetchBasicFields',
      payload: {
        reportConfigNodeId: node.reportConfigNodeId,
      },
    }).then(list => {
      this.setState({
        fields: list,
      });
    });
  }

  dataSave = () => {
    const { reportCompanyListId, dispatch, node, form, data } = this.props;
    const { exerciseDetailNodeRes } = data || {};
    const { fields } = this.state;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const res = await dispatch({
        type: 'activity2/saveBasicInfo',
        payload: {
          ...converFormDataToServerReady2(fields, formData),
          exerciseId: exerciseDetailNodeRes?.exerciseId,
          reportCompanyListId: exerciseDetailNodeRes?.reportCompanyListId || reportCompanyListId,
          reportConfigNodeId: node.reportConfigNodeId,
        },
      });

      const { exerciseId, exerciseReportNodeId } = res;
      dispatch(
        push({
          pathname: './info',
          search: `id=${exerciseId}&nodeId=${exerciseReportNodeId}`,
        })
      );
      // message.success('申报成功');
    });
  };

  render() {
    const { fieldsLoading, node, form, editMode, data, reportConfigFields } = this.props;
    const { fields } = this.state;

    const { exerciseDetailNodeRes, reportCompanyListFiledRes } = data || {};

    return (
      <Spin spinning={!!fieldsLoading}>
        {editMode ? (
          <Form {...formItemLayoutBasic}>
            {fields?.map(field => (
              <ExtFormItem
                key={field.extKeyName}
                form={form}
                field={field}
                initialValue={exerciseDetailNodeRes?.fieldMap?.[field.extKeyName]}
              />
            ))}
          </Form>
        ) : (
          <>
            <ProjectReqDataView fields={reportConfigFields} data={reportCompanyListFiledRes} />
            <PropertiesTableView
              state={PropertiesTableView.States.Yes}
              title={node.nodeName}
              fields={fields}
              data={exerciseDetailNodeRes?.fieldMap}
            />
          </>
        )}
      </Spin>
    );
  }
}

export default Basic;
