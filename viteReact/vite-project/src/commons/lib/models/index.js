import ActionModel from './action';
import ActivityModel from './activity';
import Activity2Model from './activity2';
import AnalysisModel from './analysis';
import CompanyModel from './company';
import ContactModel from './contact';
import DealModel from './deal';
import ExamModel from './exam';
import ExtfieldModel from './extfield';
import Extfield2Model from './extfield2';
import Extfield3Model from './extfield3';
import LogisticsModel from './logistics';
import PaymentModel from './payment';
import InvoiceModel from './invoice';
import PubAccountModel from './pubaccount';
import PubCourseModel from './pubcourse';
import PubCreditModel from './pubcredit';
import PubItemModel from './pubitem';
import PubMarketingMemberModel from './pubmktmb';
import PubPlatformModel from './pubplatform';
import PubScanModel from './pubscan';
import PubServiceModel from './pubservice';
import PubServiceUserModel from './pubserviceuser';
import PubSignUpModel from './pubsignup';
import PubTicketModel from './pubticket';
import PubUserModel from './pubuser';
import PubWithdrawModel from './pubwithdraw';
import VenueModel from './venue';
import CommonFileModel from './commonfile';
import FeeModel from './fee';
import StoreModel from './store';
import QrCodeMatrixModel from './qrcodematrix';
import RelTypes from './reltypes';
import PubFeedbackModel from './pubfeedback';
import ContributeModel from './contribute';
import VideoCollectModel from './video-collect';
import DigitalModel from './digital';
import CouponModel from './coupon';
import RentModel from './rent';
import MessageModel from './message';
import ReservationModel from './reservation';
import TemplateModel from './template';

export function getItemByModelKey(model, key) {
  return Object.values(model || {}).find(item => item.key === key);
}

/**
 * 符合 key, value 通过key获得value
 * @param {*} model
 * @param {*} key
 */
export function getValueByModelKey(model, key) {
  return (getItemByModelKey(model, key) || {}).value;
}

/**
 * 从model 得到key,text属性的项组成的数组
 * @param {*} model
 */
export function optionsMapper(model) {
  if (model == null) {
    return null;
  }
  return (Array.isArray(model) ? model : Object.values(model)).map(item => ({
    key: item.key,
    text: item.value,
  }));
}

// 数据类型
export { RelTypes };

export {
  ActionModel,
  ActivityModel,
  Activity2Model,
  AnalysisModel,
  CompanyModel,
  ContactModel,
  DealModel,
  ExamModel,
  ExtfieldModel,
  Extfield2Model,
  Extfield3Model,
  LogisticsModel,
  PaymentModel,
  InvoiceModel,
  PubAccountModel,
  PubCourseModel,
  PubCreditModel,
  PubItemModel,
  PubMarketingMemberModel,
  PubPlatformModel,
  PubScanModel,
  PubServiceModel,
  PubServiceUserModel,
  PubSignUpModel,
  PubTicketModel,
  PubUserModel,
  PubWithdrawModel,
  VenueModel,
  CommonFileModel,
  FeeModel,
  StoreModel,
  QrCodeMatrixModel,
  PubFeedbackModel,
  ContributeModel,
  VideoCollectModel,
  DigitalModel,
  CouponModel,
  RentModel,
  MessageModel,
  ReservationModel,
  TemplateModel,
};
