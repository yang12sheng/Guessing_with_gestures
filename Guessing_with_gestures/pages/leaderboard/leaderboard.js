// leaderboard.js
Page({
  data: {
    leaderboardData: [],
    noDataMessage: '' // 用于存储没有数据时的消息
  },

  onLoad: function() {
    this.loadLeaderboardData();
  },

  loadLeaderboardData: function() {
    const leaderboardData = [];
    const keys = wx.getStorageInfoSync().keys;

    keys.forEach(key => {
      if (key.startsWith('Leaderboard_')) {
        const scores = wx.getStorageSync(key);
        const scoreArray = scores.split(',');

        scoreArray.forEach(entry => {
          if (entry) {
            const [endTime, score] = entry.split('-');
            leaderboardData.push(`结束时间: ${endTime} - 得分: ${score}`);
          }
        });
      }
    });

    if (leaderboardData.length === 0) {
      this.setData({ noDataMessage: '暂时还没有游戏数据' });
    } else {
      this.setData({ leaderboardData, noDataMessage: '' });
    }
  }
});