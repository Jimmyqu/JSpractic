import { useSelector } from 'react-redux';
import { formatModel } from '@/utils/format';
import CompanyInfoView from './CompanyInfoView';
import PropertiesTableView from './PropertiesTableView';
import AuthInfoView from './AuthInfoView';
import ColorStateView from './ColorStateView';

function converState(ProjectAuditStates, state) {
  switch (state) {
    case ProjectAuditStates.Approved.key:
      return PropertiesTableView.States.Yes;
    case ProjectAuditStates.Rejected.key:
    case ProjectAuditStates.Cancel.key:
      return PropertiesTableView.States.No;
    default:
  }
  return PropertiesTableView.States.Pending;
}

export default ({ fields, data, showAuthInfo }) => {
  const { ProjectAuditStates } = useSelector(state => state.activity2);
  const state = converState(ProjectAuditStates, data?.auditState);
  return (
    <>
      <CompanyInfoView data={data} />
      <PropertiesTableView state={state} title="申报资质" fields={fields} data={data?.fieldMap} />
      {showAuthInfo && (
        <AuthInfoView
          state={state}
          data={{
            ...data,
            auditState: (
              <ColorStateView state={state}>{formatModel(ProjectAuditStates, data?.auditState)}</ColorStateView>
            ),
          }}
        />
      )}
    </>
  );
};
