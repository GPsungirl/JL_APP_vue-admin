<template>
  <!-- manageAreaAgent.vue 区域机构管理-->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        class="demo-form-inline"
      >
        <!-- 业务地区 -->
        <el-form-item label="业务地区" prop="province_code">
          <el-col :span="12">
            <el-form-item prop="province_code">
              <el-select
                v-model="queryForm.province_code"
                placeholder="选择省"
                class="wid_140"
                @change="changeOption_province($event)"
              >
                <el-option
                  v-for="(item, index) in queryForm.regions"
                  :key="index"
                  :label=" item.province "
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="city_code">
              <el-select v-model="queryForm.city_code" placeholder="选择市" class="wid_140">
                <el-option
                  v-for="(item, index) in queryForm.cities"
                  :key="index"
                  :label=" item.city "
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 合同编号 -->
        <el-form-item label="合同编号" prop="contract_no">
          <el-input v-model="queryForm.contract_no" placeholder="请输入合同编号" class="wid_140"></el-input>
        </el-form-item>
        <!-- 机构状态 -->
        <el-form-item label="机构状态" prop="agent_status">
          <el-select v-model="queryForm.agent_status" class="wid_140" placeholder="选择机构状态">
            <el-option
              v-for="(item, index) in queryForm.agent_statuss"
              :key="index"
              :label=" item.value "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 机构名称 -->
        <el-form-item label="机构名称" prop="agent_name">
          <el-input v-model="queryForm.agent_name" placeholder="请输入机构名称" class="wid_140"></el-input>
        </el-form-item>
        <!-- 联系人 -->
        <el-form-item label="联系人" prop="charger" label-width="68px">
          <el-input v-model="queryForm.charger" placeholder="请输入联系人" class="wid_140"></el-input>
        </el-form-item>
        <!-- 联系电话 -->
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="queryForm.phone" placeholder="请输入联系电话" class="wid_140"></el-input>
        </el-form-item>
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
        <el-table-column prop="agent_name" label="机构名称" width></el-table-column>
        <el-table-column prop="charger" label="联系人" width="80px"></el-table-column>
        <el-table-column prop="phone" label="联系电话" width></el-table-column>
        <el-table-column prop label="业务地区" width>
          <template slot-scope="scope">{{ scope.row.province + scope.row.city }}</template>
        </el-table-column>
        <el-table-column prop label="贝壳分成" width="80px">
          <template slot-scope="scope">{{ scope.row.virtual_rate + '%' }}</template>
        </el-table-column>
        <el-table-column prop label="出行分成" width="80px">
          <template slot-scope="scope">{{ scope.row.account_rate + '%' }}</template>
        </el-table-column>
        <el-table-column prop="contract_no" label="合同编号" width></el-table-column>
        <el-table-column prop="state" label="状态" width="50px">
          <template slot-scope="scope">
            <span v-if="scope.row.agent_status == 1">可用</span>
            <span v-else-if="scope.row.agent_status == 2">冻结</span>
            <span v-else-if="scope.row.agent_status == 3">注销</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
            <!-- 1是可用状态；2是不可用状态 -->
            <el-button
              v-if="scope.row.agent_status == 1"
              @click="handle_frozen(scope.row)"
              type="text"
              size="small"
            >冻结</el-button>
            <el-button
              v-if="scope.row.agent_status == 2"
              @click="handle_frozen(scope.row)"
              type="text"
              size="small"
            >解冻</el-button>
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
    <!-- M3 dialog详情-->
    <el-dialog
      title="机构详情"
      :visible.sync="detail_dialogVisible"
      width="50%"
      center
      :close-on-click-modal="false"
      v-loading="detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- 业务信息 -->
      <el-form :inline="true" :model="detail_form" class="demo-form-inline" disabled>
        <!-- 业务信息 -->
        <!-- <p class="form_title">业务信息</p> -->
        <el-form-item label="机构名称" prop="agent_name">
          <el-input v-model="detail_form.agent_name" placeholder="审批人" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="机构编号" prop="agentid">
          <el-input v-model="detail_form.agentid" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="charger" label-width="68px">
          <el-input v-model="detail_form.charger" placeholder="负责人" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="业务地区" class="marg_r0">
          <el-col :span="11">
            <el-form-item prop="province_code" class="marg_b0">
              <el-select v-model="detail_form.province_code" placeholder="选择省" class="wid_90">
                <el-option
                  v-for="(item, index) in detail_form.regions"
                  :key="index"
                  :label=" item.province "
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="city_code" class="marg_b0">
              <el-select v-model="detail_form.city_code" placeholder="选择市" class="wid_90">
                <el-option
                  v-for="(item, index) in detail_form.cities"
                  :key="index"
                  :label=" item.city "
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="detail_form.address" placeholder="联系地址" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="贝壳分成" prop="virtual_rate">
          <el-input v-model="detail_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="detail_form.phone" placeholder="联系电话" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="出行分成" prop="account_rate">
          <el-input v-model="detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="detail_form.email" placeholder="联系邮箱" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contract_no">
          <el-input v-model="detail_form.contract_no" placeholder="合同编号" class="wid_180"></el-input>
        </el-form-item>
        <div></div>
        <el-form-item label="开户名" prop="account_user" label-width="68px">
          <el-input v-model="detail_form.account_user" placeholder="开户名" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bank_code" label-width="68px">
          <el-select v-model="detail_form.bank_code" placeholder="开户行" class="wid_190">
            <el-option
              v-for="(item, index) in detail_form.bankInfo"
              :key="index"
              :label=" item.bankname "
              :value=" item.bankcode "
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account_no" label-width="68px">
          <el-input v-model="detail_form.account_no" placeholder="账号" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="开户地" label-width="68px" class="marg_r0">
          <el-col :span="11">
            <el-form-item prop="account_province_code" class="marg_b0">
              <el-select
                v-model="detail_form.account_province_code"
                placeholder="选择省"
                class="wid_90"
              >
                <el-option
                  v-for="(item, index) in detail_form.account_regions"
                  :key="index"
                  :label=" item.province"
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="city_code" class="marg_b0">
              <el-select v-model="detail_form.account_city_code" placeholder="选择市" class="wid_90">
                <el-option
                  v-for="(item, index) in detail_form.account_cities"
                  :key="index"
                  :label=" item.city "
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- M4 冻结-->
  </div>
