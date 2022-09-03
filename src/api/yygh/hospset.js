import request from '@/utils/request'
// import da from 'element-ui/src/locale/lang/da' // 是一个用来发请求的组件

const api_name = '/admin/hosp/hospitalSet'

export default {
  // 发起带条件的分页查询请求
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
  // 根据id删除
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  // 保存
  save(hospset) {
    return request({
      url: `${api_name}/saveHospSet`,
      method: 'post',
      data: hospset
    })
  },
  // 根据id查询
  getById(id) {
    return request({
      url: `${api_name}/getHospSet/${id}`,
      method: 'get'
    })
  },
  // 更新
  updateById(hospset) {
    return request({
      url: `${api_name}/updateHospSet`,
      method: 'post',
      data: hospset
    })
  },
  // 批量删除
  removeRows(ids) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: ids
    })
  },
  // 解锁或锁定
  lockOrUnlock(id, status) {
    return request({
      url: `${api_name}/lockHospitalSet/${id}/${status}`,
      method: 'put'
    })
  }
}

