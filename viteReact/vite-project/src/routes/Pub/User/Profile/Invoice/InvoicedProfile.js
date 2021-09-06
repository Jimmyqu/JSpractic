import { Component } from 'react';
import { connect } from 'react-redux';
import InvoicedDetail from '@/components/Invoice/InvoicedDetail';

@connect(({ pubinvoice }) => ({
  pubinvoice,
}))
class InvoicedProfile extends Component {
  state = {
    info: undefined,
  };

  async componentDidMount() {
    const { id, dispatch } = this.props;
    const result = await dispatch({
      type: 'pubinvoice/fetchInvoicedDetail',
      payload: id,
    });

    if (result == null || this.isUnmounted) {
      return;
    }

    this.setState({
      info: result,
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    const { info } = this.state;

    return <InvoicedDetail data={info} />;
  }
}

export default InvoicedProfile;
