/**
 *  文件关联枚举
 */
export const CommonFileLinkTypes = {
  PUBACCOUNT_FACE_AVATAR: {
    key: 33,
    value: '会员用户人脸认证头像',
  },
  SYSUSER_FACE_AVATAR: {
    key: 43,
    value: '系统用户人脸认证头像',
  },
  PUBLICSTUDY_FACE_AVATAR: {
    key: 80_000,
    value: '人员人脸认证头像',
  },
  DIGITAL_NEWSPAPER_IMG: {
    key: 700_001,
    value: '电子报素材图片',
  },
  DIGITAL_NEWSPAPER_LAYOUT_IMG: {
    key: 700_002,
    value: '电子报版面源文件',
  },
  DIGITAL_NEWSPAPER_LAYOUT_OCR_IMG: {
    key: 700_003,
    value: '电子报版面捕捉图片',
  },
  DIGITAL_NEWSPAPER_MUSIC: {
    key: 700_004,
    value: '电子报新闻背景音乐',
  },
  DIGITAL_NEWSPAPER_HTML: {
    key: 700_005,
    value: '电子报新闻富文本',
  },
  DIGITAL_NEWSPAPER_LOGO: {
    key: 700_006,
    value: '电子报Logo',
  },
  DIGITAL_NEWSPAPER_QR_CODE: {
    key: 700_007,
    value: '电子报公众号二维码',
  },
};

/**
 * 人脸认证状态
 */
export const AuthenticationStatus = {
  UNCERTIFIED: {
    key: 0,
    value: '未认证',
  },
  CERTIFIED: {
    key: 1,
    value: '已认证',
  },
};

export default {
  CommonFileLinkTypes,
  AuthenticationStatus,
};
