// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    const address=wx.getStorageSync("address");
    const cart=wx.getStorageSync("cart")||[];
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({address});
    this.setCate(cart);
      
  },

/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

  2 获取 用户 对小程序 所授予 获取地址的  权限 状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
      scope 值 true 直接调用 获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api 
      scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消   
      scope 值 false 
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中 
 */
async handleChooseAddress() {
  try {
    // 1 获取 权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 2 判断 权限状态
    if (scopeAddress === false) {
      await openSetting();
    }
    // 4 调用获取收货地址的 api
    let address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    // 5 存入到缓存中
    wx.setStorageSync("address", address);
  } catch (error) {
    console.log(error);
  }
},
// 商品的选中
//   1 绑定change事件
//   2 获取到被修改的商品对象
//   3 商品对象的选中状态 取反
//   4 重新填充回data中和缓存中
//   5 重新计算全选。总价格 总数量。
handeItemChange(e){
  const goods_id=e.currentTarget.dataset.id;
  const {cart}=this.data;
  let index=cart.findIndex(v=>v.goods_id===goods_id);
  cart[index].checked=!cart[index].checked;
  this.setCate(cart)
 
},
//计算全选，总价格，总数量方法封装
setCate(cart){
  let allChecked=true;
  let totalPrice=0;
  let totalNum=0;
  cart.forEach(v=>{
    if(v.checked){
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    }else{
      allChecked=false
    }
  })
  allChecked=cart.length!=0?allChecked:false;
    
  this.setData({
    cart,
    allChecked,
    totalPrice,
    totalNum,
  })
  wx.setStorageSync("cart",cart);
},
// 全选和反选
//   1 全选复选框绑定事件 change
//   2 获取 data中的全选变量 allChecked
//   3 直接取反 allChecked=!allChecked
//   4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
//   5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
handleItemAllCheck(){
  let {cart,allChecked}=this.data;
  allChecked=!allChecked;
  cart.forEach(v=>v.checked=allChecked);
  setCate(cart);
},
//商品数量编辑
async handleItemNumEdit(e){
  const {operation,id}=e.currentTarget.dataset;
  const {cart}=this.data;
  const index=cart.findIndex(v=>v.goods_id===id);
  if(cart[index].num===1&&operation===-1){
    const result= await showModal({content:"您要将该商品从购物车删除吗?"});
    if(result.confirm){
      cart.splice(index,1);
      this.setCate(cart);
    }
  }else{
    cart[index].num+=operation;
    this.setCate(cart);
  }
},
//结算按钮事件
async handlePay(){
  const {address,totalNum}=this.data;
  if(!address.userName){
    await showToast({title:"您还没有填写地址"});
    return;
  }
  if(totalNum===0){
    await showToast({title:"您还未选购商品"});
    return;
  }
  wx.navigateTo({
    url: '/pages/pay/index',
  });
    

}
})
