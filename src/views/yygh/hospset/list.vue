<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="医院名称">
        <el-input v-model="searchObj.hosname" placeholder="医院名称"></el-input>
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="searchObj.hoscode" placeholder="医院编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetData(1)">清空</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="removeRows()">批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      element-loading-text="数据加载中"
      :data="list"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.$index + (page - 1) * limit + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="hosname"
        label="医院名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="hoscode"
        label="医院编号"
        width="160"
      >
      </el-table-column>
      <el-table-column
        prop="apiUrl"
        label="地址"
        width="240"
      >
      </el-table-column>
      <el-table-column
        prop="contactsName"
        label="联系人"
      >
      </el-table-column>
      <el-table-column
        width="200px"
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '正常' : '锁定' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="280"
        align="center"
      >
        <template slot-scope="scope">
          <router-link :to="'/yygh/hospset/edit/' + scope.row.id">
            <el-button type="primary" icon="el-icon-edit" circle>
            </el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" circle @click="removeDataById(scope.row.id)">
          </el-button>
          <el-button type="primary" icon="el-icon-lock" v-if="scope.row.status == 1"
                     @click="lockOrUnlock(scope.row.id, 0)" circle
          >
          </el-button>
          <el-button type="primary" icon="el-icon-unlock" v-if="scope.row.status == 0"
                     @click="lockOrUnlock(scope.row.id, 1)" circle
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="padding: 30px 0; text-align: center;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 5, 7, 9]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
  import hospset from '@/api/yygh/hospset'

  export default {
    data() {
      return {
        multipleSelection: [],
        list: [],
        page: 1,
        limit: 3,
        searchObj: { hosname: '', hoscode: '' },
        total: 100,    // 默认值
        listLoading: false
      }
    },
    methods: {
      fetchData(page = 1) {
        this.listLoading = true
        this.page = page
        hospset.getPageList(this.page, this.limit, this.searchObj).then(resp => {
          console.log(resp)
          this.list = resp.data.rows
          this.total = resp.data.total

          if (this.list.length == 0) {
            if (this.page > 1) {
              this.fetchData(this.page - 1)
            }
          }

          this.listLoading = false

        })
      },
      handleSizeChange(limit) {         // 每页的条数改变时调用
        console.log(`每页 ${limit} 条`)
        this.limit = limit
        this.fetchData(1)
      },
      handleCurrentChange(page) {     // 页码改变时调用
        console.log(`当前页: ${page}`)
        this.fetchData(page)
      },
      resetData() {
        this.searchObj = { hosname: '', hoscode: '' }
        this.fetchData(1)
      },
      removeDataById(id) {
        console.log(`即将删除数据${id}`)
        this.$confirm('即将删除该医院设置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          hospset.removeById(id).then(resp => {
            if (resp.code == 20000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.fetchData(this.page)
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      removeRows() {
        this.$confirm('即将删除多条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.multipleSelection.length == 0) {
            this.$message({
              type: 'info',
              message: '请选择要删除的数据'
            })
          }

          let ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let hospset = this.multipleSelection[i]
            ids.push(hospset.id)
          }

          hospset.removeRows(ids).then(resp => {
            if (resp.code == 20000) {
              this.$message({
                type: 'success',
                message: '批量删除成功'
              })
            }
            this.fetchData(this.page)
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消批量删除'
          })
        })
      },
      lockOrUnlock(id, status) {
        hospset.lockOrUnlock(id, status).then(resp => {
          if (resp.code == 20000) {
            let msg = status == 0 ? '锁定成功' : '解锁成功'
            this.$message({
              type: 'success',
              message: msg
            })
          }
          this.fetchData(this.page)
        })
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>
