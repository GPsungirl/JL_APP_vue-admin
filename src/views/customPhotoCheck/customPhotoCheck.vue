<template>
<!-- 照片审核 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
        <!-- 所属机构1 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="queryForm.nickname" placeholder="请输入昵称" class="wid_140"></el-input>
        </el-form-item>
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
        <el-form-item label="用户ID" prop="customid">
          <el-input v-model="queryForm.customid" placeholder="请输入用户ID" class="wid_140"></el-input>
        </el-form-item>
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
        <el-table-column prop="customid" label="用户ID" width="80"></el-table-column>
        <el-table-column prop="nickname" label="昵称" :show-overflow-tooltip="true" width="80"></el-table-column>
        <!-- <el-table-column prop="createtime" label="注册时间" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="member_time" label="会员到期" :show-overflow-tooltip="true" width></el-table-column> -->
        <el-table-column prop="agent_name" label="所属机构" :show-overflow-tooltip="true" width="100"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="" label="推荐人" width="70">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handle_detail(scope.row,'up_customid')">{{  scope.row.up_customname }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="推荐人上级" width="99">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handle_detail(scope.row,'grand_customid')">{{  scope.row.grand_customname }}</el-button>
          </template>
        </el-table-column>
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
        <el-table-column prop="" label="面容状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.info_status == 0">未认证</span>
            <span v-else-if="scope.row.info_status == 1">已认证</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="状态" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.custom_status == 1">正常</span>
            <span v-else-if="scope.row.custom_status == 2">异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="待审照片" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.countPhoto > 0">有</span>
            <span v-else>没有</span>
          </template>
        </el-table-column>
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
            <el-button @click="handle_avatar(scope.row)"  type="text" size="small">头像</el-button>
            <el-button  @click="handle_cameras(scope.row)" type="text" size="small">相册</el-button>

            <el-button v-if="scope.row.info_status == 0"  @click="handle_faceIndentify(scope.row)" type="text" size="small">面容认证</el-button>
            <el-button v-else-if="scope.row.info_status == 1" @click="handle_faceIndentify(scope.row)" type="text" size="small">取消面容认证</el-button>
            <!-- countPhoto>0时，显示照片审核 -->
            <el-button v-if="scope.row.countPhoto > 0"  @click="handle_photoCheck(scope.row)" type="text" size="small">照片审核</el-button>
             <!-- 可用 -->
            <!-- <el-button
              v-if="scope.row.custom_status == 1"
              @click="handle_frozen(scope.row)"
              type="text"
              size="small"
            >冻结</el-button> -->
            <!-- 不可用 -->
            <!-- <el-button
              v-if="scope.row.custom_status == 2"
              @click="handle_frozen(scope.row)"
              type="text"
              size="small"
            >解冻</el-button> -->
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
    <!-- M4 头像 -->
    <el-dialog
      title="头像信息"
      :visible.sync="dialogVisible_avatar"
      width="42%"
      class="addUsers_dialog"
      center
      v-loading="avatar_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">

      <div class="dialogBody_addPermission">
        <div class="grid-content bg-purple-dark pad_t2">
          <div class="demo-image__placeholder">
            <div class="block">
              <!-- <span class="demonstration">自定义</span> -->
              <el-image class="avatar_imgWrap" :src="avatar_src" :preview-src-list="avatar_srcList">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible_avatar = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- M5 相册 -->
    <el-dialog
      title="审核照片"
      :visible.sync="cameras_dialogVisible"
      width="50%"
      center
      append-to-body
      :close-on-click-modal="false"
      v-loading="cameras_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail"
      >
      <div class="clear_float">
        <div class="cameras_item" v-for="photo in cameras_list" :key="photo.photoid">
          <el-image
            style="width: 100px; height: 100px"
            :src="photo.photourl"
            :preview-src-list="[photo.photourl]">
          </el-image>
          <span class="deleteP" style="color:red" @click="deletePhoto(photo)">删</span>
        </div>
      </div>
      <div class="block mar_t10">
        <el-pagination
          @current-change="handleCurrentChange_cameras"
          :current-page="currentPage_cameras"
          :total="pageTotal_cameras"
          background
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cameras_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- M6 照片审核 -->
    <el-dialog
      title="审核照片"
      :visible.sync="photoCheck_dialogVisible"
      width="50%"
      center
      append-to-body
      :close-on-click-modal="false"
      v-loading="photoCheck_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail"
      >
      <el-table :data="photoCheck_tableData" v-loading="photoCheck_tableLoading" border stripe style="width: 100%">
        <el-table-column prop="" label="照片" width="">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.photourl"
              :preview-src-list="[scope.row.photourl]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="customid" label="用户ID" width>
        </el-table-column>
        <el-table-column label="状态" width="">
            <template slot-scope="scope">
                <span v-if="scope.row.photo_status == 0">待审核</span>
                <span v-if="scope.row.photo_status == 1">可用</span>
                <span v-if="scope.row.photo_status == 2">不可用</span>
                <span v-if="scope.row.photo_status == 3">无效</span>
            </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="" label="操作" width="">
            <template slot-scope="scope">
                <el-button @click="handle_checkPhoto(scope.row, 1)" type="text" size="small">审核</el-button>
                <el-button @click="handle_checkPhoto(scope.row, 2)" type="text" size="small">拒绝</el-button>
                <!-- <el-button @click="handle_select(scope.row)" type="text" size="small">选择</el-button>                    -->
            </template>
        </el-table-column>
      </el-table>
      <div class="block mar_t10">
        <el-pagination
          @current-change="handleCurrentChange_photoCheck"
          :current-page="currentPage_photoCheck"
          :total="pageTotal_photoCheck"
          background
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="photoCheck_dialogVisible = false" size="mini">关 闭</el-button>
      </span>

    </el-dialog>
  </div>
