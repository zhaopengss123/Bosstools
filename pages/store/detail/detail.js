const Http = require('../../../utils/request.js');
const app = getApp();
let ctx1 =  wx.createCanvasContext('canvasCircle1');
let ctx2 = wx.createCanvasContext('canvasCircle2');
let WXwidth = wx.getSystemInfoSync().windowWidth;
let cxtWidth = 240 / 750 * WXwidth;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabId:1,
    typeFlag: 1,
    storeDetail:{},
    dataList:[],
    stores:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      stores: JSON.parse(options.storeDetail)
    })
    ctx1.setLineWidth(6);
    ctx1.setStrokeStyle('#eee');
    ctx1.setLineCap('round');
    ctx1.beginPath();
    ctx1.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 4, 0, 2 * Math.PI, false);
    ctx1.stroke();
    ctx1.draw();
    this.drawCircle(this.data.stores.proportion1, ctx2, '#6C79FB');

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


  //canvas

  drawCircle: function (data, ctx, colors) {
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, cxtWidth, cxtWidth);
      ctx.draw();
      var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2 - 4;
      ctx.setLineWidth(6);
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
  getData(){
      let paramJson = JSON.stringify({
        voucher: this.data.userInfo.voucher,
        typeFlag: Number(this.data.typeFlag)
      })
    Http.get('/store/detailed', {
        paramJson
      }).then(res => {
        if (res.result == 1000) {
          this.setData({
            dataList: res.data
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
  navClick(e){
    let typeFlag = e.currentTarget.dataset.id;
    this.setData({ typeFlag });
    this.getData();
    if (this.data.typeFlag == 1 ){
      this.drawCircle(this.data.stores.proportion1, ctx2, '#6C79FB');
    } else if (this.data.typeFlag == 2){
      this.drawCircle(this.data.stores.proportion2, ctx2, '#FF5E86');
    } else if (this.data.typeFlag == 3) {
      this.drawCircle(this.data.stores.proportion3, ctx2, '#ACB2FF');
    } else if (this.data.typeFlag == 4) {
      this.drawCircle(this.data.stores.proportion4, ctx2, '#FFD74B');
    }
    
  },
  isblone(e){
    let that = this;
    let indexs = e.currentTarget.dataset.index;
    let teacherId = e.currentTarget.dataset.id;
    let arr = this.data.dataList;
    if (teacherId && this.data.typeFlag != 4){
    arr.map((item,index)=>{
        if(index == indexs){
            if(item.blone){
              arr[index].blone = false;
            } else if (item.teacherId){
              arr[index].blone = true;
          
                that.getListDetaile(indexs, teacherId);
                
          
              
            }
        }
    });
    this.setData({ dataList:arr  });
    }
  },
  getListDetaile(indexs, teacherId){
      let paramJson = JSON.stringify({
        voucher: this.data.userInfo.voucher,
        type: Number(this.data.typeFlag),
        teacherId: Number(teacherId)
      })
    wx.showLoading({
      title: '加载中……',
    })
    Http.get('/employee/list/details/message', {
        paramJson
      }).then(res => {
        if (res.result == 1000) {
          let arr = this.data.dataList;
          arr[indexs].arr = res.data;
          arr[indexs].blone = true;
          this.setData({ dataList: arr });
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
  
})