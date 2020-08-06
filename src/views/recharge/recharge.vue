<template>
    <!-- 充值收益 -->
    <div class="pad_5">
      <!-- M1 查询区域 -->
      <div class="query_fields pad_b_no handle_timerange">
        <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
          <!-- 所属机构 -->
          <el-form-item label="所属机构" prop="agentName" label-width="68px">
              <el-input v-model="queryForm.agentName" placeholder="所属机构" class="wid_140"></el-input>
          </el-form-item>
          <!-- 用户ID customid-->
          <el-form-item label="用户ID" prop="customid" label-width="88px">
              <el-input v-model="queryForm.customid" placeholder="用户ID" class="wid_140"></el-input>
          </el-form-item>
          <!-- 出行时间 -->
          <el-form-item label="订单时间" prop="allTime">
              <el-date-picker
                  v-model="queryForm.allTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="订单开始时间"
                  end-placeholder="订单结束时间">
              </el-date-picker>
          </el-form-item>
          <!-- 查询 -->
          <el-form-item>
              <el-button type="primary" size='mini' @click="queryData">查询</el-button>
              <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
              <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>
              <el-button type="primary" size='mini' @click="exportData('queryForm')">导出数据</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- M2 主列表 -->
      <div>
          <!-- 表格 -->
          <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
            <el-table-column prop="money" label="充值金额" width="80px"></el-table-column>
            <el-table-column prop="customid" label="用户ID" width="70px"></el-table-column>
            <el-table-column prop="nickname" label="昵称" width="70px"></el-table-column>
            <el-table-column prop="" label="所属机构" :show-overflow-tooltip="true" width="">
               <template slot-scope="scope">
                  <el-button @click="handle_agent_name(scope.row)" type="text" size="small">{{ scope.row.agentName }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="" label="推荐人"  width="80">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handle_detail(scope.row,'up_customid')">{{  scope.row.up_custom_name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="" label="上级推荐人"  width="">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handle_detail(scope.row,'grand_customid')">{{  scope.row.grand_customname }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="cityAmount" label="机构分成"  width=""></el-table-column>
            <el-table-column prop="upAmount" label="推荐人分成"  width=""></el-table-column>
            <el-table-column prop="grandAmount" label="上级推荐人分成"  width=""></el-table-column>
            <el-table-column prop="orderTime" show-overflow-tooltip label="订单时间" width=""></el-table-column>
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
      <!-- M3 dialog 详情 -->
      <el-dialog
        title="详情"
        :visible.sync="dialogVisible_detail"
        width="42%"
        class="addUsers_dialog"
        center
        v-loading="add_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <!--新增 body -->
        <div class="dialogBody_addPermission">
          <div class="grid-content bg-purple-dark pad_t2">
            <el-form
              :inline="true"
              :model="detailForm"
              label-width="80px"
              class="demo-form-inline valid_form"
            >
              <el-form-item label="用户ID">
                <el-input v-model="detailForm.customid" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="detailForm.nickname" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <el-form-item label="年龄">
                <el-input v-model="detailForm.age" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <el-form-item label="性别" class="wid_parent">
                <template>
                  <el-radio disabled v-model="detailForm.sex" label="男">男</el-radio>
                  <el-radio disabled v-model="detailForm.sex" label="女">女</el-radio>
                </template>
              </el-form-item>
              <el-form-item label="微信号">
                <el-input v-model="detailForm.wechat" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <el-form-item label="地址" class="wid_parent">
                <el-input v-model="detailForm.addr" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <el-form-item label="身高">
                <el-input v-model="detailForm.tall" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <el-form-item label="体重">
                <el-input v-model="detailForm.weight" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <!-- <el-form-item label="电话">
                <el-input v-model="detailForm.phone" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <el-form-item label="会员状态">
                <el-input
                  v-model="detailForm.member_status"
                  :disabled="true"
                  class="wid_140"
                  placeholder
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="detailForm.email" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item>
              <el-form-item label="客户ID">
                <el-input v-model="detailForm.customid" :disabled="true" class="wid_140" placeholder></el-input>
              </el-form-item> -->
              <el-form-item label="职业">
                <el-input
                  v-model="detailForm.custom_type"
                  :disabled="true"
                  class="wid_140"
                  placeholder
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="用户状态">
                <el-input
                  v-model="detailForm.custom_status"
                  :disabled="true"
                  class="wid_140"
                  placeholder
                ></el-input>
              </el-form-item> -->
            </el-form>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="dialogVisible_detail = false" size="mini">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- M5 dialog所属机构-->
      <el-dialog
          title="机构详情"
          :visible.sync="agent_detail_dialogVisible"
          width="50%"
          center
          :close-on-click-modal="false"
          v-loading="agent_detail_loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="agent_detail"
          >
          <!-- 业务信息 -->
          <el-form :inline="true" :model="agent_detail_form"   class="demo-form-inline " label-width="68px" disabled>
              <!-- 业务信息 -->

              <el-form-item label="机构名称" prop="agent_name">
                  <el-input v-model="agent_detail_form.agent_name" placeholder="审批人" class="wid_180"></el-input>
              </el-form-item>
              <!-- <el-form-item label="机构编号" prop="agentid">
                  <el-input v-model="agent_detail_form.agentid" placeholder="" class="wid_180"></el-input>
              </el-form-item> -->
              <el-form-item label="负责人" prop="charger" label-width="68px">
                  <el-input v-model="agent_detail_form.charger" placeholder="负责人" class="wid_180"></el-input>
              </el-form-item>
              <!-- <el-form-item label="业务地区"  class="marg_r0">
                  <el-col :span="11">
                      <el-form-item prop="province_code" class="marg_b0">
                          <el-select v-model="agent_detail_form.province_code"
                              placeholder="选择省"
                              class="wid_90"
                              @change="changeOption_province_addBusiness($event)">
                              <el-option v-for="(item, index) in agent_detail_form.regions"
                                  :key="index"
                                  :label=" item.province "
                                  :value=" item.adcode ">
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :span="11">
                      <el-form-item prop="city_code" class="marg_b0">
                          <el-select v-model="agent_detail_form.city_code"
                              placeholder="选择市"
                              class="wid_90"
                              @change="changeOption_city_addBusiness($event)">
                              <el-option v-for="(item, index) in agent_detail_form.cities"
                                  :key="index"
                                  :label=" item.city "
                                  :value=" item.adcode ">
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
              </el-form-item> -->
              <el-form-item label="联系地址" prop="address">
                  <el-input v-model="agent_detail_form.address" placeholder="联系地址" class="wid_180"></el-input>
              </el-form-item>
              <!-- <el-form-item label="贝壳分成" prop="virtual_rate">
                  <el-input v-model="agent_detail_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
              </el-form-item> -->
              <el-form-item label="联系电话" prop="phone" >
                  <el-input v-model="agent_detail_form.phone" placeholder="联系电话" class="wid_180"></el-input>
              </el-form-item>
              <!-- <el-form-item label="出行分成" prop="account_rate">
                  <el-input v-model="agent_detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
              </el-form-item> -->
              <el-form-item label="联系邮箱" prop="email" >
                  <el-input v-model="agent_detail_form.email" placeholder="联系邮箱" class="wid_180"></el-input>
              </el-form-item>
              <!-- <el-form-item label="合同编号" prop="contract_no">
                  <el-input v-model="agent_detail_form.contract_no" placeholder="合同编号" class="wid_180"></el-input>
              </el-form-item> -->
              <div></div>
                <el-form-item label="开户名" prop="account_user" label-width="68px">
                  <el-input v-model="agent_detail_form.account_user" placeholder="开户名" class="wid_180"></el-input>
              </el-form-item>
              <el-form-item label="开户行" prop="bank_code" label-width="68px">
                  <el-select v-model="agent_detail_form.bank_code"
                      placeholder="开户行"
                      class="wid_190"
                      @change="changeOption_bank($event)">
                      <el-option v-for="(item, index) in agent_detail_form.bankInfo"
                          :key="index"
                          :label=" item.bankname "
                          :value=" item.bankcode ">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="账号" prop="account_no" label-width="68px">
                  <el-input v-model="agent_detail_form.account_no" placeholder="账号" class="wid_180"></el-input>
              </el-form-item>
              <el-form-item label="开户地"  label-width="68px" class="marg_r0">
                  <el-col :span="11">
                      <el-form-item prop="account_province_code" class="marg_b0">
                          <el-select v-model="agent_detail_form.account_province_code"
                              placeholder="选择省"
                              class="wid_90"
                              @change="changeOption_province_addBank($event)">
                              <el-option v-for="(item, index) in agent_detail_form.account_regions"
                                  :key="index"
                                  :label=" item.province"
                                  :value=" item.adcode ">
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :span="11">
                      <el-form-item prop="city_code" class="marg_b0">
                          <el-select v-model="agent_detail_form.account_city_code"
                              placeholder="选择市"
                              class="wid_90"
                              @change="changeOption_city_addBank($event)">
                              <el-option v-for="(item, index) in agent_detail_form.account_cities"
                                  :key="index"
                                  :label=" item.city "
                                  :value=" item.adcode ">
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
              </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
              <el-button @click="agent_detail_dialogVisible = false" size="mini">关 闭</el-button>
          </span>
      </el-dialog>
    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common';

export default {
    name: 'recharge',
    data(){
      return {
        // 地图
        districtSearch:'',
        // 主列表
        tableLoading:false,
        tableData:[],
        // 分页
        pageTotal: 100,
        currentPage:1,
        // 查询参数
        queryForm: {
            account_classs:[
                {
                    id:1,
                    value:'出行'
                }
            ],
            // 收益类型
            account_class:'',
            // 所属市级机构
            agentName:'',
            // 用户ID
            customid:'',
            // 向导id
            customid:'',
            // 向导姓名
            custom_name:'',
            // 上级id
            up_customid:'',
            // 上级姓名
            up_custom_name:'',
            // 所有时间
            allTime:'',
            // 结束时间
            endTime:'',
            // 开始时间
            startTime:'',
        },
        // 新增 弹框规则 修改也用该弹框
        dialogVisible_detail: false,
        add_loading: false,
        detailForm: {
          // 标题
          detailForm_title: "",
          customid: "",
          nickname: "",
          age:'',
          sex: "",
          phone: "",
          wechat:'',
          province:'',
          city:'',
          addr:'',
          tall:'',
          weight:'',
          custom_type: "", // 客户类别  0普通客户 1兼职向导人员 2全职向导人员 3咨询人员 4校园代
          member_status: "",
          email: "",
          custom_status: "", //用户状态  1可用 2不可用
          apple_pay: "", //是否可以进行苹果支付 1支持 2不支持
          app_openid: "", //第三方登录标识 微信Openid 陌陌
          app_logintype: "", //app登录类别 0手机号 1微信 2陌陌 3邮箱
        },
        // 所属机构的详情
        agent_detail_dialogVisible:false,
        agent_detail_loading:false,
        agent_detail_form:{
            regions:[],
            cities:[],
            bankInfo:'',
            // 机构编号
            agentid:'',
            // 机构名称
            agent_name:'',
            // 负责人
            charger:'',
            // 业务地区
            province_code:'',
            city_code:'',
            // 联系地址
            address:'',
            // 贝壳分成
            virtual_rate:'',
            // 出行分成
            account_rate:'',
            // 电话
            phone:'',
            // 邮箱
            email:'',
            // 合同编号
            contract_no:'',
            // 开户行
            bank_code:'',
            // 开户名
            account_user:'',
            // 账号
            account_no:'',
            // 开户地
            account_regions:'',
            account_cities:[],
            account_province_code:'',
            account_city_code:'',
        },
      }
    },
    created(){
      // 初始化 地图plugin
      this.initMap();
      // 初始化 省份
      this.initProvinces();
      // 初始化 银行信息
      this.getBankList();
      // 初始化主列表
      this.getTabelDataList(1);

    },
    methods:{
       // 初始化 银行信息
      getBankList(){
          this.$http.post(`${ commonUrl.baseUrl}/agent/addAgent`,{data:{
              signInUserId: this.$store.getters.userId,
              signInRoleId: this.$store.getters.roleId,
          }}).then(res=>{
              if(res.data.code == '0000'){
                  // console.log(res)
                  this.bankInfo =this.agent_detail_form.bankInfo= res.data.data.bankList
              }
          }).catch(err=>{

          })
      },
      // 初始化主列表
      getTabelDataList(pageNum){
        // 参数
        let param = {
          data: {
            // 公有
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            pageNum: pageNum,
            pageSize: 10,
            // 所属机构
            agentName:this.queryForm.agentName,
            // 用户ID
            customid:this.queryForm.customid,
            // 出行开始时间
            startTime:this.queryForm.startTime,
            // 出行结束时间
            endTime:this.queryForm.endTime,
          }
        }
        this.tableLoading = true
        this.$http.post(`${ commonUrl.baseUrl }/accountProfit/getRechargeProfit`, param).then(res=>{
            // console.log(res)
            // debugger
            if(res.data.code == '0000'){

                this.tableData =  res.data.data.customInfoList
                // 分页 总数
                this.pageTotal = res.data.data.page.pageTotal;
                // 关闭加载
                this.tableLoading = false
            }
        }).catch(err=>{})
      },
      // 导出数据
      exportData(){
          let param = {
              data:{
                  // 公有
                  signInUserId: this.$store.getters.userId,
                  signInRoleId: this.$store.getters.roleId,
                  // 私有
                  // 收益类型
                  account_class:this.queryForm.account_class,
                  // 所属市级机构
                  agentName:this.queryForm.agentName,
                  // 向导ID
                  customid:this.queryForm.customid,
                  // 出行项目
                  travel_projects:this.queryForm.travel_projects,
                  // 出行开始时间
                  startTime:this.queryForm.startTime,
                  // 出行结束时间
                  endTime:this.queryForm.endTime,
              }
          }
          // 其他收益的数据导出
          window.location.href = `${commonUrl.baseUrl}/accountProfit/exportRechargeProfit?signInUserId=${param.data.signInUserId}&signInRoleId=${param.data.signInRoleId}&customid=${param.data.customid}&account_class=${param.data.account_class}&agentName=${param.data.agentName}&startTime=${param.data.startTime}&endTime=${param.data.endTime}`
          // this.$http.post(`${ commonUrl.baseUrl}/accountProfit/exportAccountProfit`, param).then(res=>{
          //     if(res.data.code == '0000'){
          //         this.m_message(res.data.msg, 'success')
          //     }
          // }).catch(err=>{})
      },
      // 详情操作 @params:row:当前行数据；type:当前查询的id：eg:推荐人；推荐人上级，本人
      handle_detail(row,type) {
        // 参数
        let param = {
          data: {
            // 公有
            signInUserId: this.$store.getters.userId,
            signInRole: this.$store.getters.roleId,
            // 私有 当前id
            customid: row.customid
          }
        };
        // 修正参数
        switch(type){
          case 'up_customid':
            this.detailForm.detailForm_title = row.up_customname;
            param.data.customid = row.up_customid;
            break;
          case 'grand_customid':
            this.detailForm.detailForm_title = row.grand_customname;
            param.data.customid = row.grand_customid;
            break;
          default :
            this.detailForm.detailForm_title = row.nickname;
            param.data.customid = row.customid;
            break;
        }

        // 开弹框
        this.dialogVisible_detail = true;
        // 加载中
        this.add_loading = true;
        this.$http
          .post(`${commonUrl.baseUrl}/customInfo/findCustomInfoDetails`, param)
          .then(res => {
            if (res.data.code == "0000") {
              // 数据赋值
              let result = res.data.data.customInfo;
              this.detailForm.customid = result.customid;
              this.detailForm.nickname = result.nickname;
              this.detailForm.age = result.age;
              this.detailForm.sex = result.sex == 1 ? "男" : "女";
              this.detailForm.wechat = result.wechat;

              this.detailForm.addr = result.province+result.city;
              this.detailForm.tall = result.tall;
              this.detailForm.weight = result.weight;

              // 1普通会员 2超级会员
              // this.detailForm.member_status =
              //   result.member_status == 1 ? "普通会员" : "超级会员";
              // this.detailForm.email = result.email;
              // this.detailForm.phone = result.phone;
              // 客户类别
              // 0普通客户 1兼职向导人员 2全职向导人员 3咨询人员 4校园代理
              switch (result.custom_type) {
                case 0:
                  this.detailForm.custom_type = "普通客户";
                  break;
                case 1:
                  this.detailForm.custom_type = "兼职向导";
                  break;
                case 2:
                  this.detailForm.custom_type = "全职向导";
                  break;
                case 3:
                  this.detailForm.custom_type = "咨询人员";
                  break;
                case 4:
                  this.detailForm.custom_type = "校园代理";
                  break;
              }
              // this.detailForm.custom_status =
              //   result.custom_status == 1 ? "可用" : "不可用";
              // 加载完
              this.add_loading = false;
            }else{
              this.add_loading = false;
              this.m_message(res.data.msg, 'error');
            }
          })
          .catch(err => {});
      },
      // 所属机构操作
      handle_agent_name(row){
          let param = {
              data:{
                  agentid:row.city_agentid
              }
          }
          this.agent_detail_dialogVisible = true
          this.agent_detail_loading = true
          this.$http.post(`${ commonUrl.baseUrl }/agent/selectAgentInfo`, param).then(res=>{
              if(res.data.code == '0000'){
                  // console.log('机构信息：')
                  // console.log(res)
                  let result = res.data.data.agentInfo
                  // 机构id
                  this.agent_detail_form.agentid = result.agentid
                  // 机构名称
                  this.agent_detail_form.agent_name = result.agent_name
                  // 负责人
                  this.agent_detail_form.charger = result.charger
                  // 业务地区
                  // this.agent_detail_form.province_code = result.province_code
                  // 根据省查询所有市
                  // this.queryCity(result.province, 'agent_detail_form')
                  // this.agent_detail_form.city_code = result.city_code
                  // 联系地址
                  this.agent_detail_form.address = result.address
                  // 贝壳分成
                  // this.agent_detail_form.virtual_rate = result.virtual_rate
                  // 出行分成
                  // this.agent_detail_form.account_rate = result.account_rate
                  // 电话
                  this.agent_detail_form.phone = result.phone
                  // 邮箱
                  this.agent_detail_form.email = result.email
                  // 合同编号
                  // this.agent_detail_form.contract_no = result.contract_no
                  // 开户行
                  this.agent_detail_form.bank_code = result.bank_code
                  // 开户名
                  this.agent_detail_form.account_user = result.account_user
                  // 账号
                  this.agent_detail_form.account_no = result.account_no
                  // 开户地
                  // 查询开户行所在省份下的所有市列表
                  this.queryBankCity(result.account_province, 'agent_detail_form')
                  this.agent_detail_form.account_province_code = result.account_pro_code
                  this.agent_detail_form.account_city_code = result.account_city_code

                  this.agent_detail_loading = false
              }else{
                this.agent_detail_loading = false;
                this.m_message(res.data.msg, 'error')
              }
          }).catch(err=>{})
      },
      // 刷新
      handle_refresh(){
          this.getTabelDataList(this.currentPage)
          // this.currentPage = 1
      },
      // 查询按钮
      queryData(){
          if(this.queryForm.allTime.length > 0){
              // 修正 开始 和结束 时间
              this.queryForm.startTime = this.queryForm.allTime[0]
              this.queryForm.endTime = this.queryForm.allTime[1]
          }

          this.getTabelDataList(1);
          this.currentPage = 1
      },
      // 重置按钮
      resetData(formName){
          this.$refs[formName].resetFields();
          // 对于queryForm 下拉
          this.queryForm.startTime = ''
          this.queryForm.endTime = ''
      },
      // 分页
      handleCurrentChange(val){
          this.currentPage = val
          // 获取单前页数据列表
          this.getTabelDataList(val);
          //console.log(`当前页: ${val}`);
      },
      // 提示信息 message:提示信息   type 提示类型
      m_message(message,type){
        this.$message({
            message,
            type
        })
      },
      // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
      queryCity(txt,dataOrigin){

          let vm = this
          // 搜索所有省/直辖市信息

          this.districtSearch.search(txt, function (status, result) {
              // console.log(result)
              // 查询成功时，result即为对应的行政区信息
              for(let item of result.districtList[0].districtList){
                  vm[dataOrigin].cities.push({
                      adcode:item.adcode,
                      city  :item.customname
                    })
              }

          })

      },
      // 针对 account_cities这个特殊（后期合并方法***）
      queryBankCity(txt,dataOrigin){

          let vm = this
          // 搜索所有省/直辖市信息

          this.districtSearch.search(txt, function (status, result) {

              // 查询成功时，result即为对应的行政区信息
              for(let item of result.districtList[0].districtList){
                  vm[dataOrigin].account_cities.push({
                      adcode:item.adcode,
                      city  :item.name
                    })
              }

          })

          console.log(vm[dataOrigin].account_cities)

      },
      // 初始化 地图
      initMap(){
          let vm = this
          //利用高德地图API 获取 所有省
          AMap.plugin('AMap.DistrictSearch', function () {
              vm.districtSearch = new AMap.DistrictSearch({
                  // 关键字对应的行政区级别，country表示国家
                  level: 'city',
                  //  显示下级行政区级数，1表示返回下一级行政区
                  subdistrict: 1
              })
          })


      },
      // 初始化 省份数据
      initProvinces(){
          // 处理一下 数据
          let arr = [];
          for(let i in provinces.province_list){
              arr.push({
                  adcode:i,
                  province:provinces.province_list[i]
              })
          }
          this.queryForm.regions = arr
          // 详情
          this.detailForm.regions = this.detailForm.account_regions = arr
          // 详情并修改
          this.agent_detail_form.regions = this.agent_detail_form.account_regions = arr
      },
    }
}
</script>
