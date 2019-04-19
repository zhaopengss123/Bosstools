const Http = require('./../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabId:1,
    arr:[1,2,3,4,5,6,7],
    nav_index:0,
    userInfo: { voucher:'0' },
    memeberList:[],
    listHeader:'积分数量',
    timeFlag:'day'
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
      fail(res) {
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
  onShow(){
    this.setData({ tabId: 1 });
    if (this.data.userInfo.voucher!=0){
      this.getData();
    }
      
  },

  //切换tab
  navClick(e){
    let tabId = e.currentTarget.dataset.id
    this.setData({
      tabId,
      nav_index:0
    })
    this.getData();
  },
  navDetail(e){
    let id = e.currentTarget.dataset.id;
    
    let timeFlag = this.data.nav_index == 0 ? 'day' : (this.data.nav_index == 1 ? 'week' : 'month');
    console.log(timeFlag);

    
    let count = e.currentTarget.dataset.count;
    if (this.data.tabId == 2){
      wx.navigateTo({
        url: `./clueDetail/clueDetail?teacherId=${id}&timeFlag=${timeFlag }`,
      })
    } else if (this.data.tabId == 3){
      wx.navigateTo({
        url: `/pages/ask/ask?teacherId=${id}&timeFlag=${timeFlag }`,
      })
    }else if(this.data.tabId == 4){
      wx.navigateTo({
        url: `./integral/integral?teacherId=${id}&count=${count}&timeFlag=${timeFlag }`,
      })
    }
  },
  //切换月周日
  dateNavClick(e){
    let nav_index = e.currentTarget.dataset.index;
    this.setData({ nav_index });
    this.getData();
  },
  //获取数据
  getData(){
    let url="";
    let listHeader = "";
    let typeFlag = 1;
    if (this.data.tabId == 1){
      url = "/employee/integral/total";
      listHeader = "积分数量";
    } else if (this.data.tabId == 2){
      url = "/store/detailed";
      listHeader = "线索数量";
      typeFlag = 1;
    } else if (this.data.tabId == 3) {
      url = "/employee/return/visit";
      listHeader = "回访数量";
    } else if (this.data.tabId == 4) {
      url = "/employee/service/num";
      listHeader = "耗卡数量";
      typeFlag = 4;
    }
    let timeFlag = this.data.nav_index == 0 ? 'day' : (this.data.nav_index == 1? 'week' :'month');  
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      timeFlag: timeFlag,
      typeFlag
    })
    wx.showLoading({
      title: '加载中……',
    })
    Http.get(url, {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        res.data.createTime = app.transformationTime(res.data.createTime);
        this.setData({
          memeberList: res.data,
          listHeader
        })
      } else {
        wx.showModal({
          title: '系统异常',
          content: res.message,
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
  //下拉刷新
  onPullDownRefresh() {
    this.getData();
  }
})