const Http = require('../../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    cashAmount:0,
    ids:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getData(){
    wx.showLoading({
      title: '加载中……',
    })
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher
    })
    Http.get('/cash/cashamount', {
      paramJson
    }).then(res => {
      if (res.result == 1000 && res.data) {
          this.setData({
            cashAmount: res.data.cashAmount,
            ids: res.data.ids
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
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  cashsub(){
    wx.showLoading({
      title: '加载中……',
    })
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      openId: app.globalData.openid,
      cashAmount: this.data.cashAmount,
      ids: this.data.ids
    })
    Http.post('/sec/checkoid', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
          wx.showToast({
            title: '操作成功！',
          })
        this.getData();  
      }else if(res.result == 1003){
        wx.showToast({
          title: '请绑定手机后再进行提现',
          icon:'none'
        })
        setTimeout(item=>{
          wx.navigateTo({
            url: '../bindphone/bindphone',
          })
        },1500)

      }else{
        wx.showModal({
          title: '提示',
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
  },
  lookDetail(){
    wx.navigateTo({
      url: '../lookDetail/lookDetail',
    })
  }

})