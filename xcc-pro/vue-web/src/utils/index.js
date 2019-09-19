import $ from "jquery-slim"
import ajax from '@/utils/request'

// 格式化时间
export function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1)
        let val = decodeURIComponent($2)
        val = String(val)
        obj[name] = val
        return rs
    })
    return obj
}

export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}

export function param(json) {
    if (!json) return ''
    return cleanArray(Object.keys(json).map(key => {
        if (json[key] === undefined) return ''
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
    })).join('&')
}

export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

export function objectMerge(target, source) {
    /* Merges two  objects,
       giving the last one precedence */

    if (typeof target !== 'object') {
        target = {}
    }
    if (Array.isArray(source)) {
        return source.slice()
    }
    Object.keys(source).forEach((property) => {
        const sourceProperty = source[property]
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty)
        } else {
            target[property] = sourceProperty
        }
    })
    return target
}

export function scrollTo(element, to, duration) {
    if (duration <= 0) return
    const difference = to - element.scrollTop
    const perTick = difference / duration * 10
    setTimeout(() => {
        console.log(new Date())
        element.scrollTop = element.scrollTop + perTick
        if (element.scrollTop === to) return
        scrollTo(element, to, duration - 10)
    }, 10)
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
        classString += '' + className
    } else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
    }
    element.className = classString
}


