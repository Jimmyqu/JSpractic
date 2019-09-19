<template>
    <li class="file-detail-panel file-item" v-if="fileName">
        <i class="file-icon" :class="setFileClass()"></i>
        <span class="text" :title="fileName">{{fileName}}</span>
        <i class="el-icon-back icon-btn" v-if="showDownload" @click="download()"></i>
        <i class="el-icon-close icon-btn" v-if="showDel" @click="del()"></i>
    </li>
</template>

<script>
    import {tool} from '@/utils/common'
    export default {
        mixins: [tool],
        props:{
            fileName:null,
            fileUrl:String,
            showDownload:Boolean,
            showDel:Boolean,
            fileJson:String
        },
        data() {
            return {
                type:''
            };
        },
        watch: {
            fileName:{
                handler(value){
                    if(value && value.split('\.').length == 2){
                        this.type = value.split('\.')[value.split('\.').length - 1];
                    }else{
                        this.type = '';
                    }
                },
                immediate: true
            },
            fileJson:{
                handler(v){
                    try{
                        let arr = JSON.parse(v);
                        this.fileName = arr[0].name;
                        this.fileUrl = arr[0].path;
                    }catch(e) {}
                }
            }
        },
        methods: {
            setFileClass(){
                if(this.type == ''){
                    return;
                }
                if('.xlsx'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'excel';
                }else if('.gif'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'gif';
                }else if('.html'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'html';
                }else if('.jpg'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'jpg';
                }else if('.mp3'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'mp3';
                }else if('.pdf'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'pdf';
                }else if('.ppt'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'ppt';
                }else if('.png'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'png';
                }else if('.txt'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'txt';
                }else if('.docx'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'word';
                }else if('.zip,.rar'.indexOf(this.type.toLocaleLowerCase()) !== -1){
                    return 'zip';
                }
            },
            download(){
                if(this.fileUrl){
                    this.downloadFile(this.fileUrl,this.fileName);
                }else{
                    this.$emit('download',this.bean);
                }
            },
            del(){
                this.$emit('del',this.bean);
            },
        },
        mounted(){
        },
    }
</script>
<style>
    .file-detail-panel {
        display: flex;
        align-items: center;
        height: 25px;
    }
    .file-detail-panel .text{
        margin-right: 10px;
        margin-left: 10px;
        line-height: 1.5;
        max-width: calc(100% - 65px);
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
        text-align: left;
    }
    .file-detail-panel .icon-btn {
        background: #b9c0cb;
        color: #fff;
        font-size: 14px;
        border-radius: 50%;
        margin-left: 10px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .file-detail-panel .icon-btn:active {
        opacity: 0.7;
    }
    .file-detail-panel .el-icon-back:before {
        transform: rotate(-90deg);
        font-size: 12px;
    }
    .file-detail-panel .el-icon-back:hover {
        background: #ff9600;
    }
    .file-detail-panel .el-icon-close:hover {
        background: #ff5824;
    }
    .file-icon {
        background: url("~img/file/white.png") no-repeat;
        background-size: 100%;
        width: 15px;
        height: 15px;
        display: inline-block;
    }
    .file-icon.excel {
        background-image: url("~img/file/excel.png");
    }
    .file-icon.gif {
        background-image: url("~img/file/gif.png");
    }
    .file-icon.html {
        background-image: url("~img/file/html.png");
    }
    .file-icon.jpg {
        background-image: url("~img/file/jpg.png");
    }
    .file-icon.mp3 {
        background-image: url("~img/file/mp3.png");
    }
    .file-icon.pdf {
        background-image: url("~img/file/pdf.png");
    }
    .file-icon.png {
        background-image: url("~img/file/png.png");
    }
    .file-icon.ppt {
        background-image: url("~img/file/ppt.png");
    }
    .file-icon.txt {
        background-image: url("~img/file/txt.png");
    }
    .file-icon.word {
        background-image: url("~img/file/word.png");
    }
    .file-icon.zip {
        background-image: url("~img/file/zip.png");
    }
</style>
