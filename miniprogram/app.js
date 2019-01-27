
//app.js
App({
  onLaunch: function () {
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == 'none') {
          wx.showModal({
            content: '没有网络，小程序无法提供服务',
            showCalcel: false,
            confirmText: "确定",
            confirmColor: "#4a4a4a",
            cancelColor: '#9B9B9B'
          });
        }
      },
    });
    wx.onNetworkStatusChange(res => {
      if (res.networkType == 'none') {
        wx.showModal({
          title: '',
          content: '断网了，请检查网络',
          confirmText: '确定',
          confirmColor: "#4a4a4a",
          cancelColor: '#9B9B9B'
        })
      }
    });
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'car-9c91ad',
        traceUser: true,
      })
    }

    this.globalData = {
      userInfo: {}
    }
  },
  onShow() {
    const updateManager = wx.getUpdateManager();
    if (updateManager) {
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          })
        }
      })
    }

  },
  onError(msg) {
    console.error("[APP ERROR]", msg)
  }
})
