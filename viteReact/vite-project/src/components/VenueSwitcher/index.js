import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, Spin } from 'antd';
import { parse } from 'qs';

const { Option } = Select;

@connect(({ venue, loading }) => ({
  venue,
  venueListFetching: loading.effects['venue/fetch'],
  tableLoading: loading.effects['booking/fetch'],
}))
class VenueSwitcher extends Component {
  static contextTypes = {
    location: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    const { location } = context;
    this.query = parse(location.search.slice(1));
  }

  handleSelectChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'venue/changeVenueId',
      payload: value,
    });
  };

  render() {
    const { venue = {}, venueListFetching, tableLoading, filter = () => true, style } = this.props;
    const { list = [] } = venue;
    const { currentVenue = {} } = venue;
    const showList = list.filter(filter);
    // 如果由于不同地方使用本组件的过滤方式不同导致当前全局id被过滤，则自动切换一次
    if (currentVenue.id && !showList.some(item => item.id === currentVenue.id)) {
      this.handleSelectChange((showList[0] || {}).id);
    }
    return (
      <Select
        notFoundContent={venueListFetching && <Spin />}
        style={{ width: '100%', minWidth: 180, ...style }}
        value={currentVenue.id}
        onChange={this.handleSelectChange}
        disabled={venueListFetching || tableLoading}
      >
        {showList.map(item => (
          <Option key={item.id} value={item.id}>
            {item.salesName}
          </Option>
        ))}
      </Select>
    );
  }
}

export default VenueSwitcher;
