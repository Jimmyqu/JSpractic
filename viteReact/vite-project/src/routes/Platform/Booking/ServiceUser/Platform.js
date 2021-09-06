import { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Card, Form, Select, Input, Tag, Icon } from 'antd';
import { formatDate, formatHM, formatMoney, formatModel } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { blackOrWhite } from '@/utils/color';
import { DEFAULT_GIFT_PIC_FULLPATH } from '@/utils/utils';
import { checkMobile } from '@/commons/lib/validator';
import style from './platform.less';

const { Meta } = Card;
const { CheckableTag } = Tag;

@connect(({ venue, orderprocessing }) => ({
  venue,
  orderprocessing,
}))
@Form.create()
class Platform extends Component {
  formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 7 },
  };

  state = {
    checkableTagKey: undefined,
    defTeamId: undefined,
    defMobile: undefined,
    defDesc: undefined,
  };

  componentDidMount() {
    const {
      setChild,
      platform: { sportTeamId, sportTeamColor, fightMobile, fightDeclaration },
      sportTeamList = [],
      ballColorList = [],
    } = this.props;
    setChild(this);
    const defTeamId =
      sportTeamId && sportTeamList.some(item => item.sportTeamId === sportTeamId)
        ? sportTeamId
        : (sportTeamList[0] || {}).sportTeamId;
    // 颜色互斥后端做了，ballColorList里不会有对方的颜色
    const checkableTagKey =
      sportTeamColor && ballColorList.some(item => item.key === sportTeamColor)
        ? sportTeamColor
        : (ballColorList[0] || {}).key;
    this.setState({
      defTeamId,
      checkableTagKey,
      defMobile: fightMobile,
      defDesc: fightDeclaration,
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleCheckableTagChange = (key, checked) => {
    if (checked) {
      // 不给取消
      this.setState({
        checkableTagKey: key,
      });
    }
  };

  handleServiceUserClick = item => {
    const { disabledUserMapping, onSelectedUserChange } = this.props;
    const disabledCounter = disabledUserMapping[item.careerId] || {};
    if (!item.choice || disabledCounter[item.platformUserId] > 0) {
      return;
    }
    if (onSelectedUserChange) {
      onSelectedUserChange(this, item);
    }
  };

  render() {
    const {
      platform,
      sportTeamList = [],
      ballColorList = [],
      selectedUserMapping = {},
      disabledUserMapping = {},
      venue: { Careers },
      form,
    } = this.props;

    const { checkableTagKey, defTeamId, defMobile, defDesc } = this.state;

    const title = `场地：${platform.platformParentName && `${platform.platformParentName}-`}${
      platform.platformName
    }(${formatDate(platform.orderDate)} ${formatHM(platform.startTime)}-${formatHM(platform.endTime)}) 共${
      platform.bookingTime
    }小时`;

    const { sportPlatformUserList = [], isFight } = platform;
    const serviceUserMapping = {};
    sportPlatformUserList.forEach(item => {
      serviceUserMapping[item.careerId] = serviceUserMapping[item.careerId] || [];
      serviceUserMapping[item.careerId].push(item);
    });

    const { getFieldDecorator } = form;

    return (
      <Card title={title}>
        <Form {...this.formItemLayout}>
          {Object.keys(serviceUserMapping).map(key => {
            const selectedList = selectedUserMapping[key] || [];
            const disabledCounter = disabledUserMapping[key] || {};
            return (
              <MarginBar top key={key}>
                <h4 className={style.title}>{formatModel(Careers, +key)}</h4>
                {serviceUserMapping[key].map(item => (
                  <MarginBar key={item.careerId + item.platformUserId} inline top left className={style.avatarCard}>
                    <Card
                      hoverable
                      className={classNames({
                        [style.selected]: selectedList.includes(item.platformUserId),
                        [style.disabled]: !item.choice || disabledCounter[item.platformUserId] > 0,
                      })}
                      cover={<img alt="avatar" src={item.picUrl || DEFAULT_GIFT_PIC_FULLPATH} />}
                      onClick={() => this.handleServiceUserClick(item)}
                    >
                      <Meta
                        title={item.realName}
                        description={<span className={style.price}>{formatMoney(item.servicePrice)}元</span>}
                      />
                    </Card>
                  </MarginBar>
                ))}
              </MarginBar>
            );
          })}
          {isFight > 0 && (
            <>
              <MarginBar top>
                <h4 className={style.title}>约战</h4>
              </MarginBar>

              <Form.Item label="选择球队">
                {getFieldDecorator('sportTeamId', {
                  initialValue: defTeamId,
                  rules: [
                    {
                      required: true,
                      message: '请选择团队',
                    },
                  ],
                })(
                  <Select placeholder="请选择团队">
                    {sportTeamList.map(item => (
                      <Select.Option key={item.sportTeamId} value={item.sportTeamId}>
                        {item.sportName || '?'}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="队服颜色">
                {getFieldDecorator('sportTeamColor', {
                  initialValue: checkableTagKey,
                  value: checkableTagKey,
                })(
                  <>
                    {ballColorList.map(item => (
                      <CheckableTag
                        checked={checkableTagKey === item.key}
                        key={item.key}
                        className={style.tag}
                        style={{ backgroundColor: item.rgb, color: blackOrWhite(item.rgb) }}
                        onChange={checked => this.handleCheckableTagChange(item.key, checked)}
                      >
                        {item.title}
                        <Icon type="check" />
                      </CheckableTag>
                    ))}
                  </>
                )}
              </Form.Item>
              <Form.Item label="联系方式">
                {getFieldDecorator('fightMobile', {
                  initialValue: defMobile,
                  rules: [
                    {
                      required: false,
                      message: '请输入合法的手机号码!',
                      validator: checkMobile,
                    },
                  ],
                })(<Input placeholder="请填写联系方式" />)}
              </Form.Item>
              <Form.Item label="约战备注">
                {getFieldDecorator('fightDeclaration', {
                  initialValue: defDesc,
                })(<Input placeholder="其他约战说明" maxLength={250} />)}
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
    );
  }
}

export default Platform;
