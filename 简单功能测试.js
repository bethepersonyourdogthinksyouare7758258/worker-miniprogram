/**
 * 简单功能测试 - 验证法条数据和页面逻辑
 * 确保新的简化方案正常工作
 */

// 导入数据模块
const { getAllLaws, getLawsByStage, searchLaws, getStats, getLawById } = require('./data/core-laws/laws-data.js');

// 测试结果收集
const testResults = [];

function runTest(testName, testFn) {
  try {
    console.log(`\n🧪 测试: ${testName}`);
    const result = testFn();
    if (result === true) {
      console.log(`✅ ${testName} - 通过`);
      testResults.push({ name: testName, status: '✅ 通过' });
    } else {
      console.log(`❌ ${testName} - 失败: ${result}`);
      testResults.push({ name: testName, status: `❌ 失败: ${result}` });
    }
  } catch (error) {
    console.log(`❌ ${testName} - 错误: ${error.message}`);
    testResults.push({ name: testName, status: `❌ 错误: ${error.message}` });
  }
}

// 1. 测试数据加载
runTest('数据加载测试', () => {
  const allLaws = getAllLaws();
  if (allLaws.length !== 31) {
    return `期望31条法条，实际${allLaws.length}条`;
  }
  
  // 检查数据结构
  const firstLaw = allLaws[0];
  const requiredFields = ['id', 'stage', 'tag', 'title', 'summary', 'legalBasis'];
  for (const field of requiredFields) {
    if (!firstLaw.hasOwnProperty(field)) {
      return `缺少必要字段: ${field}`;
    }
  }
  
  return true;
});

// 2. 测试按阶段筛选
runTest('阶段筛选测试', () => {
  const stages = ['入职阶段', '在职阶段', '离职阶段'];
  
  for (const stage of stages) {
    const laws = getLawsByStage(stage);
    if (laws.length === 0) {
      return `${stage}没有数据`;
    }
    
    // 确保返回的都是该阶段的法条
    for (const law of laws) {
      if (law.stage !== stage) {
        return `${stage}筛选错误，包含了${law.stage}的法条`;
      }
    }
  }
  
  return true;
});

// 3. 测试搜索功能
runTest('搜索功能测试', () => {
  // 搜索工资相关
  const salaryResults = searchLaws('工资');
  if (salaryResults.length === 0) {
    return '工资搜索无结果';
  }
  
  // 搜索试用期相关
  const probationResults = searchLaws('试用期');
  if (probationResults.length === 0) {
    return '试用期搜索无结果';
  }
  
  // 搜索不存在的内容
  const noResults = searchLaws('不存在的内容xyz123');
  if (noResults.length !== 0) {
    return '搜索不存在内容应该返回空数组';
  }
  
  return true;
});

// 4. 测试ID查找
runTest('ID查找测试', () => {
  // 测试存在的ID
  const law1 = getLawById(1);
  if (!law1) {
    return 'ID为1的法条不存在';
  }
  if (law1.title !== '试用期最长多久？') {
    return 'ID为1的法条标题不正确';
  }
  
  // 测试不存在的ID
  const noLaw = getLawById(999);
  if (noLaw !== undefined) {
    return 'ID为999的法条不应该存在';
  }
  
  return true;
});

// 5. 测试统计信息
runTest('统计信息测试', () => {
  const stats = getStats();
  
  if (stats.total !== 31) {
    return `总数应为31，实际${stats.total}`;
  }
  
  if (!stats.stages) {
    return '缺少阶段统计';
  }
  
  if (!stats.tags) {
    return '缺少标签统计';
  }
  
  // 检查阶段统计是否合理
  const stageTotal = Object.values(stats.stages).reduce((sum, count) => sum + count, 0);
  if (stageTotal !== 31) {
    return `阶段统计总数应为31，实际${stageTotal}`;
  }
  
  return true;
});

// 6. 测试数据完整性
runTest('数据完整性测试', () => {
  const allLaws = getAllLaws();
  
  // 检查ID是否连续
  const ids = allLaws.map(law => law.id).sort((a, b) => a - b);
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] !== i + 1) {
      return `ID不连续，缺少ID: ${i + 1}`;
    }
  }
  
  // 检查是否有重复标题
  const titles = allLaws.map(law => law.title);
  const uniqueTitles = [...new Set(titles)];
  if (titles.length !== uniqueTitles.length) {
    return '存在重复的法条标题';
  }
  
  // 检查必要字段是否为空
  for (const law of allLaws) {
    if (!law.title || law.title.trim() === '') {
      return `ID ${law.id} 的标题为空`;
    }
    if (!law.summary || law.summary.trim() === '') {
      return `ID ${law.id} 的简明结论为空`;
    }
  }
  
  return true;
});

// 7. 模拟页面逻辑测试
runTest('页面逻辑模拟测试', () => {
  // 模拟页面数据结构
  let pageData = {
    searchText: '',
    selectedStage: 'all',
    filteredData: [],
    expandedItems: {}
  };
  
  // 模拟加载所有数据
  let data = getAllLaws();
  pageData.filteredData = data.map(item => ({
    ...item,
    expanded: pageData.expandedItems[item.id] || false
  }));
  
  if (pageData.filteredData.length !== 31) {
    return '页面数据加载失败';
  }
  
  // 模拟阶段切换
  pageData.selectedStage = '入职阶段';
  data = getLawsByStage(pageData.selectedStage);
  pageData.filteredData = data.map(item => ({
    ...item,
    expanded: pageData.expandedItems[item.id] || false
  }));
  
  if (pageData.filteredData.length === 0) {
    return '阶段切换失败';
  }
  
  // 检查是否都是入职阶段的法条
  const wrongStage = pageData.filteredData.find(item => item.stage !== '入职阶段');
  if (wrongStage) {
    return '阶段筛选不正确';
  }
  
  // 模拟搜索
  pageData.searchText = '试用期';
  pageData.selectedStage = 'all';
  data = getAllLaws();
  const searchResults = data.filter(law => 
    law.title.toLowerCase().includes('试用期') ||
    law.summary.toLowerCase().includes('试用期') ||
    law.tag.toLowerCase().includes('试用期') ||
    law.legalBasis.toLowerCase().includes('试用期')
  );
  
  if (searchResults.length === 0) {
    return '搜索功能模拟失败';
  }
  
  return true;
});

// 运行所有测试
function runAllTests() {
  console.log('='.repeat(50));
  console.log('🚀 简化方案功能测试');
  console.log('='.repeat(50));
  
  // 执行所有测试
  console.log('开始执行测试...\n');
  
  // 生成测试报告
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试报告');
  console.log('='.repeat(50));
  
  testResults.forEach(result => {
    console.log(`${result.status} ${result.name}`);
  });
  
  const passedTests = testResults.filter(r => r.status.includes('✅')).length;
  const totalTests = testResults.length;
  
  console.log('\n📈 测试统计:');
  console.log(`- 总测试数: ${totalTests}`);
  console.log(`- 通过数量: ${passedTests}`);
  console.log(`- 通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 所有测试通过！页面应该可以正常显示了。');
  } else {
    console.log('\n⚠️  存在测试失败，需要修复问题。');
  }
  
  console.log('='.repeat(50));
  
  return passedTests === totalTests;
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
