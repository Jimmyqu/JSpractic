<template>
    <el-dialog :title="relatioTitle" :visible.sync="show" width="1000px"
               top="5vh" :append-to-body="true">
        <el-tree :data="treeData" ref="tree" show-checkbox node-key="id" default-expand-all
                 :default-checked-keys="selectTreeId"
                 :expand-on-click-node="false" :check-strictly="true" :check-on-click-node="true"
                 @check="selectTree"
                 :class="{'data':treeData.length}">
                <span class="tree-item" slot-scope="{ node, data }">
                    <span class="tree-label" v-if="data.type!=3" :class="{'black':data.id=='0'||data.parentId=='0'}">
                        {{ data.name }}
                    </span>
                    <div class="button-permission" v-if="data.buttonList && data.buttonList.length" @click.stop>
                        <el-checkbox-group v-model="data.selectData">
                            <el-checkbox v-for="bean in data.buttonList" :label="bean.id" :key="bean.id"
                                         :disabled="bean.disabled"
                                         @change="selectTree(bean)">
                                {{bean.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </span>
        </el-tree>
        <div slot="footer" class="dialog-footer" v-show="showButton">
            <el-button @click="close()">取 消</el-button>
            <el-button type="primary" @click="save()">确 定</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'


    export default {
        mixins: [tool],
        data(){
            return {
                show:false,
                relatioTitle:"",
                selectTreeId:["0"],
                treeDataBak:{},
                treeData: [],
                roleId:"",
                showButton:false,
            }
        },
        methods:{
            open(row, showButton=true){
                console.log(showButton)
                if(showButton) {
                    this.relatioTitle = "分配权限";
                }else{
                    this.relatioTitle = "权限详情";
                }
                this.showButton = showButton;
                this.roleId = row.id;
                this.treeInit(row.id);
                this.show = true;
            },
            close(){
                this.show = false;
            },
            treeInit(roleId){
                ajax.get("sys/role/relation/"+roleId).then(res =>{
                    if(this.checkResponse(res)){
                        this.selectTreeId = ["0"];
                        if(!this.showButton){
                            this.setData(res.data);
                        }
                        this.treeData = res.data;
                        this.setTreeDataBak(this.treeData);
                    }else{
                        this.treeData = [];
                    }
                })
            },
            save(){ //修改权限
                let data = {
                    "roleId": this.roleId,
                    "ids": this.getTreeSelect()
                };
                ajax.post("sys/role/relation/edit", data).then((res) => {
                    if (this.checkResponse(res)) {
                        this.showMessage('权限分配成功','success');
                        this.show = false;
                    }
                });

            },
            //获取勾选的结果
            getTreeSelect(){
                let out = this.selectTreeId;
                for(let key in this.treeDataBak){
                    if (this.treeDataBak.hasOwnProperty(key) === true){
                        const selectData = this.treeDataBak[key].selectData;
                        const buttonList = this.treeDataBak[key].buttonList;
                        if(buttonList && buttonList.length && selectData && selectData.length){
                            out = out.concat(selectData);
                        }
                    }
                }
                out = out.filter(function(element,index,self){
                    return self.indexOf(element) === index&&element != "0";
                });
                return out;
            },
            setData(data){
                data.forEach(bean =>{
                    bean.disabled=true;
                    if(bean.children && bean.children.length) {
                        this.setData(bean.children);
                    }
                    if(bean.buttonList && bean.buttonList.length) {
                        this.setData(bean.buttonList);
                    }
                });
            },
            setTreeDataBak(data){
                data.forEach(bean =>{
                    this.treeDataBak[bean.id]=bean;
                    if(bean.children && bean.children.length) {
                        this.selectTreeId = this.selectTreeId.concat(bean.selectData);
                    }
                    if(bean.children && bean.children.length) {
                        this.setTreeDataBak(bean.children);
                    }
                    if(bean.buttonList && bean.buttonList.length) {
                        this.setTreeDataBak(bean.buttonList);
                    }
                });
            },
            selectParent(id, state){
                if(state) {
                    const bean = this.treeDataBak[id];
                    if(this.selectTreeId.indexOf(id) === -1){
                        this.selectTreeId.push(id);
                    }
                    if(bean.parentId){
                        this.selectParent(bean.parentId, state);
                    }
                }
            },
            selectChild(id, state) {
                const bean = this.treeDataBak[id];
                if(state) {
                    if(this.selectTreeId.indexOf(id) === -1){
                        this.selectTreeId.push(id);
                    }
                }else{
                    const i = this.selectTreeId.indexOf(id);
                    i !== -1 && this.selectTreeId.splice(i,1);
                }
                // 全选按钮权限
                if(bean.buttonList && bean.buttonList.length){
                    this.checkAll(bean, state);
                }
                bean.children&&bean.children.forEach(item => {
                    this.selectChild(item.id, state);
                });
            },
            //树节点勾选
            selectTree(data, isTree){
                let state;
                if(isTree){
                    this.selectTreeId = this.$refs.tree.getCheckedKeys();
                    state = this.selectTreeId.indexOf(data.id)!==-1;
                    this.selectChild(data.id, state);
                    this.selectParent(data.id, state);
                }else{
                    state = this.selectTreeId.indexOf(data.parentId)===-1;
                    this.selectParent(data.parentId, state);
                }
                this.$refs.tree.setCheckedKeys(this.selectTreeId);
            },
            //全选按钮权限
            checkAll(data, state){
                if(data.buttonList && data.buttonList.length){
                    let selectData = [];
                    if(state){
                        data.buttonList.forEach(bean =>{
                            selectData.push(bean.id);
                        })
                    }
                    this.$set(data,"selectData", selectData);
                }
            },
        }
    }
</script>
<style scoped lang="scss">
    /deep/ .el-dialog__footer {
        padding-top: 15px;
        padding-bottom: 15px;
    }
    .el-tree {
        border: 1px solid #eee;
        margin-top: 15px;
        max-height: calc(90vh - 130px);
        overflow-y: auto;
    }
    .el-tree /deep/ > .el-tree-node {
        position: relative;
    }
    .el-tree.data /deep/ > .el-tree-node:before {
        content: "";
        position: absolute;
        background: #eee;
        width: 1px;
        height: 100%;
        left: 250px;
    }
    .el-tree /deep/ .tree-label {
        max-width: calc(100% - 750px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .el-tree /deep/ .tree-label.black {
        color: #000;
    }

    .el-tree /deep/ .el-tree-node__content {
        height: auto;
        align-items: flex-start;
        border-bottom: 1px solid #eee;
        line-height: 25px;
    }
    .tree-item {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding-bottom: 5px;
        position: relative;
    }
    .tree-item .button-permission {
        width: 700px;
        display: flex;
        padding-left: 20px;
    }
    .tree-item .button-permission .el-checkbox-group {
        display: flex;
        flex-wrap: wrap;
    }
    .tree-item .button-permission .el-checkbox {
        margin-left: 0;
        margin-right: 10px;
    }
    .el-tree /deep/ .el-checkbox__label {
        color: #606266;
    }
    .el-tree /deep/ .tree-label,
    .el-tree /deep/ .el-checkbox,
    /deep/ .el-tree-node__content  .el-tree-node__expand-icon {
        margin-top: 3px;
    }
</style>
