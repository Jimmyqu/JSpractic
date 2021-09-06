import { Component } from 'react';
import Table from '@/components/Datatable/BaseTable';
import EditableRow from './EditableRow';
import EditableCell from './EditableCell';
import styles from './index.less';

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

export default class EditableTable extends Component {
  handleSave = record => {
    const { onEdit } = this.props;
    if (onEdit) {
      onEdit(record);
    }
  };

  render() {
    const { columns = [], onEdit, form, ...props } = this.props;

    return (
      <Table
        {...props}
        bordered
        components={components}
        rowClassName={() => styles.row}
        columns={columns.map(col => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record, index) => {
              return {
                record,
                index,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSave,
              };
            },
          };
        })}
        onRow={form == null ? null : () => ({ form })}
      />
    );
  }
}
