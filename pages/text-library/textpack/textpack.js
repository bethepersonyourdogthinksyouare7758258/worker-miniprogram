// pages/text-library/textpack/textpack.js
Page({
  data: {},
  
  navigateToList(e) {
    const category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: `./list/list?category=${category}`
    });
  }
});