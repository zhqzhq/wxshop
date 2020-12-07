//Page Object
import {request} from "../../request/index.js"
Page({
  data: {
    swiperlist:[],
    cateslist:[],
    floorlist:[],
    
  },
  onLoad:function(options){
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperlist:result.data.message
    //     })
        
    //   },
    // });  
    this.getswiperlist();
    this.getcateslist();
    this.getfloorlist();
  },
  getswiperlist(){
    request({url: '/home/swiperdata'}).then(
      result=>{
        this.setData({
          swiperlist:result
        })
      }
    )
  },
  getcateslist(){
    request({url: '/home/catitems'}).then(
      result=>{
        this.setData({
          cateslist:result
        })
      }
    )

  },
  getfloorlist(){
    request({url: '/home/floordata'}).then(
      result=>{
        this.setData({
          floorlist:result
        })
      }
    )
  },
  
});
  