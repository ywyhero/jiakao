// pages/result/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    scoreVal: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lists = wx.getStorageSync('answeredLists')
    let score = options.score;
    let scoreVal = score >= 90 ? `恭喜您，您的得分是${score}分，通过了本次考试。` :  `很遗憾，您的得分是${score}分，未通过考核，再接再励吧。`
    console.log(app.globalData.userInfo)
    this.setData({
      lists,
      scoreVal,
      userInfo: app.globalData.userInfo
    })
  }
  
})