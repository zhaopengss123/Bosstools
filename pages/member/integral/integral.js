const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memeberList:[],
    teacherId:'',
    count:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ teacherId: Number(options.teacherId), count: options.count, timeFlag: options.timeFlag})
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({ userInfo: res.data });
        that.getData();
      },
      fail(res) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    }); 
  },
  getData(){
    // let date = new Date();
    // let y = date.getFullYear();
    // let m = date.getMonth() + 1;
    // let d = date.getDate();
    // m = m > 9 ? m : '0' + m;
    // d = d > 9 ? d : '0' + d;
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      timeFlag: this.data.timeFlag,
      teacherId: this.data.teacherId
    })
    wx.showLoading({
      title: '加载中……',
    })
    Http.get('/employee/detatiled/service', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        res.data.createTime = app.transformationTime(res.data.createTime);
        this.setData({
          memeberList: res.data,

        })
      } else {
        wx.showModal({
          title: '系统异常',
          content: res.message,
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
  }

})