</template>
<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
export default {
  name: "manageAreaAgent",
  data() {
    return {
      // 地图
      districtSearch: "",
      // 主列表
      tableLoading: false,
      tableData: [],
      detail_dialogVisible: false,
      detail_loading: false,
      // 分页
      pageTotal: 100,
      currentPage: 1,
      // 查询参数
      queryForm: {
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 1可用 2冻结 3注销
        agent_statuss: [
          {
            id: 1,
            value: "可用"
          },
          {
            id: 2,
            value: "冻结"
          },
          {
            id: 3,
            value: "注销"
          }
        ],
        agent_status: "",
        // 机构名称  机构状态  联系人   合同编号 电话
        province_code: "",
        city_code: "",
        province_param: "",
        agent_name: "",

        charger: "",
        contract_no: "",
        phone: ""
      },
      // 详情数据
      detail_form: {
        regions: [],
        cities: [],
        // 机构编号
        agentid: "",
        // 机构名称
        agent_name: "",
        // 负责人
        charger: "",
        // 业务地区
        province_code: "",
        city_code: "",
        // 联系地址
        address: "",
        // 贝壳分成
        virtual_rate: "",
        // 出行分成
        account_rate: "",
        // 电话
        phone: "",
        // 邮箱
        email: "",
        // 合同编号
        contract_no: "",
        bankInfo: "",
        // 开户行
        bank_code: "",
        // 开户名
        account_user: "",
        // 账号
        account_no: "",
        // 开户地
        account_regions: "",
        account_cities: [],
        account_province_code: "",
        account_city_code: ""
      }
    };
  },
  created() {
    // 初始化 银行信息
    this.getBankList();
    // 初始化 地图plugin
    this.initMap();
    // 初始化 省份
    this.initProvinces();
    // 初始化 主列表数据
    this.getTableDataList(1);
  },
  methods: {
    // 初始化 银行信息
    getBankList() {
      this.$http
        .post(`${commonUrl.baseUrl}/agent/addAgent`, {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId
          }
        })
        .then(res => {
          if (res.data.code == "0000") {
            this.detail_form.bankInfo = res.data.data.bankList;
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
        })
        .catch(err => {});
    },
    // 初始化 主列表数据
    getTableDataList(pageNum) {
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有参数
          // 机构名称  机构状态  联系人   合同编号 电话
          province_code: this.queryForm.province_code,
          city_code: this.queryForm.city_code,
          agent_name: this.queryForm.agent_name,
          agent_status: this.queryForm.agent_status,
          charger: this.queryForm.charger,
          contract_no: this.queryForm.contract_no,
          phone: this.queryForm.phone
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/agent/getManageAreaAgent`, param)
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            this.tableData = res.data.data.agentList;
            // 分页总数
            this.pageTotal = res.data.data.page.pageTotal;
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 详情操作
    handle_detail(row) {
      this.detail_dialogVisible = true;
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/agent/findAreaAgentDetails`, {
          data: { agentid: row.agentid }
        })
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            let result = res.data.data.agent;
            // 机构id
            this.detail_form.agentid = result.agentid;
            // 机构名称
            this.detail_form.agent_name = result.agent_name;
            // 负责人
            this.detail_form.charger = result.charger;
            // 业务地区
            this.detail_form.province_code = result.province_code;
            // 根据省查询所有市
            this.queryCity(result.province, "detail_form");

            this.detail_form.city_code = result.city_code;
            // 联系地址
            this.detail_form.address = result.address;
            // 贝壳分成
            this.detail_form.virtual_rate = result.virtual_rate;
            // 出行分成
            this.detail_form.account_rate = result.account_rate;
            // 电话
            this.detail_form.phone = result.phone;
            // 邮箱
            this.detail_form.email = result.email;
            // 合同编号
            this.detail_form.contract_no = result.contract_no;
            // 开户行
            this.detail_form.bank_code = result.bank_code;
            // 开户名
            this.detail_form.account_user = result.account_user;
            // 账号
            this.detail_form.account_no = result.account_no;
            // 开户地
            // 查询开户行所在省份下的所有市列表
            this.queryBankCity(result.account_province, "detail_form");
            this.detail_form.account_province_code = result.account_pro_code;
            this.detail_form.account_city_code = result.account_city_code;

            this.detail_loading = false;
          }
        })
        .catch(err => {});
    },
    // 冻结操作
    handle_frozen(row) {
      let _flag = "";
      let _flag_title = ""
      let _flag_txt = "";
      if (row.agent_status == 1) {//冻结
        _flag = 2;
        _flag_title="冻结"
        _flag_txt = "是否冻结该机构?";
      } else {
        _flag = 1;
        _flag_title="解冻"
        _flag_txt = "是否解冻该机构?";
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
            agent_status: _flag,
            agentid: row.agentid,
            phone: row.phone
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/agent/updateAgentStatus`, param)
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
    // 查询按钮
    queryData() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 重置查询条件
    resetData(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(this.currentPage);
      // this.currentPage = 1;
    },
    // 省份change事件
    changeOption_province(e) {
      // 参数收集
      this.queryForm.province_param = {
        adcode: e,
        txt: provinces.province_list[e]
      };
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
    // 针对 account_cities这个特殊（后期合并方法***）
    queryBankCity(txt, dataOrigin) {
      let vm = this;
      // 搜索所有省/直辖市信息

      this.districtSearch.search(txt, function(status, result) {
        // 查询成功时，result即为对应的行政区信息
        for (let item of result.districtList[0].districtList) {
          vm[dataOrigin].account_cities.push({
            adcode: item.adcode,
            city: item.name
          });
        }
      });
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    },
    // 新增 校验规则
    m_valid_addForm(formName) {
      let flag = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          flag = true;
          return true;
        } else {
          flag = false;
          return false;
        }
      });
      return flag;
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取主页列表数据(loading状态)
      this.getTableDataList(val);
      //console.log(`当前页: ${val}`);
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
      this.detail_form.regions = this.detail_form.account_regions = arr;
    }
  }
};
</script>
