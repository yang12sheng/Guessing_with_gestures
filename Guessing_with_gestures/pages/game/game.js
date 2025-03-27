Page({
  data: {
    currentWord: '',
    timer: 120, // 120秒倒计时
    score: 0,
    wordList: [],
    currentIndex: 0,
    intervalId: null,
    fontSize: 200, // 默认字体大小
    startTime: null, // 新增：记录游戏开始时间
    questionBank: {
      "动物类": [
        "大熊猫", "狮子", "猩猩", "长颈鹿", "袋鼠",
        "猫头鹰", "刺猬", "企鹅", "螃蟹", "蝴蝶",
        "蜜蜂", "蚂蚁", "大象", "鲨鱼", "骆驼"
      ],
      "生活用品类": [
        "雨伞", "梳子", "眼镜", "闹钟", "剪刀",
        "吹风机", "手电筒", "扫帚", "热水袋", "拖鞋",
        "手机", "电脑", "冰箱", "洗衣机", "微波炉"
      ],
      "美食类": [
        "汉堡", "冰淇淋", "饺子", "火锅", "蛋糕",
        "糖葫芦", "薯条", "月饼", "泡面", "粽子",
        "披萨", "烤鸭", "油条", "汤圆", "牛排"
      ],
      "体育项目类": [
        "篮球", "足球", "乒乓球", "跳绳", "游泳",
        "羽毛球", "网球", "排球", "跑步", "跳高",
        "跳远", "太极拳", "瑜伽", "骑自行车", "踢毽子"
      ],
      "成语类": [
        "对牛弹琴", "胸无点墨", "守株待兔", "打草惊蛇", "虎背熊腰",
        "眼高手低", "鸡鸣狗盗", "鸡飞狗跳", "画蛇添足", "坐井观天",
        "叶公好龙", "刻舟求剑", "掩耳盗铃", "盲人摸象", "亡羊补牢"
      ],
      "职业类": [
        "医生", "警察", "老师", "厨师", "消防员",
        "宇航员", "科学家", "画家", "歌手", "舞蹈家",
        "律师", "记者", "司机", "农民", "邮递员"
      ],
      "卡通形象类": [
        "喜羊羊", "灰太狼", "哆啦A梦", "海绵宝宝", "小猪佩奇",
        "米老鼠", "唐老鸭", "樱桃小丸子", "蜡笔小新", "哆啦美",
        "葫芦娃", "黑猫警长", "孙悟空", "奥特曼", "史迪仔"
      ],
      "自然景观类": [
        "太阳", "月亮", "星星", "山", "水",
        "彩虹", "大海", "沙漠", "森林", "瀑布",
        "下雪", "下雨", "打雷", "闪电", "台风"
      ],
      "日常行为类": [
        "刷牙", "洗脸", "吃饭", "睡觉", "跑步",
        "洗澡", "穿衣", "脱衣", "看书", "写字",
        "看电视", "玩游戏", "唱歌", "跳舞", "拍照"
      ]
    }
  },

  onLoad: function() {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        // 根据屏幕宽度调整字体大小
        const newFontSize = res.windowWidth / 7; // 根据需要调整比例
        that.setData({
          fontSize: newFontSize
        });
      }
    });
    // 从本地存储中加载类别
    const category = wx.getStorageSync('category') || '动物类';
    this.selectWordList(category);
    console.log('Selected word category:', category); // 打印选择的词语列表
    this.startGame();
  },

  selectWordList: function(category) {
    const { questionBank } = this.data;
    let wordList = [];

    if (category === "全部题库") {
      // 如果选择了“全部题库”，则从所有类别中选择词语
      for (let key in questionBank) {
        if (questionBank.hasOwnProperty(key)) {
          wordList = wordList.concat(questionBank[key]);
        }
      }
    } else {
      // 否则，从指定类别中选择词语
      wordList = questionBank[category] || questionBank['动物类'];
    }

    // 打乱数组
    wordList = this.shuffleArray(wordList);

    this.setData({ wordList });
    console.log('Selected word list:', wordList); // 打印选择的词语列表
  },

  startGame: function() {
    this.setData({ score: 0, currentIndex: 0 }); // 记录开始时间

    this.updateScore();
    this.showNextWord();
    this.startTimer();
  },

  showNextWord: function() {
    const { currentIndex, wordList } = this.data;
    if (currentIndex < wordList.length) {
      this.setData({ currentWord: wordList[currentIndex] });
      console.log('Current word:', wordList[currentIndex]); // 打印当前显示的词语
    } else {
      this.endGame();
    }
  },

  skipWord: function() {
    const { currentIndex, wordList } = this.data;
    if (currentIndex < wordList.length - 1) {
      this.setData({ currentIndex: currentIndex + 1 });
      this.showNextWord();
    } else {
      wx.showToast({ title: '没有更多的词语了！', icon: 'none' });
    }
  },

  correctAnswer: function() {
    const { currentIndex, wordList, score } = this.data;
    if (currentIndex < wordList.length) {
      this.setData({ score: score + 1, currentIndex: currentIndex + 1 });
      this.updateScore();
      this.showNextWord();
    } else {
      wx.showToast({ title: '没有更多的词语了！', icon: 'none' });
    }
  },

  startTimer: function() {
    this.setData({
      intervalId: setInterval(() => {
        const { timer } = this.data;
        if (timer > 0) {
          this.setData({ timer: timer - 1 });
        } else {
          this.endGame();
        }
      }, 1000)
    });
  },

  updateScore: function() {
    this.setData({ scoreText: `已猜对: ${this.data.score}` });
  },

  endGame: function() {
    clearInterval(this.data.intervalId);
    const endTime = new Date().toLocaleString(); // 获取当前时间作为结束时间
    this.saveScore(this.data.score, endTime);
    wx.showToast({ title: `游戏结束！得分: ${this.data.score}`, icon: 'none', duration: 2000 });
    wx.navigateBack();
  },

  // 新增：用于打乱数组的函数
  shuffleArray: function(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  saveScore: function(score, endTime) {
    const dateKey = `Leaderboard_${new Date().toISOString().split('T')[0]}`;
    const scores = wx.getStorageSync(dateKey) || '';
    wx.setStorageSync(dateKey, scores + `${endTime}-${score},`);
  },

  onUnload: function() {
    clearInterval(this.data.intervalId);
  }
});