// pages/result/result.js
const wxCharts = require('../../utils/wxcharts.js');

Page({
  data: {
    costPerformance: 0,
    stepsToIdeal: 0,
    offerTotalScore: 0,
    idealTotalScore: 0,
    offerSalary: 0,
    idealSalary: 0,
    offerSideIncome: 0,
    idealSideIncome: 0,
    offerCost: 0,
    idealCost: 0,
    offerItemScores: {},
    idealItemScores: {},
  },

  onLoad: function () {
    const dataInput = wx.getStorageSync('dataInput');
    const ratingWeights = wx.getStorageSync('ratingWeights');

    console.log('DataInput:', dataInput);
    console.log('RatingWeights:', ratingWeights);

    if (dataInput && ratingWeights) {
      this.calculateScores(dataInput, ratingWeights);
      this.drawRadarChart(dataInput);
    } else {
      console.error('No data available');
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
    }
  },

  calculateScores: function (dataInput, ratingWeights) {
    const factors = Object.keys(dataInput.offerFactors);
    let offerTotalWeightedScore = 0;
    let idealTotalWeightedScore = 0;
    let totalWeight = 0;
    const offerItemScores = {};
    const idealItemScores = {};

    const offerIncome = dataInput.salary.offerSalary + dataInput.salary.offerSideIncome;
    const idealIncome = dataInput.salary.idealSalary + dataInput.salary.idealSideIncome;
    const offerNetIncome = Math.max(offerIncome - dataInput.salary.offerCost, 0);
    const idealNetIncome = Math.max(idealIncome - dataInput.salary.idealCost, 0);

    const baseIncome = 20000;
    const offerIncomeFactor = Math.min(offerNetIncome / baseIncome, 2);
    const idealIncomeFactor = Math.min(idealNetIncome / baseIncome, 2);

    factors.forEach(factor => {
      const weight = ratingWeights[factor];
      const offerScore = dataInput.offerFactors[factor];
      const idealScore = dataInput.idealFactors[factor];

      offerTotalWeightedScore += weight * offerScore;
      idealTotalWeightedScore += weight * idealScore;
      totalWeight += weight;

      offerItemScores[factor] = Math.min((offerScore * offerIncomeFactor).toFixed(2), 10);
      idealItemScores[factor] = Math.min((idealScore * idealIncomeFactor).toFixed(2), 10);
    });

    const offerWeightedAverage = totalWeight > 0 ? offerTotalWeightedScore / totalWeight : 0;
    const idealWeightedAverage = totalWeight > 0 ? idealTotalWeightedScore / totalWeight : 0;

    const offerTotalScore = (offerWeightedAverage * 10 * offerIncomeFactor).toFixed(2);
    const idealTotalScore = (idealWeightedAverage * 10 * idealIncomeFactor).toFixed(2);

    const costPerformance = idealTotalScore > 0 ? (offerTotalScore / idealTotalScore).toFixed(2) : 0;
    const stepsToIdeal = (100 * (1 - costPerformance)).toFixed(0);

    this.setData({
      offerTotalScore: offerTotalScore,
      idealTotalScore: idealTotalScore,
      offerSalary: dataInput.salary.offerSalary,
      idealSalary: dataInput.salary.idealSalary,
      offerSideIncome: dataInput.salary.offerSideIncome,
      idealSideIncome: dataInput.salary.idealSideIncome,
      offerCost: dataInput.salary.offerCost,
      idealCost: dataInput.salary.idealCost,
      offerItemScores: offerItemScores,
      idealItemScores: idealItemScores,
      costPerformance: costPerformance,
      stepsToIdeal: stepsToIdeal
    }, () => {
      console.log('Data set to UI:', this.data);
    });
  },

  drawRadarChart: function (dataInput) {
    const factors = Object.keys(dataInput.offerFactors);
    const offerData = factors.map(factor => dataInput.offerFactors[factor]);
    const idealData = factors.map(factor => dataInput.idealFactors[factor]);

    try {
      new wxCharts({
        canvasId: 'radarCanvas',
        type: 'radar',
        categories: [
          '发展空间', '支配时间', '人脉', '社交认可', '简历美化',
          '职场舒适', '公司稳定', '工作轻松', '工作自由'
        ],
        series: [
          { name: 'Offer', data: offerData, color: '#07c160' },
          { name: '理想工作', data: idealData, color: '#ff7300' }
        ],
        width: 300,
        height: 300,
        extra: {
          radar: { max: 10, labelColor: '#666' }
        }
      });
      console.log('Radar chart rendered successfully');
    } catch (e) {
      console.error('Radar chart rendering failed:', e);
    }
  },

  // 长按二维码复制链接并提示
  handleQrcodeLongPress: function () {
    wx.setClipboardData({
      data: 'https://mp.weixin.qq.com/s/QjIo-BMCEi6Ym-x2-CHGlA',
      success: () => {
        wx.showModal({
          title: '链接已复制',
          content: '链接已复制到剪贴板，请打开浏览器粘贴访问',
          showCancel: false,
          confirmText: '知道了',
          success: () => {
            console.log('用户确认复制链接');
          }
        });
      },
      fail: (err) => {
        console.error('复制链接失败', err);
        wx.showToast({
          title: '复制失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 分享按钮点击事件
  shareToFriend: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage'],
      success: () => {
        console.log('分享菜单打开成功');
      },
      fail: (err) => {
        console.error('分享菜单打开失败:', err);
      }
    });
  },

  // 分享功能的具体内容
  onShareAppMessage: function (res) {
    return {
      title: '我的性价比分析结果，快来看看吧！',
      path: '/pages/result/result',
      imageUrl: '/cloudbase/assets/qrcode.jpg',
      success: (res) => {
        console.log('分享成功', res);
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('分享失败', err);
        wx.showToast({
          title: '分享取消',
          icon: 'none'
        });
      }
    };
  }
});