<template>
<!-- 机构红包充值 -->
 <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields">
        <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
          <!-- 机构名称 -->
          <el-form-item label="机构名称" prop="agent_name">
              <el-input v-model="queryForm.agent_name" placeholder="请输入机构名称" class="wid_140"></el-input>
          </el-form-item>
          <!-- 机构地区 -->
          <el-form-item label="机构地区">
            <el-col :span="12">
              <el-form-item prop="province_code">
                <el-select v-model="queryForm.province_code" placeholder="选择省" class="wid_140" @change="changeOption_province($event)">
                  <el-option v-for="(item, index) in queryForm.regions" :key="index" :label=" item.province " :value=" item.adcode ">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="city_code">
                <el-select v-model="queryForm.city_code" placeholder="选择市" class="wid_140" @change="changeOption_city($event)">
                  <el-option v-for="(item, index) in queryForm.cities" :key="index" :label=" item.city " :value=" item.adcode ">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <!-- 联系人 -->
          <el-form-item label="联系人" prop="charger">
              <el-input v-model="queryForm.charger" placeholder="请输入联系人" class="wid_140"></el-input>
          </el-form-item>
          <!-- 银行账号 -->
          <el-form-item label="银行账号" prop="account_no">
              <el-input v-model="queryForm.account_no" placeholder="请输入银行账号" class="wid_140"></el-input>
          </el-form-item>
          <!-- 查询 -->
          <el-form-item>
              <el-button type="primary" size='mini' @click="queryData">查询</el-button>
              <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
              <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>
          </el-form-item>
        </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
          <el-table-column prop="agent_name" label="机构名称" width="" >
          </el-table-column>
          <!-- 业务地区 -->
          <el-table-column prop label="业务地区" width="">
            <template slot-scope="scope">
              <span>{{scope.row.province+scope.row.city}}</span>
            </template>
          </el-table-column>
          <!-- 联系人 -->
          <el-table-column prop="charger" label="联系人" width="" >
          </el-table-column>
          <!-- 联系电话 -->
          <el-table-column prop="phone" label="联系电话" width="120" >
          </el-table-column>
          <!-- 银行账号 -->
          <el-table-column prop="account_no" label="银行账号" width="" >
          </el-table-column>
          <!-- 现有余额 -->
          <el-table-column prop="accountRemain" label="现有余额(元)" width="120" >
          </el-table-column>
          <el-table-column v-if="roleId == '9'" prop="" label="操作" width="120">
            <template slot-scope="scope">
                <el-button   @click="handle_upload(scope.row)" type="text" size="small">充值</el-button>
                <!-- <el-button @click="view_upload(scope.row)" type="text" size="small">查看发票</el-button>
                <el-button v-if="roleId != 1" @click="handle_check(scope.row)" type="text" size="small">审核</el-button> -->
            </template>
          </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block mar_t10">
          <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="pageTotal"
          background
          layout="total, prev, pager, next, jumper"
          >
          </el-pagination>
      </div>
    </div>
    <!-- M3 dialog 上传凭证-->
    <el-dialog

      title="充值并上传凭证"
      :visible.sync="add_dialog"
      width="30%"
      center

      v-loading="invoice_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      >
      <!-- body append-to-body-->
      <!-- :http-request="handleUpload" -->
      <div class="wid_b75">
        <!-- 充值金额 -->
        <el-form :inline="true" :model="rechargeForm" :rules="rechargeForm_rules" ref="rechargeForm"  class="demo-ruleForm demo-form-inline valid_form">
          <el-form-item label="充值金额" prop="recharge_money" label-width="120px">
              <el-input type="text" v-model.number="rechargeForm.recharge_money" placeholder="请输入充值金额" class="wid_140"></el-input>元
          </el-form-item>
          <el-form-item label="上传入账凭证" prop="uploadFile" label-width="120px">
            <el-upload
              action="#"
              :http-request="handleUpload"
              :before-upload="beforeInvoiceUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-exceed="limitTip"
              :limit="1"
              ref="uploadlist"
              >

              <i  class="el-icon-plus"></i>
            </el-upload>
            <el-dialog

              title="查看入账凭证"
              :visible.sync="invoiceDialogVisible"
              append-to-body
              center
              top="10vh"
              class="invoiceimg_wrap"
              >
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>


      </div>
      <!-- footer  -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="add_dialog = false" size='mini'>取 消</el-button>
      <el-button type="primary" @click="saveData" size='mini'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- M4 dialog 查看发票 -->
    <el-dialog
      title="查看发票"
      :visible.sync="view_dialog"
      width="30%"

      center
      v-loading="view_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"

      >

      <img width="100%" :src="viewImageUrl" alt="">

      <!-- footer -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="view_dialog = false" size='mini'>取 消</el-button>
      </span>
    </el-dialog>
    <!-- M5 dialog 审核-->
    <el-dialog
      title="审核"
      :visible.sync="detail_check_dialogVisible"
      width="30%"

      center
      v-loading="detail_check_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      >
      <!-- 业务审核 -->
      <el-form :inline="true" :model="detail_check_form" :rules="detail_check_rules" ref="detail_check_form"  class="demo-ruleForm demo-form-inline valid_form">
          <el-form-item label="审核状态" prop="merchant_check" label-width="80px">
            <!-- 1待审核2通过3拒绝 -->
            <el-radio-group
              v-model="detail_check_form.merchant_check"
              @change="selectedAgentCheck($event)">
              <!-- <el-radio label="1">待审核</el-radio> -->
              <el-radio label="3">拒绝</el-radio>
              <el-radio label="2">通过</el-radio>

            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核说明" prop="check_remark" label-width="80px">
              <el-input type="textarea" v-model="detail_check_form.check_remark" ></el-input>
          </el-form-item>
      </el-form>
      <!-- footer -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="detail_check_dialogVisible = false" size='mini'>取 消</el-button>
        <el-button type="primary" @click="save_check" size='mini'>确 定</el-button>

      </span>
    </el-dialog>
 </div>

