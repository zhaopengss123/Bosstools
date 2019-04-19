const Http = require('./../../utils/request.js');
const app = getApp();

Page({
  data: {
    list:[],
    userInfo:{},
    toggle:false,
    storeDetail:{}
  },

  onLoad: function () {
      let that = this;
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1; 
      let d = date.getDate();
      m = m > 9 ? m : '0'+ m;
      d = d > 9 ? d : '0' + d;     
      this.setData({ times : y+'-'+m+'-'+d });

  },
  onShow(){
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({ userInfo: res.data })
        that.getData();
      },
      fail() {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });
  },
  /*------------首页介绍开关----------------*/
  toggleFun(){
    if (this.data.toggle ){
      this.setData({ toggle: false })
    }else{
      this.setData({ toggle: true })
    }
  },
   /*------------首页介绍----------------*/
  getData(){
   /*---------获取门店数据--------------*/ 
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      timeFlag: 'day'
    })
    Http.get('/achievement/list/achievement/data', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        this.setData({
          storeDetail:res.data
        })
      } 
      wx.hideLoading();
    }, err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });
  /*---------获取老师列表--------------*/
    paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      timeFlag: this.data.times
    })
    Http.get('/achievement/list/employee/achievement/data', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        this.setData({
          list: res.data
        })
      } 
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }, err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });
   
  },
  toIncome(){
    wx.navigateTo({
      url: './income/income',
    })
  },
  toIntegral(){
    wx.navigateTo({
      url: './integral/integral',
    })
  },
  toClue(){
    wx.navigateTo({
      url: './clueDetail/clueDetail',
    })   
  },
  toAsk(){
    wx.navigateTo({
      url: './ask/ask?teacherId=&timeFlag=' + this.data.times ,
    })
  },
  toExperience(){
    wx.navigateTo({
      url: './experience/experience',
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getData();
  }
})
