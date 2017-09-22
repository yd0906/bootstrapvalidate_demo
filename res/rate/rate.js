/**
 * 企业商户入网 各个指标限制
 * @author YUDAN
 */
$(function(){
    // 添加表单验证
    $("#merchantForm").bootstrapValidator({
    	excluded:[":disabled"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
        feedbackIcons: {
            required: 'glyphicon glyphicon-asterisk requiredStar',
            valid: 'glyphicon glyphicon-ok',
            validating: 'glyphicon glyphicon-refresh'
        }
    });
    
    // 如果条件限制的数据为接口传入的，可在此处写ajax异步请求,不影响页面显示的时间
})

// 点击提交 触发验证
function submitForm(type) {
   if ("TJ" == type) {
       // 表单提交前再进行一次验证
       var bootstrapValidator = $("#merchantForm").data("bootstrapValidator").validate();
       // 当验证通过
       if (bootstrapValidator.isValid()) {
           alert("验证通过");
       }
   }
}

/**
 * MCC类型选择事件
 * @param object
 */
function selectMccType(object) {
	var selectMccType = $(object).val();
	// 可选列表置空
    $("#profitType").empty();
    // 根据MCC类型获取可选分润类型
    var standardRule = standardRuleMap.get(selectMccType);
    if (standardRule != null) {
        for(var i = 0; i < standardRule.length; i++) {
            $("#profitType").append(standardMap.get(standardRule[i]));
            // 设置默认选择
            if (i == 0) {
                setfeeRate();
                bktZzfw();
            }
        }
    } else {
        removeAllZzfwlxValidate();
        removeAllRateValidate();
    }
}

/**
 * 设置费率信息限制
 */
function setfeeRate() {
	// 获取当前 结算方式
    var fl_jsfs = $("#fl_jsfs").val();
    // 获取当前 分润类型
    var profitType = $("#profitType").val();
    // 移除已有的限制
    removeAllRateValidate();
    // 获取当前规则
    var rateStandard = rateStandardMap.get(fl_jsfs + "-" + profitType);
    // 添加新的限制条件
    if (null != rateStandard) {
    	// 借记卡费率
        bindInputLimit("flxx_jjkfl", rateStandard.jjkfl, false);
        // 借记卡封顶
        bindInputLimit("flxx_xykfd", rateStandard.xykfd, false);
        // 信用卡费率
        bindInputLimit("flxx_xykfl", rateStandard.xykfl, false);
        // 增收手续费
        bindInputLimit("flxx_zssxf", rateStandard.zssxf, false);
        // 增收费率
       // bindInputLimit("xxxxx", rateStandard.zsfl, false);
    }
}

/**
 * 设置增值服务信息
 */
function bktZzfw(){
	// 获取当前 增值服务类型
    var flxx_zzfwlx = $("#flxx_zzfwlx").val();
    // 获取当前 分润类型
    var profitType = $("#profitType").val();
    // 获取当前规则
    var rateStandard = rateStandardMap.get(flxx_zzfwlx + "-" + profitType);
    // 移除已有的限制
    removeAllZzfwlxValidate();
    // 限制条件
    if (null != rateStandard) {
        // 借记卡费率
        bindInputLimit("flxx_zzfw_jjkfl", rateStandard.jjkfl, false);
        // 借记卡封顶
        bindInputLimit("flxx_zzfw_xykfd", rateStandard.xykfd, false);
        // 信用卡费率
        bindInputLimit("flxx_zzfw_xykfl", rateStandard.xykfl, false);
        // 增收手续费
        bindInputLimit("flxx_zzfw_zssxf", rateStandard.zssxf, true);
        // 增收费率
        bindInputLimit("flxx_zzfw_zsfl",  rateStandard.zsfl, false);
    }
}

/**
 * 输入框绑定限制条件
 * @param tagId
 * @param inputLimit
 * @param onlyInteger
 */
function bindInputLimit(tagId, inputLimit, onlyInteger) {
   if (null == inputLimit) return ;
   // 添加默认值
   if (null != inputLimit.defaultValue) {
      $("#"+tagId).val(inputLimit.defaultValue);
   }
   // TODO 是否可填
   if (!inputLimit.use) {
      $("#"+tagId).attr("readonly", true);
   }
   // 添加上下限条件
   if (null != inputLimit.down) {
      addValidate($("#"+tagId), inputLimit.down, inputLimit.up, onlyInteger, tagId+"_error");
   }
}

/**
 * 设置输入的限制
 * @param _jqueryObject 验证的输入框对象
 * @param up            上限
 * @param down          下限
 * @param onlyInteger   只能输入整数
 * @param errorTag      错误信息显示框
 */
function addValidate(_jqueryObject, down, up, onlyInteger, errorTagId) {
   $("#merchantForm").bootstrapValidator("addField", _jqueryObject, {
      // 生成验证规则
      validators: generateValidator(onlyInteger, down, up),
      container: '#'+errorTagId // 存放错误的信息容器
   });
}

function generateValidator(onlyInteger, down, up) {
   var option = {
      notEmpty: {
          message: '不能为空'
      },
      numeric: {
          message: '只能是数字'
      },
      between: {
          min: down,
          max: up,
          message: " 下限："+ down + '上限：' + up
      }
   }
   var option2 = {
      notEmpty: {
          message: '不能为空'
      },
      numeric: {
          message: '只能是数字'
      },
      regexp: {
          regexp: /^[0-9]+$/,
          message: "只能整数"
      },
      between: {
          min: down,
          max: up,
          message: " 下限："+ down + '上限：' + up
      }
   }
   if (onlyInteger) {
      return option2;
   }
   return option;
}

/**
 * 移除所有增值服务类型的限制
 */
function removeAllZzfwlxValidate() {
   // 借记卡费率
   removeValidate("flxx_zzfw_jjkfl");
   // 借记卡封顶
   removeValidate("flxx_zzfw_xykfd");
   // 信用卡费率
   removeValidate("flxx_zzfw_xykfl");
   // 增收手续费
   removeValidate("flxx_zzfw_zssxf");
   // 增收费率
   removeValidate("flxx_zzfw_zsfl");
}

/**
 * 移除所有的费率信息限制
 */
function removeAllRateValidate() {
   // 借记卡费率
   removeValidate("flxx_jjkfl");
   // 借记卡封顶
   removeValidate("flxx_xykfd");
   // 信用卡费率
   removeValidate("flxx_xykfl");
   // 增收手续费
   removeValidate("flxx_zssxf");
}

/**
 * 移除验证
 * @param _jqueryObject
 */
function removeValidate(tagId) {
   // 取消置灰不可填
   $("#"+tagId).attr("readonly", false);
   // 删除已有值
   $("#"+tagId).val("");
   var message = $("#"+tagId).data('bv.messages');
   if (undefined != message) {
      try{
          // 取消已有的错误验证信息
          $("#merchantForm").data('bootstrapValidator').updateStatus($("#"+tagId), "NOT_VALIDATED", null );
          // 删除验证
          $("#merchantForm").bootstrapValidator('removeField', $("#"+tagId));
      } catch (e) {
          // 此处的异常不需要处理，删除验证时的更新操作由于验证不存在而出错
      }
   }
}

//**************************************** MCC类型对应 分润类型可选择列表 **********************************************
var standardRuleMap = new Map();
// 把要默认的写在最前边
standardRuleMap.put("BZ", new Array("bz","vip"));
standardRuleMap.put("YH", new Array("yh","bz","vip"));
standardRuleMap.put("JM", new Array("jm", "bz","yh","vip"));
standardRuleMap.put("TSJF", new Array("bz"));

//************************************************可选分润标准 *****************************************************
var standardMap = new Map();
standardMap.put("bz", "<option value=\"bz\">标准类</option>");
standardMap.put("yh", "<option value=\"yh\">优惠类</option>");
standardMap.put("jm", "<option value=\"jm\">减免类</option>");
standardMap.put("vip", "<option value=\"vip\">VIP</option>");

//********************************************* 费率信息各 档次 集合 **************************************************

/**
 * 费率标准集合
 * @param _key 结算方式-分润标准
 * @param _value {@link RateStandard}
 * @type {Map}
 */
var rateStandardMap = new Map();
/**********T1***********/
// T1-标准
rateStandardMap.put("T1-bz", new RateStandard(
      new InputLimit("", true,  0.41, 2,    null, null),   // 借记卡费率
      new InputLimit("", true,  17,   100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0.52, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
// T1-优惠
rateStandardMap.put("T1-yh", new RateStandard(
      new InputLimit("", true,  0.32, 2,    null, null),   // 借记卡费率
      new InputLimit("", true,  14,   100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0.43, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
// T1-减免
rateStandardMap.put("T1-jm", new RateStandard(
      new InputLimit("", true,  0,    2,    null, null),   // 借记卡费率
      new InputLimit("", true,  0,    100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0,    2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
// T1-VIP
rateStandardMap.put("T1-vip", new RateStandard(
      new InputLimit("", true,  0.41, 2,    null, null),   // 借记卡费率
      new InputLimit("", true,  17,   100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0.52, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
// T1-特殊计费类
rateStandardMap.put("T1-tsjf", new RateStandard(
      new InputLimit("", true,  0.41, 2,    null, null),   // 借记卡费率
      new InputLimit("", true,  17,   100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0.52, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
/**********D1***********/
// D1-标准
rateStandardMap.put("D1-bz", new RateStandard(
      new InputLimit("", true,  0.41, 2,    null, null),   // 借记卡费率
      new InputLimit("", true,  17,   100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0.52, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    0.1,  null)    // 增收费率
));
// D1-优惠
rateStandardMap.put("D1-yh", new RateStandard(
      new InputLimit("", true,  0.32, 2,    null, null),   // 借记卡费率
      new InputLimit("", true,  14,   100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0.43, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    0.1,  null)    // 增收费率
));
// D1-减免
rateStandardMap.put("D1-jm", new RateStandard(
      new InputLimit("", true,  0,    2,    null, null),   // 借记卡费率
      new InputLimit("", true,  0,    100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0,    2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    0.1,  null)    // 增收费率
));
// D1-VIP
rateStandardMap.put("D1-vip", new RateStandard(
      new InputLimit("", true,  0.41, 2,    null, null),   // 借记卡费率
      new InputLimit("", true,  17,   100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0.52, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    0.1,  null)    // 增收费率
));
// D1-特殊计费类
rateStandardMap.put("D1-tsjf", new RateStandard(
      new InputLimit("", true,  0.41, 2,    null, null),   // 借记卡费率
      new InputLimit("", true,  17,   100,  null, null),   // 借记卡封顶
      new InputLimit("", true,  0.52, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    0.1,  null)    // 增收费率
));
/**********TS***********/
// TS-标准
rateStandardMap.put("TS-bz", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", true,  0.55, 2,    null, null),   // 信用卡费率
      new InputLimit("", true,  0,    1,    1,    null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
// TS-优惠
rateStandardMap.put("TS-yh", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", true,  0.55, 2,    null, null),   // 信用卡费率
      new InputLimit("", true,  0,    1,    1,    null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
// TS-减免
rateStandardMap.put("TS-jm", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", true,  0.55, 2,    null, null),   // 信用卡费率
      new InputLimit("", true,  0,    1,    1,    null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
// TS-VIP
rateStandardMap.put("TS-vip", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", true,  0.6,  2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, 1,    null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));
// TS-特殊计费类
rateStandardMap.put("TS-tsjf", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", true,  0.52, 2,    null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", false, null, null, null, null)    // 增收费率
));

/**********D0***********/
// D0-标准
rateStandardMap.put("D0-bz", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", false, null, null, null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    null, null)    // 增收费率
));
// D0-优惠
rateStandardMap.put("D0-yh", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", false, null, null, null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    null, null)    // 增收费率
));
// D0-减免
rateStandardMap.put("D0-jm", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", false, null, null, null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    null, null)    // 增收费率
));
// D0-VIP
rateStandardMap.put("D0-vip", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", false, null, null, null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    null, null)    // 增收费率
));
// D0-特殊计费类
rateStandardMap.put("D0-tsjf", new RateStandard(
      new InputLimit("", false, null, null, null, null),   // 借记卡费率
      new InputLimit("", false, null, null, null, null),   // 借记卡封顶
      new InputLimit("", false, null, null, null, null),   // 信用卡费率
      new InputLimit("", false, null, null, null, null),   // 增收手续费
      new InputLimit("", true,  0.1,  1,    0.1,  null)    // 增收费率
));

/**
 * 费率标准对象
 * @param jjkfl      借记卡费率
 * @param xykfd      借记卡封顶
 * @param xykfl      信用卡费率
 * @param zssxf      增收手续费
 * @param zsfl       增收费率
 */
function RateStandard(jjkfl, xykfd, xykfl, zssxf, zsfl) {
    this.jjkfl = jjkfl;
    this.xykfd = xykfd;
    this.xykfl = xykfl;
    this.zssxf = zssxf;
    this.zsfl = zsfl;
}

/**
 * 输入框的限制条件对象
 * @param tagId             文本框ID
 * @param use               是否可用
 * @param down              下限
 * @param up                上限
 * @param defaultValue      默认值
 * @param operation         附加操作(函数)
 */
function InputLimit(tagId, use, down, up, defaultValue, operation) {
    this.tagId = tagId;
    this.use = use;
    this.down = down;
    this.up = up;
    this.defaultValue = defaultValue;
    this.operation = operation;
    // 添加下限
    this.setDown = function(_value) {
        this.down = _value;
    }
    // 添加上限
    this.setUp = function (_value) {
        this.up = _value;
    }
}

//************************************************ 页面集合 ************************************************
/**
 * js 的 Map 对象
 * @constructor 类似于 JAVA 中的 MAP 结构
 */
function Map() {
    this.elements = new Array();

    // 向MAP中增加元素（key, value)
    this.put = function(_key, _value) {
        this.elements.push( {
            key : _key,
            value : _value
        });
    }

    // 获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try{
            for(var i = 0; i < this.elements.length; i++) {
                if(this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch(e) {
            return null;
        }
    }
}

