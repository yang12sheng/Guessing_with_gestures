Page({
  data: {
    categories: ['动物类', '生活用品类', '美食类', '体育项目类', '成语类', '职业类', '卡通形象类', '自然景观类', '日常行为类'],
    selectedCategory: '',
    inputWord: '',
    displayQuestionBank: [],
    questionBank: {},
    editedFlags: {},
    deleteWord: '', // 新增：用于存储要删除的词语
    defaultQuestionBank: {
      "动物类": ["大熊猫", "狮子", "猩猩", "长颈鹿", "袋鼠", "猫头鹰", "刺猬", "企鹅", "螃蟹", "蝴蝶", "蜜蜂", "蚂蚁", "大象", "鲨鱼", "骆驼"],
      "生活用品类": ["雨伞", "梳子", "眼镜", "闹钟", "剪刀", "吹风机", "手电筒", "扫帚", "热水袋", "拖鞋", "手机", "电脑", "冰箱", "洗衣机", "微波炉"],
      "美食类": ["汉堡", "冰淇淋", "饺子", "火锅", "蛋糕", "糖葫芦", "薯条", "月饼", "泡面", "粽子", "披萨", "烤鸭", "油条", "汤圆", "牛排"],
      "体育项目类": ["篮球", "足球", "乒乓球", "跳绳", "游泳", "羽毛球", "网球", "排球", "跑步", "跳高", "跳远", "太极拳", "瑜伽", "骑自行车", "踢毽子"],
      "成语类": ["对牛弹琴", "胸无点墨", "守株待兔", "打草惊蛇", "虎背熊腰", "眼高手低", "鸡鸣狗盗", "鸡飞狗跳", "画蛇添足", "坐井观天", "叶公好龙", "刻舟求剑", "掩耳盗铃", "盲人摸象", "亡羊补牢"],
      "职业类": ["医生", "警察", "老师", "厨师", "消防员", "宇航员", "科学家", "画家", "歌手", "舞蹈家", "律师", "记者", "司机", "农民", "邮递员"],
      "卡通形象类": ["喜羊羊", "灰太狼", "哆啦A梦", "海绵宝宝", "小猪佩奇", "米老鼠", "唐老鸭", "樱桃小丸子", "蜡笔小新", "哆啦美", "葫芦娃", "黑猫警长", "孙悟空", "奥特曼", "史迪仔"],
      "自然景观类": ["太阳", "月亮", "星星", "山", "水", "彩虹", "大海", "沙漠", "森林", "瀑布", "下雪", "下雨", "打雷", "闪电", "台风"],
      "日常行为类": ["刷牙", "洗脸", "吃饭", "睡觉", "跑步", "洗澡", "穿衣", "脱衣", "看书", "写字", "看电视", "玩游戏", "唱歌", "跳舞", "拍照"]
    }
  },

  onLoad: function() {
    this.initializeEditedFlags();
    this.loadQuestionBank();
    this.formatQuestionBankContents();
  },
  
  formatQuestionBankContents: function() {
    const questionBank = this.data.questionBank;
    const displayQuestionBank = [];
    for (const category in questionBank) {
      if (questionBank.hasOwnProperty(category)) {
        const items = questionBank[category].join('、');
         displayQuestionBank.push({
          category: `类别: ${category}`,
          words: items
        });
      }
    }
    this.setData({ displayQuestionBank });
  },

  initializeEditedFlags: function() {
    const editedFlags = {};
    this.data.categories.forEach(category => {
      editedFlags[category] = false;
    });
    this.setData({ editedFlags });
  },

  loadQuestionBank: function() {
    let questionBank = wx.getStorageSync('questionBank');
    if (!questionBank || Object.keys(questionBank).length === 0) {
      questionBank = this.data.defaultQuestionBank;
      wx.setStorageSync('questionBank', questionBank);
    }
    this.setData({ questionBank });
    console.log('Loaded question bank:', questionBank);
  },

  onCategoryChange: function(e) {
    const selectedCategory = this.data.categories[e.detail.value];
    this.setData({ selectedCategory });
  },

  onWordInput: function(e) {
    this.setData({ inputWord: e.detail.value });
  },

  addWord: function() {
    const { selectedCategory, inputWord, questionBank, editedFlags } = this.data;
    if (!inputWord) {
      wx.showToast({ title: '请输入词语', icon: 'none' });
      return;
    }
    if (!selectedCategory) {
      wx.showToast({ title: '请选择类别', icon: 'none' });
      return;
    }
    if (!questionBank[selectedCategory]) {
      questionBank[selectedCategory] = [];
    }
    questionBank[selectedCategory].push(inputWord);
    editedFlags[selectedCategory] = true;
    this.setData({ questionBank, inputWord: '', editedFlags });
    this.formatQuestionBankContents(); // 更新显示内容
    wx.showToast({ title: '词语已添加', icon: 'success' });
    console.log(`Added word: ${inputWord} to category: ${selectedCategory}`);
    console.log('Current question bank:', questionBank);
  },
  onDeleteWordInput: function(e) { // 新增：用于输入要删除的词语
    this.setData({ deleteWord: e.detail.value });
  },
  
  deleteWord: function() { // 新增：删除词语功能
    const { selectedCategory, deleteWord, questionBank, editedFlags } = this.data;
    if (!deleteWord) {
      wx.showToast({ title: '请输入要删除的词语', icon: 'none' });
      return;
    }
    if (!selectedCategory) {
      wx.showToast({ title: '请选择类别', icon: 'none' });
      return;
    }
    const index = questionBank[selectedCategory].indexOf(deleteWord);
    if (index > -1) {
      questionBank[selectedCategory].splice(index, 1);
      editedFlags[selectedCategory] = true;
      this.setData({ questionBank, deleteWord: '', editedFlags });
      this.formatQuestionBankContents(); // 更新显示内容
      wx.showToast({ title: '词语已删除', icon: 'success' });
      console.log(`Deleted word: ${deleteWord} from category: ${selectedCategory}`);
      console.log('Current question bank:', questionBank);
    } else {
      wx.showToast({ title: '词语不存在', icon: 'none' });
    }
  },
  saveData: function() {
    wx.setStorageSync('questionBank', this.data.questionBank);
    wx.showToast({ title: '题库已保存', icon: 'success' });
    console.log('Saved question bank:', this.data.questionBank);
  },

  importData: function() {
    wx.showToast({ title: '导入功能未实现', icon: 'none' });
  }
});