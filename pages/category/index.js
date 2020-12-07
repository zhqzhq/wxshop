// pages/category/index.js
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    catelist:[],
    leftmenu:[],
    menucontext:[],
    selectedindex:0,
    scrolltop:0,
  },
  Cates:[],
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates=wx.getStorageSync("cates");
    if(!Cates){
      this.getcate();
    }else{
      if(Date.now()-Cates.time>10000){
        this.getcate();
      }else{
        this.Cates=Cates.data;
        let leftmenu=this.catelist.map(v=>v.cat_name);
        let menucontext=this.catelist[0].children
        this.setData({
          leftmenu,
          menucontext 
        })

      }
    }
  },
  async getcate(){
    // request({url: '/categories'}).then(
    //   result=>{
    //     this.catelist=result.data.message;
    //     wx.setStorageSync("cates", {time:Date.now(),data:this.catelist});
          
    //     let leftmenu=this.catelist.map(v=>v.cat_name);
    //     let menucontext=this.catelist[0].children
    //     this.setData({
    //       leftmenu,
    //       menucontext 
    //     })
    //   }
    // )
    const result= await request({url: '/categories'});
        this.catelist=result;
        wx.setStorageSync("cates", {time:Date.now(),data:this.catelist});
        let leftmenu=this.catelist.map(v=>v.cat_name);
        let menucontext=this.catelist[0].children
        this.setData({
          leftmenu,
          menucontext 
        })

  },
  changeindex(e){
    const {index}=e.currentTarget.dataset;
    let menucontext=this.catelist[index].children
    this.setData({
      selectedindex:index,
      menucontext,
      scrolltop:0

    })
  }

})