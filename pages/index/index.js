const Http = require('./../../utils/request.js');
const app = getApp();

Page({
  data: {
    list:[],
    userInfo:{},
    toggle:false,
    storeDetail:{},
    tabNav:0,
    nav_index:0,
    startDate:null,
    endDate:null,
    store_index:1,
    pageStart:0,
    memberlist:[],
    reserveId:null
  },

  onLoad: function () {
      let that = this;
      this.setData({ 
        startDate: this.fun_date(-1),
        endDate: this.fun_date(-1),     
         });
      if (!app.globalData.openid){
          wx.login({
            success(res){
              that.getOpenid(res.code);
            } 
          })
      };  
  },
  onShow(){
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({ userInfo: res.data })
        that.getData();
        that.getStoreData();
      },
      fail() {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });
  }, 
  /*******  计算日期  ************/
  fun_date(aa) {
    var date1 = new Date(),
    time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + aa);
    var time2 = date2.getFullYear() + "-" + ((date2.getMonth() + 1) > 9 ? (date2.getMonth() + 1) : '0' + (date2.getMonth() + 1)) + "-" + (date2.getDate() > 9 ? date2.getDate() : '0' + date2.getDate());
    return time2;
  },
  /*------------获取openid----------------*/
  getOpenid(wxCode){
    Http.get('/auth/getWeChatMessage', {
      wxCode
    }).then(res => {
      if (res.result == 1000) {
        app.globalData.openid = res.data.openid;
      }
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
  toggleFun(){
    if (this.data.toggle ){
      this.setData({ toggle: false })
    }else{
      this.setData({ toggle: true })
    }
  },
   /*------------首页介绍----------------*/
  getData(){
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      startDate: this.data.startDate,
      endDate: this.data.endDate
    })
    wx.showLoading({
      title: '加载中',
    })
    Http.get('/achievement/listManagerStore', {
      paramJson
    }).then(res => {
      wx.hideLoading();
      if (res.result == 1000) {
        this.setData({
          list: res.data
        })
        
      }
    }, err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });

  },

  /**********预约记录*************/
  getStoreData(){
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      dateType:this.data.store_index + '',
      pageStart: this.data.pageStart
    })
    wx.showLoading({
      title: '加载中',
    })
    Http.get('/reserve/reservelist', {
      paramJson
    }).then(res => {
      wx.hideLoading();
      if (res.result == 1000) {

        let arr = [];
        arr = this.data.memberlist.concat(res.data.memberReserveList);
        this.setData({
          memberlist: arr,
          pageStart: res.data.pageEnd
        })
      }
    }, err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });
  },
  /*******选择日期******** */
  dateNavClick(e){
    let index = e.currentTarget.dataset.index;
    let indexDate,endDates;
    if(index == 0){
      indexDate = this.fun_date(-1);
      endDates = this.fun_date(-1);
    }else if(index == 1){
      indexDate = this.fun_date(0);
      endDates = this.fun_date(0);
    }else{
      indexDate = this.fun_date(-7);
      endDates = this.fun_date(0);
    }
    this.setData({
      startDate: indexDate,
      nav_index: index,
      endDate: endDates
    })
    this.getData();
  },
  storeDateNavClick(e){
    let index = e.currentTarget.dataset.index;

    this.setData({
      store_index: index,
      memberlist: [],
      pageStart: 0
    })
    this.getStoreData();      
  },

  //下拉刷新
  onPullDownRefresh() {
    this.getData();
  },
  toggleClick(e) {
    let index = e.currentTarget.dataset.id;
    this.setData({
      tabNav: index
    })
    if(index == 0){
        this.getData();
    }else{
        this.getStoreData();
    }
  },
  startDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
    this.getData();
  },  
  endDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
    this.getData();
  },
  onReachBottom() {
    if(this.data.tabNav == 1){
      this.getStoreData();
    }
    
  },
  //去添加预约
  addOrder(){
    wx.navigateTo({
      url: './add-order/add-order',
    })
  },

  totell(e){
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone 
    })
  },
  qxbtn(e){
    let reserveId = e.currentTarget.dataset.reserveid;    
    this.setData({
      reserveId
    })
    wx.showModal({
      title: '提示',
      content: '确认撤销预约吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask:true
          })
          Http.get('/reserve/cancleReserve', {
            reserveId
          }).then(res => {
            wx.hideLoading();
            if (res.result == 1000) {
                wx.showToast({
                  title: '操作成功',
                  icon: 'none'
                })
              this.getStoreData();
            }else{
              wx.showToast({
                title: res.message,
                icon:'none'
              })
            }
          }, err => {
            wx.showModal({
              title: '网络错误',
              content: '请检查网络',
              showCancel: false
            })
            wx.hideLoading();
          });
        } else if (res.cancel) {
         
        }
      }
    })
  }
})
