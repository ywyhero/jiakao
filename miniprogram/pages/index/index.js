const app = getApp();
Page({
  data: {
    subject: 1,
    model: 'c1',
    isShow: false
  },
  onLoad() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              console.log(app.globalData.userInfo)
              this.setData({
                isShow: false
              })
            }
          })
        } else {
          this.setData({
            isShow: true
          })
        }
      }
    })
  },
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;
      wx.cloud.callFunction({
          name: 'login',
          data: userInfo
        })
        .then(res => {
            console.log(res)
          this.setData({
            isShow: false
          })
          app.globalData.userInfo = e.detail.userInfo;
        })

    }
  },
  subjectClick(e) {
    const subject = Number(e.currentTarget.dataset.subject);
    this.setData({
      subject
    })
  },
  modelClick(e) {
    const model = e.currentTarget.dataset.model;
    console.log(model)
    this.setData({
      model
    })
  },
  typeClick(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'order') {
      wx.navigateTo({
        url: `/pages/detail/index?model=${this.data.model}&subject=${this.data.subject}&type=${type}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/randDetail/index?model=${this.data.model}&subject=${this.data.subject}&type=${type}`,
      })
    }

  }
})