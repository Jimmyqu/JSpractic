<template>
    <div class="form-panel">
        <el-form :model="customerInfo" :rules="rules" label-position="top" ref="customerInfo" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="基本资料" name="1">
                    <div class="flex-panel">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="customerInfo.name" placeholder="请输入姓名" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="customerInfo.sex" placeholder="请选择性别" clearable>
                                <el-option label="男" :value="1"></el-option>
                                <el-option label="女" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="customerInfo.phone" placeholder="请输入手机号" maxLength="11"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select @change="chooserOrgId" v-model="companyIds" placeholder="请选择组织" type="one"
                                         url="/admin/organization/tree"></tree-select>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idCard">
                            <el-input v-model="customerInfo.idCard" placeholder="请输入身份证号" maxLength="18" clearable
                                      @change="idCardChange"></el-input>
                        </el-form-item>
                        <el-form-item label="婚姻状况">
                            <el-select v-model="customerInfo.maritalStatus" placeholder="请选择婚姻状况" clearable>
                                <el-option label="已婚" :value="2"></el-option>
                                <el-option label="未婚" :value="1"></el-option>
                                <el-option label="离婚" :value="3"></el-option>
                                <el-option label="再婚" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="民族" prop="nationality">
                            <el-input v-model="customerInfo.nationality" placeholder="请输入民族" maxLength="20"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker v-model="customerInfo.birthday" type="date" value-format="yyyy-MM-dd"
                                            placeholder="请选择出生日期" :editable="false" readonly="">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model="customerInfo.age" placeholder="请输入年龄" maxLength="3" clearable
                                      readonly=""></el-input>
                        </el-form-item>

                        <el-form-item label="现住地址" prop="currentAddress">
                            <el-input type="textarea" v-model="customerInfo.currentAddress" placeholder="请输入现住地址"
                                      maxLength="50" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="户口所在地" prop="accountLocation">
                            <el-input v-model="customerInfo.accountLocation" placeholder="请输入户口所在地" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="customerInfo.remark" placeholder="请输入备注" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="征信" prop="credit">
                            <el-input v-model="customerInfo.credit" placeholder="请输入征信" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="驾驶证信息" name="2">
                    <div class="flex-panel">
                        <el-form-item label="驾驶证号" prop="driverNo">
                            <el-input v-model="customerInfo.driverNo" placeholder="请输入驾驶证号" maxLength="18"
                                      clearable disabled></el-input>
                        </el-form-item>
                      <el-form-item label="准驾车型">
                            <el-select v-model="customerInfo.driveType" multiple placeholder="请选择准驾车型" clearable filterable>
                                <el-option v-for="item in driveTypeList"
                                           :key="item.value"
                                           :label="item.text"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="驾驶证申领日期" prop="driveDate">
                            <el-date-picker v-model="customerInfo.driveDate" type="date" value-format="yyyy-MM-dd"
                                            placeholder="请选择驾驶证申领日期" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="驾龄" prop="driveAge">
                            <el-input v-model="customerInfo.driveAge" placeholder="请输入驾龄" maxLength="3"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="驾驶经历" prop="driveExperience">
                            <el-input type="textarea" v-model="customerInfo.driveExperience" placeholder="请输入驾驶经历"
                                      maxLength="50" clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="家庭联系人" name="3">
                    <div class="flex-panel">
                        <el-form-item label="家庭联系人" prop="familyContact">
                            <el-input v-model="customerInfo.familyContact" placeholder="请输入家庭联系人" maxLength="20"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="家庭联系人关系" prop="familyContactRelation">
                            <el-input v-model="customerInfo.familyContactRelation" placeholder="请输入家庭联系人关系" maxLength="20"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="家庭联系人手机号" prop="familyContactPhoneNo">
                            <el-input v-model="customerInfo.familyContactPhoneNo" placeholder="请输入家庭联系人手机号" maxLength="11"
                                      clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="银行卡信息" name="4">
                    <div class="flex-panel">
                        <el-form-item label="银行卡账号" prop="bankCard" >
                            <el-input v-model="customerInfo.bankCard" placeholder="请输入银行卡账号" maxLength="18"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="开户行" prop="openBank">
                            <el-input v-model="customerInfo.openBank" placeholder="请输入开户行" clearable maxLength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="开户人" prop="bankOwner">
                            <el-input v-model="customerInfo.bankOwner" placeholder="请输入开户人" clearable maxLength="10"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="证照" name="5">
                    <div class="flex-panel">
                        <el-form-item label="身份证正面">
                            <upload-panel :size="1" :file-list.sync="idCardFrontPhoto" accept=".jpg,.jpeg,.png"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                        <el-form-item label="身份证反面">
                            <upload-panel :size="1" :file-list.sync="idCardBackPhoto" accept=".jpg,.jpeg,.png"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                        <el-form-item label="驾驶证照片">
                            <upload-panel :size="1" :file-list.sync="driverCardPhoto" accept=".jpg,.jpeg,.png"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                        <el-form-item label="其他">
                            <upload-panel :size="1" :file-list.sync="otherPhoto" accept=".jpg,.jpeg,.png"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>

            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="submitForm('customerInfo')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "customerPersonalForm",
        components: {TreeSelect, CitySelect, MoneyInput, UploadPanel},
        data() {
            return {
                openCollapse: ["1", "2", "3", "4", "5"],
                show: false,
                customerInfo: {
                    driveType:[]
                },
                idCardFrontPhoto: [],
                idCardBackPhoto: [],
                driverCardPhoto: [],
                otherPhoto: [],
                companyIds: [],
                typeList:[],
                rules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'change'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'change'},
                        {validator: formRule.phone, message: "手机号必须为11位数字", trigger: "blur"}
                    ],
                    birthday: [
                        {required: true, message: '请选择出生日期', trigger: 'change'}
                    ],
                    driverNo: [
                        {required: true, message: '请输入驾驶证号', trigger: 'change'}
                    ],
                    driveDate: [
                        {required: true, message: '请选择驾驶证申领日期', trigger: 'change'}
                    ],
                    familyContactPhoneNo: [
                        {validator: formRule.phone, message: "家庭联系人手机号必须为11位数字", trigger: "blur"}
                    ],
                    age: [
                        {validator: formRule.standardSize, message: "请输入整数", trigger: "blur"}
                    ],
                    driveAge: [
                        {validator: formRule.standardSize, message: "请输入整数", trigger: "blur"}
                    ],
                    workAge: [
                        {validator: formRule.standardSize, message: "请输入整数", trigger: "blur"}
                    ],
                    serviceMonths: [
                        {validator: formRule.standardSize, message: "请输入整数", trigger: "blur"}
                    ],
                    idCard: [
                        {required: true, message: '请输入身份证号', trigger: 'blur'},
                        {
                            validator: formRule.common,
                            reg: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                            message: "请输入正确的身份证号",
                            trigger: "blur"
                        }
                    ],
                    companyId: [
                        {required: true, message: '所属组织不能为空', trigger: 'change'}
                    ],
                    /*workDate: [
                        { type: 'date', required: false, message: '请选择出生日期', trigger: 'change' }
                    ]*/
                    bankCard:[
                        {validator: formRule.numberSize,required:false ,size:[18], message: '请输入正确的银行卡号', trigger: 'change'}
                        ]
                },
                serviceCityList: [],
                driveTypeList: [],
                relatedUserList: [],

            }
        },
        methods: {

            idCardChange(value) {
                const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                if (reg.test(value)) {
                    /!*计算出生日期和年龄*!/
                    let birthday = this.getBirthdayFromIdCard(value);
                    /!*初始化出生日期和年龄*!/
                    const data = new Date(Date.parse(birthday.replace(/-/g, "/"))).format('yyyy-MM-dd');
                    this.$set(this.customerInfo, 'birthday', data);
                    this.$set(this.customerInfo, 'driverNo', value);
                    const age = this.getAges(birthday);
                    this.$set(this.customerInfo, 'age' +
                        '', age);

                }
            },

            getAges(str) {
                var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
                if (r == null) return false;
                var d = new Date(r[1], r[3] - 1, r[4]);
                if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
                    var Y = new Date().getFullYear();
                    return Y - r[1];
                }
            }, getBirthdayFromIdCard(idCard) { /!*根据身份证号获取出生年龄*!/
                var birthday = "";
                if (idCard != null && idCard != "") {
                    if (idCard.length == 15) {
                        birthday = "19" + idCard.substr(6, 6);
                    } else if (idCard.length == 18) {
                        birthday = idCard.substr(6, 8);
                    }

                    birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
                }
                return birthday;
            },

            open() {
                var $this = this;
                $this.openCollapse = ["1", "2", "3", "4", "5"];
                $this.show = true;
                /!*$this.clearValidate('customerInfo');*!/
                let id = this.$route.query.id;
                $this.selectDriveType();
                if (id) {
                    ajax.get("core/personal/detailEdit/" + id + "?time=" + new Date().getTime()).then(result => {
                        if (result.status == 0) {
                            $this.customerInfo = result.data;
                            $this.idCardChange($this.customerInfo.idCard);
                            if (result.data.driveType) {
                                result.data.driveType = result.data.driveType.split(',');
                            }else{
                                result.data.driveType =[]
                            }
                            $this.init();
                        }
                    });
                } else {

                }
            },
            clearValidate(customerInfo) {
                let $this = this;
                if ($this.$refs[customerInfo]) {
                    $this.$refs[customerInfo].resetFields();
                }
            },
           /* initData() {
                var $this = this;
                $this.idCardFrontPhoto = [];
                $this.idCardBackPhoto = [];
                $this.driverCardPhoto = [];
                $this.otherPhoto = [];
            },*/
            init() {
                var $this = this;
                if ($this.customerInfo.id) {
                    if ($this.customerInfo.idCardFrontPhoto) {
                        $this.idCardFrontPhoto.push(JSON.parse($this.customerInfo.idCardFrontPhoto));
                    }
                    if ($this.customerInfo.idCardBackPhoto) {
                        $this.idCardBackPhoto.push(JSON.parse($this.customerInfo.idCardBackPhoto));
                    }
                    if ($this.customerInfo.driverCardPhoto) {
                        $this.driverCardPhoto.push(JSON.parse($this.customerInfo.driverCardPhoto));
                    }
                    if ($this.customerInfo.otherPhoto) {
                        $this.otherPhoto.push(JSON.parse($this.customerInfo.otherPhoto));
                    }
                    $this.customerInfo.cityName = [$this.customerInfo.provinceId, $this.customerInfo.serviceCityId];
                    console.log($this.customerInfo.companyId);
                    $this.companyIds.push($this.customerInfo.companyId);
                }
            },chooserOrgId() {/!*选取用户组织*!/
                if (this.companyIds.length > 0) {
                    this.customerInfo.companyId = this.companyIds[0];
                }
            },

            photoHandle(object1, object2) {
                var $this = this;
                var object = {};
                object['name'] = object1[0].name;
                object['path'] = object1[0].path;
                object['filedomain'] = object1[0].filedomain;
                if (object2 == 1) {
                    $this.customerInfo.idCardFrontPhoto = JSON.stringify(object);
                } else if (object2 == 2) {
                    $this.customerInfo.idCardBackPhoto = JSON.stringify(object);
                } else if (object2 == 3) {
                    $this.customerInfo.driverCardPhoto = JSON.stringify(object);
                } else if (object2 == 4) {
                    $this.customerInfo.otherPhoto = JSON.stringify(object);
                }
            },
            submitForm(customerInfo) {
                var $this = this;
                $this.$refs[customerInfo].validate((valid) => {
                    if (valid) {
                        if ($this.idCardFrontPhoto != null && $this.idCardFrontPhoto.length > 0) {
                            $this.photoHandle($this.idCardFrontPhoto, 1);
                        } else {
                            $this.customerInfo.idCardFrontPhoto = null;
                        }
                        if ($this.idCardBackPhoto != null && $this.idCardBackPhoto.length > 0) {
                            $this.photoHandle($this.idCardBackPhoto, 2);
                        } else {
                            $this.customerInfo.idCardBackPhoto = null;
                        }
                        if ($this.driverCardPhoto != null && $this.driverCardPhoto.length > 0) {
                            $this.photoHandle($this.driverCardPhoto, 3);
                        } else {
                            $this.customerInfo.driverCardPhoto = null;
                        }
                        if ($this.otherPhoto != null && $this.otherPhoto.length > 0) {
                            $this.photoHandle($this.otherPhoto, 4);
                        } else {
                            $this.customerInfo.otherPhoto = null;
                        }

                        /!*$this.customerInfo.serviceCityId = $this.customerInfo.cityName[1];*!/
                        var url = "core/personal";
                        $this.customerInfo.driveType = $this.customerInfo.driveType.join(',');
                        var customerInfo = JSON.stringify($this.customerInfo);
                        console.log($this.customerInfo)
                        ajax.post(url, $this.customerInfo).then(res => {
                            if (res.status == 0) {
                                $this.$message({message: '保存成功', type: 'success'});
                                $this.close();
                                $this.$emit('load');
                            } else {
                                $this.$message.error('保存失败');
                            }
                        });
                    } else {
                        return false;
                    }

                });
            },
            selectDriveType() {
                var $this = this;
                ajax.get("admin/dict/type/准驾车型?time=" + new Date().getTime()).then(result => {
                    console.log(result);
                    if (result.length > 0) {
                        $this.driveTypeList = result;
                    } else {
                        $this.driveTypeList = [];
                    }
                });
            }
        },
        mounted() {
            this.open();
        }
    }
</script>

