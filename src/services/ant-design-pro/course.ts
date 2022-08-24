/* eslint-disable */
import { request } from '@umijs/max';




export async function getCourseClassifyList() {
  return request<APICourse.CourseClassify>('/v1/course/classify', {
    method: 'GET',
  })
}
