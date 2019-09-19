<template>
    <div class="app-container white-bg list-panel" v-cloak>

    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'setupCity',
        mixins: [tool],
        data() {
            return {
                showSearch: false,
                showAddBtn: this.getCurrentUserAuthority('city/addOrEdit'),
                showEditBtn: this.getCurrentUserAuthority('city/addOrEdit'),
                showDeleteBtn: this.getCurrentUserAuthority('city/delete'),
                showViewBtn: true,
                showExportExcelBtn: this.getCurrentUserAuthority('city/exportExcel'),
                searchParam: {},
                list: [],
                formData: {},
                listUrl: "/base/city/list"
            }
        },
        mounted: function () {
            this.getList();
        },
        methods: {
            deleteData(row) {
                var that = this;
                that.$confirm('是否确认删除城市【' + row.name + '】 ?').then(_ => {
                    ajax.post('/base/city/delete/' + row.id).then(rs => {
                        if (rs.status == 0) {
                            that.$message({message: '删除成功！', type: 'success'});
                            this.getList();
                        } else {
                            that.$message({message: rs.message, type: 'error'});
                        }
                    });
                }).catch(_ => {
                });
            },
            exportExcel() {
                const params = this.searchParam;
                params.rows = this.pageSize;
                params.page = this.page;
                window.open(exportUrl('base/city/exportExcel?' + $.param(params)));
            }
        },

    }
</script>

