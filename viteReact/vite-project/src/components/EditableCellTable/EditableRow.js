import { Form } from 'antd';
import EditableContext from './context';

function EditableRow({ form, index, ...props }) {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
}

export default Form.create()(EditableRow);
