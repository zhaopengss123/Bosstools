const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: [],
    dateIndex:0,
    year: '2019',
    month:'一月',
    dateArr:[],
    selectIndex:100,
    selectedDate:'',
    memberDetail:{},
    current:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    m = m > 9 ? m : '0' + m;
    d = d > 9 ? d : '0' + d;
    this.setData({ selectedDate: y + '-' + m + '-' + d });
    this.datefun(0);
    console.log(this.data.selectIndex);
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({ userInfo: res.data, teacherId: options.teacherId });
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
  datefun(index) {
    let now = new Date();
    let nowDayOfWeek = now.getDay();
    let startDate = this.showWeekFirstDay(1 - nowDayOfWeek + index);
    let tuesday = this.showWeekFirstDay(2 - nowDayOfWeek + index);;
    let tednesday = this.showWeekFirstDay(3 - nowDayOfWeek + index);;
    let thursday = this.showWeekFirstDay(4 - nowDayOfWeek + index);;
    let triday = this.showWeekFirstDay(5 - nowDayOfWeek + index);;
    let taturday = this.showWeekFirstDay(6 - nowDayOfWeek + index);;
    let endDate = this.showWeekFirstDay(7 - nowDayOfWeek + index);
    let arr = [];
    let monthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    arr.push(startDate.substring(8,10));
    arr.push(tuesday.substring(8, 10));
    arr.push(tednesday.substring(8, 10));
    arr.push(thursday.substring(8, 10));
    arr.push(triday.substring(8, 10));
    arr.push(taturday.substring(8, 10));
    arr.push(endDate.substring(8, 10));  
    let dateArr = [];
    dateArr.push(startDate);
    dateArr.push(tuesday);
    dateArr.push(tednesday);
    dateArr.push(thursday);
    dateArr.push(triday);
    dateArr.push(taturday);
    dateArr.push(endDate);      
    this.setData({ 
      dateList: arr,
      year: startDate.substring(0, 4),
      month: monthArr[ Number(startDate.substring(5,7))-1],
      dateArr,
       });
  },
  showWeekFirstDay(i) {
    let that = this;
    var day3 = new Date();
    day3.setTime(day3.getTime() + i * 24 * 60 * 60 * 1000);
    let Month = (day3.getMonth() + 1) < 10 ? '0' + (day3.getMonth() + 1) : (day3.getMonth() + 1);
    let dayDate = (day3.getDate()) < 10 ? '0' + (day3.getDate()) : (day3.getDate());
    var s3 = day3.getFullYear() + "-" + Month + "-" + dayDate;
    return s3;
  },
  prveDate(){
    // let index = this.data.dateIndex -1;
    // this.setData({ dateIndex: index })
    // this.datefun(index * 7);
  },
  nextDate(){
    // let index = this.data.dateIndex + 1;
    // this.setData({ dateIndex: index })
    // this.datefun(index * 7);
  },
  selectDate(e){
    let index = e.currentTarget.dataset.index;

    this.setData({ 
      selectIndex: index,
      selectedDate: this.data.dateArr[index],
     });
    this.getData();
    
  },
  getData(){
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      timeFlag: this.data.selectedDate,
      teacherId: Number(this.data.teacherId)
    })
    wx.showLoading({
      title: '加载中……',
    })
    Http.get('/achievement/list/employee/achievement/details', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
        let date =  new Date(res.data.joinDate);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        m = m > 9 ? m : '0' + m;
        d = d > 9 ? d : '0' + d;
        res.data.joinDate = y+'-'+m+'-'+d;
        res.data.workRecord.map( (item,index) =>{
          res.data.workRecord[index].content = JSON.parse(res.data.workRecord[index].content);
        })
        this.setData({
          memberDetail: res.data
        })

      } else {
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
  navToService(e){
    let id  = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: `./service/service?id=${ id }`,
    })
  },
  selectIndex(e){
    let index = e.detail.current;
    let indexs = index - 1;
    this.setData({ dateIndex: indexs })
    this.datefun(indexs * 7);
    this.setData({
      selectedDate: this.data.dateArr[this.data.selectIndex],
    });
    this.getData();
  }
})