</template>

<script>
import provinces from "../../utils/area.js";
import { mapGetters } from 'vuex'
import commonUrl from '../../utils/common';
import qs from 'qs';
import axios from 'axios'
// 引入 COS
import COS from 'cos-js-sdk-v5'

export default {
  name: 'agentRechargeList',
  data(){

      // 校验分成
      let validRecharge=(val,value,callback)=>{
          if (!value){
              callback(new Error('请输入值'))
          }else {
              callback()
          }
      }
      return {
        // 地图
          districtSearch: "",
          roleId:'',
          // COS 所需参数
          cos:'',
          Bucket:'',
          Region:'',
          // ***主列表数据
          tableLoading: false,
          view_loading: false,
          tableData: [],

          invoice_loading:false,
          invoiceDialogVisible:false,

          detail_check_dialogVisible:false,
          detail_check_loading:false,
          // ***查询区
          queryForm: {

            agent_name:'',
            // 初始化 省 regions  市 cities
            regions: "",
            cities: [],
            // 省市
            province_code: "",
            city_code: "",
            // 银行账号
            account_no:'',
            // 联系人
            charger:''
          },
          // 分页
          pageTotal: 0,
          currentPage:1,
          // 弹框
          add_dialog:false,
          view_dialog:false,

          dialogImageUrl:'',
          viewImageUrl:'', // 查看发票
          // 机构id (每次上传时都要存一下)
          agent_accountid:'',
          // 充值上传凭证需要
          agentid:'',
          _key:'' ,// 记录一下上传时的key
          // 充值
          rechargeForm:{
            // 充值金额
            recharge_money:'',
            agentid:'',
          },
          rechargeForm_rules:{
            recharge_money:[
              { required: true, validator:validRecharge, trigger: 'blur' },
              { type: 'number', message: '充值金额必须是数字'}
            ],
            uploadFile:[
              {required: true, validator: this.validateFile, trigger: 'change'}
            ]
          },
          //审核
          check_dialog:false,
          check_loading:false,
          detail_check_form:{
            agent_accountid:'',
            // 审核类别
            merchant_checks:[
                {
                    id:1,
                    txt:'待审核'
                },
                {
                    id:2,
                    txt:'审核通过'
                },
                {
                    id:3,
                    txt:'审核拒绝'
                }
            ],
            merchant_check:'3',
            // 审核说明
            check_remark:'',
          },
          // 审核 规则
          detail_check_rules:{
              // 审核状态
              // merchant_check:[
              //     { required: true, message: '请选择审核状态', trigger: 'change' }
              // ],
              check_remark:[
                  { required: true, message: '请输入拒绝原因', trigger: 'blur' }
              ]
          },
      }
  },
  created(){
    // 初始化 地图plugin
    this.initMap();
    // 初始化 省份
    this.initProvinces();
    this.roleId = this.$store.getters.roleId
    // 获取cos参数
    this.getCOSParam();
    //  获取所有数据
    this.getTableDataList(1);
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    // 获取cos参数
    getCOSParam(){
      let vm  = this
      this.$http.post(`${commonUrl.baseUrl}/agentAccount/getCosKey`)
      .then(function (res) {
        if(res.data.code == '0000'){
          let result = res.data.data.liveList
          // 创建cos实例
          vm.cos = new COS({
            AppId: result.Appid,
            SecretId: result.SecretId,
            SecretKey: result.SecretKey,
          });
          // 存 cos 桶 和 源
          vm.Bucket = result.Bucket
          vm.Region = result.Region
        }

      })
      .catch(function (err) {
        console.log(err);
      });
    },
    // 初始化 主列表 数据
    getTableDataList(pageNum){
      let param = {
        data:{
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有参数
          account_no:this.queryForm.account_no,
          charger:this.queryForm.charger,
          agent_name:this.queryForm.agent_name,
          province_code:this.queryForm.province_code,
          city_code:this.queryForm.city_code
        }
      }
      this.tableLoading = true

      this.$http.post(`${ commonUrl.baseUrl }/agent/agentRechargeList`, param).then(res=>{
        if(res.data.code == '0000'){

          // 数据
          this.tableData = res.data.data.agentRechargeList
          // 分页总数
          this.pageTotal = res.data.data.page.pageTotal;
          this.tableLoading = false
        }
      }).catch(err=>{

      })
    },
    // 审核操作
    handle_check(row){
      this.detail_check_form.agent_accountid = row.agent_accountid
      // 清空数据

      this.detail_check_dialogVisible = true
      this.resetData('detail_check_form');
    },
    // 选中审核状态
    selectedAgentCheck(e){

      if(e == '2'){ // 通过
          this.detail_check_rules.check_remark = null
      }else{
          this.detail_check_rules.check_remark = [
              { required: true, message: '请输入审核说明', trigger: 'blur' }
          ]
      }
    },
    // 保存审核
    save_check(){
      if(this.m_valid_addForm('detail_check_form')){
        let param = {
            data: {
                // 公参
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
                userid: this.detail_check_form.userid,
                // 私参
                agent_accountid:this.detail_check_form.agent_accountid,
                check_status:this.detail_check_form.merchant_check,
                check_remark:this.detail_check_form.check_remark,
            }
        }
        this.detail_check_loading = true
        this.$http.post(`${ commonUrl.baseUrl}/agentAccount/agentAccountAuditor`, param).then(res=>{
            if(res.data.code == '0000'){

                this.detail_check_loading = false
                this.detail_check_dialogVisible = false
                this.m_message(res.data.msg, 'success')
                this.handle_refresh(1);
            }
        }).catch(err=>{})
      }
    },

    // 查询按钮
    queryData(){
      this.getTableDataList(1);
      this.currentPage = 1
    },
    // 刷新 主列表
    handle_refresh(){
        this.getTableDataList(this.currentPage);
        // this.currentPage = 1
    },
    // 预检 上传
    beforeInvoiceUpload(file){

      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if(!isJPG){
        this.m_message('只能上传图片', 'warning')
        return false
      }

    },
     // 上传 凭证（真正上传）
    handleUpload(param){

      const vm = this

      let file = param.file;
      if (!file) return;
      let originName = file.name;
      let originSize = file.size;
      let originType = file.type;
      // 文件夹 文件名
      let  fileName =  new Date().getTime() + originName
      let  fileFolder = 'RechargeImg/'
      let  key = 'RechargeImg/' + new Date().getTime() + originName   // fileFolder + fileName
      vm.invoice_loading = true
      vm.cos.sliceUploadFile({
        Bucket: vm.Bucket,
        Region: vm.Region,
        Key: key, //上传的文件夹和图片名称
        Body: file, //要上传的文件
        onProgress: function (progressData) {
            /* 上传进度 */
            console.log(progressData);
        }
      }, function (err, data) {

          if (data.statusCode == 200) { // 上传成功返回url
            vm.rechargeForm._key = key;
            vm.invoice_loading = false
          }

      });

    },
    handlePictureCardPreview(file){

      this.dialogImageUrl = file.url;
      this.invoiceDialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 个数限制
    limitTip(){
      this.m_message('只能上传一张', 'warning')
    },
    // 充值操作
    handle_upload(row){
      // 清空 imgUrl
      this.dialogImageUrl = ''
      // 清空_key
      this.rechargeForm._key = ''
      this.add_dialog = true
      this.rechargeForm.agentid = row.agentid
    },
    // 保存上传凭证
    saveData(){

      if(this.m_valid_addForm('rechargeForm')){
        let param = {
          data:{
              agentid:this.rechargeForm.agentid,
              recharge_money:this.rechargeForm.recharge_money*100,
              recharge_credit_url:'/'+this.rechargeForm._key
          }
        }
        this.invoice_loading = true
        // 将数据传给后台
        this.$http.post(`${commonUrl.baseUrl}/agentRechargeCheck/recharge`, param).then(res=>{
          if(res.data.code == '0000'){
            this.invoice_loading = false
            this.add_dialog = false
            // 提示成功
            this.m_message(res.data.msg, 'success')
            // 清空凭证图 清空充值金额
            this.$refs.uploadlist.clearFiles()
            this.rechargeForm.recharge_money = ''
            // 刷新 主数据列表
            this.getTableDataList(1);
          }
        }).catch(err=>{  })
      }

    },
    // 查看发票
    view_upload(row){
      let param = {
        data:{
          agent_accountid:row.agent_accountid+''
        }
      }
      // 弹框  加载中
      this.viewImageUrl = ''

      this.view_dialog = true
      this.view_loading= true

      this.$http.post(`${commonUrl.baseUrl}/agentAccount/checkInvoices`, param).then(res=>{
        if(res.data.code == '0000'){
          //console.log(res)

          this.viewImageUrl = res.data.data.agentAccount.invoice_url
          // 加载 结束
          this.view_loading = false
        }
      }).catch(err=>{  })
    },
    // 收益状态 change事件
    changeProfitState(e){

    },
    // 新增 校验规则
    m_valid_addForm(formName) {
        let  flag  = false ;
        this.$refs[formName].validate((valid) => {
            if (valid) {
            flag = true;
            return true
            } else {
            flag = false;
            return false;
            }
        });
        return flag;
    },
    // 校验文件上传
    validateFile (rule, value, callback) {
      if (!this.$refs.uploadlist.uploadFiles.length) {
        callback(new Error('请选择要上传的文件'))
      } else {
        callback()
      }
    },
    // 分页
    handleCurrentChange(val){
      this.currentPage = val
      // 获取主页列表数据(loading状态)
      this.getTableDataList(val)
      //console.log(`当前页: ${val}`);
    },
    // 重置查询条件
    resetData(formName){
        this.$refs[formName].resetFields();
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message,type){
      this.$message({
        message,
        type
      })
    },
    // 省份change事件
    changeOption_province(e) {
      // 参数收集
      this.queryForm.province_param = {
        adcode: e,
        txt: provinces.province_list[e]
      };
      // console.log(e)
      // console.log(provinces.province_list[e])
      // 赋值cities (先清理 后赋值)
      this.queryForm.cities = [];
      this.queryForm.city_code = "";
      this.queryCity(provinces.province_list[e], "queryForm");
    },
     // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
    queryCity(txt, dataOrigin) {
      let vm = this;
      // 搜索所有省/直辖市信息

      this.districtSearch.search(txt, function(status, result) {
        // console.log(result)
        // 查询成功时，result即为对应的行政区信息
        for (let item of result.districtList[0].districtList) {
          vm[dataOrigin].cities.push({
            adcode: item.adcode,
            city: item.name
          });
        }
      });
    },
    // 市区change事件
    changeOption_city(e) {},
    // 初始化 省份数据
    initProvinces() {
      // 处理一下 数据
      let arr = [];
      for (let i in provinces.province_list) {
        arr.push({
          adcode: i,
          province: provinces.province_list[i]
        });
      }
      this.queryForm.regions = arr;
      // 详情
      //this.detail_form.regions = this.detail_form.account_regions = arr;
      // 详情并修改
      //this.agent_detail_form.regions = this.agent_detail_form.account_regions = arr;
    },
    // 初始化 地图
    initMap() {
      let vm = this;
      //利用高德地图API 获取 所有省
      AMap.plugin("AMap.DistrictSearch", function() {
        vm.districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: "city",
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 1
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}
</style>
