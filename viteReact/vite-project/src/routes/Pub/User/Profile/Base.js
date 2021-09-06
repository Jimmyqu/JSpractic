import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, Row, Col, Avatar, Icon, Divider, Button, message } from 'antd';
import classNames from 'classnames';
import MarginBar from '@/components/MarginBar';
import Modal from '@/components/Modal';
import AuthComponent from '@/components/AuthComponent';
import BindingSimpleModal from '@/components/Modal/BindingSimpleModal';
import { formatMoney, formatDate, formatDateTime, formatHomeTown, formatModel, formatImageUrl } from '@/utils/format';
import { DEFAULT_USER_AVATAR_PIC_FULLPATH } from '@/utils/utils';
import { rgb } from '@/utils/color';
import { provinceList } from '@/commons/lib/home-town';
import ethnicList from '@/commons/lib/data/ethnic';
// import { CommonFileLinkTypes } from '@/utils/upload';
import ProfileBaseForm from './BaseForm';
import style from './base.less';

@connect(({ pubuser, loading, global }) => ({
  pubuser,
  basicSaving: loading.effects['pubuser/basicSave'],
  RelTypes: global.RelTypes,
}))
class ProfileBase extends Component {
  state = {
    icCardBingdingVisible: false,
    resetPwdVisible: false,
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};
    dispatch({
      type: 'pubuser/fetch',
      payload: pubAccountId,
    });
  };

  handleFormSubmit = (e, form) => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, formValues) => {
      if (err) {
        return;
      }
      const {
        dispatch,
        match: { params },
      } = this.props;
      const { id: pubAccountId } = params || {};

      const { publicUserBasic, ...formData } = formValues;
      const { pcdValue = [], birthday, ...pb } = publicUserBasic || {};
      await dispatch({
        type: 'pubuser/basicSave',
        payload: {
          ...formData,
          publicAccount: {
            ...formData.publicAccount,
            id: pubAccountId,
          },
          publicUserBasic: {
            ...pb,
            province: pcdValue[0],
            city: pcdValue[1],
            district: pcdValue[2],
            birthday: birthday ? birthday.valueOf() : null,
          },
        },
      });
      message.success('保存成功');
    });
  };

  toWithdraw = () => {
    const { dispatch } = this.props;
    dispatch(
      push({
        pathname: 'amounttopup',
        search: 'tab=withdraw',
      })
    );
  };

  icCardBinding = () => {
    this.setState({
      icCardBingdingVisible: true,
    });
  };

  resetPwdVisibleChange = visible => {
    this.setState({
      resetPwdVisible: visible,
    });
  };

  toGradeIntersts = (levelId, levelName, publicAccount) => {
    const { dispatch } = this.props;
    const { mobile, realName } = publicAccount || {};
    if (!levelId) {
      return;
    }
    dispatch(
      push({
        pathname: '/basic/pub/grade/grade-interests',
        search: `id=${levelId}&mobile=${mobile}&realName=${realName}&name=${levelName}`,
      })
    );
  };

  // switchToAFR = () => {
  //   const {
  //     dispatch,
  //     match: { params },
  //   } = this.props;
  //   dispatch(
  //     push({
  //       pathname: '/basic/device/afr/auth',
  //       search: `type=${CommonFileLinkTypes.PUBACCOUNT_FACE_AVATAR.key}&id=${params.id}`,
  //     })
  //   );
  // };
  //
  // switchToAuthPics = () => {
  //   const {
  //     dispatch,
  //     match: { params },
  //   } = this.props;
  //   dispatch(
  //     push({
  //       pathname: '/basic/device/afr/pics',
  //       search: `type=${CommonFileLinkTypes.PUBACCOUNT_FACE_AVATAR.key}&id=${params.id}`,
  //     })
  //   );
  // };

  handleIcCardBingdingVisibleVisibleChange = visible => {
    this.setState({
      icCardBingdingVisible: visible,
    });
  };

  handleIcCardBingdingOk = () => {
    message.success('绑定成功');
    this.setState({
      icCardBingdingVisible: false,
    });
  };

  resetPwd = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};
    dispatch({
      type: 'pubuser/resetPwd',
      payload: {
        id: pubAccountId,
      },
    }).then(() => {
      message.success('重置成功');
    });
  };

  render() {
    const {
      pubuser,
      basicSaving,
      match: { params },
      RelTypes,
    } = this.props;
    const { icCardBingdingVisible, resetPwdVisible } = this.state;

    const { id: pubAccountId } = params || {};
    const { userInfoCache = {}, Genders, IDCardTypes } = pubuser;
    const viewUserInfo = userInfoCache[pubAccountId] || {};
    const {
      publicAccount,
      publicUserBasic,
      backgroundColor,
      levelId,
      levelName,
      wrapperRealName,
      wechatName,
      studentName,
      welinkName,
    } = viewUserInfo;

    const {
      picUrl,
      realName,
      mobile,
      amountAvail,
      accountFee,
      descr,
      loginTime,
      // authentication
    } = publicAccount || {};
    const {
      gender,
      bio,
      birthday,
      idcardType,
      idcard,
      ethnic,
      hometown,
      height,
      weight,
      telephone,
      party,
      company,
      position,
      address,
      email,
      nationality,
      province,
      city,
      district,
    } = publicUserBasic || {};
    return (
      <>
        <Row gutter={8}>
          <Col md={24} lg={8}>
            <Card className={style.userCard}>
              <div
                className={classNames('text-center', style.avatarBg)}
                style={{ background: `linear-gradient(to right, ${rgb(backgroundColor, 0.5)}, ${backgroundColor})` }}
                onClick={() => this.toGradeIntersts(levelId, levelName, publicAccount)}
              >
                <div>
                  <Avatar
                    className={style.avatar}
                    src={formatImageUrl(picUrl, 'img_small_200X200_prew', DEFAULT_USER_AVATAR_PIC_FULLPATH)}
                  />
                </div>
                <div className={style.name}>
                  {realName}
                  {(() => {
                    switch (gender) {
                      case Genders.Male.key:
                        return <Icon type="man" style={{ color: '#0071c5' }} />;
                      case Genders.Female.key:
                        return <Icon type="woman" style={{ color: '#ff007a' }} />;
                      default:
                        return null;
                    }
                  })()}
                </div>
                <div>{bio}</div>
              </div>
              <Row>
                <Col span={8}>编号</Col>
                <Col span={16} className="text-right">
                  {pubAccountId}
                </Col>
              </Row>
              <Divider dashed />
              <Row>
                <Col span={8}>手机号</Col>
                <Col span={16} className="text-right">
                  {mobile}
                </Col>
              </Row>
              <Divider dashed />
              <Row>
                <Col span={8}>账户可用余额</Col>
                <Col span={16} className="text-right">
                  {formatMoney(amountAvail)} 元
                </Col>
              </Row>
              <Row>
                <Col span={8}>可用积分</Col>
                <Col span={16} className="text-right">
                  {formatMoney(accountFee)} 分
                </Col>
              </Row>
              <Divider dashed />
              <Row>
                <Col span={8}>出生日期</Col>
                <Col span={16} className="text-right">
                  {formatDate(birthday) || ' '}
                </Col>
              </Row>
              <Row>
                <Col span={8}>证件类型</Col>
                <Col span={16} className="text-right">
                  {formatModel(IDCardTypes, idcardType)}
                </Col>
              </Row>
              <Row>
                <Col span={8}>证件号</Col>
                <Col span={16} className="text-right">
                  {idcard}
                </Col>
              </Row>
              {ethnic && (
                <Row>
                  <Col span={8}>民族</Col>
                  <Col span={16} className="text-right">
                    {(ethnicList.find(item => item.id === ethnic) || {}).text || ethnic}
                  </Col>
                </Row>
              )}
              {hometown && (
                <Row>
                  <Col span={8}>籍贯</Col>
                  <Col span={16} className="text-right">
                    {(provinceList.find(item => item.id === hometown) || {}).name || hometown}
                  </Col>
                </Row>
              )}
              {height && (
                <Row>
                  <Col span={8}>身高</Col>
                  <Col span={16} className="text-right">
                    {height}
                    cm
                  </Col>
                </Row>
              )}
              {weight && (
                <Row>
                  <Col span={8}>体重</Col>
                  <Col span={16} className="text-right">
                    {weight}
                    kg
                  </Col>
                </Row>
              )}
              {telephone && (
                <Row>
                  <Col span={8}>固定电话</Col>
                  <Col span={16} className="text-right">
                    {telephone}
                  </Col>
                </Row>
              )}
              {party && (
                <Row>
                  <Col span={8}>政治面貌</Col>
                  <Col span={16} className="text-right">
                    {party}
                  </Col>
                </Row>
              )}
              {company && (
                <Row>
                  <Col span={8}>工作单位</Col>
                  <Col span={16} className="text-right">
                    {company}
                  </Col>
                </Row>
              )}
              {position && (
                <Row>
                  <Col span={8}>职务</Col>
                  <Col span={16} className="text-right">
                    {position}
                  </Col>
                </Row>
              )}
              {address && (
                <Row>
                  <Col span={8}>联系地址</Col>
                  <Col span={16} className="text-right">
                    {address}
                  </Col>
                </Row>
              )}
              {email && (
                <Row>
                  <Col span={8}>邮箱</Col>
                  <Col span={16} className="text-right">
                    {email}
                  </Col>
                </Row>
              )}
              {nationality && (
                <Row>
                  <Col span={8}>国籍</Col>
                  <Col span={16} className="text-right">
                    {nationality}
                  </Col>
                </Row>
              )}
              {(province || city || district) && (
                <Row>
                  <Col span={8}>省/市/区</Col>
                  <Col span={16} className="text-right">
                    {formatHomeTown(province) || province}
                    {formatHomeTown(city) || city}
                    {formatHomeTown(district) || district}
                  </Col>
                </Row>
              )}
              {descr && (
                <Row>
                  <Col span={8}>备注</Col>
                  <Col span={16} className="text-right">
                    {descr}
                  </Col>
                </Row>
              )}
              {wrapperRealName && (
                <Row>
                  <Col span={8}>已实名</Col>
                  <Col span={16} className="text-right">
                    {wrapperRealName}
                  </Col>
                </Row>
              )}
              {wechatName && (
                <Row>
                  <Col span={8}>已绑定微信</Col>
                  <Col span={16} className="text-right">
                    {wechatName}
                  </Col>
                </Row>
              )}
              {studentName && (
                <Row>
                  <Col span={8}>已绑定学生证</Col>
                  <Col span={16} className="text-right">
                    {studentName}
                  </Col>
                </Row>
              )}
              {welinkName && (
                <Row>
                  <Col span={8}>已绑定welink</Col>
                  <Col span={16} className="text-right">
                    {welinkName}
                  </Col>
                </Row>
              )}
              <Divider dashed />
              <Row>
                <Col span={8}>最后登陆时间</Col>
                <Col span={16} className="text-right">
                  {formatDateTime(loginTime)}
                </Col>
              </Row>
              {/* {publicAccount && (
                <>
                  <Divider dashed />
                  <Row>
                    <Col span={8}>人脸认证</Col>
                    <Col span={16} className="text-right">
                      {authentication ? (
                        <Button type="primary" onClick={this.switchToAuthPics}>
                          查看认证图片
                        </Button>
                      ) : (
                        <Button type="primary" onClick={this.switchToAFR}>
                          开通人脸认证
                        </Button>
                      )}
                    </Col>
                  </Row>
                </>
              )} */}
              <Divider dashed />
              <Row>
                <Col span={24} className="text-right">
                  <AuthComponent auth="reset-pwd">
                    <Button type="primary" onClick={() => this.resetPwdVisibleChange(true)}>
                      重置密码
                    </Button>
                  </AuthComponent>
                  <MarginBar inline top left>
                    <AuthComponent auth="binding">
                      <Button type="primary" onClick={this.icCardBinding}>
                        绑定IC/物理卡
                      </Button>
                    </AuthComponent>
                  </MarginBar>
                  <MarginBar inline top left>
                    <Button type="primary" onClick={this.toWithdraw}>
                      账户余额提现
                    </Button>
                  </MarginBar>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={24} lg={16}>
            <Card>
              <ProfileBaseForm
                handleFormSubmit={this.handleFormSubmit}
                fetch={this.fetch}
                saveLoading={basicSaving}
                userinfo={viewUserInfo}
              />
            </Card>
          </Col>
        </Row>
        <BindingSimpleModal
          userId={pubAccountId}
          // dataId=
          relType={RelTypes.PUBACCOUNT_USER.key}
          visible={icCardBingdingVisible}
          onVisibleChange={this.handleIcCardBingdingVisibleVisibleChange}
          onOk={this.handleIcCardBingdingOk}
        />
        <Modal
          title="重置密码"
          visible={resetPwdVisible}
          onVisibleChange={this.resetPwdVisibleChange}
          onOk={this.resetPwd}
        >
          <div className="text-center">
            <p>您确定需要重置密码吗？</p>
            <p>重置之后密码将改为手机号后六位</p>
          </div>
        </Modal>
      </>
    );
  }
}

export default ProfileBase;