</template>
<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
export default {
  name: "customPhotoCheck",
  data() {
    return {
      roleId:'',

      // 主列表
      tableLoading: false,
      tableData: [],
      // 主列表分页
      pageTotal: 1,
      currentPage: 1,
      // 照片审核分页
      pageTotal_photoCheck: 1,
      currentPage_photoCheck: 1,
      // 相册分页
      currentPage_cameras:1,
      pageTotal_cameras:1,
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
      value1: "",
      // 弹框
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
      // 头像
      dialogVisible_avatar:false,
      avatar_loading:false,
      avatar_src:'',
      avatar_srcList:[],
      // 相册
      cameras_dialogVisible:false,
      cameras_loading:false,
      cameras_list:[],
      cameras_customid:'',
      // 照片审核
      photoCheck_dialogVisible:false,
      photoCheck_loading:false,
      photoCheck_tableData:[],
      photoCheck_tableLoading:false,
      photoCheck_customid:'',
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
          // 用户id
          customid:this.queryForm.customid,
          phone:this.queryForm.phone,
          pageNum: pageNum,
          pageSize: 10,

          nickname: this.queryForm.nickname,
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
        .post(`${commonUrl.baseUrl}/customInfo/getCustomPhotoManageList`, param)
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

    // 删除相册照片
    deletePhoto(photo){

      this.$confirm("确认删除照片?", "删除照片", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        let param = {
          data: {
            photoid: photo.photoid,
            cosPhotokey: photo.cosPhotokey,
            photo_status:3
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/customPhoto/deleteCustomPhoto`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.m_message(res.data.msg, "success");
              // 刷新
              this.getTableDataList_cameras(this.currentPage_cameras)
            } else {
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },
    // 面容认证/取消面容认证
    handle_faceIndentify(row){

      let _nickname = row.nickname;

      let _flag = "";
      let _flag_title = ""
      let _flag_txt = "";
      if (row.info_status == 1) {//取消面容认证
        _flag = 0;
        _flag_title=`（${_nickname}）取消面容认证`;
        _flag_txt = "是否取消面容认证?";
      } else {
        _flag = 1;
        _flag_title=`（${_nickname}）面容认证`
        _flag_txt = "是否面容认证?";
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
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            customid:row.customid,
            info_status:_flag,

          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/customInfo/updateInfoStatus`, param)
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
    // 操作-头像
    handle_avatar(row){
      // 清空数据
      this.avatar_srcList.length = 0;
      this.avatar_src = '';

      this.dialogVisible_avatar = true;

      let param = {
        data:{
          customid:row.customid,
        }
      }
      this.avatar_loading = true;
      this.$http
      .post(`${commonUrl.baseUrl}/customInfo/findCustomHeadPhoto`, param)
      .then(res => {
        console.log(res)
        if (res.data.code == "0000") {
          this.avatar_src = res.data.data.customInfo.headurl;
          // this.avatar_src = 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg';
          this.avatar_srcList.push(res.data.data.customInfo.headurl);
          this.avatar_loading = false;
        }
      })
      .catch(err => {});
    },
    // 操作-相册
    handle_cameras(row){
      this.cameras_dialogVisible = true;
      this.cameras_customid = row.customid;
      this.getTableDataList_cameras(1);
    },
    // 操作-照片审核
    handle_photoCheck(row){
      this.photoCheck_dialogVisible = true;
      this.photoCheck_customid = row.customid;
      console.log(this)
      this.getTableDataList_photoCheck(1);
    },
    // 操作-审核
    handle_checkPhoto(row, status){
      let param = {
        data:{
          photoid:row.photoid,
          photo_status:status,
          cosPhotokey:row.cosPhotokey
        }
      }
      this.photoCheck_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/customPhoto/checkCustomPhoto`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.photoCheck_tableLoading = false;
            this.m_message(res.data.msg, 'success');
            // 刷新列表
            this.getTableDataList_photoCheck(this.currentPage_photoCheck);
          }
        })
        .catch(err => {});
    },
    // 查询按钮
    queryData() {
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
          }
        })
        .catch(err => {});
    },
    // 机构状态change事件
    changeOption_vip(e) {
      console.log(e);
    },
    // 主列表分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
      //console.log(`当前页: ${val}`);
    },
    // 照片审核列表数据
    getTableDataList_photoCheck(pageNum){
      let param ={
        data:{
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          customid:this.photoCheck_customid,
          pageNum:pageNum,
          pageSize:10,
        }
      }
      this.photoCheck_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/customPhoto/selectPhotoWaitCheckList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.photoCheck_tableLoading = false;
            this.photoCheck_tableData = res.data.data.photoWaitCheckList;
            // 分页 总数
            this.pageTotal_photoCheck = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 照片审核列表分页
    handleCurrentChange_photoCheck(val) {
      this.currentPage_photoCheck = val;
      // 获取单前页数据列表
      this.getTableDataList_photoCheck(val);
      //console.log(`当前页: ${val}`);
    },
    // 获取相册列表数据
    getTableDataList_cameras(pageNum){
      let param ={
        data:{
          customid:this.cameras_customid,
          pageNum:pageNum,
          pageSize:10,
        }
      }
      this.cameras_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/customPhoto/selectPhotoCheckOkList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.cameras_tableLoading = false;
            this.cameras_list = res.data.data.photoCheckOkList;
            // 分页 总数
            this.pageTotal_cameras = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 相册列表份分页
    handleCurrentChange_cameras(val){
       this.currentPage_cameras = val;
      // 获取单前页数据列表
      this.getTableDataList_cameras(val);
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
  .modi_role .el-dialog__body{
    height:60vh;
  }
  .avatar_imgWrap{
    display: block;
    width:300px;
    height:200px;
    margin:auto;
  }
  .cameras_item{
    float:left;
    position: relative;
    margin:6px 6px;
  }
  .clear_float:after{
    display:block;clear:both;content:"";visibility:hidden;height:0
  }
  .clear_float{
    zoom:1;
  }



  .deleteP{
    font-size: 12px;
    position: absolute;
    top:0;
    right:0;
    border:1px solid red;
    border-radius: 50%;
    width:14px;
    height:14px;
    transform: scale(0.9);
  }
  .deleteP:hover{
    cursor: pointer;
  }
</style>
