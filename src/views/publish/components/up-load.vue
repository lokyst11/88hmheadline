<template>
  <div>
      <p @click="centerDialogVisible=true">点击图片上传</p>
      <el-dialog
        title="请选择文章封面图片"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
       </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  components: {},
  props: {},
  data () {
    return {
      // 对话框显示或隐藏
      centerDialogVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {}
}
</script>

<style>

</style>
