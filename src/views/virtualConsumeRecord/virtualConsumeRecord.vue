<template>
<!-- 贝壳消费记录 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no handle_timerange">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        class="demo-form-inline"
      >
        <!-- 用户ID customid-->
        <el-form-item label="用户ID" prop="customid" label-width="68px">
          <el-input v-model="queryForm.customid" placeholder="请输入用户ID" class="wid_140"></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="phone" label-width="68px">
          <el-input v-model="queryForm.phone" placeholder="电话" class="wid_140"></el-input>
        </el-form-item>
        <!-- 消费贝壳 -->
        <el-form-item label="消费贝壳" label-width="68px">
          <el-col :span="24">
            <el-form-item prop="startVirtual">
              <el-input v-model="queryForm.startVirtual" placeholder="最小值" class style="width:70px"></el-input>-
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryForm.endVirtual" placeholder="最大值" class style="width:70px"></el-input>贝壳
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 订单编号 -->
        <el-form-item label="订单编号" prop="virtual_payoffid" label-width="68px">
          <el-input v-model="queryForm.virtual_payoffid" placeholder="订单编号" class="wid_140"></el-input>
        </el-form-item>
        <!-- 消费用途 -->
        <!-- <el-form-item label="消费用途" prop="virtual_class">
          <el-select v-model="queryForm.virtual_class" class="wid_140" placeholder="请选择消费用途">
            <el-option
              v-for="(item, index) in queryForm.business_types"
              :key="index"
              :label=" item.value "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 消费时间 -->
        <el-form-item label="消费时间" prop="businessTime">
          <el-date-picker
            v-model="queryForm.businessTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
        <el-table-column prop="customid" label="用户ID" width="80">
          <!-- 流水类别 consume_type 1支付 2退款 -->
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.consume_type == 2">{{ scope.row.dest_customid }}</span>
            <span v-else-if="scope.row.consume_type == 1">{{ scope.row.customid }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="80"></el-table-column>
        <el-table-column prop="virtual_src_amount" label="消费贝壳" width="80"></el-table-column>
        <el-table-column prop label="性别" width="50px">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == '1'">男</span>
            <span v-else-if="scope.row.sex == '2'">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <!-- 消费用途 1礼物 2红包  3现金充值 4提成入账 5转账 6提现 7充值会员 8预约上线 9退款-->
        <el-table-column prop label="消费用途" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.virtual_class == 1">礼物</span>
            <span v-else-if="scope.row.virtual_class == 2">红包</span>
            <span v-else-if="scope.row.virtual_class == 3">现金充值</span>
            <span v-else-if="scope.row.virtual_class == 4">提成入账</span>
            <span v-else-if="scope.row.virtual_class == 5">转账</span>
            <span v-else-if="scope.row.virtual_class == 6">提现</span>
            <span v-else-if="scope.row.virtual_class == 7">充值会员</span>
            <span v-else-if="scope.row.virtual_class == 8">预约上线</span>
            <span v-else-if="scope.row.virtual_class == 9">退款</span>
          </template>
        </el-table-column>
        <!-- 礼物名称 -->
        <el-table-column prop="gift_name" label="礼物名称" width="90"></el-table-column>
        <!-- 单价 -->
        <el-table-column prop="virtual_gift_price" label="单价" width="60"></el-table-column>
        <!-- 数量 -->
        <el-table-column prop="virtual_gift_num" label="数量" width="60"></el-table-column>
        <!-- 支付状态 -->
        <!--consume_refund_status 0待支付/退款 1支付/退款成功 2支付/退款失败 3支付/退款超时 -->
        <!-- 流水类别 consume_type 1支付 2退款 -->
        <!-- <el-table-column prop label="支付状态" width="80px">
          <template slot-scope="scope">

            <span v-if="scope.row.consume_type == 1">支付</span>
            <span v-else-if="scope.row.consume_type == 2">退款</span>
          </template>
        </el-table-column> -->
        <!-- 支付方式  1支付宝 2微信 --><!-- 待支付时，支付方式不显示 -->
        <!-- <el-table-column prop label="支付方式" width="80px">
          <template slot-scope="scope">

            <span v-if="scope.row.consume_type == 1 && scope.row.consume_refund_status ==0 "></span>
            <span v-else-if="scope.row.pay_type == 1">支付宝</span>
            <span v-else-if="scope.row.pay_type == 2">微信</span>
            <span v-else-if="scope.row.pay_type == 3">苹果</span>
            <span v-else-if="scope.row.pay_type == 4">贝壳</span>
          </template>
        </el-table-column> -->
        <!-- 消费时间 -->
        <el-table-column prop="createtime" :show-overflow-tooltip="true" label="消费时间" width="200"></el-table-column>
        <!-- 订单编号 -->
        <el-table-column prop="virtual_payoffid" label="订单编号" width="" :show-overflow-tooltip="true"></el-table-column>
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
  </div>
</template>
<script>
import commonUrl from "../../utils/common";

export default {
  name: "virtualConsumeRecord",
  data() {
    return {
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 0,
      currentPage: 1,
      // 查询参数
      queryForm: {
        // 用户id
        customid:'',
        phone:'',
        // 消费用途     1订单支付 2充值 3会员
        business_types: [
          {
            id: 4,
            value: "邀请上线"
          }
        ],
        virtual_class: "",
        // 订单编号
        virtual_payoffid: "",
        // 消费时间
        businessTime: "",
        // 开始时间  结束时间
        startTime: "",
        endTime: "",
        // 最大金额 最小进额
        startVirtual: "",
        endVirtual: "",
        // 昵称
        nickname: "",

      }
    };
  },
  created() {
    // 初始化主列表
    this.getTabelDataList(1);
  },
  methods: {
    // 初始化主列表
    getTabelDataList(pageNum) {
      // 参数
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有
          // 用户id
          customid:this.queryForm.customid,
          phone:this.queryForm.phone,
          // 消费用途   1订单支付 2充值 3会员
          //virtual_class: this.queryForm.virtual_class,
          // 订单编号
          virtual_payoffid: this.queryForm.virtual_payoffid,
          // 开始时间  结束时间
          startTime: this.queryForm.startTime,
          endTime: this.queryForm.endTime,
          // 最大金额 最小进额
          startVirtual:this.queryForm.startVirtual,
          endVirtual: this.queryForm.endVirtual,
        }
      };
      this.tableLoading = true;
      this.$http
        .post(
          `${commonUrl.baseUrl}/virtualPayoffInfo/selectVirtualPayoffList`,
          param
        )
        .then(res => {
          if (res.data.code == "0000") {
            this.tableData = res.data.data.virtualPayoffList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
            // 关闭加载
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },

    // 刷新 主列表
    handle_refresh() {
      this.getTabelDataList(this.currentPage);
      // this.currentPage = 1;
    },
    // 查询按钮
    queryData() {
      // console.log(this.queryForm);
      // 修正一下 开始时间和结束时间
      this.queryForm.startTime = this.queryForm.businessTime[0];
      this.queryForm.endTime = this.queryForm.businessTime[1];

      // this.queryForm.startVirtual = this.queryForm.startVirtual / 100
      // this.queryForm.endVirtual= this.queryForm.endVirtual/ 100

      this.getTabelDataList(1);
      this.currentPage = 1
    },
    // 重置按钮
    resetData(formName) {
      this.$refs[formName].resetFields();
      // 对于queryForm 下拉
      this.queryForm.businessTime = "";
      this.queryForm.pay_type = "";
      this.queryForm.virtual_class = "";
      this.queryForm.startVirtual = "";
      this.queryForm.endVirtual = "";
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTabelDataList(val);
      //console.log(`当前页: ${val}`);
    }
  }
};
</script>
