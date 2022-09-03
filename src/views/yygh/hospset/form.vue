<template>
  <div class="app-container">
    <el-form ref="form" label-width="120px">
      <el-form-item label="医院名称">
        <el-input v-model="hospset.hosname"></el-input>
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input :disabled="isEdit" v-model="hospset.hoscode"></el-input>
      </el-form-item>
      <el-form-item label="签名key">
        <el-input v-model="hospset.signKey"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="hospset.contactsName"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="hospset.contactsPhone"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate()" :disabled="saveBtnDisabled">保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import hospset from '@/api/yygh/hospset'

  export default {
    data() {
      return {
        saveBtnDisabled: false,
        isEdit: false,
        hospset: {
          hosname: '',
          hoscode: '',
          signKey: '',
          contactsName: '',
          contactsPhone: ''
        }
      }
    },
    methods: {
      saveOrUpdate() {
        this.saveBtnDisabled = true
        if (this.hospset.id) {
          this.updateData()
        } else {
          this.saveData()
        }
      },
      saveData() {
        hospset.save(this.hospset).then(resp => {
          if (resp.code == 20000) {
            if (resp.message != '操作成功') {
              this.$message({
                type: 'error',
                message: resp.message
              })
              this.saveBtnDisabled = false
            } else {
              this.$message({
                type: 'success',
                message: '开通成功!'
              })
              this.$router.push({
                path: '/yygh/hospset/list'
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: '开通失败!'
            })
          }
        })
      },
      updateData() {
        hospset.updateById(this.hospset).then(resp => {
          if (resp.code == 20000) {
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
            this.$router.push({
              path: '/yygh/hospset/list'
            })
          } else {
            this.$message({
              type: 'error',
              message: '更新失败!'
            })
          }
        })
      },
      cancel() {
        this.$router.push({
          path: '/yygh/hospset/list'
        })
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id) { // 将要进行修改操作, 需要回显
        console.log('修改')
        this.isEdit = true
        hospset.getById(this.$route.params.id).then(resp => {
          this.hospset = resp.data.item
        })
      } else {  // 新增, 不需要回显
        console.log('新增')
      }
    }
  }

</script>
