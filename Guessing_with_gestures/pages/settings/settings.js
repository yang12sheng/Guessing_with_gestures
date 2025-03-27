Page({
  data: {
    categories: [
      { name: "全部题库", checked: false }, // 新增：全部题库选项
      { name: "动物类", checked: false },
      { name: "生活用品类", checked: false },
      { name: "美食类", checked: false },
      { name: "体育项目类", checked: false },
      { name: "成语类", checked: false },
      { name: "职业类", checked: false },
      { name: "卡通形象类", checked: false },
      { name: "自然景观类", checked: false },
      { name: "日常行为类", checked: false }
    ],
    selectedCategory: "动物类"
  },

  onLoad: function() {
    const savedCategory = wx.getStorageSync('category') || '动物类';
    console.log('Loaded saved category:', savedCategory); // 调试日志
    this.setData({
      categories: this.data.categories.map(category => ({
        ...category,
        checked: category.name === savedCategory
      })),
      selectedCategory: savedCategory
    });
  },

  onCategoryChange: function(e) {
    const selectedCategory = e.detail.value;
    console.log('Category changed to:', selectedCategory); // 调试日志

    // 更新类别的选中状态
    this.setData({
      categories: this.data.categories.map(category => ({
        ...category,
        checked: category.name === selectedCategory
      })),
      selectedCategory: selectedCategory
    });
  },

  saveSelection: function() {
    console.log('Saving category:', this.data.selectedCategory); // 调试日志
    wx.setStorageSync('category', this.data.selectedCategory);
    wx.showToast({
      title: '设置已保存',
      icon: 'success',
      duration: 2000
    });
    wx.navigateBack();
  }
});