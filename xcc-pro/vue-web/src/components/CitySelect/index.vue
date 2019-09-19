<template>
    <div class="block">
        <el-cascader
            :disabled="disabled"
            :props="props"
            :options="options"
            v-model="cityId"
            @change="handleChange"
            filterable>
        </el-cascader>
    </div>
</template>

<script>
    import ajax from '@/utils/request'

    export default {
        name: 'city-select',
        props: {
            disabled: Boolean,
            value: null,
        },
        watch: {
            value: {
                handler(curVal=[], oldVal) {
                    if (JSON.stringify(curVal) === JSON.stringify(oldVal)) {
                        return
                    }
                    this.cityId = curVal;
                },
                immediate: true,
                deep: true
            }
        },
        data() {
            return {
                options: [],
                cityId: [],
                props: {
                    value: "id",
                    label: "name"
                }
            };
        },
        mounted() {
            this.loadCitySelect();
        },
        methods: {
            handleChange(value) {
                this.$emit("update:value", this.cityId);
                this.$emit("input", this.cityId);
                this.$emit("change", this.cityId);
            },
            loadCitySelect() {
                ajax.get("admin/dict/cityTree").then(res => {
                    var newResult = [];
                    res.forEach(function (bean) {
                        if (bean.pid) {
                            var data = {
                                id: bean.pid,
                                name: bean.pname,
                                children: bean.children
                            }
                            newResult.push(data);
                        }
                    });
                    this.options = newResult;
                })
            }
        },
    }
</script>

<style scoped>
    .svg-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
