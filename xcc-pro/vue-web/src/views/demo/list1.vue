<template>
    <div class="app-container list-panel">
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">订单号</label>
                    <div class="input-group">
                        <el-input v-model="searchData.value1"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchData.value2"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">驾驶员</label>
                    <div class="input-group">
                        <el-input v-model="searchData.value3"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchData.value4"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchData.value5" placeholder="不限">
                            <el-option label="新增" value="1"></el-option>
                            <el-option label="完成" value="2"></el-option>
                            <el-option label="取消完成" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">支付方式</label>
                    <div class="input-group">
                        <el-select v-model="searchData.value6" placeholder="不限">
                            <el-option label="现金" value="1"></el-option>
                            <el-option label="油卡" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">加油卡</label>
                    <div class="input-group">
                        <el-input v-model="searchData.value7"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button size="small" type="primary" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <el-button size="mini" type="warning" @click="showForm()">新增</el-button>
            <el-button size="mini" type="danger" :disabled="selectListData.length == 0" @click="delSelect()">批量删除
            </el-button>
        </div>
        <!--表格-->
        <div class="table-box">
            <!-- 多选才需要@selection-change -->
            <el-table :data="list" width="100%" border @selection-change="selectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column fixed="left" label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="showForm(scope.row)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="edit(scope.$index, tableData4)" type="text" size="small">
                            删除
                        </el-button>
                        <el-dropdown placement="bottom" size="mini" trigger="click">
                            <span class="el-dropdown-link">
                                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="table-dropdown" slot="dropdown">
                                <el-dropdown-item @click.native.prevent="edit(scope.$index, tableData4)">按钮1
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="edit(scope.$index, tableData4)">按钮2
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="edit(scope.$index, tableData4)">按钮3
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="edit(scope.$index, tableData4)">按钮4
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column prop="jumpTitle" label="所属组织" show-overflow-tooltip min-width="70"></el-table-column>
                <el-table-column prop="jumpTitle" label="加油卡" min-width="200"></el-table-column>
                <el-table-column prop="jumpTitle" label="油卡类型" min-width="100"></el-table-column>
                <el-table-column prop="jumpTitle" label="充值方式" min-width="100"></el-table-column>
                <el-table-column prop="jumpTitle" label="充值日期" min-width="100"></el-table-column>
                <el-table-column prop="jumpTitle" label="充值金额" min-width="100"></el-table-column>
                <el-table-column prop="jumpTitle" label="充值人" min-width="100"></el-table-column>
                <el-table-column prop="jumpTitle" label="充值前余额" min-width="100"></el-table-column>
                <el-table-column prop="jumpTitle" label="发票号" min-width="200"></el-table-column>
                <el-table-column prop="jumpTitle" label="状态" min-width="200"></el-table-column>
                <el-table-column prop="jumpTitle" label="录入人" min-width="100"></el-table-column>
                <el-table-column prop="jumpTitle" label="录入时间" min-width="200"></el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="listCount">
            </el-pagination>
        </div>

        <formTemplate ref="form" :form="formData"></formTemplate>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import ajax from '@/utils/request'
    import formTemplate from '@/views/tgpt/demo/form'

    export default {
        name: "demoList",
        mixins: [tool],
        components: {formTemplate},
        data() {
            return {
                showSearch: false,
                formData: {},
                searchData: {},
                selectListData: [],// 列表选中行的数据
                list: [],
                page: 1,
                pageSize: 10,
                listCount: 1,
            }
        },
        methods: {
            //列表切换选中事件 selectData 是当前选中的所有列表数据
            selectionChange(selectData) {
                this.selectListData = selectData;
            },
            //删除选中的数据
            delSelect() {
                let idArr = [];
                this.selectListData.forEach(item => {
                    idArr.push(item.id);
                });
                const params = {ids: idArr.join(",")};
                ajax.get("http://localhost:9528/static/json/list.json", params).then(res => {
                    this.showMessage("删除成功", "success");
                    this.handleCurrentChange(1);
                })
            },
            //重置筛选
            resetList() {
                this.searchData = {};
                this.handleCurrentChange(1);
            },
            //切换页容量
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },
            //翻页
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
            //查询列表
            getList() {
                const params = this.searchData;
                params.rows = this.pageSize;
                params.page = this.page;
                ajax.get("http://localhost:9528/static/json/list.json", params).then(res => {
                    this.list = res.data;
                    this.listCount = res.records;
                })
            },
            edit() {

            },
            delSelectData() {

            },
            showForm(bean) {
                if (bean) {
                    this.formData = Object.assign({}, bean);
                } else {
                    this.formData = {};
                }
                this.$refs.form.open();
            }
        },
        mounted() {
            this.getList();

        }
    }
</script>

