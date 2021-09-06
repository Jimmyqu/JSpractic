import PropTypes from 'prop-types';
import VerticalPairColumnTable from '@/components/VerticalPairColumnTable';
import PairColumn from '@/components/VerticalPairColumnTable/PairColumn';
import ViewHeader from '@/components/Activity2/ViewHeader';
import MarginBar from '@/components/MarginBar';
import ExtFormItem from '@/components/Form/FormItem/ExtFormItem';
import styles from './index.less';

function PropertiesTableView({ fields, title, data, state }, { isMobile }) {
  return (
    <div className={styles.tableView}>
      <ViewHeader state={state}>{title}</ViewHeader>
      <MarginBar top className={styles.tableRowWrapper}>
        <VerticalPairColumnTable per={isMobile ? 1 : 2}>
          {(fields || []).map(field => (
            <PairColumn key={field.extKeyName} label={field.extShowName || field.extKeyName}>
              <ExtFormItem field={field} initialValue={data?.[field.extKeyName]} isView />
            </PairColumn>
          ))}
        </VerticalPairColumnTable>
      </MarginBar>
    </div>
  );
}

// copy
PropertiesTableView.States = {
  ...ViewHeader.States,
};

PropertiesTableView.contextTypes = {
  isMobile: PropTypes.bool,
};

export default PropertiesTableView;