export function isInclude(name){
    let js = /js$/i.test(name);
    let es = document.getElementsByTagName(js?'script':'link');
    for(var i=0;i<es.length;i++) 
    if(es[i][js?'src':'href'].indexOf(name)!=-1)return true;
    return false;
}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach((keys) => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function (...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

export function uniqueArr(arr) {
    return Array.from(new Set(arr))
}

export function setListWidth() {
    $(".list-panel .search-box").each(function (i) {
        if ($(this).find(".form-group").length == 4 && $(this).width() >= 1520) {
            $(this).removeClass("hide-search").find(".el-icon-d-arrow-right").hide();
        }
    });
}

export function isFunction(a) {
    return "function" === typeof a
}

export function formatAmount(src, pos) {
    !src && (src = 0);
    let num = parseFloat(src.toString().replace(',', '')).toFixed(pos);
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = '0';
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    let cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (pos === 0) {
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        return ((sign) ? '' : '-') + num;
    } else {
        if (cents < 10) cents = '0' + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    }
}

export const WORKFLOW_CONFIG = {
    START_PROCESS_URL:"/workflow/workflow/startProcess",   //流程发起URL
    PROCESS_REVERSE_URL:"/workflow/workflow/approval",     //流程审批URL
    QUERY_UESR_TASK_URL:"/workflow/workflow/userTaskPage", //获取用户审批任务
    MODAL_TYPE:{
        "XMHT":{
            SERVICE:"coreProjectContractService",
            DETAIL_URL:"/tgpt/project/contract/detail/",
        },
        "CWHT":{
            SERVICE:"trafficContractService",
            DETAIL_URL:"/tgpt/project/contract/detail/",
        },
        "XMHTZX":{
            SERVICE:"coreProjectContractExecuteService",
            DETAIL_URL:"/tgpt/project/contractExecute/detail/",
        },
        "XMHTXQ":{
            SERVICE:"coreProjectContractRenewService",
            DETAIL_URL:"/tgpt/project/contract/detail/",
        },
        "XMHTSZ":{
            SERVICE:"coreProjectContractSanService",
            DETAIL_URL:"/tgpt/project/contractSan/detail/",
        },
        "XMDD":{
            SERVICE:"coreProjectOrderService",
            DETAIL_URL:"/tgpt/project/order/detail/",
        },
        "XMHTTC" :{
            SERVICE:"projectContractOutService",
            DETAIL_URL:"/tgpt/project/contractOut/detail/"
        },
        "FWTGHT":{
            SERVICE:"coreServiceHostingContractService",
            DETAIL_URL:"/tgpt/project/serviceHosting/contract/detail/",
        },
        "FWTGHTZX":{
            SERVICE:"coreServiceHostingContractExecutionService",
            DETAIL_URL:"/tgpt/project/serviceHosting/contractExecution/detail/",
        },
        "FWTGHTXQ":{
            SERVICE:"coreServiceHostingContractRenewService",
            DETAIL_URL:"/tgpt/project/serviceHosting/contract/detail/",
        },
        "CLDPSQD" :{
            SERVICE:"vehicleTransferService",
            DETAIL_URL:"/tgpt/traffic/transfer/detail/"
        },
        "XMTKSQJSP" :{
            SERVICE:"coreProjectTermsService",
            DETAIL_URL:"/tgpt/project/termApplyApproval/detail/"
        },
        "CLQJD": {
            SERVICE:"coreVehicleCleanBillService",
            DETAIL_URL:"/tgpt/traffic/clean/detail/",
        },
        "CLJYD" :{
            SERVICE: "coreVehicleFuelOilBillService",
            DETAIL_URL:"/tgpt/traffic/refuel/detail/"
        },
        "WXBYD" :{
            SERVICE: "vehicleMaintenanceBillService",
            DETAIL_URL:"/tgpt/traffic/maintenanceBill/detail/"
        },
        "XMPS" :{
            SERVICE: "coreProjectReviewService",
            DETAIL_URL:"/tgpt/project/approve/detail/"
        },
        "QYKHTKD" :{
            SERVICE: "enterpriseRefundService",
            DETAIL_URL:"/tgpt/financial/companyRefund/detail/"
        },
        /*"QYSK" :{
            SERVICE: "coreEnterpriseVoucherService",
            DETAIL_URL:"/tgpt/financial/companyReceipt/detail/"
        },*/
        "JYK" :{
            SERVICE: "oilCardService",
            DETAIL_URL:"/tgpt/traffic/oilCard/binding/"
        },
        "JYKCZJL" :{
            SERVICE: "oilCardRechargeService",
            DETAIL_URL:"/tgpt/traffic/oilCardRecharge/detail/"
        },
        "CLBXD" :{
            SERVICE: "vehicleInsuranceBillService",
            DETAIL_URL:"/tgpt/traffic/insuranceBill/detail/"
        },
        "CLSGD" :{
            SERVICE: "coreVehicleAccidentBillService",
            DETAIL_URL:"/tgpt/traffic/accident/detail/"
        },
        "QYKHSKD" :{
            SERVICE: "coreEnterpriseVoucherService",
            DETAIL_URL:"/tgpt/financial/companyReceipt/detail/"
        },
        "CLCGDD" :{
            SERVICE: "corePurchaseOrderService",
            DETAIL_URL:"/tgpt/vehicle/purchaseOrder/detail/"
        },
        "ZTBGL" :{
            SERVICE: "coreProjectBidService",
            DETAIL_URL:"/tgpt/project/bid/detail/"
        },
        "BXGL" :{
            SERVICE: "appDriverReimburseService",
            DETAIL_URL:"/tgpt_v2/appDriver/reimburse/detail/"
        },
        "CLCGJH" :{
            SERVICE: "corePurchasePlanService",
            DETAIL_URL:"/tgpt/vehicle/purchasePlan/detail/"
        },"SJXX" :{
            SERVICE: "appDriverMessageService",
            DETAIL_URL:"/tgpt_v2/appDriver/message/detail/"
        },
        "CLSYSQ" :{
            SERVICE: "baseVehicleUseApplyService",
            DETAIL_URL:"/tgpt_v2/vehicleUseApply/detail/"
        },
        "CLCZSQ" :{
            SERVICE: "baseVehicleDisposalApplyService",
            DETAIL_URL:"/tgpt_v2/vehicleDisposalApply/detail/"
        },
        "CLCSSQ" :{
            SERVICE: "baseVehicleSellApplyService",
            DETAIL_URL:"/tgpt_v2/vehicleSellApply/detail/"
        },
    }
}

export function number_format (number, decimals, dec_point, thousands_sep){
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

/**
 * 发起审批流程
 */
export function startProcess(businessId,modelCode, collback){
    const param = {businessId:businessId,modelCode:modelCode,businessService:WORKFLOW_CONFIG.MODAL_TYPE[modelCode].SERVICE};
    ajax.post(WORKFLOW_CONFIG.START_PROCESS_URL, param).then((res)=>{
        if(collback && typeof collback =="function"){
            collback(res);
        }
    });
}
/**
 * 发起审批流程
 */
export function startProcessAsync(businessId, modelCode, variables) {
    var param = {
        businessId: businessId,
        modelCode: modelCode,
        businessService: WORKFLOW_CONFIG.MODAL_TYPE[modelCode].SERVICE,
        variables: variables
    };
    return ajax.post(WORKFLOW_CONFIG.START_PROCESS_URL, param)
}

/**
 * 秒转时分秒，小于十补零
 * @param result
 * @returns {string}
 */
export function secondsToTime(seconds) {
    seconds = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    if(!seconds || seconds < 0){
        return;
    }
    var h = Math.floor(seconds / 3600) < 10 ? '0'+Math.floor(seconds / 3600) : Math.floor(seconds / 3600);
    var m = Math.floor((seconds / 60 % 60)) < 10 ? '0' + Math.floor((seconds / 60 % 60)) : Math.floor((seconds / 60 % 60));
    var s = Math.floor((seconds % 60)) < 10 ? '0' + Math.floor((seconds % 60)) : Math.floor((seconds % 60));

    return h + ":" + m + ":" + s;
}

/**
 * 秒转小时
 * @param result
 * @returns {string}
 */
export function secondsToHour(seconds) {
    seconds = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    if(!seconds || seconds < 0){
        return;
    }
    //小时
    return (seconds / 3600).toFixed(1);

}

export const calculator = {
    /*
    函数，加法函数，用来得到精确的加法结果
    */
    Add: function (arg1, arg2) {
        if (!arg1 || isNaN(arg1))
            arg1 = 0;
        if (!arg2 || isNaN(arg2))
            arg2 = 0;

        arg1 = arg1.toString(), arg2 = arg2.toString();
        var arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
            d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
        var maxLen = Math.max(d1.length, d2.length);
        var m = Math.pow(10, maxLen);
        var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
        var d = arguments[2];
        return typeof d === "number" ? Number((result).toFixed(d)) : result;
    },
    /*
    函数：减法函数，用来得到精确的减法结果
    */
    Sub: function (arg1, arg2) {
        if (!arg1 || isNaN(arg1))
            arg1 = 0;
        if (!arg2 || isNaN(arg2))
            arg2 = 0;
        return calculator.Add(arg1, -Number(arg2), arguments[2]);
    },
    /*
    函数：乘法函数，用来得到精确的乘法结果
    */
    Mul: function (arg1, arg2) {
        if (!arg1 || isNaN(arg1))
            arg1 = 0;
        if (!arg2 || isNaN(arg2))
            arg2 = 0;
        var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    },
    /*
    函数：除法函数，用来得到精确的除法结果
    */
    Div: function (arg1, arg2) {
        if (!arg1 || isNaN(arg1))
            arg1 = 0;
        if (!arg2 || isNaN(arg2))
            arg2 = 0;
        var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    }
};
