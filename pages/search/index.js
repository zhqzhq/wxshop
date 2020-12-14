// pages/search/index.js
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goods:[],
    isshow:false,
    isinput:""
  },
  Timeid:-1,
  handlesearch(e){
    const {value}=e.detail;
    if(!value.trim()){
      this.setData({
        isshow:false,
        goods:[]
      })
      return
    }
    this.setData({
      isshow:true
    })
    clearTimeout(this.Timeid);
    this.Timeid=setTimeout(() => {
      this.getsearch(value);
    }, 1000);
    

  },
  async getsearch(query){
    const res= await request({url:"/goods/search",data:{query}});
    const {goods}=res;
    this.setData({
      goods
    }) 
  },
  handlecanel(){
    this.setData({
      isinput:"",
      isshow:false,
      goods:[]
    })

  }

})