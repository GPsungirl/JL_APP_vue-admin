/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 正整数校验
export function PositiveInt(str){
  const reg = /(^[1-9]\d*$)/
  return reg.test(str)
}
/**
 * 手机号 验证
 */
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
/**
 * 贝壳收入 验证1-100
 */
export function validNum100(val){
  const reg = /^((?!0)\d{1,2}|100)$/;
  return reg.test(Number(val))

}
/**
 * 分润比例<2% 且最多保留一位小数
 */
export function validNum2(val) {
  let len = 0;
  if(val.toString().indexOf('.')>0){
    if(val.toString().split(".")){
      len = val.toString().split(".")[1].length;
    }
  }

  return (val > 0 && val <= 2 &&  len<=1)

}
/**
 * 比例 >1% 且<=4% 且最多保留一位小数
 */
export function validNum4(val) {
  let len = 0;
  if(val.toString().indexOf('.')>0){
    if(val.toString().split(".")){
      len = val.toString().split(".")[1].length;
    }
  }

  return (val >= 1 && val <= 4 &&  len<=1)

}
// 数字上限<=20
export function validNum20(val) {
  return (val > 0 && val <= 20)

}
// 数字上限<=40
export function validNum40(val) {
  return (val > 0 && val <= 40)

}
// 数字上限<=80
export function validNum80(val) {
  return (val > 0 && val <= 80)

}
// 数字上限<=120
export function validNum120(val) {
  return (val > 0 && val <= 120)

}
/**
 * 工作分成 动态调整上限值
 */
export function validDyNum(val,dyVal){
  // if(val >= 0 && val <= dyVal){
  //   return
  // }
  // const reg =  new RegExp("^((?!0)\\d{1,2}|"+dyVal+")$")
  // // const reg = eval("\/^((?!0)\\d{1,2}|"+dyVal+")$\/");
  // return reg.test(Number(val))
  return (val >= 0 && val <= dyVal)
}
/**
 * 提成分成 <15
 */
export function validNum15(val){
  return (val >= 0 && val <= 15)

}
/**
 * 过滤银行卡号中间的空格
 */
export function filterSpace(val){
  let sstr = val.replace(/\s*/g, '')
  return sstr;
}
