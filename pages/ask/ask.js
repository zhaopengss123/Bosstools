const Http = require('./../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabId:1,
    teacherId:'',
    dataFlag: 3,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ teacherId: Number(options.teacherId), timeFlag: options.timeFlag})
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({ userInfo: res.data });
        if (that.data.teacherId ){
          that.getTeacherData();
        }
        
      },
      fail(res) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    }); 
  },
  getTeacherData(){
    // let date = new Date();
    // let y = date.getFullYear();
    // let m = date.getMonth() + 1;
    // let d = date.getDate();
    // m = m > 9 ? m : '0' + m;
    // d = d > 9 ? d : '0' + d;
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      timeFlag: this.data.timeFlag,
      teacherId: this.data.teacherId,
      dataFlag: Number(this.data.dataFlag)
    })
    Http.get('/employee/return/visit/detatiled', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        this.setData({
          dataList: res.data
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
  },
  navClick(e){
    let dataFlag = e.currentTarget.dataset.id ;
    this.setData({  dataFlag  });
    if( this.data.teacherId ){
      this.getTeacherData();
    }
  },

})