// pages/goods_list/index.js
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
  ],
  goodsList:[],
  },

  queryinfo:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10,
  },

  totalpage:1,

  handletabsitemchange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>{i===index?v.isActive=true:v.isActive=false});
    this.setData({
      tabs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {cid}=options
    this.queryinfo.cid=cid
    this.getgoodslist();

  },
 async getgoodslist(){
   const result=await request({url:"/goods/search",data:this.queryinfo});
   this.totalpage=Math.ceil(result.total/this.queryinfo.pagesize);
   this.setData({
     goodsList:[...this.data.goodsList,...result.goods]
   });
   wx.stopPullDownRefresh();
  },
    // 页面上滑 滚动条触底事件
    onReachBottom(){
      if(this.queryinfo.pagenum>=this.totalpage){
        wx.showToast({ title: '人家也是有底线的！',icon: 'none'});
      }else{
        this.queryinfo.pagenum++;
        this.getgoodslist();
      }
    },
     // 下拉刷新事件 
  onPullDownRefresh(){
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    // 2 重置页码
    this.queryinfo.pagenum=1;
    // 3 发送请求
    this.getgoodslist();
  }

})