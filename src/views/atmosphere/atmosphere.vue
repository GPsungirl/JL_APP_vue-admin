<template>
  <!-- 氛围号管理 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no mar_item18">
      <el-form :inline="true" :model="queryForm" :rules="queryForm_rules" ref="queryForm" size="mini" class="demo-form-inline">
        <!-- 所属机构1 -->
        <!-- <el-form-item label="昵称" prop="nickname">
          <el-input v-model="queryForm.nickname" placeholder="请输入昵称" class="wid_140"></el-input>
        </el-form-item> -->
        <!-- 是否会员2 -->
        <!-- <el-form-item label="会员状态">
          <el-select
            v-model="queryForm.member_status"
            class="wid_140"
            placeholder="请选择会员状态"
            @change="changeOption_vip($event)"
          >
            <el-option
              v-for="(item, index) in queryForm.member_statuss"
              :key="index"
              :label=" item.txt "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 现居住地 -->
        <!-- <el-form-item label="现居住地">
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
        </el-form-item> -->
        <!-- 用户ID -->
        <!-- <el-form-item label="用户ID" prop="customid">
          <el-input v-model="queryForm.customid" placeholder="请输入用户ID" class="wid_140"></el-input>
        </el-form-item> -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="queryForm.phone" placeholder="手机号" class="wid_140"></el-input>
        </el-form-item>
        <!-- <el-form-item label="累计消费" label-width="68px">
          <el-col :span="24">
            <el-form-item prop="lowMoney">
              <el-input v-model="queryForm.lowMoney" placeholder="最小金额" class style="width:70px"></el-input>-
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryForm.highMoney" placeholder="最大金额" class style="width:70px"></el-input>元
            </el-form-item>
          </el-col>
        </el-form-item> -->
        <!-- 注册时间 -->
        <!-- <el-form-item label="注册时间" prop="times">
          <el-date-picker
            v-model="queryForm.times"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item> -->
        <!-- 查询 -->
        <el-form-item>
          <el-button type="success" size="mini" @click="findCustomInfo">检索</el-button>
          <!-- <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>-->
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="customid" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="nickname" label="昵称" :show-overflow-tooltip="true" width="120"></el-table-column>
        <!-- <el-table-column prop="createtime" label="注册时间" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="member_time" label="会员到期" :show-overflow-tooltip="true" width></el-table-column> -->
        <el-table-column prop="agent_name" label="所属机构" width="280"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <!-- <el-table-column prop="" label="推荐人" width="70">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="findCustomInfo(scope.row,'up_customid')">{{  scope.row.up_customname }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="推荐人上级" width="99">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="findCustomInfo(scope.row,'grand_customid')">{{  scope.row.grand_customname }}</el-button>
          </template>
        </el-table-column> -->
        <el-table-column prop="" label="是否实名" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.real_identity_status == 1">已实名</span>
            <span v-else-if="scope.row.real_identity_status == 0">未实名</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="是否会员" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.memberType == 1">会员</span>
            <span v-else-if="scope.row.memberType == 2">非会员</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="状态" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.custom_status == 1">正常</span>
            <span v-else-if="scope.row.custom_status == 2">异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="virtual_remain" label="贝壳余额" width="80"></el-table-column>
        <!-- <el-table-column prop="" label="角色" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.custom_type == 0">普通客户</span>
            <span v-else-if="scope.row.custom_type == 1">合伙人</span>
            <span v-else-if="scope.row.custom_type == 2">业务员</span>
            <span v-else-if="scope.row.custom_type == 3">角落客服</span>
            <span v-else-if="scope.row.custom_type == 4">氛围号</span>
            <span v-else-if="scope.row.custom_type == 5">机构代理</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop label="性别" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-if="scope.row.sex == 2">女</span>
            <span v-if="scope.row.sex == 0">未知</span>
          </template>
        </el-table-column> -->
        <!-- 现居住地 -->
        <!-- <el-table-column prop label="现居住地" width="">
          <template slot-scope="scope">
            <span>{{scope.row.province+scope.row.city}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="客户类别" width>
          <template slot-scope="scope">
            <span v-if="scope.row.custom_type == 0">普通客户</span>
            <span v-else-if="scope.row.custom_type == 1">兼职向导</span>
            <span v-else-if="scope.row.custom_type == 2">全职向导</span>
            <span v-else-if="scope.row.custom_type == 3">咨询人员</span>
            <span v-else-if="scope.row.custom_type == 4">校园代理</span>
          </template>
        </el-table-column>
        <el-table-column prop label="用户状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.custom_status == 1">可用</span>
            <span v-else-if="scope.row.custom_status == 2">不可用</span>
          </template>
        </el-table-column>
        <el-table-column prop label="会员状态" width>
          <template slot-scope="scope">
            <span v-if="new Date().getTime() > new Date(scope.row.member_time).getTime()">普通会员</span>
            <span v-else>超级会员</span>
          </template>
        </el-table-column> -->

        <el-table-column prop label="操作" width>
          <template slot-scope="scope">

            <el-button @click="handle_virtual(scope.row)" type="text" size="small">充值</el-button>
            <!-- <el-button @click="findCustomInfo(scope.row,'customid')"  type="text" size="small">详情</el-button> -->
            <!-- <el-button v-if="roleId == 1" @click="handle_vip(scope.row)" type="text" size="small">会员</el-button> -->
            <!-- 可用 -->
            <!-- <el-button
              v-if="scope.row.custom_status == 1"
              @click="handle_frozen(scope.row)"
              type="text"
              size="small"
            >冻结</el-button>
            <el-button
              v-if="scope.row.custom_status == 2"
              @click="handle_frozen(scope.row)"
              type="text"
              size="small"
            >解冻</el-button> -->
            <el-button
              v-if="roleId == 1"
              @click="handle_delete(scope.row)"
              type="text"
              size="small"
            >移除</el-button>
            <el-button @click="modi_deduct(scope.row)" type="text" size="small">扣款</el-button>
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
        ></el-pagination>
      </div>
    </div>

    <!-- M3 dialog 检索 -->
    <el-dialog
      title="检索信息"
      :visible.sync="dialogVisible_findInfo"
      width="45%"
      class="addUsers_dialog"
      center
      v-loading="findInfo_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <!--新增 body -->
      <div class="dialogBody_addPermission">
        <div class="grid-content bg-purple-dark pad_t2">
          <el-form
            :inline="true"
            :model="detailForm"
            label-width="90px"
            class="demo-form-inline valid_form"
          >
            <el-form-item label="用户ID">
              <el-input v-model="detailForm.customid" :disabled="true" class="wid_140" placeholder></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="detailForm.nickname" :disabled="true" class="wid_140" placeholder></el-input>
            </el-form-item>
             <el-form-item label="所属机构">
              <el-input v-model="detailForm.agent_name" :disabled="true" class="wid_140" placeholder></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="detailForm.phone" :disabled="true" class="wid_140" placeholder></el-input>
            </el-form-item>
            <el-form-item label="推荐人">
              <el-input v-model="detailForm.up_customname" :disabled="true" class="wid_140" placeholder></el-input>
            </el-form-item>
            <el-form-item label="推荐人上级">
              <el-input v-model="detailForm.grand_customname" :disabled="true" class="wid_140" placeholder></el-input>
            </el-form-item>
            <el-form-item label="是否实名">
              <el-input
                v-model="detailForm.real_identity_status"
                :disabled="true"
                class="wid_140"
                placeholder
              ></el-input>
            </el-form-item>
            <el-form-item label="会员状态">
              <el-input
                v-model="detailForm.memberType"
                :disabled="true"
                class="wid_140"
                placeholder
              ></el-input>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-input
                v-model="detailForm.custom_status"
                :disabled="true"
                class="wid_140"
                placeholder
              ></el-input>
            </el-form-item>
             <el-form-item label="角色">
              <el-input
                v-model="detailForm.custom_type_txt"
                :disabled="true"
                class="wid_140"
                placeholder
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="微信号">
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
            <el-form-item label="" class="wid_parent">
              <template>
                <el-radio disabled v-model="detailForm.sex" label="男">男</el-radio>
                <el-radio disabled v-model="detailForm.sex" label="女">女</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="detailForm.email" :disabled="true" class="wid_140" placeholder></el-input>
            </el-form-item>
            <el-form-item label="客户ID">
              <el-input v-model="detailForm.customid" :disabled="true" class="wid_140" placeholder></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible_findInfo = false" size="mini">关 闭</el-button>
        <el-button type="primary" v-if="detailForm.custom_type != 4" @click="add_atmosphere" size="mini">添加为氛围号</el-button>
      </span>
    </el-dialog>
    <!-- M4 dialog 充值数量 -->
    <el-dialog
      title="充值"
      :visible.sync="recharge_dialogVisible"
      top="15vh"
      width="40%"
      center
      :close-on-click-modal="false"
      v-loading="recharge_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="handle_virtual recharge_form"
      >
      <!-- 业务信息 -->
      <el-form
        :model="modi_rate_form"
        :rules="modi_rate_rules"
        ref="modi_rate_form"
        class="demo-ruleForm "
        label-width="130px"
      >

        <el-form-item label="充值数量" prop="virtual">
          <el-input v-model="modi_rate_form.virtual" placeholder="充值数量" class="wid_140"></el-input>
          <span style="color:green;font-size:12px;">请输入整数</span>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="recharge_dialogVisible = false" size="mini">关 闭</el-button>
        <el-button type="primary" @click="vave_handle_virtual" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- M5 扣款数量 -->
    <el-dialog
      title="扣款"
      :visible.sync="deduct_dialogVisible"
      top="15vh"
      width="40%"
      center
      :close-on-click-modal="false"
      v-loading="deduct_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="handle_virtual recharge_form"
      >
      <!-- 业务信息 -->
      <el-form
        :model="modi_rate_form_deduct"
        :rules="modi_rate_rules_deduct"
        ref="modi_rate_form_deduct"
        class="demo-ruleForm "
        label-width="130px"
      >

        <el-form-item label="充值数量" prop="virtual">
          <el-input v-model="modi_rate_form_deduct.virtual" placeholder="充值数量" class="wid_140"></el-input>
          <span style="color:green;font-size:12px;">请输入整数</span>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="deduct_dialogVisible = false" size="mini">关 闭</el-button>
        <el-button type="primary" @click="deduct_handle_virtual" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import {
  isvalidPhone,
  validNum100,
  filterSpace,
  validZNum,
  validNum20,
  validNum2,
  validNum4,
  validNum40,
  validNum80,
  validNum120,
  PositiveInt,
  getFloat
} from "../../utils/validate";
export default {
  name: "atmosphere",
  data() {
    let validPhone = (val,value,callback)=>{
      if (!value) {
        callback(new Error("请输入值"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确手机号"));
      } else {
        callback();
      }
    }
    // 充值数量
    let validVirtual =(val, value, callback) => {
       if (!value) {
        callback(new Error("请输入值"));
      } else if (!PositiveInt(value)) {
        callback(new Error("请输入大于0的整数"));
      } else {
        callback();
      }
    }
    return {
      roleId:'',

      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 100,
      currentPage: 1,
      // 查询参数
      queryForm: {
        member_statuss: [
          {
            id: 1,
            txt: "普通会员"
          },
          {
            id: 2,
            txt: "超级会员"
          }
        ],
        nickname: "",
        // 注册时间段
        times:'',
        startTime:'',
        endTime:'',
        customid:'',
        phone:'',
        lowMoney:'',
        highMoney:'',
        createtime:'',
        member_status: "",
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 省市
        province_code: "",
        city_code: "",
      },
      queryForm_rules:{
        phone:[
          { required: true, validator: validPhone, trigger: "blur" },
        ]
      },
      value1: "",
      // 弹框

      dialogVisible_findInfo: false,
      findInfo_loading: false,

      // 新增 弹框规则 修改也用该弹框
      detailForm: {
        // 标题

        detailForm_title: "",
        customid: "",
        nickname: "",
        agent_name:'',
        phone: "",
        up_customname:'',
        grand_customname:'',
        real_identity_status:'',
        memberType:'',
        custom_status:'',
        custom_type_txt:'',
        custom_type:'',

        age:'',
        sex: "",
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
       // 充值
      recharge_dialogVisible: false,
      recharge_loading: false,
      modi_rate_form: {
        virtual: "",
        customid:'',
      },
      modi_rate_rules: {
        // 充值数量
        virtual:[
          { required: true, validator: validVirtual, trigger: "blur" },
        ],
      },
      // 退款
      deduct_dialogVisible:false,
      deduct_loading:false,
      modi_rate_form_deduct: {
        virtual: "",
        customid:'',
      },
      modi_rate_rules_deduct: {
        // 充值数量
        virtual:[
          { required: true, validator: validVirtual, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 初始化 主列表数据
    this.getTableDataList(1);
    // 获取roleId
    this.roleId = this.$store.getters.roleId;

  },
  methods: {
    // 初始化 主列表数据
    getTableDataList(pageNum) {
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10
          // 用户id
          //customid:this.queryForm.customid,
          // lowMoney:
          //   this.queryForm.lowMoney == ""
          //     ? this.queryForm.lowMoney
          //     : this.queryForm.lowMoney * 100,
          // highMoney:
          //   this.queryForm.highMoney == ""
          //     ? this.queryForm.highMoney
          //     : this.queryForm.highMoney * 100,
          //phone:this.queryForm.phone,
          // nickname: this.queryForm.nickname,
          // member_status: this.queryForm.member_status,
          // province_code:this.queryForm.province_code,
          // city_code:this.queryForm.city_code,
          // 注册时间
          // startTime:this.queryForm.startTime,
          // endTime:this.queryForm.endTime,

        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/customInfo/getAtmosphereList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            // console.log(res)
            // degugger;
            this.tableData = res.data.data.customInfoList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 操作-检索
    findCustomInfo(){

      if(this.m_valid_addForm('queryForm')){
        // this.detailForm.detailForm_title = row.up_customname;
        // 参数
        let param = {
          data: {
            // 公有
            signInUserId: this.$store.getters.userId,
            signInRole: this.$store.getters.roleId,
            // 私有 当前id
            //customid: row.customid
            phone:this.queryForm.phone
          }
        };


        // 开弹框
        this.dialogVisible_findInfo = true;
        // 加载中
        this.findInfo_loading = true;
        this.$http
          .post(`${commonUrl.baseUrl}/customInfo/findById`, param)
          .then(res => {
            if (res.data.code == "0000") {
            // console.log(res)
            // debugger;
              // 数据赋值
              let result = res.data.data.customInfo;
              // 用户ID 昵称 所属机构 手机号 推荐人 推荐人上级 是否已经实名 是否会员 状态 角色
              this.detailForm.customid = result.customid;
              this.detailForm.nickname = result.nickname;
              this.detailForm.agent_name = result.agent_name;
              this.detailForm.phone = result.phone;
              this.detailForm.up_customname = result.up_customname;
              this.detailForm.grand_customname = result.grand_customname;
              this.detailForm.real_identity_status = result.real_identity_status == 1? '已实名':'未实名';
              this.detailForm.memberType = result.memberType == 1? '会员' :'非会员';

              this.detailForm.custom_status  = result.custom_status == 1?'可用':'不可用';
              this.detailForm.custom_type = result.custom_type;
              // 客户类别
              //  0普通客户 1合伙人 2业务员 3角落客服 4氛围号 5机构代理
              switch (result.custom_type) {
                case 0:
                  this.detailForm.custom_type_txt = "普通客户";
                  break;
                case 1:
                  this.detailForm.custom_type_txt = "合伙人";
                  break;
                case 2:
                  this.detailForm.custom_type_txt = "业务员";
                  break;
                case 3:
                  this.detailForm.custom_type_txt = "角落客服";
                  break;
                case 4:
                  this.detailForm.custom_type_txt = "氛围号";
                  break;
                case 5:
                  this.detailForm.custom_type_txt = "机构代理";
                  break;
                default:
                  this.detailForm.custom_type_txt = "普通客户";
              }
              // this.detailForm.age = result.age;
              // this.detailForm.sex = result.sex == 1 ? "男" : "女";
              // this.detailForm.wechat = result.wechat;

              // this.detailForm.addr = result.province+result.city;
              // this.detailForm.tall = result.tall;
              // this.detailForm.weight = result.weight;

              // 1普通会员 2超级会员
              // this.detailForm.member_status =
              //   result.member_status == 1 ? "普通会员" : "超级会员";
              // this.detailForm.email = result.email;


              // this.detailForm.custom_status =
              //   result.custom_status == 1 ? "可用" : "不可用";
              // 加载完
              this.findInfo_loading = false;
            }
          })
          .catch(err => {});
      }
    },
    // 添加为氛围号
    add_atmosphere(){
        this.findInfo_loading = true;
        let param ={
          data:{
            custom_type:'4',
            customid:this.detailForm.customid,
          }
        }
        this.$http
        .post(`${commonUrl.baseUrl}/customInfo/updateCustomType`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.findInfo_loading = false;
            this.m_message('添加氛围号成功', 'success');
            // 关闭弹框 刷新主列表 清空检索手机号
            this.dialogVisible_findInfo = false;
            this.queryForm.phone = '';
            this.handle_refresh();
          }else{
            this.findInfo_loading = false;
            this.m_message(res.data.msg, 'error');
          }
        })
        .catch(err => {});
    },
    // 移除氛围号
    handle_delete(row){

        let param ={
          data:{
            custom_type:'0',
            customid:row.customid,
          }
        }
        this.tableLoading = true;
        this.$http
        .post(`${commonUrl.baseUrl}/customInfo/updateCustomType`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.m_message('移除氛围号成功', 'success');
            this.tableLoading = true;
            this.handle_refresh();
          }else{
            this.tableLoading = true;
            this.m_message('移除氛围号失败', 'error');
          }
        })
        .catch(err => {});
    },
    // 操作会员
    handle_vip(row){
      // 开弹框
      this.dialogVisible_vip = true;

      this.vipForm.customid = row.customid;
      // 加载中
      // this.vip_loading = true;

    },
    // 保存会员设置
    save_vip(){

      if(this.m_valid_addForm('vip_form')){
        // 提交
        let param = {
          data:{
            date:this.vipForm.vip_date,
            customid:this.vipForm.customid
          }
        }
        this.vip_loading = true;
        this.$http.post(`${ commonUrl.baseUrl }/customInfo/updateMembeTime`, param).then(res=>{
          if(res.data.code == '0000'){
            this.vip_loading = false
            this.m_message(res.data.msg, 'success')
            this.resetData('vip_form')
            this.dialogVisible_vip = false
            // 刷新
            this.handle_refresh();
          }else{
            this.vip_loading = false
            this.m_message(res.data.msg, 'warning')
            this.resetData('vip_form');
          }
        }).catch(err=>{})
      }
    },
    // 充值
    handle_virtual(row){

      // 开弹框
      this.recharge_dialogVisible = true;
      this.modi_rate_form.customid = row.customid;
      // 初始化数据.......
      // 根据当前登陆者角色 显示角色类:roleId:2机构3合伙人
      // 机构可以调整普通用户=>业务员、合伙人
      // 合伙人可以调整普通用户=>业务员
      // if(this.roleId == 2){
      //   this.modi_rate_form.custom_types = [
      //     {
      //       id:2,
      //       value:'合伙人'
      //     },
      //     {
      //       id:3,
      //       value:'业务员'
      //     }
      //   ];
      // }else if(this.roleId == 3){
      //   this.modi_rate_form.custom_types = [
      //     {
      //       id:3,
      //       value:'业务员'
      //     }
      //   ];
      // }


    },
    // 充值提交
    vave_handle_virtual() {
      if(this.m_valid_addForm('modi_rate_form')){
        // 修正小数位数
        // this.modi_rate_form.virtual = getFloat(this.modi_rate_form.virtual,1);
        let param = {
          data:{
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            virtual: this.modi_rate_form.virtual,
            customid:this.modi_rate_form.customid,
            // custom_type:this.modi_rate_form.custom_type,
            // recharge_bonus:this.modi_rate_form.recharge_bonus,
            // active_fee_month: this.modi_rate_form.active_fee_month*100,
            // active_fee_three_month:this.modi_rate_form.active_fee_three_month*100,
            // active_fee_six_month:this.modi_rate_form.active_fee_six_month*100,
          }
        };
        // console.log(param.data)
        // debugger

        this.recharge_loading = true;
        this.$http
        .post(`${commonUrl.baseUrl}/customVirtualAccount/updateRechargeVirtual`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // 处理数据。。。。
            this.recharge_loading = false;
            this.m_message(res.data.msg, 'success')
            this.recharge_dialogVisible = false;
            // 更新数据
            this.handle_refresh();
          }else{
            this.recharge_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
      }
    },
    // 扣款
    modi_deduct(row){
      // 开弹框

      this.deduct_dialogVisible = true;
      this.modi_rate_form_deduct.virtual = '';
      this.modi_rate_form_deduct.customid = row.customid;
    },
    // 提交扣款
    deduct_handle_virtual(){
      if(this.m_valid_addForm('modi_rate_form_deduct')){
        let param = {
          data:{
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            virtual: this.modi_rate_form.virtual,
            customid:this.modi_rate_form.customid,
          }
        };

        this.deduct_loading = true;
        this.$http
        .post(`${commonUrl.baseUrl}/customVirtualAccount/updateDeductVirtual`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // 处理数据。。。。
            this.deduct_loading = false;
            this.m_message(res.data.msg, 'success')
            this.deduct_dialogVisible = false;
            // 更新数据
            this.handle_refresh();
          }else{
            this.deduct_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
      }
    },
    // 查询按钮
    queryData() {
      if (this.queryForm.times.length > 0) {
        // 修正 开始 和结束 时间
        this.queryForm.startTime = this.queryForm.times[0];
        this.queryForm.endTime = this.queryForm.times[1];
      }
      // 参数
      let param = {
        member_status: this.queryForm.member_status,
        nickname: this.queryForm.nickname
      };
      // console.log(param);
      // console.log(this.queryForm)
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {
      // this.queryForm.nickname = "";
      // this.queryForm.member_status = "";

      this.$refs[formName].resetFields();
      // 对于queryForm 下拉
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(this.currentPage);
      // this.currentPage = 1;
    },
    // 冻结/解冻 解冻1 冻结2
    handle_frozen(row) {
      let tip_txt = row.custom_status == 1 ? "冻结成功" : "解冻成功";
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRole: this.$store.getters.roleId,
          // 参数 私有
          custom_status: row.custom_status == 1 ? 2 : 1,
          customid: row.customid
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/customInfo/updateStatus`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            this.m_message(tip_txt, "success");
            this.getTableDataList(1);
          }
        })
        .catch(err => {});
    },

    // 机构状态change事件
    changeOption_vip(e) {
      console.log(e);
    },

    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
      //console.log(`当前页: ${val}`);
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
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    },

  }
};
</script>
<style >

  .handle_virtual .el-dialog__body{
    height:60vh;
  }
  .recharge_form .el-dialog__body{
    height:40vh;
  }
  .query_fields.mar_item18 .el-form-item--mini.el-form-item,
  .query_fields.mar_item18 .el-form-item--small.el-form-item{
    margin-bottom:18px ;
  }
</style>
