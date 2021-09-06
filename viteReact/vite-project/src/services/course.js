import { get, postJSON } from '@/utils/request';

export async function queryCourseDetail(params) {
  return get('/course/courseDetails.do', params);
}

export async function queryCourseInfo(params) {
  return get('/course/confirmCourseInfo.do', params);
}

export async function queryCourseSchedule(params) {
  return get('/course/reserveDailySchedule.do', params);
}

export async function queryFixedCourseByName(params) {
  return get('/course/queryCourseNameList.do', params);
}

export async function postBatchSign(params) {
  return postJSON('/publicStudyCourse/batchSign.do', params);
}

export async function queryCourseClassInfo(params) {
  return get('/course/courseAboutInfo.do', params);
}

export async function postChangeCourseSurplusNum(params) {
  return postJSON('/courseData/modifyQuota.do', params);
}

export async function postAddOrUpdateCourseSchedule(params) {
  return postJSON('/courseData/modifySchedule.do', params);
}

export async function postUpdateCourseTeachers(params) {
  return postJSON('/courseData/modifySysUser.do', params);
}

export async function postUpdateCoursePlatforms(params) {
  return postJSON('/courseData/modifyPlatform.do', params);
}

export async function postUpdateLinkCourseCycle(params) {
  return postJSON('/publicServiceAccount/saveCourse.do', params);
}

export async function checkIsExistsTime(params) {
  return get('/courseData/isExistsTime.do', params);
}

export async function queryPlatformListByScheduleId(params) {
  return get('/courseSchedulePlatform/list.do', params);
}

export async function queryTeacherListByScheduleId(params) {
  return get('/courseScheduleSysUser/list.do', params);
}

export async function queryCourseDealInfo(params) {
  return get('/courseData/courseDataDetails.do', params);
}

export async function queryCourseDateList(params) {
  return get('/courseCalendar/list.do', params);
}

export async function queryCourseSysUser() {
  return get('/courseScheduleSysUser/courseScheduleSysUserList.do');
}
