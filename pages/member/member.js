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
    timeFlag:'day',
    tabNav:0,
    list: [],
    userInfo: {},
    toggle: false,
    storeDetail: {},
  
    
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
         that.getIndexData();
      },
      fail(res) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });   
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    m = m > 9 ? m : '0' + m;
    d = d > 9 ? d : '0' + d;
    this.setData({ times: y + '-' + m + '-' + d });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow(){
    if (this.data.userInfo.voucher != 0 && this.data.userInfo.voucher){
      this.getData();
      this.getIndexData();
    }
      
  },

  //切换tab
  navClick(e){
    let tabId = e.currentTarget.dataset.id
    this.setData({
      tabId
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
        url: `/pages/index/clueDetail/clueDetail?teacherId=${id}&timeFlag=${timeFlag }`,
      })
    } else if (this.data.tabId == 3){
      wx.navigateTo({
        url: `/pages/ask/ask?teacherId=${id}&timeFlag=${timeFlag }`,
      })
    }else if(this.data.tabId == 4){
      console.log(111111111);
      wx.navigateTo({
        url: `/pages/index/integral/integral?teacherId=${id}&count=${count}&timeFlag=${timeFlag }`,
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
      listHeader = "回访数量"
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
  /*------------首页介绍开关----------------*/
  toggleFun() {
    if (this.data.toggle) {
      this.setData({ toggle: false })
    } else {
      this.setData({ toggle: true })
    }
  },
  /*------------首页介绍----------------*/
  getIndexData() {
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
          storeDetail: res.data
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
  toIncome() {
    wx.navigateTo({
      url: '/pages/index/income/income',
    })
  },
  toIntegral() {
    wx.navigateTo({
      url: '/pages/index/integral/integral',
    })
  },
  toClue() {
    wx.navigateTo({
      url: '/pages/index/clueDetail/clueDetail',
    })
  },
  toAsk() {
    wx.navigateTo({
      url: '/pages/ask/ask?timeFlag=' + this.data.times,
    })
  },
  toExperience() {
    wx.navigateTo({
      url: '/pages/index/experience/experience',
    })
  },
  toggleClick(e){
    let index = e.currentTarget.dataset.id;
    this.setData({
      tabNav: index
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getData();
    this.getIndexData();

  }


})