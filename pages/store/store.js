const Http = require('./../../utils/request.js');
const app = getApp();
let WXwidth = wx.getSystemInfoSync().windowWidth;
let ctx1 = wx.createCanvasContext('canvasResults1');
let ctx2 = wx.createCanvasContext('canvasResults2');
let ctx3 = wx.createCanvasContext('canvasResults3');
let ctx4 = wx.createCanvasContext('canvasResults4');
let praiseCircle1 = wx.createCanvasContext('praiseCircle1');
let praiseCircle2 = wx.createCanvasContext('praiseCircle2');
let praiseCircle3 = wx.createCanvasContext('praiseCircle3');
let praiseCircle4 = wx.createCanvasContext('praiseCircle4');
let praiseWidth = 288 / 750 * WXwidth;
let cxtWidth = 122 / 750 * WXwidth;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeDetail:{},
    userInfo: { voucher: '0' },
    timeFlag: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cxt_arc1 = wx.createCanvasContext('canvasCircle1');
    let cxt_arc2 = wx.createCanvasContext('canvasCircle2');
    let cxt_arc3 = wx.createCanvasContext('canvasCircle3');
    let cxt_arc4 = wx.createCanvasContext('canvasCircle4');
    cxt_arc1.setLineWidth(4);
    cxt_arc1.setStrokeStyle('#eee');
    cxt_arc1.setLineCap('round');
    cxt_arc1.beginPath();
    cxt_arc1.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 3, 0, 2 * Math.PI, false);
    cxt_arc1.stroke();
    cxt_arc1.draw();

    cxt_arc2.setLineWidth(4);
    cxt_arc2.setStrokeStyle('#eee');
    cxt_arc2.setLineCap('round');
    cxt_arc2.beginPath();
    cxt_arc2.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 3, 0, 2 * Math.PI, false);
    cxt_arc2.stroke();
    cxt_arc2.draw();

    cxt_arc3.setLineWidth(4);
    cxt_arc3.setStrokeStyle('#eee');
    cxt_arc3.setLineCap('round');
    cxt_arc3.beginPath();
    cxt_arc3.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 3, 0, 2 * Math.PI, false);
    cxt_arc3.stroke();
    cxt_arc3.draw();

    cxt_arc4.setLineWidth(4);
    cxt_arc4.setStrokeStyle('#eee');
    cxt_arc4.setLineCap('round');
    cxt_arc4.beginPath();
    cxt_arc4.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 3, 0, 2 * Math.PI, false);
    cxt_arc4.stroke();
    cxt_arc4.draw();    
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({ userInfo: res.data })
        that.getData();
        that.evaluation();
      },
      fail() {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });

  },
  onShow(){
    if (this.data.userInfo.voucher != 0) {
      this.getData();
    }
  },
  setCanvas(x1, x2, x3, x4, evaluationTotal){
    function drawArc(s, e , c , ctx) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, praiseWidth, praiseWidth);
      ctx.draw();
      var x = praiseWidth / 2, y = praiseWidth / 2, radius = praiseWidth / 2 - 10;
      ctx.setLineWidth(12);
      ctx.setStrokeStyle(c);
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    let step = x1, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
    if (evaluationTotal != 0){
      endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
      drawArc(startAngle, endAngle, '#FF5E86', praiseCircle1);
    }else{
      step = 100, startAngle = 1.5  * Math.PI, endAngle = 0;
      endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
      drawArc(startAngle, endAngle, '#eee', praiseCircle1);
    }

    
    step = x2 + x1, startAngle = (1.5 + x1 / 50) * Math.PI, endAngle = 0;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle, '#ABACFF', praiseCircle2);
    
    step = x1+x2+x3, startAngle = (1.5+ x1/50 + x2/50)  * Math.PI, endAngle = 0;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle, '#FFCB39', praiseCircle3);

    step = x1 + x2 + x3+x4, startAngle = (1.5 + x1 / 50 + x2 / 50 + x3/50 ) * Math.PI, endAngle = 0;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle, '#6988FF', praiseCircle4);
  },
  //canvas
 
  drawCircle: function (data,ctx,colors) {
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, cxtWidth, cxtWidth);
      ctx.draw();
      var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2 - 3;
      ctx.setLineWidth(4);
      ctx.setStrokeStyle(colors);
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    let step = data, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle);
  },
  more(){
    let storeDetail = JSON.stringify(this.data.storeDetail );
    wx.navigateTo({
      url: `detail/detail?storeDetail=${storeDetail}`,
    })
  },
  getData(){
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      timeFlag:'month'
    })
    Http.get('/store/data', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        res.data.proportion1 = parseInt((res.data.clueCounts / res.data.expectClueNum)*100);
        res.data.proportion1 = res.data.proportion1 ? res.data.proportion1: 0;
        this.drawCircle(res.data.proportion1, ctx1, '#6C79FB');
        res.data.proportion2 = parseInt((res.data.pravticeCounts / res.data.expectExperienceNum)* 100);
        res.data.proportion2 = res.data.proportion2 ? res.data.proportion2 : 0;
        this.drawCircle(res.data.proportion2, ctx2, '#FF5E86');  
        res.data.proportion3 = parseInt((res.data.applyCardCount / res.data.expectCardNum) * 100);
        res.data.proportion3 = res.data.proportion3 ? res.data.proportion3 : 0;
        this.drawCircle(res.data.proportion3, ctx3, '#ACB2FF');
        res.data.proportion4 = parseInt((res.data.removeCount / res.data.expectConsumecardNum) * 100);
        res.data.proportion4 = res.data.proportion4 ? res.data.proportion4 : 0;
        this.drawCircle(res.data.proportion4, ctx4, '#FFD74B');   
        this.setData({
          storeDetail: res.data
        })
        
      } else {
        wx.showModal({
          title: '系统异常',
          content: res.message,
        })
      }
      wx.stopPullDownRefresh();
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
  /*--------好评率---------*/
  evaluation(){
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      monthFlag: this.data.timeFlag
    })
    wx.showLoading({
      title: '加载中……',
    })
    Http.get('/store/evaluate', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        let evaluationTotal = res.data.totalGoodCount + res.data.totalPraiseCount + res.data.totalCommonlyCount + res.data.totalNotGoodCount;
        let proportion1 = evaluationTotal != 0 ? Math.ceil((res.data.totalGoodCount / evaluationTotal) * 100) : 0;
        let proportion2 = evaluationTotal != 0 ? Math.ceil((res.data.totalPraiseCount / evaluationTotal) * 100) : 0;
        let proportion3 = evaluationTotal != 0 ? Math.ceil((res.data.totalCommonlyCount / evaluationTotal) * 100) : 0;
        let proportion4 = evaluationTotal != 0 ? Math.ceil((res.data.totalNotGoodCount / evaluationTotal) * 100) : 0;
        res.data.proportion1 = proportion1;
        this.setData({
          evaluationDetail: res.data
        })
        this.setCanvas(proportion1, proportion2, proportion3, proportion4, evaluationTotal);
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
  /*-------选择月份---------*/
  monthSelect(e){
    let timeFlag = Number(e.currentTarget.dataset.id);
    this.setData({ timeFlag }) ;
    this.evaluation();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getData();
  }


    
})