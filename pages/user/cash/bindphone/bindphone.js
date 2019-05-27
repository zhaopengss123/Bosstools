const Http = require('../../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCodeTime:60,
    phone: null,
    code: null
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
        // that.setData({ userInfo: app.userInfo })
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
  // 获取验证码
    getCode() {
    if (this.data.getCodeTime != 60) { return; }
    let isMobile = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (isMobile.test(this.data.phone)) {
      wx.showLoading({
        title: '正在获取验证码',
        mask: true
      });

      Http.post('/sec/sendcode', {
        paramJson : JSON.stringify({
          phoneNumber: this.data.phone,
          voucher: this.data.userInfo.voucher,
          openId: app.globalData.openid
        })
      }).then(res => {
        wx.hideLoading();
        if (res.result == 1000) {
          this.setIntervalCode();
        } else {
          wx.showToast({
            icon: "none",
            title: '获取验证码失败',
          })
        }
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请输入正确手机号',
      })
    }
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },
  submit(){
 
    let isMobile = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (isMobile.test(this.data.phone)) {

      Http.post('/sec/checkcode', {
        paramJson: JSON.stringify({
          phoneNumber: this.data.phone,
          voucher: this.data.userInfo.voucher,
          openId: app.globalData.openid,
          code: this.data.code
        })
      }).then(res => {
        wx.hideLoading();
        if (res.result == 1000) {
          wx.showToast({
            title: '绑定成功！',
          })
          setTimeout(function(){
            wx.navigateBack();
          },2000);
        } else {
          wx.showToast({
            icon: "none",
            title: '获取验证码失败',
          })
        }
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请输入正确手机号',
      })
    }
  },
  /* ---------------- 倒计时 ---------------- */
  setIntervalCode() {
    let interval = setInterval(_ => {
      let getCodeTime = this.data.getCodeTime - 1;
      this.setData({ getCodeTime });
      if (getCodeTime <= 0) { clearInterval(interval); this.setData({ getCodeTime: 60 }); }
    }, 1000)
  },
})