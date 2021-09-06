import { PubCourseModel } from '@/commons/lib/models';
import {
  queryCourseDetail,
  queryCourseInfo,
  queryCourseSchedule,
  queryFixedCourseByName,
  postBatchSign,
  queryCourseClassInfo,
  postChangeCourseSurplusNum,
  postAddOrUpdateCourseSchedule,
  postUpdateCourseTeachers,
  postUpdateCoursePlatforms,
  postUpdateLinkCourseCycle,
  queryPlatformListByScheduleId,
  queryTeacherListByScheduleId,
  checkIsExistsTime,
  queryCourseDealInfo,
  queryCourseDateList,
  queryCourseSysUser,
} from '@/services/course';

export default {
  // 课程
  namespace: 'pubcourse',

  state: {
    ...PubCourseModel,
  },

  effects: {
    fetch: [
      function* fetch({ payload }, { call }) {
        return yield call(queryCourseDealInfo, payload);
      },
      {
        type: 'takeLatest',
      },
    ],
    *fetchCourse({ payload }, { call }) {
      const courseDataId = payload;
      if (courseDataId == null) {
        return null;
      }
      return yield call(queryCourseDetail, {
        courseDataId,
      });
    },
    *fetchCourseSysUser(_, { call }) {
      return yield call(queryCourseSysUser);
    },
    *fetchCourseInfo({ payload }, { call }) {
      const courseDataId = payload;
      if (courseDataId == null) {
        return null;
      }
      return yield call(queryCourseInfo, {
        courseDataId,
      });
    },
    *fetchCourseSchedule({ payload }, { call }) {
      return yield call(queryCourseSchedule, payload);
    },
    *fetchCourseDateList({ payload }, { call }) {
      return yield call(queryCourseDateList, payload);
    },
    fetchFixedCourseByName: [
      function* fetchFixedCourseByName({ payload }, { call }) {
        return yield call(queryFixedCourseByName, {
          courseName: payload,
        });
      },
      {
        type: 'takeLatest',
      },
    ],
    *batchSign({ payload }, { call }) {
      yield call(postBatchSign, payload);
    },
    *getCourseClassInfo({ payload }, { call }) {
      const courseDataId = payload;
      if (payload == null) {
        return null;
      }
      return yield call(queryCourseClassInfo, {
        courseDataId,
      });
    },
    *updateCourseSurplusNum({ payload }, { call }) {
      yield call(postChangeCourseSurplusNum, payload);
    },
    *addOrUpdateCourseSchedule({ payload }, { call }) {
      yield call(postAddOrUpdateCourseSchedule, payload);
    },
    *updateCourseTeachers({ payload }, { call }) {
      yield call(postUpdateCourseTeachers, payload);
    },
    *updateCoursePlatforms({ payload }, { call }) {
      yield call(postUpdateCoursePlatforms, payload);
    },
    *saveLinkCourseCycle({ payload }, { call }) {
      yield call(postUpdateLinkCourseCycle, payload);
    },
    *fetchAllPlatformByCourseDataId({ payload }, { call }) {
      return yield call(queryPlatformListByScheduleId, payload);
    },
    *fetchAllTeacherByCourseDataId({ payload }, { call }) {
      return yield call(queryTeacherListByScheduleId, payload);
    },
    *ToCheckIsExistsTime({ payload }, { call }) {
      return yield call(checkIsExistsTime, payload);
    },
  },

  reducers: {},
};
