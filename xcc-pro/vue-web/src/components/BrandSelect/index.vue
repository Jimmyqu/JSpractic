<template>
    <div class="brand-select">
        <el-select v-model="text" placeholder="请选择" ref="brandSelect">
            <el-option value="0">
                <div :id="id" class="select-box" @click.stop>
                    <ul class="char-box">
                        <li v-for="(list,key) in data" :key="key" @click="jump(key)">{{key}}</li>
                    </ul>
                    <ul class="one-box">
                        <li v-for="(list,key) in data" :key="key">
                            <div class="title" :data="key">{{key}}</div>
                            <div class="text" v-for="(bean,i) in list"
                                 :class="{'active':active1.id==bean.id}"
                                 @click="active1=bean;getData2(bean.id)" :key="i">{{bean.name}}
                            </div>
                        </li>
                    </ul>
                    <ul class="two-box" v-if="data2&&data2.length">
                        <li class="text" v-for="(bean,i) in data2"
                            :class="{'active':active2.id==bean.id}"
                            @click="active2=bean;getData3(bean.id)" :key="i">
                            {{bean.name}}
                        </li>
                    </ul>
                    <ul class="two-box" v-if="data3&&data3.length">
                        <li class="text" v-for="(bean,i) in data3"
                            :class="{'active':active3.id==bean.id}"
                            @click="active3=bean;setData(bean)" :key="i">
                            {{bean.name}}
                        </li>
                    </ul>
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import ajax from '@/utils/request'
    import $ from 'jquery-slim'

    export default {
        mixins: [tool],
        props: {
            disabledInit:Boolean,
            level: null,
            value: null
        },
        watch: {
            value: {
                handler(val, oldVal) {
                    if (!val) {
                        this.$emit("input", []);
                        return;
                    }
                    if(val.length) {
                        this.getText();
                    }
                },
                deep: true,
                immediate: true
            },
            level: {
                handler(val, oldVal) {
                    if (!val) {
                        this.curLevel = 2;
                    } else {
                        this.curLevel = val;
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                curLevel: 2,
                id: "id" + new Date().getTime(),
                text: "",
                data: {},
                data2: [],
                data3: [],
                active1: {},
                active2: {},
                active3: {},
            };
        },

        mounted() {
            if(!this.disabledInit){
                this.init();
            }
        },
        methods: {
            jump(key) {
                let top = $("#" + this.id).find("[data=" + key + "]")[0].offsetTop;
                $("#" + this.id).find(".one-box")[0].scrollTop = top;
            },

            init() {
                ajax.get("base/vehicleBrand/getVehicleBrandList").then(res => {
                    if (this.checkResponse(res)) {
                        this.formatData(res.data);
                        if(this.value && this.value.length == this.level) {
                            this.setData1(this.value[0]);
                            this.getData2(this.value[0],_ =>{
                                this.setData2(this.value[1]);
                            });
                            if(this.level == 3 && this.value[0] != 0){
                                this.getData3(this.value[1],_ =>{
                                    this.setData3(this.value[2]);
                                });
                            }

                        }
                    }
                })
            },
            formatData(list) {
                if(list && list.length) {
                    this.data = {}
                    list.forEach(bean =>{
                        if(bean.firstletter){
                            let dataList = this.data[bean.firstletter];
                            if(dataList){
                                dataList.push(bean);
                            }else{
                                this.data[bean.firstletter] = [bean];
                            }

                        }
                    })
                }

            },
            getData2(id, callback) {
                ajax.get("base/vehicleModel/getVehicleSeriesList?brandId=" + id).then(res => {
                    if (this.checkResponse(res)) {
                        if(res.data && res.data.length == 1 && res.data[0].id == 0){
                            this.active1 = res.data[0];
                            this.active2 = res.data[0];
                            this.active3 = res.data[0];
                            this.text = res.data[0].name;
                            this.data2 = [];
                            this.emit();
                            this.$refs.brandSelect.blur();
                        }else{
                            this.data2 = res.data;
                        }
                        this.data3 = [];
                        this.active2 ={};
                        this.active3 ={};
                        $.isFunction(callback) && callback();
                    }
                })
            },
            getData3(id, callback) {
                if(this.curLevel == 2) {
                    this.data3 = [];
                    this.setData();
                }else{
                    ajax.get("base/baseVehicleModelInfo/getVehicleModelInfoList?seriesId=" + id).then(res => {
                        if (this.checkResponse(res)) {
                            this.data3 = res.data;
                            this.active3 ={};
                            $.isFunction(callback) && callback();
                        }
                    })
                }

            },
            setData1(id){
                for(let key in this.data){
                    let list = this.data[key];
                    list.forEach(bean =>{
                        if(id == bean.id) {
                            this.active1 = bean;
                        }
                    });

                }
            },
            setData2(id){
                this.data2.forEach(bean =>{
                    if(id == bean.id) {
                        this.active2 = bean;
                    }
                });
                this.getText();
            },
            setData3(id){
                this.data3.forEach(bean =>{
                    if(id == bean.id) {
                        this.active3 = bean;
                    }
                });
                this.getText();
            },
            setData(){
                this.getText();
                this.emit();
                this.$refs.brandSelect.blur();
            },
            getText(){
                if(this.curLevel == 2&&this.active2.name){
                    this.text = this.active2.name;
                }else if(this.curLevel == 3&&this.active3.name){
                    this.text = this.active3.name;
                }
            },
            emit() {
                let idArr = [];
                let objArr = [];
                idArr.push(this.active1.id);
                objArr.push(this.active1);
                idArr.push(this.active2.id);
                objArr.push(this.active2);
                if(this.curLevel == 3){
                    idArr.push(this.active3.id);
                    objArr.push(this.active3);
                }
                this.$emit("input",idArr);
                this.$emit("change",objArr);
            }

        },
    }
</script>
<style scoped lang="scss">
    @mixin active {
        &.active,
        &:hover {
            background: #4a91ff;
            color: #fff;
        }
    }

    .el-select-dropdown__item {
        height: auto;
        padding: 0;
        margin: -6px 0;
    }

    .select-box {
        width: auto;
        height: 260px;
        font-size: 0;
        ul {
            width: 150px;
            height: 100%;
            overflow-y: scroll;
            display: inline-block;
            background: #fff;
            color: #333;
            font-size: 14px;
            &::-webkit-scrollbar {
                width: 2px;
            }
            ::-webkit-scrollbar-thumb {
                background-color: #9e9e9e;
            }
            &::-webkit-scrollbar-track-piece {
                background: #e5e5e5;
                border: 0;
            }
            li {
                width: 100%;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                line-height: 30px;
                .title {
                    height: 30px;
                    width: 100%;
                    padding-left: 30px;
                    color: #386ed3;
                    font-weight: 700;
                    background-color: #ebf0fb;
                }
                .text {
                    width: 100%;
                    height: 30px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-left: 30px;
                    &:nth-last-of-type(n+2) {
                        border-bottom: 1px solid #eee;
                    }
                    @include active;
                }
            }
        }
        ul.char-box {
            width: 25px;
            background: #f7f7f7;
            vertical-align: top;
            li {
                height: 25px;
                justify-content: center;
                @include active;
            }
        }
        ul.two-box {

            &:last-child{
                width: auto;
                li {
                    padding-right: 20px;
                }
            }
            li {
                border-bottom: 1px solid #eee;
                line-height: 29px;
                padding-left: 30px;
                @include active;
            }
        }
    }
</style>
