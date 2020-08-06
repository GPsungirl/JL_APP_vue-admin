<template>
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form :inline="true" label-width="70px" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="queryForm.nickname" placeholder="请输入昵称" class="wid_140"></el-input>
        </el-form-item>
        <!-- 是否会员 -->
        <el-form-item label="会员状态" prop="memberType">
          <el-select
            v-model="queryForm.memberType"
            class="wid_140"
            placeholder="请选择会员状态"
            @change="changeOption_vip($event)"
          >
            <el-option
              v-for="(item, index) in queryForm.memberTypes"
              :key="index"
              :label=" item.txt "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 性别 -->
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="queryForm.sex"
            class="wid_140"
            placeholder="请选择性别"

          >
            <el-option
              v-for="(item, index) in queryForm.sexs"
              :key="index"
              :label=" item.txt "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 所属机构 -->
        <el-form-item label="所属机构" prop="agent_name">
          <el-input v-model="queryForm.agent_name" placeholder="所属机构" class="wid_140"></el-input>
        </el-form-item>
        <!-- 推荐人 -->
        <el-form-item label="推荐人" prop="up_customname">
          <el-input v-model="queryForm.up_customname" placeholder="推荐人" class="wid_140"></el-input>
        </el-form-item>
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
        <el-form-item label="用户ID" prop="customid">
          <el-input v-model="queryForm.customid" placeholder="请输入用户ID" class="wid_140"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="queryForm.phone" placeholder="手机号" class="wid_140"></el-input>
        </el-form-item>
         <!-- 审核状态 -->
        <!-- <el-form-item label="审核状态" prop="idcard_check_status">
          <el-select
            v-model="queryForm.idcard_check_status"
            class="wid_140"
            placeholder="请选择会员状态"
            >
            <el-option
              v-for="(item, index) in queryForm.idcard_check_statuss"
              :key="index"
              :label=" item.txt "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item> -->
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
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="customid" label="用户ID" width="70"></el-table-column>
        <el-table-column prop="nickname" label="昵称" :show-overflow-tooltip="true" width="70"></el-table-column>
        <!-- <el-table-column prop="createtime" label="注册时间" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="member_time" label="会员到期" :show-overflow-tooltip="true" width></el-table-column> -->
        <el-table-column prop="agent_name" label="所属机构" :show-overflow-tooltip="true" width="100"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="110"></el-table-column>
        <el-table-column prop="" label="推荐人" width="70">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handle_detail(scope.row,'up_customid')">{{  scope.row.up_customname }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="推荐人上级" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handle_detail(scope.row,'grand_customid')">{{  scope.row.grand_customname }}</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="" label="是否会员" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.memberType == 1">会员</span>
            <span v-else-if="scope.row.memberType == 2">非会员</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="状态" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.custom_status == 1">正常</span>
            <span v-else-if="scope.row.custom_status == 2">异常</span>
          </template>
        </el-table-column>
        <!-- 0不需审核 1已审核 2需要审核 3审核拒绝 -->
        <!-- <el-table-column prop="" label="审核状态" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.idcard_check_status == 0">不需审核</span>
            <span v-else-if="scope.row.idcard_check_status == 1">已审核</span>
            <span v-else-if="scope.row.idcard_check_status == 2">需要审核</span>
            <span v-else-if="scope.row.idcard_check_status == 3">审核拒绝</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="" label="实名认证状态" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.real_identity_status == 0">未认证</span>
            <span v-else-if="scope.row.real_identity_status == 1">已认证</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="" label="是否实名" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.real_identity_status == 1">已实名</span>
            <span v-else-if="scope.row.real_identity_status == 0">未实名</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="活体状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.face_identity_status == 0">未认证</span>
            <span v-else-if="scope.row.face_identity_status == 1">已认证</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="认证类别" width="80">
           <template slot-scope="scope">
            <span v-if="scope.row.authentication_type == 0">系统认证</span>
            <span v-else-if="scope.row.authentication_type == 1">人工认证</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="角色" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.custom_type == 0">普通客户</span>
            <span v-else-if="scope.row.custom_type == 1">合伙人</span>
            <span v-else-if="scope.row.custom_type == 2">业务员</span>
            <span v-else-if="scope.row.custom_type == 3">角落客服</span>
            <span v-else-if="scope.row.custom_type == 4">氛围号</span>
            <span v-else-if="scope.row.custom_type == 5">机构代理</span>
          </template>
        </el-table-column>
        <el-table-column prop label="性别" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-if="scope.row.sex == 2">女</span>
            <span v-if="scope.row.sex == 0">未知</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop label="会员状态" width>
          <template slot-scope="scope">
            <span v-if="new Date().getTime() > new Date(scope.row.member_time).getTime()">普通会员</span>
            <span v-else>超级会员</span>
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
        </el-table-column> -->


        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button @click="handle_detail(scope.row,'customid')"  type="text" size="small">详情</el-button>
            <!-- 会员设置 超管和运营 有权限-->
            <el-button v-if="roleId == 1 || roleId == 7" @click="handle_vip(scope.row)" type="text" size="small">会员</el-button>
            <el-button v-if="(roleId == 1 || roleId == 7) && scope.row.authentication_type == 0"  @click="handle_identify(scope.row)" type="text" size="small">人工认证</el-button>
            <el-button v-if="(roleId == 1 || roleId == 7) && scope.row.authentication_type == 1"  @click="handle_identify(scope.row)" type="text" size="small">取消人工</el-button>
            <!-- 可用 超管和运营 有权限-->
            <el-button
              v-if="(roleId == 1 || roleId == 7)&&scope.row.custom_status == 1"
              @click="handle_frozen(scope.row)"
              type="text"
              size="small"
            >冻结</el-button>
            <!-- 不可用 超管和运营 有权限-->
            <el-button
              v-if="(roleId == 1 || roleId == 7) &&  scope.row.custom_status == 2"
              @click="handle_frozen(scope.row)"
              type="text"
              size="small"
            >解冻</el-button>
            <!-- 调整角色： 机构、合伙人有权限-->
            <el-button v-if="(roleId == 6 || roleId == 14) && scope.row.custom_type == 0" @click="modi_role(scope.row)" type="text" size="small">调整角色</el-button>
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
    <!-- M4 dialog 设置超级会员 -->
    <el-dialog
      title="设置超级会员"
      :visible.sync="dialogVisible_vip"
      width="30%"
      class="addUsers_dialog"
      center
      v-loading="vip_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <!--新增 body -->
      <div class="dialogBody_addPermission">
        <div class="grid-content bg-purple-dark pad_t2">
          <el-form
            :inline="true"
            :model="vipForm"
            label-width="80px"
            class="valid_form"
            ref="vip_form"
            :rules="vip_form_rules"
          >
            <el-form-item label="会员时长" prop="vip_date">
              <el-input v-model.number="vipForm.vip_date"  class="wid_140" placeholder="输入会员时长"></el-input>
              <span> 天 </span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible_vip = false" size="mini">关 闭</el-button>
        <el-button type="primary" @click="save_vip" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- M3 dialog 详情 -->
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
                v-model="detailForm.memberType"
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
    <!-- 调整角色 -->
    <el-dialog
      title="调整角色"
      :visible.sync="modi_rate_dialogVisible"
      top="15vh"
      width="40%"
      center
      :close-on-click-modal="false"
      v-loading="modi_rate_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="modi_role"
      >
      <!-- 业务信息 -->
      <el-form
        :model="modi_rate_form"
        :rules="modi_rate_rules"
        ref="modi_rate_form"
        class="demo-ruleForm valid_form"
        label-width="130px"
      >
        <el-form-item label="选择角色" prop="custom_type" >
          <el-select v-model="modi_rate_form.custom_type" placeholder="会员状态" class="wid_140">
            <el-option
              v-for="(item, index) of modi_rate_form.custom_types"
              :key="index"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打赏分成" prop="virtual_rate">
          <el-input v-model="modi_rate_form.virtual_rate" placeholder="打赏分成" class="wid_140"></el-input>%
          <span style="color:green;font-size:12px;">输入1-4之间的数</span>
        </el-form-item>
        <el-form-item label="充值提成" prop="recharge_bonus">
          <el-input v-model="modi_rate_form.recharge_bonus" placeholder="充值提成" class="wid_140"></el-input>%
          <span style="color:green;font-size:12px;">输入1-4之间的数</span>
        </el-form-item>
        <el-form-item label="开通一个月会费" prop="active_fee_month">
          <el-input v-model="modi_rate_form.active_fee_month" placeholder="开通一个月会费" class="wid_140"></el-input>元
          <span style="color:green;font-size:12px;">输入数字小于40</span>
        </el-form-item>
        <el-form-item label="开通三个月会费" prop="active_fee_three_month">
          <el-input v-model="modi_rate_form.active_fee_three_month" placeholder="开通三个月会费" class="wid_140"></el-input>元
          <span style="color:green;font-size:12px;">输入数字小于80</span>
        </el-form-item>
        <el-form-item label="开通六个月会费" prop="active_fee_six_month">
          <el-input v-model="modi_rate_form.active_fee_six_month" placeholder="开通六个月会费" class="wid_140"></el-input>元
          <span style="color:green;font-size:12px;">输入数字小于120</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="modi_rate_dialogVisible = false" size="mini">关 闭</el-button>
        <el-button type="primary" @click="save_modi_role" size="mini">确 定</el-button>
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
  getFloat
} from "../../utils/validate";
export default {
  name: "customInfo",
  data() {
    let validMobile = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确手机号"));
        } else {
          callback();
        }
      }
    };
    // 比例
    let validRate_commision = (val, value, callback) => {
      if (!value) {
        callback(new Error("请输入值"));
      } else if (!validNum4(value)) {
        callback(new Error("请输入1-4之间的正数,且小数位数不得多于一位"));
      } else {
        callback();
      }

    };
    // 一月会费
    let validFee_one =(val, value, callback) => {
       if (!value) {
        callback(new Error("请输入值"));
      } else if (!validNum40(value)) {
        callback(new Error("请输入0-40之间的正数"));
      } else {
        callback();
      }
    }
    // 三月会费
    let validFee_three =(val, value, callback) => {
       if (!value) {
        callback(new Error("请输入值"));
      } else if (!validNum80(value)) {
        callback(new Error("请输入0-80之间的正数"));
      } else {
        callback();
      }
    }
    // 半月会费
    let validFee_six =(val, value, callback) => {
       if (!value) {
        callback(new Error("请输入值"));
      } else if (!validNum120(value)) {
        callback(new Error("请输入0-120之间的正数"));
      } else {
        callback();
      }
    }
    return {
      roleId:'',
       // 地图
      districtSearch: "",
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 100,
      currentPage: 1,
      // 查询参数
      queryForm: {
        idcard_check_statuss:[
          {id:0,txt:'不需审核'},
          {id:1,txt:'已审核'},
          {id:2,txt:'需要审核'},
          {id:3,txt:'审核拒绝'},
        ],
        idcard_check_status:'',
        memberTypes: [
          {
            id: 1,
            txt: "会员"
          },
          {
            id: 2,
            txt: "非会员"
          }
        ],
        sexs:[
          {
            id: 1,
            txt: "男"
          },
          {
            id: 2,
            txt: "女"
          }
        ],
        sex:'',
        nickname: "",
        agent_name:'',
        up_customname:'',
        // 注册时间段
        times:'',
        startTime:'',
        endTime:'',
        customid:'',
        phone:'',
        lowMoney:'',
        highMoney:'',
        createtime:'',
        memberType: "",
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 省市
        province_code: "",
        city_code: "",
      },
      vipForm:{
        vip_date:'',
        customid:''
      },
      vip_form_rules:{
        vip_date:[
          { required: true, message: '会员时长不能为空', trigger:'blur'},
          { type: 'number', message: '会员时长必须为数字值',trigger:'blur'}
        ]
      },
      value1: "",
      // 弹框
      vip_loading: false,
      dialogVisible_vip:false,
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



        memberType: "",
        email: "",
        custom_status: "", //用户状态  1可用 2不可用
        apple_pay: "", //是否可以进行苹果支付 1支持 2不支持
        app_openid: "", //第三方登录标识 微信Openid 陌陌
        app_logintype: "", //app登录类别 0手机号 1微信 2陌陌 3邮箱


      },
      // 调整角色
      modi_rate_dialogVisible: false,
      modi_rate_loading: false,
      modi_rate_form: {
        virtual_rate: "",
        recharge_bonus:"",
        active_fee_month: "",
        active_fee_three_month:'',
        active_fee_six_month:'',
         customid:'',
        userId:'',

        custom_type:'',
        custom_types:[
          // {
          //   id:0,
          //   value:'机构'
          // },
          {
            id:1,
            value:'合伙人'
          },
          {
            id:2,
            value:'业务员'
          },
        ]
      },
      modi_rate_rules: {
        // 选择角色
        custom_type:[
           { required: true, message: '请选择角色', trigger: 'change' }
        ],
        // 比例4%
        virtual_rate: [
          { required: true, validator: validRate_commision, trigger: "blur" },
          // { type: "number", message: "分润比例必须为数字" }
        ],
        // 比例4%
        recharge_bonus:[
          { required: true, validator: validRate_commision, trigger: "blur" },
        ],
        //单月会费40
        active_fee_month: [
          { required: true, validator: validFee_one, trigger: "blur" },
          // { type: "number", message: "开户分成必须为数字" }
        ],
        //仨月会费80
        active_fee_three_month:[
          { required: true, validator: validFee_three, trigger: "blur" },
        ],
        // 六月会费120
        active_fee_six_month:[
          { required: true, validator: validFee_six, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 初始化 主列表数据
    this.getTableDataList(1);
    // 获取roleId
    this.roleId = this.$store.getters.roleId;
    // 初始化 地图plugin
    this.initMap();
    // 初始化 省份
    this.initProvinces();

  },
  methods: {
    // 初始化 主列表数据
    getTableDataList(pageNum) {
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          // 用户id
          customid:this.queryForm.customid,
          idcard_check_status:this.queryForm.idcard_check_status,
          nickname: this.queryForm.nickname,
          phone:this.queryForm.phone,
          pageNum: pageNum,
          pageSize: 10,
          agent_name:this.queryForm.agent_name,
          memberType: this.queryForm.memberType,
          up_customname:this.queryForm.up_customname,
          sex:this.queryForm.sex,
          // lowMoney:
          //   this.queryForm.lowMoney == ""
          //     ? this.queryForm.lowMoney
          //     : this.queryForm.lowMoney * 100,
          // highMoney:
          //   this.queryForm.highMoney == ""
          //     ? this.queryForm.highMoney
          //     : this.queryForm.highMoney * 100,

          // province_code:this.queryForm.province_code,
          // city_code:this.queryForm.city_code,
          // 注册时间
          // startTime:this.queryForm.startTime,
          // endTime:this.queryForm.endTime,

        }
      };

      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/customInfo/getAllCustomInfoList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            this.tableData = res.data.data.AllCustomInfoList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 人工认证/取消人工认证
    handle_identify(row){
      let _flag = "";
      let _flag_title = ""
      let _flag_txt = "";
      if (row.authentication_type == 1) {//取消人工
        _flag = 0;
        _flag_title="取消人工认证"
        _flag_txt = "是否取消人工认证?";
      } else {
        _flag = 1;
        _flag_title="人工认证"
        _flag_txt = "是否人工认证?";
      }
      this.$confirm(_flag_txt, _flag_title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        let param = {
          data: {
            identityid:row.identityid,
            authentication_type:_flag
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/identityInfo/updateCheckAuthentication`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.m_message(res.data.msg, "success");

              // 刷新
              this.handle_refresh();
            } else {
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
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
    // 调整角色
    modi_role(row){
      // 开弹框
      this.modi_rate_dialogVisible = true;
      this.modi_rate_form.customid = row.customid;
      // 初始化数据.......custom_type：0机构 1 合伙人2 业务员
      // 根据当前登陆者角色 显示角色类:roleId:2机构3合伙人
      // 机构可以调整普通用户=>业务员、合伙人
      // 合伙人可以调整普通用户=>业务员
      if(this.roleId == 6){ //机构
        this.modi_rate_form.custom_types = [
          {
            id:1,
            value:'合伙人'
          },
          {
            id:2,
            value:'业务员'
          }
        ];
      }else if(this.roleId == 14){ // 合伙人
        this.modi_rate_form.custom_types = [
          {
            id:2,
            value:'业务员'
          }
        ];
      }


    },
    // 保存调整角色
    save_modi_role() {
      if(this.m_valid_addForm('modi_rate_form')){
        // 修正小数位数
        // this.modi_rate_form.virtual_rate = getFloat(this.modi_rate_form.virtual_rate,1);
        let param = {
          data:{
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            customid:this.modi_rate_form.customid,
            custom_type:this.modi_rate_form.custom_type,

            virtual_rate: this.modi_rate_form.virtual_rate,
            recharge_bonus:this.modi_rate_form.recharge_bonus,
            active_fee_month: this.modi_rate_form.active_fee_month*100,
            active_fee_three_month:this.modi_rate_form.active_fee_three_month*100,
            active_fee_six_month:this.modi_rate_form.active_fee_six_month*100,
          }
        };
        // console.log(param.data)
        // debugger

        this.modi_rate_loading = true;
        this.$http
        .post(`${commonUrl.baseUrl}/agent/saveParterOrSalerOrAgent`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // 处理数据。。。。
            this.modi_rate_loading = false;
            this.m_message(res.data.msg, 'success')
            this.modi_rate_dialogVisible = false;
            // 更新数据
            this.handle_refresh();
          }else{
            this.modi_rate_loading = false;
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
        memberType: this.queryForm.memberType,
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
      // this.queryForm.memberType = "";

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
            this.handle_refresh();
          }
        })
        .catch(err => {});
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
            // this.detailForm.memberType =
            //   result.memberType == 1 ? "普通会员" : "超级会员";
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
    // 机构状态change事件
    changeOption_vip(e) {
      // console.log(e);
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
};
</script>
<style >
  .modi_role .el-dialog__body{
    height:60vh;
  }
</style>
