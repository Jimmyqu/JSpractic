<template>
    <div class="approval-flow steps-panel">
        <el-steps direction="vertical" :active="active" style="width:100%;">
            <el-step :title="bean.nodeName" v-for="(bean,i) in list" :key="i">
                <i class="el-icon-check" slot="icon"></i>
                <div class="step-box" slot="description">
                    <div class="row" v-if="bean.nodeType==3">
                        <label>操作人</label>
                        <span>{{bean.approvaler}}</span>
                    </div>
                    <div class="row" v-if="i!=0" >
                        <label>状态</label>
                        <template v-if="bean.nodeType==3 || (bean.approvalStatus == 1 && !bean.approvaler)">
                            <span v-if="bean.approvalStatus==1 && bean.approvaler">同意</span>
                            <span v-if="bean.approvalStatus==1 && !bean.approvaler">已跳过</span>
                            <span v-if="bean.approvalStatus==2">不同意</span>
                        </template>
                        <span v-if="bean.nodeType==1">等待</span>
                        <span v-if="bean.nodeType==2 && !bean.approvalStatus == 1">进行中</span>
                    </div>
                    <div class="row" v-if="bean.nodeType==3">
                        <label>操作时间</label>
                        <span>{{bean.approvalTime}}</span>
                    </div>
                    <div class="row" v-if="i!=0&&bean.nodeType==3 && bean.approvalReason!=''">
                        <label>审批意见</label>
                        <span>{{bean.approvalReason}}</span>
                    </div>
                </div>
            </el-step>
        </el-steps>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'

    export default {
        name: 'city-select',
        mixins:[tool],
        props:{
            id:null
        },
        data() {
            return {
                active:999,
                list:[],
            };
        },
        watch:{
            id:{
                handler(val, oldVal){
                    if(val !== oldVal){
                        this.getData();
                    }
                },
                immediate: true
            }
        },
        methods: {
            getData(){
                if(!this.id){
                    return;
                }
                ajax.get("workflow/workflow/getProcessInfo/" + this.id).then((res) => {
                    if (this.checkResponse(res)) {
                        this.list = res.data;
                        this.list.forEach((item,i) =>{
                            if(item.nodeType == 3 || item.approvalStatus == 1){
                                this.active = i+1;
                            }
                        })
                    }
                });
            }
        },
    }
</script>

<style scoped>
    .el-steps {
        display: block;
    }
    .error-info {
        color: red;
    }
    .el-button--text {
        padding: 5px 0;
    }
    .hide-upload-btn .el-upload__tip,
    .hide-upload-btn .el-upload {
        display: none;
    }
    .el-upload__tip {
        line-height: 25px;
    }
    .el-upload-list__item {
        max-width: 300px;
    }
    .el-upload-list__item.is-success:focus .el-upload-list__item-status-label {
        display: block;
    }
    .el-upload-list__item.is-success:focus:hover .el-upload-list__item-status-label {
        display: none;
    }
    .el-table__header-wrapper th {
        background: #f5f6f8;
        color: #333;
    }

    .steps-panel {
        height: 100%;
        width: 100%;
        display: block;
    }
    .steps-panel .step-box {
        margin: 8px 0;
    }
    .steps-panel .close {
        float: none;
        opacity: 1;
        font-weight: initial;
        cursor: default;
    }
    .steps-panel .row {
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        padding: 3px 0;
        /*align-items: center;*/
    }
    .steps-panel .row > div {
        display: inline-block;
    }
    .steps-panel .steps-panel-title {
        font-size: 16px;
        font-weight: bold;
        color: #000;
    }
    .steps-panel .el-step.is-vertical .el-step__main {
        padding-left: 18px;
        color: #333;
        font-size: 16px;
    }
    .steps-panel .el-step.is-vertical .el-step__line {
        top: 2px;
    }
    .steps-panel .el-step {
        min-height: 60px;
    }
    .steps-panel .el-step__description.is-finish,
    .steps-panel .el-step__title.is-finish {
        color: inherit;
    }
    .steps-panel .el-step__description .row label {
        color: #444;
        font-weight: inherit;
        width: 90px;
        vertical-align: top;
        margin-bottom: 0;
    }
    .steps-panel .el-step__description .row > span {
        color: #000;
        width: calc(100% - 90px);
    }
    .steps-panel .el-step__description .upload-btn {
        margin-top: 5px;
    }
    .steps-panel .showBtn {
        font-size: 12px;
        color: #444;
        margin-left: 16px;
        cursor: pointer;
    }
    .steps-panel .showBtn:hover {
        color: #409EFF;
    }
    .steps-panel /deep/ .el-step .el-step__icon-inner{
        display: none;
    }
    .steps-panel /deep/ .is-process .el-step__icon.is-text  {
        border: 7px solid #ff9600;
    }
    .steps-panel /deep/ .is-process .el-icon-check {
        display: none;
    }
    .steps-panel /deep/ .el-step__line {
        background-color: #dcdfec;
    }
    .steps-panel /deep/ .el-step__head {
        border-color: #dcdfec;
    }
    .steps-panel /deep/ .el-step__head.is-finish {
        color: #fff;
        border-color: #afd5fa;
    }
    .steps-panel /deep/ .el-step__head.is-finish .el-step__icon.is-text {
        background-color: #60acf6;
        font-size: 18px;
        border: 0;
    }
    .steps-panel /deep/ .el-step__title.is-wait {
        color: #666;
    }

    .steps-panel .content-item ul {
        color: #2a78fd;
        margin-bottom: 5px;
    }
    .steps-panel .content-item ul li {

    }
    .steps-panel .file-item {
        display: flex;
        align-items: center;
    }
    .steps-panel .file-item .text{
        margin-right: 10px;
        margin-left: 10px;
        max-width: calc(100% - 65px);
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
        text-align: left;
    }
    .steps-panel .file-item .icon-btn {
        background: #b9c0cb;
        color: #fff;
        font-size: 14px;
        border-radius: 50%;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .steps-panel .file-item .icon-btn:active {
        opacity: 0.7;
    }
    .steps-panel .file-item .el-icon-back:before {
        transform: rotate(-90deg);
        font-size: 12px;
    }
    .steps-panel .file-item .el-icon-back:hover {
        background: #ff9600;
    }
    .steps-panel .file-item .el-icon-close:hover {
        background: #ff5824;
    }


    .steps-panel .after-renting .row {
        display: block;
    }
    .text-btn {
        display: inline-block;
        color: #2a78fd;
        margin: 0 15px;
        font-size: 12px;
    }


</style>
