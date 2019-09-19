<template>
    <div class="form-panel">
        <el-form :model="driverInfo" :rules="rules" label-position="top" ref="driverInfo" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="基本资料" name="1">
                    <div class="flex-panel">
                        <el-form-item label="司机姓名" prop="name">
                            <el-input v-model="driverInfo.name" placeholder="请输入司机姓名" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="driverInfo.sex" placeholder="请选择性别" clearable>
                                <el-option label="男" :value="1"></el-option>
                                <el-option label="女" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="driverInfo.phone" placeholder="请输入手机号" maxLength="11"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select @change="chooserOrgId" v-model="companyIds" placeholder="请选择组织" type="one"
                                         url="/admin/organization/tree"></tree-select>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idCard">
                            <el-input v-model="driverInfo.idCard" placeholder="请输入身份证号" maxLength="18" clearable
                                      @change="idCardChange"></el-input>
                        </el-form-item>
                        <el-form-item label="婚姻状况">
                            <el-select v-model="driverInfo.maritalStatus" placeholder="请选择婚姻状况" clearable>
                                <el-option label="已婚" :value="2"></el-option>
                                <el-option label="未婚" :value="1"></el-option>
                                <el-option label="离婚" :value="3"></el-option>
                                <el-option label="再婚" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="民族" prop="nationality">
                            <el-input v-model="driverInfo.nationality" placeholder="请输入民族" maxLength="20"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker v-model="driverInfo.birthday" type="date" value-format="yyyy-MM-dd"
                                            placeholder="请选择出生日期" :editable="false" readonly="">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model="driverInfo.age" placeholder="请输入年龄" maxLength="3" clearable
                                      readonly=""></el-input>
                        </el-form-item>
                        <el-form-item label="籍贯" prop="nativePlace">
                            <el-input v-model="driverInfo.nativePlace" placeholder="请输入籍贯" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="学历">
                            <el-select v-model="driverInfo.education" placeholder="请选择学历" clearable>
                                <el-option label="初中及以下" :value="1"></el-option>
                                <el-option label="高中" :value="2"></el-option>
                                <el-option label="中专" :value="3"></el-option>
                                <el-option label="大专" :value="4"></el-option>
                                <el-option label="本科及以上" :value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="英文水平">
                            <el-select v-model="driverInfo.englishLevel" placeholder="请选择英文水平" clearable>
                                <el-option label="无" :value="1"></el-option>
                                <el-option label="一般" :value="2"></el-option>
                                <el-option label="熟悉" :value="3"></el-option>
                                <el-option label="精通" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="政治面貌">
                            <el-select v-model="driverInfo.politicalStatus" placeholder="请选择政治面貌" clearable>
                                <el-option label="群众" :value="1"></el-option>
                                <el-option label="党员" :value="2"></el-option>
                                <el-option label="其它党派" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="现住地址" prop="currentAddress">
                            <el-input type="textarea" v-model="driverInfo.currentAddress" placeholder="请输入现住地址"
                                      maxLength="50" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="户口所在地" prop="accountLocation">
                            <el-input v-model="driverInfo.accountLocation" placeholder="请输入户口所在地" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="driverInfo.remark" placeholder="请输入备注" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="征信" prop="credit">
                            <el-input v-model="driverInfo.credit" placeholder="请输入征信" maxLength="50"
                                      clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="驾驶证信息" name="2">
                    <div class="flex-panel">
                        <el-form-item label="驾驶证号" prop="driverNo">
                            <el-input v-model="driverInfo.driverNo" placeholder="请输入驾驶证号" maxLength="18"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="准驾车型">
                            <el-select v-model="driverInfo.driveType" placeholder="请选择准驾车型" clearable filterable>
                                <el-option v-for="item in driveTypeList" :key="item.value" :label="item.text"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="驾驶证申领日期" prop="driveDate">
                            <el-date-picker v-model="driverInfo.driveDate" type="date" value-format="yyyy-MM-dd"
                                            placeholder="请选择驾驶证申领日期" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="驾龄" prop="driveAge">
                            <el-input v-model="driverInfo.driveAge" placeholder="请输入驾龄" maxLength="3"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="驾驶经历" prop="driveExperience">
                            <el-input type="textarea" v-model="driverInfo.driveExperience" placeholder="请输入驾驶经历"
                                      maxLength="50" clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="家庭联系人" name="3">
                    <div class="flex-panel">
                        <el-form-item label="家庭联系人" prop="familyContact">
                            <el-input v-model="driverInfo.familyContact" placeholder="请输入家庭联系人" maxLength="20"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="家庭联系人关系" prop="familyContactRelation">
                            <el-input v-model="driverInfo.familyContactRelation" placeholder="请输入家庭联系人关系" maxLength="20"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="家庭联系人手机号" prop="familyContactPhoneNo">
                            <el-input v-model="driverInfo.familyContactPhoneNo" placeholder="请输入家庭联系人手机号" maxLength="11"
                                      clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="在职状态" name="4">
                    <div class="flex-panel">
                        <el-form-item label="关联用户" prop="relatedUserId">
                            <!--<el-input v-model="driverInfo.relatedUserId" placeholder="请选择关联用户" clearable></el-input>-->
                            <el-select v-model="driverInfo.relatedUserId" placeholder="请选择关联用户" clearable filterable
                                       remote :remote-method="selectRelatedUser" @click.native="selectRelatedUser()">
                                <el-option v-for="item in relatedUserList" :key="item.id" :label="item.text"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务城市" prop="cityName">
                            <city-select :value.sync="driverInfo.cityName" ref="citySelect"></city-select>
                            <!--<el-select v-model="driverInfo.serviceCityId" placeholder="请选择服务城市" clearable filterable remote :remote-method="selectUseCity" @click.native="selectUseCity()">
                                <el-option v-for="item in serviceCityList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>-->
                        </el-form-item>
                        <el-form-item label="工龄" prop="workAge">
                            <el-input v-model="driverInfo.workAge" placeholder="请输入工龄" maxLength="3"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="在职状态" prop="workStatus">
                            <el-select v-model="driverInfo.workStatus" placeholder="请选择在职状态" clearable>
                                <el-option label="在职" :value="1"></el-option>
                                <el-option label="离职" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="入职日期" prop="workDate">
                            <el-date-picker v-model="driverInfo.workDate" type="date" value-format="yyyy-MM-dd"
                                            placeholder="请选择入职日期" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="工作类型" prop="workType">
                            <el-select v-model="driverInfo.workType" placeholder="请选择工作类型" clearable>
                                <el-option label="专职长租" :value="1"></el-option>
                                <el-option label="专职短租" :value="2"></el-option>
                                <el-option label="兼职短租" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务状态" prop="serviceStatus">
                            <el-select v-model="driverInfo.serviceStatus" :disabled="serviceStatusDisabledFlag" placeholder="请选择服务状态" clearable>
                                <el-option label="空闲" :value="1"></el-option>
                                <el-option label="服务中" disabled :value="2"></el-option>
                                <el-option label="休假" :value="3"></el-option>
                                <el-option label="停用" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="违章次数">
                            <el-input v-model="driverInfo.violationCount" placeholder="请输入违章次数" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="事故次数">
                            <el-input v-model="driverInfo.accidentCount" placeholder="请输入事故次数" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="项目服务月数" prop="serviceMonths">
                            <el-input v-model="driverInfo.serviceMonths" placeholder="请输入项目服务月数" maxLength="6"
                                      clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="银行卡信息" name="5">
                    <div class="flex-panel">
                        <el-form-item label="银行卡账号" prop="bankCard" >
                            <el-input v-model="driverInfo.bankCard" placeholder="请输入银行卡账号" maxLength="18"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="开户行" prop="openBank">
                            <el-input v-model="driverInfo.openBank" placeholder="请输入开户行" clearable maxLength="30"></el-input>
                        </el-form-item>
                        <el-form-item label="开户人" prop="bankOwner">
                            <el-input v-model="driverInfo.bankOwner" placeholder="请输入开户人" clearable maxLength="10"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="证照" name="6">
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
                <el-button type="primary" @click="submitForm('driverInfo')">保存</el-button>
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
        name: "driverInformationForm",
        components: {TreeSelect, CitySelect, MoneyInput, UploadPanel},
        data() {
            return {
                openCollapse: ["1", "2", "3", "4", "5", "6"],
                show: false,
                serviceStatusDisabledFlag:false,
                driverInfo: {},
                idCardFrontPhoto: [],
                idCardBackPhoto: [],
                driverCardPhoto: [],
                otherPhoto: [],
                companyIds: [],
                rules: {
                    name: [
                        {required: true, message: '请输入司机姓名', trigger: 'change'}
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
                    cityName: [
                        {required: true, message: '请选择服务城市', trigger: 'change'}
                    ],
                    workStatus: [
                        {required: true, message: '请选择在职状态', trigger: 'change'}
                    ],
                    workType: [
                        {required: true, message: '请选择工作类型', trigger: 'change'}
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
                        {validator: formRule.standardSize, message: "请输入整数", trigger: "change"}
                    ],
                    serviceStatus: [
                        {required: true, message: '请选择服务状态', trigger: 'change'}
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
                relatedUserList: []
            }
        },
        methods: {

            idCardChange(value) {
                const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                if (reg.test(value)) {
                    /*计算出生日期和年龄*/
                    let birthday = this.getBirthdayFromIdCard(value);
                    /*初始化出生日期和年龄*/
                    const data = new Date(Date.parse(birthday.replace(/-/g, "/"))).format('yyyy-MM-dd');
                    this.$set(this.driverInfo, 'birthday', data);
                    const age = this.getAges(birthday);
                    this.$set(this.driverInfo, 'age' +
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
            },

            /*根据身份证号获取出生年龄*/
            getBirthdayFromIdCard(idCard) {
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
                $this.clearValidate('driverInfo');
                //$this.selectUseCity();
                let user = this.getCurrentUserInfo();
                let id = this.$route.query.id;
                if (id) {
                    ajax.get("base/driver/selectDriverById/" + id + "?time=" + new Date().getTime()).then(result => {
                        $this.selectDriveType();
                        $this.selectRelatedUser();
                        if (result.status == 0) {
                            $this.driverInfo = result.data;
                            $this.init();
                        }
                    });
                } else {
                    $this.selectDriveType();
                    $this.selectRelatedUser();
                    $this.initData();
                }
            },
            clearValidate(driverInfo) {
                let $this = this;
                if ($this.$refs[driverInfo]) {
                    $this.$refs[driverInfo].resetFields();
                }
            },
            initData() {
                var $this = this;
                $this.driverInfo = {};
                $this.idCardFrontPhoto = [];
                $this.idCardBackPhoto = [];
                $this.driverCardPhoto = [];
                $this.otherPhoto = [];
            },
            init() {
                debugger
                var $this = this;
                if ($this.driverInfo.id) {
                    if ($this.driverInfo.idCardFrontPhoto) {
                        $this.idCardFrontPhoto.push(JSON.parse($this.driverInfo.idCardFrontPhoto));
                    }
                    if ($this.driverInfo.idCardBackPhoto) {
                        $this.idCardBackPhoto.push(JSON.parse($this.driverInfo.idCardBackPhoto));
                    }
                    if ($this.driverInfo.driverCardPhoto) {
                        $this.driverCardPhoto.push(JSON.parse($this.driverInfo.driverCardPhoto));
                    }
                    if ($this.driverInfo.otherPhoto) {
                        $this.otherPhoto.push(JSON.parse($this.driverInfo.otherPhoto));
                    }
                    $this.driverInfo.cityName = [$this.driverInfo.provinceId, $this.driverInfo.serviceCityId];
                    $this.companyIds.push($this.driverInfo.companyId);
                    if($this.driverInfo.serviceStatus==2)
                        $this.serviceStatusDisabledFlag=true;
                }
            },

            /*选取用户组织*/
            chooserOrgId() {
                if (this.companyIds.length > 0) {
                    this.driverInfo.companyId = this.companyIds[0];
                }
            },

            photoHandle(object1, object2) {
                var $this = this;
                var object = {};
                object['name'] = object1[0].name;
                object['path'] = object1[0].path;
                object['filedomain'] = object1[0].filedomain;
                if (object2 == 1) {
                    $this.driverInfo.idCardFrontPhoto = JSON.stringify(object);
                } else if (object2 == 2) {
                    $this.driverInfo.idCardBackPhoto = JSON.stringify(object);
                } else if (object2 == 3) {
                    $this.driverInfo.driverCardPhoto = JSON.stringify(object);
                } else if (object2 == 4) {
                    $this.driverInfo.otherPhoto = JSON.stringify(object);
                }
            },
            submitForm(driverInfo) {
                var $this = this;
                $this.$refs[driverInfo].validate((valid) => {
                    if (valid) {
                        if ($this.idCardFrontPhoto != null && $this.idCardFrontPhoto.length > 0) {
                            $this.photoHandle($this.idCardFrontPhoto, 1);
                        } else {
                            $this.driverInfo.idCardFrontPhoto = null;
                        }
                        if ($this.idCardBackPhoto != null && $this.idCardBackPhoto.length > 0) {
                            $this.photoHandle($this.idCardBackPhoto, 2);
                        } else {
                            $this.driverInfo.idCardBackPhoto = null;
                        }
                        if ($this.driverCardPhoto != null && $this.driverCardPhoto.length > 0) {
                            $this.photoHandle($this.driverCardPhoto, 3);
                        } else {
                            $this.driverInfo.driverCardPhoto = null;
                        }
                        if ($this.otherPhoto != null && $this.otherPhoto.length > 0) {
                            $this.photoHandle($this.otherPhoto, 4);
                        } else {
                            $this.driverInfo.otherPhoto = null;
                        }
                        $this.driverInfo.serviceCityId = $this.driverInfo.cityName[1];
                        var url = "base/driver/edit";
                        var driverInfo = JSON.stringify($this.driverInfo);
                        ajax.post(url, $this.driverInfo).then(res => {
                            if (res.status == 0) {
                                $this.$message({message: res.message, type: 'success'});
                                $this.close();
                                $this.$emit('load');
                            } else {
                                $this.$message.error(res.message);
                            }
                        });
                    } else {
                        return false;
                    }

                });
            },
            selectUseCity(query) {
                var $this = this;
                if (!query) {
                    query = "";
                }
                ajax.get("base/driver/selectUseCity?name=" + query + "&time=" + new Date().getTime()).then(result => {
                    if (result.length > 0) {
                        $this.serviceCityList = result;
                    } else {
                        $this.serviceCityList = [];
                    }
                });
            },
            selectDriveType() {
                var $this = this;
                ajax.get("admin/dict/type/准驾车型?time=" + new Date().getTime()).then(result => {
                    if (result.length > 0) {
                        $this.driveTypeList = result;
                    } else {
                        $this.driveTypeList = [];
                    }
                });
            },
            selectRelatedUser(query) {
                var $this = this;
                if (!query) {
                    query = "";
                }
                ajax.get("base/driver/selectUser?name=" + query + "&time=" + new Date().getTime()).then(result => {
                    if (result.length > 0) {
                        $this.relatedUserList = result;
                    } else {
                        $this.relatedUserList = [];
                    }
                });
            }
        },
        mounted() {
            this.open();
        }
    }
</script>

