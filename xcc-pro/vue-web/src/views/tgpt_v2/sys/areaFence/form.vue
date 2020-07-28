<template>
    <div class="form-panel">
        <el-form :model="addForm" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="区域栅栏" name="1">

                    <el-row type="flex" class="row-bg">
                        <el-col :span="5">
                            <el-form-item label="服务组织" prop="companyId" :rules="rules.required('请选择服务组织')">
                                <!--<el-select v-model="addForm.companyId" placeholder="请选择">-->
                                    <!--<el-option-->
                                        <!--v-for="item in organizations"-->
                                        <!--:key="item.id"-->
                                        <!--:label="item.name"-->
                                        <!--:value="item.id">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->
                                <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                             url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                            </el-form-item>

                        </el-col>
                    </el-row>

                    <el-row type="flex" class="row-bg">
                        <el-col :span="5">
                            <el-form-item label="栅栏名称" prop="name" :rules="rules.required()">
                                <el-input v-model="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row type="flex" :gutter="20" class="row-bg" style="height: 360px">
                        <el-col :span="5">
                            <el-card class="box-card" style="height: 100%;overflow: auto;">
                                <el-tree
                                    ref="tree"
                                    :data="cityTreeData"
                                    show-checkbox
                                    node-key="id"
                                    @check-change="treeCheckChange">
                                </el-tree>
                            </el-card>
                        </el-col>
                        <el-col :span="9">
                            <el-input
                                type="textarea"
                                :rows="16"
                                v-model="cityTxt" disabled>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "areaFenceForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                activeNames: ['0', '1'],
                addForm: {},
                cityTreeData: [],
                cityTxt: '',
                cityId: '',
                cityData: [],
                organization:[],
                organizations: [],
                PI: 3.1415926535897932384626,
                A: 6378245.0,
                EE: 0.00669342162296594323,
            }
        },
        mounted() {
            //this.getOrganizations();
            this.open();

            let that = this;
            Promise.all([this.getCityTreeData(), this.getDetailById()])
                .then(function () {
                    that.$refs.tree.setCheckedKeys(that.addForm['citys']);
                });
            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            this.$nextTick(()=>{
                // this.initialize();
            })
        },
        methods: {
            getOrganizations() {  //获取组织数据
                ajax.get("admin/organization/managerCompany").then((res) => {
                    if (this.checkResponse(res)) {
                        this.organizations = res.data;
                        if (this.organizations.length == 1) {
                            this.addForm.companyId = this.organizations[0].id;
                        }
                    }
                });
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    //this.addForm.companyId = this.organization[0];
                    this.$set(this.addForm,'companyId',this.organization[0]);
                }else{
                    this.addForm.companyId = '';
                    this.$set(this.addForm,'',this.organization[0]);
                }
            },
            open() {
                this.addForm = {};
                this.getCityTreeData();
                this.getDetailById();
            },
            getCityTreeData() {
                let that = this;
                //城市树
                let p = new Promise(resolve => {
                    ajax.get('/admin/dict/cityTreeNode').then(rs => {
                        that.cityTreeData = rs.data;

                        resolve();
                    });
                });
                return p;
            },
            getDetailById() {
                if (!this.$route.query['id'])
                    return;

                let that = this;
                let p = new Promise(resolve => {
                    ajax.get('/base/baseAreaFence/' + that.$route.query['id']).then(rs => {
                        that.addForm = rs.data;
                        if (rs.data.companyId)
                            this.organization[0] = rs.data.companyId;
                        resolve();
                    });


                });
                return p;
            },
            //保存提交
            submitForm(form) {
                let data = this.addForm;

                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    if (!this.cityData || this.cityData.length == 0) {
                        this.$message.error('至少选择一个城市吧！！');
                        return;
                    }
                    console.log(this.cityData)
                    data.cityDataList = this.cityData;
                    this.loading = true;
                    ajax.post('/base/baseAreaFence', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({message: '操作成功', type: 'success'});
                            this.close();
                        }
                        this.loading = false;
                    }).catch(error => {
                        this.loading = false;
                    });
                });
            },
            treeCheckChange() {
                if (!this.$refs.tree)
                    return;

                let t = '', idx = '';
                let cityDatas = []
                this.$refs.tree.getCheckedNodes().forEach(node => {
                    if (node.parentId == '0')
                        return;
                    t += (',' + node.label);
                    idx += (',' + node.id);
                    if (node.parentId != '0') {
                        let parentDate = this.getByparentId(node.parentId);
                        let grade = 2;

                        let name = parentDate.name + node.label;
                        if (parentDate.parentId != 0 && parentDate.parentId != '0') {
                            let ipDate = this.getByparentId(parentDate.parentId);
                            name = ipDate.name + name;
                            grade = 3;
                        }
                        let city = {
                            id: node.id,
                            name: name,
                            grade: grade
                        };
                        this.getBoundary(city.name, data => {
                            city.lonAndLat = data;
                        })
                        cityDatas.push(city)
                    }

                });
                this.cityTxt = t.substr(1);
                this.cityData = cityDatas;
                console.log(this.cityData)
            },
            getByparentId(id) {
                for (var i = 0; i < this.cityTreeData.length; i++) {
                    let citys = this.cityTreeData[i];
                    if (citys.id == id) {
                        return {id: citys.id, name: citys.label, parentId: citys.parentId}
                    } else {
                        for (var j = 0; j < citys.children.length; j++) {
                            if (citys.children[j].id == id) {
                                return {
                                    id: citys.children[j].id,
                                    name: citys.children[j].label,
                                    parentId: citys.children[j].parentId
                                }
                            }
                        }
                    }
                }
            }, getBoundary(name, callback) {
                let bdary = new BMap.Boundary();
                let latAndLons = "";
                bdary.get(name, (rs) => {       //获取行政区域
                    let count = rs.boundaries.length; //行政区域的点有多少个
                    console.log(name)
                    let latAndLonsh = "";
                    for (let i = 0; i < count; i++) {
                        latAndLons = rs.boundaries[i];
                        if (latAndLons != "") {
                            latAndLons.split(";").forEach(node => {
                                var x = node.split(",")[0];
                                var y = node.split(",")[1];
                                var latAndLon = this.bd09_to_wgs84(x, y);
                                latAndLonsh += latAndLon.lat + "," + latAndLon.lon + ";"
                            })
                        }
                    }
                    callback(latAndLonsh);
                });

            }, bd09_to_wgs84(lat, lon) {
                var latAndLon = this.bd09_to_gcj02(lat, lon);
                return this.gcj02_to_wgs84(latAndLon.lat, latAndLon.lon)
            }, bd09_to_gcj02(lat, lon) {
                let x = lon - 0.0065;
                let y = lat - 0.006;
                let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.PI);
                let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.PI);
                return {lat: z * Math.sin(theta), lon: z * Math.cos(theta)};
            }, gcj02_to_wgs84(lat, lon) {
                let wgs84_pos = this.tran(lat, lon);
                let gcj02_lon = lon * 2 - wgs84_pos.lon;
                let gcj02_lat = lat * 2 - wgs84_pos.lat;
                return {lat: gcj02_lat, lon: gcj02_lon};
            }, tran(lat, lon) {
                var dLat = this.transformLat(lon - 105.0, lat - 35.0);
                var dLon = this.transformLon(lon - 105.0, lat - 35.0);
                let radLat = lat / 180.0 * this.PI;
                var magic = Math.sin(radLat);
                magic = 1 - this.EE * magic * magic;
                let sqrtMagic = Math.sqrt(magic);
                dLat = (dLat * 180.0) / ((this.A * (1 - this.EE)) / (magic * sqrtMagic) * this.PI);
                dLon = (dLon * 180.0) / (this.A / sqrtMagic * Math.cos(radLat) * this.PI);
                let mgLat = lat + dLat;
                let mgLon = lon + dLon;
                return {lat: mgLat, lon: mgLon};
            }, transformLat(x, y) {
                var ret = -100.0 + 2.0 * x + 3.0 * y;
                ret += 0.2 * y * y + 0.1 * x * y;
                ret += 0.2 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
                return ret;
            }, transformLon(x, y) {
                var ret = 300.0 + x + 2.0 * y;
                ret += 0.1 * x * x + 0.1 * x * y;
                ret += 0.1 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
                return ret;
            }

        }
    }
</script>

