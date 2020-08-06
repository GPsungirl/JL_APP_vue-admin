<template>
    <!-- 直播记录 -->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no">
            <el-form :inline="true" ref="queryForm" :model="queryForm" size="mini" class="demo-form-inline">
            <!-- 姓名 -->
            <el-form-item label="姓名" prop="customname" label-width="68px">
                <el-input v-model="queryForm.customname" placeholder="请输入姓名" class="wid_140"></el-input>
            </el-form-item>
            <!-- 所属机构 -->
            <el-form-item label="所属机构" prop="agent_name">
                <el-input v-model="queryForm.agent_name" placeholder="请输入所属机构" class="wid_140"></el-input>
            </el-form-item>
            <!-- 上级姓名 -->
            <el-form-item label="上级姓名" prop="up_customname">
                <el-input v-model="queryForm.up_customname" placeholder="请输入上级姓名" class="wid_140"></el-input>
            </el-form-item>
            <!-- 上级ID -->
            <el-form-item label="上级ID" prop="up_customid" label-width="68px">
                <el-input v-model="queryForm.up_customid" placeholder="请输入上级ID" class="wid_140"></el-input>
            </el-form-item>
            <!-- 查询月 -->
            <el-form-item label="查询月" label-width="68px" prop="live_month">
               <el-date-picker
                    v-model="queryForm.live_month"
                    type="month"
                    format="yyyy 年 MM 月"
                    value-format="yyyyMM"
                    placeholder="选择月"
                    class="wid_140"
                    >
                </el-date-picker>
            </el-form-item>


            <!-- 向导ID customid-->
            <!-- <el-form-item label="向导ID" prop="customid" label-width="68px">
                <el-input v-model="queryForm.customid" placeholder="请输入向导ID" class="wid_140"></el-input>
            </el-form-item> -->
            <!-- 现居住地 -->
            <!-- <el-form-item label="籍贯地" >
              <el-col :span="12">
                  <el-form-item prop="province_code">
                      <el-select v-model="queryForm.province_code"
                          placeholder="选择省"
                          class="wid_140"
                          @change="changeOption_province($event)">
                          <el-option v-for="(item, index) in queryForm.regions"
                              :key="index"
                              :label=" item.province "
                              :value=" item.adcode ">
                          </el-option>
                      </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item prop="city_code">
                      <el-select v-model="queryForm.city_code"
                          placeholder="选择市"
                          class="wid_140"
                          @change="changeOption_city($event)">
                          <el-option v-for="(item, index) in queryForm.cities"
                              :key="index"
                              :label=" item.city "
                              :value=" item.adcode ">
                          </el-option>
                      </el-select>
                  </el-form-item>
              </el-col>
            </el-form-item> -->




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
                <el-table-column prop="customid" label="向导ID" width="80" >
                </el-table-column>
                <el-table-column prop="customname" label="姓名" width="80">
                </el-table-column>
                 <!-- <el-table-column prop="" label="籍贯地" width="">
                    <template slot-scope="scope">
                        {{ scope.row.province + scope.row.city }}
                    </template>
                </el-table-column> -->
                <el-table-column prop="up_customid" label="上级ID" width="80">
                </el-table-column>
                <el-table-column prop="" label="上级姓名" width="80">
                    <template slot-scope="scope">
                        <el-button @click="handle_detail_up(scope.row,'up_customid')" type="text" size="small">{{ scope.row.up_customname }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="性别" width="60">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex == 1">男</span>
                        <span v-else>女</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="所属机构" width>
                    <template slot-scope="scope">
                        <el-button @click="handle_agent_name(scope.row)" type="text" size="small">{{ scope.row.agent_name }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="task_month" label="直播月份" width="80px">
                </el-table-column>
                <el-table-column prop="" label="本月直播时长" width>
                    <template slot-scope="scope">
                        <span>{{ Math.round(scope.row.live_time / 60) +'分钟'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="">
                <template slot-scope="scope">
                    <el-button @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
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
        <!-- M3 dialog详情-->
        <el-dialog
            title="工作记录表"
            :visible.sync="detail_dialogVisible"
            width="50%"
            center
            top="5vh"
            :close-on-click-modal="false"
            v-loading="detail_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="travel_record"
            >
            <!-- 业务信息 -->
            <div>
                <!-- 表头 -->
                <header style="margin-bottom:8px">
                    <div class="inl_block mar_r10">
                        <span class="pp_label">ID:</span>
                        <span>{{ detail_form.customid }}</span>
                    </div>
                    <div class="inl_block ">
                        <span class="pp_label">姓名:</span>
                        <span>{{ detail_form.customname }}</span>
                    </div>
                </header>
                <!-- 表格 -->
                <el-table :data="detail_tableData" v-loading="detail_tableLoading" border stripe style="width: 100%">
                    <el-table-column prop="" label="开始工作时间" width="" >
                        <template slot-scope="scope">
                            {{ getFormatDate(new Date(scope.row.live_endtime) - scope.row.live_time_length*1000)  }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="live_endtime" label="结束工作时间" width="">
                    </el-table-column>

                    <el-table-column prop="" label="直播时长" width="">
                        <template slot-scope="scope">
                            {{ Math.floor(scope.row.live_time_length / 60) + '分钟'}}
                        </template>
                    </el-table-column>

                </el-table>
                <!-- 分页 -->
                <div class="block mar_t10">
                    <el-pagination
                    @current-change="detail_handleCurrentChange"
                    :current-page="detail_currentPage"
                    :total="detail_pageTotal"
                    background
                    layout="total, prev, pager, next, jumper"
                    >
                    </el-pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
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
        <!-- M6 dialog上级姓名-->
        <el-dialog
          :title="detailForm.detailForm_title+'的信息'"
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
    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common'
import {isvalidPhone} from '../../utils/validate'

export default {
    customname: 'travelRecord',
    data(){
        return {
          // 地图
          districtSearch:'',
          // 主列表
          tableLoading:false,
          tableData:[],
          // 工作记录表
          detail_tableLoading:false,
          detail_tableData:[],

          detail_dialogVisible:false,
          detail_loading:false,

          up_detail_dialogVisible:false,
          up_detail_loading:false,
          // 分页
          pageTotal: 0,
          currentPage:1,
          detail_pageTotal: 0,
          detail_currentPage:1,
          bankInfo:'',
          // 查询参数
          queryForm: {
              // 初始化 省 regions  市 cities
              regions:'',
              cities: [],

              live_month:'',
              province_code: '',
              city_code:'',
              province_param:'',
              city_param: '',

              customname:'',
              customid:'',
              up_customname:'',
              up_customid:'',
              agent_name:'',

          },
          // 详情数据
          detail_form:{
              customid:'',
              customname:'',
              row:'',
          },
          // 上级 详情
          up_detail_form:{
              // 向导ID
              customid:'',
              // 向导姓名
              customname:'',
              // 上级ID
              up_customid:'',
              // 上级姓名
              up_customname:'',
              // 民族
              traveler_native:'',
              // 性别
              sex:'',
              // 居住地
              juzhudi:'',
              // 职业
              profession:'',
              // 详细地址
              address:'',
              // 身高
              tall:'',
              // 体重
              weight:'',
              // 手机号
              phone:'',
              // 微信号
              webchat:'',
              // 陌陌号
              momo:'',
              // 出生日期
              birthday:'',
              // 贝壳分成
              virtual_rate:'',
              // 出行分成
              account_rate:'',
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
          // 上级最新详情
          dialogVisible_detail: false,
          add_loading: false,
          // 新增 弹框规则 修改也用该弹框
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
        }
    },
    created(){
        // 初始化 地图plugin
        this.initMap();
        // 初始化 省份
        this.initProvinces();
        // 初始化 银行信息
        this.getBankList();
        // 初始化 主列表
        this.getTableDataList(1)


    },
    methods:{
        // 获取主列表
        getTableDataList(pageNum){
            let param = {
               data:{
                    // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    // 所属机构 姓名 向导状态 上级id  上级姓名
                    agent_name:this.queryForm.agent_name,
                    customname:this.queryForm.customname,
                    // 向导id
                    customid:this.queryForm.customid,
                    live_month:this.queryForm.live_month,
                    up_customid:this.queryForm.up_customid,
                    up_customname:this.queryForm.up_customname,

                    // province_code:this.queryForm.province_code,
                    // city_code:this.queryForm.city_code,

               }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/travelerMonthTask/selectCustomRecordList`, param).then(res=>{
                if(res.data.code == '0000'){
                    // console.log(res)

                    this.tableData = res.data.data.AllCustomInfoList
                    // 分页总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    this.tableLoading = false
                }else{
                  this.m_message(res.data.msg, 'error')
                  this.tableLoading = false
                }
            }).catch(err=>{

            })
        },
        // 获取工作记录列表
        getTableDataList_detail(row, pageNum){
            let param = {
                data: {
                    customid:row.customid,
                    live_month:row.live_month,
                    pageNum:pageNum,
                    pageSize:10
                }
            }
            this.detail_tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/liveRecord/getLiveRecordInfo`, param).then(res=>{
                if(res.data.code == '0000'){

                    this.detail_tableData = res.data.data.liveRecordInfoList
                    //  分页
                    this.detail_pageTotal = res.data.data.page.pageTotal;
                    this.detail_tableLoading = false
                }
            }).catch(err=>{})
        },
        // 详情操作
        handle_detail(row){

            // 展示在表头里
            this.detail_form.row = row
            this.detail_form.customid = row.customid
            this.detail_form.customname = row.customname

            this.detail_dialogVisible = true
            // 取工作记录表的数据
            this.getTableDataList_detail(row,1)
        },
        // 上级详情操作 @params:row:当前行数据；type:当前查询的id：eg:推荐人；推荐人上级，本人
        handle_detail_up(row,type) {
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
              }
            })
            .catch(err => {});
        },
        // 上级姓名操作（废弃）
        handle_up_name(row){

            let param = {
                data:{
                    up_customid:row.up_customid
                }
            }
            this.up_detail_dialogVisible = true
            this.up_detail_loading = true
            this.$http.post(`${commonUrl.baseUrl}/travelerInfo/findByUpCustomId`, param).then(res=>{
                if(res.data.code == '0000'){
                    console.log(res)
                    debugger
                    let result = res.data.data.travelerInfo

                    // 向导姓名
                    this.up_detail_form.customname = result.customname
                    // 向导ID
                    this.up_detail_form.customid = result.customid
                    // 所属机构
                    this.up_detail_form.agent_name = result.agent_name
                    // 上级ID
                    this.up_detail_form.up_customid = result.up_customid
                    // 上级姓名
                    this.up_detail_form.up_customname = result.up_customname
                    // 民族 性别  居住地  职业 详细地址 身高 体重 手机号 微信号 陌陌号  出生日期
                    this.up_detail_form.traveler_native = result.traveler_native
                    this.up_detail_form.sex = result.sex == '01' ?'男' :'女'
                    this.up_detail_form.juzhudi = result.province +  result.city
                    // 判断职业
                    // '职业类别 0其他 1学生 2都市白领 3导游 4自由职业
                    let  _profession = '';
                    switch(result.profession_type){
                        case 0:
                            _profession = '其他';
                            break;
                        case 1:
                            _profession = '学生';
                            break;
                        case 2:
                            _profession = '都市白领';
                            break;
                        case 3:
                            _profession = '导游';
                            break;
                        case 4:
                            _profession = '自由职业';
                            break;
                    }
                    this.up_detail_form.profession = _profession
                    this.up_detail_form.address = result.address
                    this.up_detail_form.tall = result.tall + 'cm'
                    this.up_detail_form.weight = result.weight + 'kg'
                    this.up_detail_form.phone  = result.phone
                    this.up_detail_form.webchat = result.webchat
                    this.up_detail_form.momo = result.momo
                    this.up_detail_form.birthday = result.birthday
                    // 贝壳分成
                    this.up_detail_form.virtual_rate = result.virtual_rate
                    // 出行分成
                    this.up_detail_form.account_rate = result.account_rate
                    this.up_detail_loading = false
                }
            }).catch(err=>{})
        },
        // 所属机构操作
        handle_agent_name(row){
            let param = {
                data:{
                    agentid:row.agentid
                }
            }
            this.agent_detail_dialogVisible = true
            this.agent_detail_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/agent/selectAgentInfo`, {data:{agentid:row.agentid}}).then(res=>{
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
                }
            }).catch(err=>{})
        },
        // 查询按钮
        queryData(){
            // console.log(this.queryForm)
            // 根据参数进行查询
            this.getTableDataList(1)
            this.currentPage = 1
        },
        // 重置按钮
        resetData(formName){
            if(this.$refs[formName]){
                this.$refs[formName].resetFields();
            }
        },
        // 刷新按钮
        handle_refresh(){
            this.getTableDataList(this.currentPage);
            // this.currentPage = 1
        },
        // 初始化 银行信息
        getBankList(){
            this.$http.post(`${ commonUrl.baseUrl}/agent/addAgent`,{data:{
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
            }}).then(res=>{
                if(res.data.code == '0000'){

                    this.bankInfo = this.agent_detail_form.bankInfo = res.data.data.bankList
                    // 组合省份
                    // let arr = [];
                    // if(res.data.data.manageProvinceCodeList.length > 0){
                    //     for(let item of res.data.data.manageProvinceCodeList){
                    //         arr.push({
                    //             adcode: item.province_code,
                    //             province: provinces.province_list[item.province_code]
                    //         })
                    //     }
                    // }
                    // this.add_form.regions = arr;

                }
            }).catch(err=>{

            })
        },
        // 省份change事件
        changeOption_province(e){
            // 参数收集
            this.queryForm.province_param = { adcode:e, txt: provinces.province_list[e] }
            // console.log(e)
            // console.log(provinces.province_list[e])
            // 赋值cities (先清理 后赋值)
            this.queryForm.cities = [];
            this.queryForm.city = '';
            this.queryCity(provinces.province_list[e], 'queryForm');
        },
        // 市区change事件
        changeOption_city(e){
        },
        // 机构状态change事件
        changeOption_institutionalStatus(e){
            console.log(e);
        },
        // 提示信息 message:提示信息   type 提示类型
        m_message(message,type){
            this.$message({
                message,
                type
            })
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

        },
        // 开户地 市
        changeOption_city_addBank(e){
            for(let item of this.detail_check_form.account_cities){
               if(item.adcode == e){

                   this.detail_check_form.account_city_param = { cityname:item.city, adcode:e  }
               }
            }
        },
        // 选择开户行
        changeOption_bank(e){

            for(let item of this.detail_check_form.bankInfo){
                if(item.bankcode == e ){
                    this.detail_check_form.account_bank = item.bankname
                }
            }

        },
        // 分页
        handleCurrentChange(val){
            this.currentPage = val
            // 获取单前页数据列表
            this.getTableDataList(val);
        },
        // 工作记录分页
        detail_handleCurrentChange(val){
            this.detail_currentPage = val
            // 获取当前页工作记录
            this.getTableDataList_detail(this.detail_form.row, val)
        },
        // 格式化日期
        getFormatDate(date){

            let _date = new Date(date);
            let YYYY = _date.getFullYear();
            let MM = _date.getMonth()+1;
            let dd = _date.getDate(); //日
            let HH = _date.getHours(); //小时
            let mm = _date.getMinutes();
            let ss = _date.getSeconds();
            MM = MM>9?MM:'0'+MM;
            dd = dd>9?dd:'0'+dd;
            HH = HH>9?HH:'0'+HH;
            mm = mm>9?mm:'0'+mm;
            ss = ss>9?ss:'0'+ss;
            return YYYY+'-'+MM +'-'+dd+' '+HH +':'+mm +':'+ss
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
            this.detail_form.regions = this.detail_form.account_regions = arr
            // 详情并修改
            this.agent_detail_form.regions = this.agent_detail_form.account_regions = arr
        },
    }
}
</script>
