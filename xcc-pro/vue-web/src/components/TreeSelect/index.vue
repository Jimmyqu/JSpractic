<template>
    <div class="tree-select-panel">
        <el-select v-model="text"  :placeholder="placeholder" ref="treeSelect" v-cloak
                   :disabled="disabled" clearable @clear="clear" :loading="load" @visible-change="visibleChange">
            <el-option value="0" class="tree-select">
                <div class="tree-box" @click.prevent.stop>
                    <el-input
                        placeholder="输入关键字搜索"
                        v-model="filterText">
                    </el-input>
                    <span class="num" v-if="type!='one'">已选中{{selectIds.length}}个</span>
                    <el-tree    :data="data"
                                :check-strictly="true"
                                @check-change="update"
                                @node-click="nodeClick"
                                :show-checkbox="type!='one'"
                                node-key="id"
                                :props="defaultProps"
                                :ref="treeName"
                                :expand-on-click-node="false"
                                :filter-node-method="filterNode"
                                default-expand-all>
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="name-text" :class="{'disabled':data.disabled}" :title="node.label">{{ node.label }}</span>
                    </span>
                    </el-tree>
                </div>
            </el-option>
        </el-select>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { tool } from '@/utils/common'

    export default {
        name: 'tree-select',
        mixins: [tool],
        props: {
            disabled:Boolean,
            value:null,
            placeholder:String,

            disabledEmpty: Boolean,
            name: String,
            type: String,
            disabledId: Array,
            params: Object,
            url: String,
            mode: String,
            index:null
        },
        data() {
            return {
                treeName: "tree" + new Date().getTime(),
                text:'',

                filterText: '',// 搜索关键字
                selectIds: [],
                selectData: [],
                selectShowId: [],
                dataObj:{},
                data: [],
                defaultProps: {
                    isLeaf: 'leaf',
                    children: 'children',
                    label: 'name'
                },
                load:false,
                time:null
            };
        },
        watch: {
            data: {
                handler(val, oldVal) {
                    if(val){
                        this.setData(val);
                    }
                    if(this.value){
                        this.selectIds = this.value;
                        this.updateSelect();
                    }
                },
                deep: true
            },
            value: {
                handler(val, oldVal) {
                    if(val){
                        this.selectIds = this.value;
                        this.updateSelect();
                    }else{
                        this.selectIds = [];
                        this.updateSelect();
                    }
                },
                deep: true
            },
            url() {
                this.getData();
            },
            params: {
                handler(val, oldVal) {
                    if(val){
                        this.getData();
                    }
                },
                deep: true
            },
            disabledId: {
                handler(val, oldVal) {
                    if (JSON.stringify(val) === JSON.stringify(oldVal)) {
                        return;
                    }
                    if (!this.disabledId || this.disabledId.length === 0) {
                        return;
                    }
                    this.setDisabled(this.data);
                },
                immediate: true,
                deep: true
            },
            filterText(val) {
                this.$refs[this.treeName].filter(val);
            }
        },
        methods: {
            visibleChange(visible){
                this.load = true
                if(visible){
                    clearTimeout(this.time)
                    let length = this.data[0] && this.data[0].children && this.data[0].children.length || 0
                    let time = length > 100 ? 1000 : length * 10
                    this.time = setTimeout(()=>{
                        this.load = false
                    },time)
                }else{
                    this.load = true
                }
            },
            clear(){
                this.selectIds = [];
                this.selectData = [];
                this.setSelectData();
                this.emit();
            },
            // 调用者改变数据后更新选中状态
            updateSelect() {
                this.setDisabled(this.data);
                this.setSelectData();
            },
            // 设置节点数据
            setData(data){
                data && data.forEach(item =>{
                    this.dataObj[item.id] = Object.assign({},item);
                    if(item.children && item.children.length) {
                        this.setData(item.children);
                    }
                })
            },
            // 设置选中数据
            setSelectData() {
                let data = this.$refs[this.treeName].getCheckedNodes();
                let key = this.$refs[this.treeName].getCheckedKeys();
                if(JSON.stringify(data) !== JSON.stringify(this.selectData)
                        ||JSON.stringify(key) !== JSON.stringify(this.selectIds)){
                    if (Array.isArray(this.selectIds) && this.selectIds && this.selectIds.length) {
                        this.$refs[this.treeName].setCheckedKeys(this.selectIds);
                        // this.selectData = this.$refs[this.treeName].getCheckedNodes();
                        this.selectData = [];
                        this.selectIds.forEach(item =>{
                            let bean = this.dataObj[item];
                            if(bean) {
                                this.selectData.push(bean);
                            }
                        });
                    } else {
                        this.$refs[this.treeName].setCheckedKeys([]);
                        this.selectData = [];
                    }
                }
                this.setSelectName();
            },
            // 设置禁用id
            setDisabled(data) {
                if (!data)
                    return;
                data.forEach((bean) => {
                    if (this.disabledId && this.disabledId.indexOf(bean.id) !== -1) {
                        this.$set(bean, 'disabled',true);
                    }else{
                        this.$set(bean, 'disabled',false);
                    }
                    if (this.disabledEmpty && bean.hasUser === 0 && bean.name.indexOf("暂无用户") === -1) {
                        this.$set(bean, 'name',bean.name + '(暂无用户)');
                    }
                    if (bean.children && bean.children.length > 0) {
                        this.setDisabled(bean.children);
                    }
                });
            },
            // 单选选取部门
            nodeClick(bean) {
                if (this.type === 'one' && !bean.disabled && (!this.disabledEmpty || bean.hasUser)) {
                    this.selectIds = [bean.id];
                    this.selectData = [bean];
                    this.setSelectData();
                    this.emit();
                    return false;
                }
            },
            // 点击后更新
            update(bean) {
                console.log('update',bean);
                if(this.type === 'one'){
                    return;
                }else{
                    this.selectIds = this.$refs[this.treeName].getCheckedKeys();
                    this.selectData = this.$refs[this.treeName].getCheckedNodes();
                }

                this.setSelectData();
                this.emit();
            },
            // 设置选取的name
            setSelectName(){
                if(!this.selectData){
                    return;
                }
                let text = [];
                this.selectData.forEach(item =>{
                    text.push(item.name);
                });
                this.text = text.join(",");
                if(this.type === "one") {
                    this.$refs.treeSelect.handleClose();
                }
            },
            // 更新调用者的数据
            emit() {
                this.$emit("input",this.selectIds,this.selectData);
                this.$emit("change",this.selectData,this.index);
            },
            getData() {
                if (!this.url) {
                    return;
                }
                ajax.get(this.url, this.params).then((res) => {
                    if (this.checkResponse(res)) {
                        this.data = res.data;
                        this.updateSelect();
                        this.$nextTick(_ => {
                            this.$refs[this.treeName].filter(this.filterText);
                        });
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        },
        mounted() {
            this.getData();
        },
    }
</script>

<style>
    .tree-select{
        max-width: 480px;
        height: auto;
        padding: 0;
    }

    @media screen and (max-width: 1600px) {
        .tree-select{
            max-width: 350px;
        }
    }
    @media screen and (max-width: 1366px) {
        .tree-select{
            max-width: 330px;
        }
    }
    .tree-select .tree-box {
        background: #fff;
        padding: 0 20px;
        min-width: 300px;
    }
    .tree-select .num {
        position: absolute;
        height: 34px;
        top: 0;
        right: 30px;
        color: #409eff;
    }
    .tree-select .disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
    .custom-tree-node{
        width: 100%;
    }
    .name-text{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        padding-right: 20px;
    }
</style>
