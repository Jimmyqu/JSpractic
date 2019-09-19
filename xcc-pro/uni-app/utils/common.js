import { get, post } from './request'

export const tool = {
    data() {
        return {
            pageSize: 15,
            page: 1,// 当前页
            listCount: 0,
            listUrl: "",
            list: [],
            searchParam:{},
            focus:false
        }
    },

    methods: {
        search(){
            this.page = 1;
            this.getList();
            this.focus = false;
		},
		clear(){
			this.resetSearchParamKey();
            this.focus = true;
            this.searchParam.driver = '';
            this.search();
        },
		resetSearchParamKey(){},
        toDetail(url,i){
            wx.navigateTo({ url:i?url+'?id='+i: url});
        },
        goback(){
            wx.navigateBack({
                delta: 1
            })
        },
        showToast(title='操作失败',icon="none",duration=2000){
            wx.showToast({
                title: title,
                icon: icon,
                duration: duration
            })
        },
        //重置筛选
        resetList() {
            this.searchParam = {};
            this.handleCurrentChange(1);
        },
        //切换页容量
        handleSizeChange(val) {
            this.pageSize = val;
            this.page = 1;
            this.getList();
        },
        //翻页
        handleCurrentChange(val, type) {
            this.page = val;
            if (type) {
                this.getList(false, false);
            } else {
                this.getList(false, true);
            }
        },
        getListBefore(params) {
        },
        getListAfter(callback) {
        },
        //查询列表
        getList(type) {
            this.hasGetList = true
            let params = Object.assign({}, this.searchParam);
            params.size = this.pageSize;
            params.current = this.page;
            params.rows = this.pageSize;
            params.page = this.page;
            this.getListBefore(params);
            // this.loading = true;
            //去除搜索条件 前后的空格
            for (var index in params) {
                if (typeof params[index] === 'string') {
                    var param = params[index].toString();
                    this.searchParam[index] = params[index] = param.replace(/(^\s*)|(\s*$)/g, "");
                }
            }
            get({
                url: this.listUrl,
                data: params
            }).then(res => {
                if (typeof res.records === "object") {
                    this.list = type?this.list.concat(res.records):res.records;
                    this.listCount = res.total;
                }
                if (typeof res.rows === "object") {
                    this.list = type?this.list.concat(res.rows):res.rows;
                    this.listCount = res.records;
                }
                this.getListAfter();
            })
        },
    },
    mounted() {
        this.pageSize = 15
        this.page = 1// 当前页
        this.listCount = 0
        this.list = []
    },
};
export const pullRefresh = {
    onPullDownRefresh() {
        this.page = 1;
        this.getList();
        //刷新完成后关闭
        wx.stopPullDownRefresh();
    },
    onReachBottom() {
        this.page = this.page + 1;
        if (this.list.length >= this.listCount) {
          return false;
        }
        this.getList(true);
    }
}