// index.js
Page({
  data: {
      // 可以在这里定义页面的数据
  },
  startGame: function() {
      // 开始游戏逻辑
      wx.showToast({
          title: '开始游戏',
          icon: 'success'
      });
      wx.navigateTo({
        url: '/pages/game/game',
      })
  },
  openSettings: function() {
      // 打开设置页面
     
      wx.navigateTo({
        url: '/pages/settings/settings',
      })
  },
  viewLeaderboard: function() {
      // 查看排行榜
      wx.showToast({
          title: '查看排行榜',
          icon: 'success'
      });
      wx.navigateTo({
        url: '/pages/leaderboard/leaderboard',
      })
  },
  adminPanel: function() {
      // 管理面板
      wx.showToast({
          title: '管理面板',
          icon: 'success'
      });
      wx.navigateTo({
        url: '/pages/admin/admin',
      })
  }
});