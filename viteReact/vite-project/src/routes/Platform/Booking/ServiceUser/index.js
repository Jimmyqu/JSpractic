import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack, replace } from 'connected-react-router';
import { Button, Card } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import Platform from './Platform';

@connect(({ orderprocessing, booking, loading }) => ({
  booking,
  orderprocessing,
  saving: loading.effects['orderprocessing/saveOrder'],
  fetching: loading.effects['booking/fetchServiceUser'],
}))
class ServiceUser extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
    validPubStudy: PropTypes.bool,
  };

  state = {
    serverData: undefined,

    selectedUserList: [], // 职业为key的已选服务人员mapping, 下标对应场地下标
  };

  async componentDidMount() {
    const { checkOpFailedAndGoBack } = this.context;
    if (checkOpFailedAndGoBack()) {
      return;
    }
    const {
      orderprocessing: { dealInfo },
      dispatch,
    } = this.props;
    const serverData = await dispatch({
      type: 'booking/fetchServiceUser',
    });
    const { dealPlatformList: list } = serverData;
    if (
      list == null ||
      list.every(platform => {
        if (platform.isFight > 0) {
          return false;
        }
        return platform.sportPlatformUserList == null || platform.sportPlatformUserList.length === 0;
      })
    ) {
      dispatch(replace('./mall'));
      return;
    }
    if (this.isUnmounted) {
      return;
    }
    const { dealServiceUserList } = dealInfo;
    this.setState({
      serverData,
      selectedUserList: list.map(platform => {
        const userList = platform.sportPlatformUserList || [];
        const mapping = {};
        (dealServiceUserList || []).forEach(cachedUser => {
          if (
            platform.platformId === cachedUser.platformId &&
            platform.startTime === cachedUser.startTime &&
            platform.endTime === cachedUser.endTime
          ) {
            // 同一个人可能同时服务不同职业？
            const user = userList.find(
              u => u.platformUserId === cachedUser.platformUserId && u.careerId === cachedUser.careerId
            );
            // 服务器数据已经不提供此人
            if (user == null) {
              return;
            }
            mapping[cachedUser.careerId] = mapping[cachedUser.careerId] || [];
            mapping[cachedUser.careerId].push(cachedUser.platformUserId);
          }
        });
        // 服务器默认的
        userList.forEach(user => {
          if (user.selected) {
            mapping[user.careerId] = mapping[user.careerId] || [];
            const ids = mapping[user.careerId];
            if (ids.includes(user.platformUserId)) {
              return;
            }
            ids.push(user.platformUserId);
          }
        });
        return mapping;
      }),
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  setChild = (child, i) => {
    this.children = this.children || [];
    this.children[i] = child;
  };

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  handleNextStep = async summary => {
    if (this.children == null) {
      return;
    }
    const { getNextStepPath } = this.context;
    const { dispatch } = this.props;
    const dealServiceUserList = [];
    const dealPlatformTeamInfoList = [];
    for (let i = 0, len = this.children.length; i < len; i += 1) {
      const { form, platform } = this.children[i].props;
      let result;
      try {
        // eslint-disable-next-line no-await-in-loop
        result = await new Promise((resolve, reject) => {
          form.validateFieldsAndScroll(
            {
              scroll: {
                offsetBottom: 80,
              },
            },
            (err, formData) => {
              if (err) {
                reject();
                return;
              }
              resolve(formData);
            }
          );
        });
      } catch (e) {
        // reject时没传递参赛
        if (e) {
          throw e;
        }
        return;
      }

      // 职业为key的已选服务人员集合
      // const { serviceUsers } = result;
      const { selectedUserList } = this.state;
      const selectedUserMapping = selectedUserList[i];

      Object.entries(selectedUserMapping).forEach(([key, list]) => {
        list.forEach(platformUserId => {
          dealServiceUserList.push({
            platformId: platform.platformId,
            orderDate: platform.orderDate,
            startTime: platform.startTime,
            endTime: platform.endTime,
            careerId: +key,
            platformUserId,
          });
        });
      });

      dealPlatformTeamInfoList.push({
        ...result,
        orderDate: platform.orderDate,
        startTime: platform.startTime,
        endTime: platform.endTime,
        platformId: platform.platformId, // 添加字段方便对比关联
      });
    }

    const id = await dispatch({
      type: 'booking/serviceUserNextStep',
      payload: {
        dealServiceUserList,
        dealPlatformTeamInfoList,
      },
      summary,
    });
    if (summary) {
      if (id) {
        dispatch(
          push({
            pathname: './summary',
            search: `id=${id}`,
          })
        );
      }
      return;
    }
    dispatch(push(getNextStepPath()));
  };

  handleSelectedUserChange = (child, user) => {
    const i = this.children.indexOf(child);
    const { selectedUserList } = this.state;
    const list = [...selectedUserList];
    const selectedUserMapping = list[i] || {};
    const ids = [...(selectedUserMapping[user.careerId] || [])];
    const idIndex = ids.indexOf(user.platformUserId);
    // 有就删除，没有就添加
    if (idIndex >= 0) {
      ids.splice(idIndex, 1);
    } else {
      ids.push(user.platformUserId);
    }
    list[i] = {
      ...selectedUserMapping,
      [user.careerId]: ids,
    };
    this.setState({
      selectedUserList: list,
    });
  };

  toSummary = () => {
    this.handleNextStep(true);
  };

  // 计算冲突而禁用的人员配置
  calcDisabledUserMapping(currentPlatform) {
    const { selectedUserList, serverData = {} } = this.state;
    const { dealPlatformList = [] } = serverData;
    const { sportPlatformUserList = [], startTime, endTime } = currentPlatform;

    const disabledUserMapping = {};
    dealPlatformList.forEach((platform, pIdx) => {
      if (currentPlatform === platform) {
        return;
      }
      // 服务时间冲突
      // 同一个人，在不同场地，不一定都冲突，在场地A的时间与在场地B的时间有叠加，不代表在场地A的时间与在场地C的时间有叠加，所以要区分开
      if (
        (platform.startTime < startTime && platform.endTime > startTime) ||
        (platform.endTime > endTime && platform.startTime < endTime) ||
        (platform.endTime > endTime && platform.startTime < startTime) ||
        (platform.endTime < endTime && platform.startTime > startTime) ||
        (platform.endTime === endTime && platform.startTime >= startTime) ||
        (platform.endTime <= endTime && platform.startTime === startTime)
      ) {
        const selectedUserMapping = selectedUserList[pIdx] || {};
        Object.values(selectedUserMapping).forEach(platformUserIds => {
          platformUserIds.forEach(platformUserId => {
            const user = sportPlatformUserList.find(u => u.platformUserId === platformUserId);
            if (user) {
              disabledUserMapping[user.careerId] = disabledUserMapping[user.careerId] || {};
              const mp = disabledUserMapping[user.careerId];
              mp[user.platformUserId] = mp[user.platformUserId] || 0;
              mp[user.platformUserId] += 1;
            }
          });
        });
      }
    });

    return disabledUserMapping;
  }

  render() {
    const { checkOpFailed, selectPubStudy, validPubStudy } = this.context;
    if (checkOpFailed()) {
      return null;
    }
    const { saving, fetching } = this.props;
    const { serverData = {}, selectedUserList } = this.state;
    const { dealPlatformList = [], ballColorList, sportTeamList } = serverData;

    return fetching ? (
      <Card loading={fetching} />
    ) : (
      <>
        {dealPlatformList.map((item, i) => {
          // 禁用数量通过人员选择情况计算出来，不存储
          const disabledUserMapping = this.calcDisabledUserMapping(item, i);
          return (
            <Platform
              key={item.startTime + item.platformId}
              platform={item}
              ballColorList={ballColorList}
              sportTeamList={sportTeamList}
              selectedUserMapping={selectedUserList[i]}
              disabledUserMapping={disabledUserMapping}
              onSelectedUserChange={this.handleSelectedUserChange}
              setChild={child => this.setChild(child, i)}
            />
          );
        })}
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={saving} onClick={this.handleGoBack}>
              返回修改
            </Button>
          </MarginBar>
          {!(selectPubStudy && validPubStudy) && (
            <MarginBar left top inline>
              <Button type="danger" loading={saving} onClick={this.toSummary}>
                结算
              </Button>
            </MarginBar>
          )}
          <MarginBar left top inline>
            <Button type="primary" disabled={saving} onClick={() => this.handleNextStep()}>
              下一步
            </Button>
          </MarginBar>
        </FooterToolbar>
      </>
    );
  }
}

export default ServiceUser;
