const Http = require('../../../utils/request.js');
const app = getApp();
// let ctx1 = wx.createCanvasContext('canvasCircle1');
// let ctx2 = wx.createCanvasContext('canvasCircle2');
// let WXwidth = wx.getSystemInfoSync().windowWidth;
// let cxtWidth = 240 / 750 * WXwidth;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList:[],
    amount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // ctx1.setLineWidth(6);
    // ctx1.setStrokeStyle('#eee');
    // ctx1.setLineCap('round');
    // ctx1.beginPath();
    // ctx1.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 4, 0, 2 * Math.PI, false);
    // ctx1.stroke();
    // ctx1.draw();
    // this.drawCircle('50', ctx2, '#ACB2FF');
          wx.getStorage({
        key: 'userInfo',
        success(res) {
          that.setData({ userInfo: res.data })
          that.getData();
        },
        fail(){
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

  //canvas

  // drawCircle: function (data, ctx, colors) {
  //   function drawArc(s, e) {
  //     ctx.setFillStyle('white');
  //     ctx.clearRect(0, 0, cxtWidth, cxtWidth);
  //     ctx.draw();
  //     var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2 - 4;
  //     ctx.setLineWidth(6);
  //     ctx.setStrokeStyle(colors);
  //     ctx.setLineCap('round');
  //     ctx.beginPath();
  //     ctx.arc(x, y, radius, s, e, false);
  //     ctx.stroke()
  //     ctx.draw()
  //   }
  //   let step = data, startAngle = 1.5 * Math.PI, endAngle = 0;
  //   let n = 100;
  //   endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
  //   drawArc(startAngle, endAngle);
  // },
  getData(){
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
     
    })
    Http.get('/store/income/detailed', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        let amount = 0;
        res.data.map(item=>{
          amount += item.total;
        })
        this.setData({
          cardList: res.data,
          amount
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