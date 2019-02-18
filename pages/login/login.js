const Http = require('./../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:'',
    userName:'',
    isPrompt:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setpassword(e){
    let password = e.detail.value;
    this.setData({ password })
  },
  setusername(e){
    let userName = e.detail.value;
    this.setData({ userName });
  },
  submit(){
    if (!this.data.userName){
      this.setData({ 
        isPrompt: true,
        prompts:'用户名不能为空'
      })
      return false;
    }
    if (!this.data.password) {
      this.setData({
        isPrompt: true,
        prompts: '密码不能为空'
      })
      return false;
    }    
    let paramJson = JSON.stringify({
      userName:this.data.userName,
      password: this.data.password
    })
    wx.showLoading({
      title: '加载中……',
    })
    Http.post('/auth/login', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
          wx.setStorage({
            key: 'userInfo',
            data: res.data
          })
        wx.switchTab({
          url: '../index/index',
        })
      }else{
        this.setData({
          isPrompt: true,
          prompts:res.message
        })
      }
      wx.hideLoading();
    }, err=> {
      console.log(err);
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });
  }

})