// 数据完整性验证器 - Core Laws数据质量保证
// 负责验证从CSV到前端显示的整个数据链路的完整性

const fs = require('fs');
const path = require('path');

class DataValidator {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.assetsDir = path.join(this.baseDir, '../../assets/core-laws');
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  // 执行所有测试
  async runAllTests() {
    console.log('🧪 开始执行数据完整性测试...');
    
    // 重置测试结果
    this.testResults = { passed: 0, failed: 0, tests: [] };
    
    // 执行各项测试
    await this.testCSVDataIntegrity();
    await this.testJSDataGeneration();
    await this.testDataConsistency();
    await this.testFrontendCompatibility();
    await this.testSpecificLegalBasis();
    
    console.log(`\n📊 测试结果: 通过 ${this.testResults.passed}, 失败 ${this.testResults.failed}`);
    
    return this.testResults;
  }

  // Test 1: CSV数据完整性测试
  async testCSVDataIntegrity() {
    const testName = 'CSV数据完整性';
    console.log(`  🔍 ${testName}...`);
    
    try {
      // 测试法条知识CSV
      const legalCSVPath = path.join(this.assetsDir, '法条知识-最终标准版.csv');
      const legalData = this.parseCSV(legalCSVPath);
      
      // 验证数据量
      if (legalData.length !== 32) {
        throw new Error(`法条知识数量不正确: 期望32条, 实际${legalData.length}条`);
      }
      
      // 验证必填字段
      legalData.forEach((row, index) => {
        const requiredFields = ['法条ID', '问题标题', '简明结论', '法条依据'];
        requiredFields.forEach(field => {
          if (!row[field] || row[field].trim().length === 0) {
            throw new Error(`第${index + 2}行 ${field} 字段为空`);
          }
        });
      });
      
      // 测试维权场景CSV
      const scenarioCSVPath = path.join(this.assetsDir, '维权场景-最终标准版.csv');
      const scenarioData = this.parseCSV(scenarioCSVPath);
      
      // 验证数据量
      if (scenarioData.length !== 18) {
        throw new Error(`维权场景数量不正确: 期望18个, 实际${scenarioData.length}个`);
      }
      
      this.addTestResult(testName, true, '数据量和必填字段验证通过');
      
    } catch (error) {
      this.addTestResult(testName, false, error.message);
    }
  }

  // Test 2: JS数据文件生成测试
  async testJSDataGeneration() {
    const testName = 'JS数据文件生成';
    console.log(`  🔍 ${testName}...`);
    
    try {
      const legalJSPath = path.join(this.baseDir, 'legal-knowledge.js');
      const scenarioJSPath = path.join(this.baseDir, 'rights-scenarios.js');
      
      // 验证文件存在
      if (!fs.existsSync(legalJSPath)) {
        throw new Error('legal-knowledge.js 文件不存在');
      }
      if (!fs.existsSync(scenarioJSPath)) {
        throw new Error('rights-scenarios.js 文件不存在');
      }
      
      // 测试文件加载
      delete require.cache[require.resolve(legalJSPath)];
      delete require.cache[require.resolve(scenarioJSPath)];
      
      const { legalKnowledge, knowledgeStats, knowledgeById } = require(legalJSPath);
      const { rightsScenarios, scenarioStats, scenarioById } = require(scenarioJSPath);
      
      // 验证数据结构
      if (!legalKnowledge || !knowledgeStats || !knowledgeById) {
        throw new Error('法条知识数据结构不完整');
      }
      if (!rightsScenarios || !scenarioStats || !scenarioById) {
        throw new Error('维权场景数据结构不完整');
      }
      
      this.addTestResult(testName, true, 'JS文件生成和结构验证通过');
      
    } catch (error) {
      this.addTestResult(testName, false, error.message);
    }
  }

  // Test 3: 数据一致性测试
  async testDataConsistency() {
    const testName = '数据一致性';
    console.log(`  🔍 ${testName}...`);
    
    try {
      // 读取CSV数据
      const legalCSVPath = path.join(this.assetsDir, '法条知识-最终标准版.csv');
      const csvData = this.parseCSV(legalCSVPath);
      
      // 读取JS数据
      const legalJSPath = path.join(this.baseDir, 'legal-knowledge.js');
      delete require.cache[require.resolve(legalJSPath)];
      const { knowledgeById } = require(legalJSPath);
      
      // 对比数据一致性
      csvData.forEach((csvRow, index) => {
        const lawId = csvRow['法条ID'];
        const jsData = knowledgeById[lawId];
        
        if (!jsData) {
          throw new Error(`JS数据中缺少 ${lawId}`);
        }
        
        // 对比关键字段
        if (jsData.title !== csvRow['问题标题']) {
          throw new Error(`${lawId} 标题不一致`);
        }
        if (jsData.summary !== csvRow['简明结论']) {
          throw new Error(`${lawId} 简明结论不一致`);
        }
        if (jsData.legalBasis !== csvRow['法条依据']) {
          throw new Error(`${lawId} 法条依据不一致`);
        }
      });
      
      this.addTestResult(testName, true, 'CSV与JS数据一致性验证通过');
      
    } catch (error) {
      this.addTestResult(testName, false, error.message);
    }
  }

  // Test 4: 前端兼容性测试
  async testFrontendCompatibility() {
    const testName = '前端兼容性';
    console.log(`  🔍 ${testName}...`);
    
    try {
      const legalJSPath = path.join(this.baseDir, 'legal-knowledge.js');
      delete require.cache[require.resolve(legalJSPath)];
      const { legalKnowledge, knowledgeById } = require(legalJSPath);
      
      // 模拟前端数据处理
      const allItems = [];
      Object.keys(legalKnowledge).forEach(category => {
        if (Array.isArray(legalKnowledge[category])) {
          allItems.push(...legalKnowledge[category]);
        }
      });
      
      // 验证前端需要的字段
      allItems.forEach(item => {
        const requiredFields = ['id', 'type', 'category', 'tag', 'title', 'summary', 'legalBasis'];
        requiredFields.forEach(field => {
          if (item[field] === undefined || item[field] === null) {
            throw new Error(`${item.id || 'unknown'} 缺少字段: ${field}`);
          }
        });
      });
      
      // 验证按ID查找功能
      const law001 = knowledgeById['LAW001'];
      if (!law001 || !law001.legalBasis) {
        throw new Error('按ID查找功能不正常');
      }
      
      this.addTestResult(testName, true, '前端数据结构和查找功能验证通过');
      
    } catch (error) {
      this.addTestResult(testName, false, error.message);
    }
  }

  // Test 5: 特定法条内容测试（重点检查LAW028）
  async testSpecificLegalBasis() {
    const testName = '特定法条内容检查';
    console.log(`  🔍 ${testName}...`);
    
    try {
      const legalJSPath = path.join(this.baseDir, 'legal-knowledge.js');
      delete require.cache[require.resolve(legalJSPath)];
      const { knowledgeById } = require(legalJSPath);
      
      // 检查LAW028（用户特别关注的法条）
      const law028 = knowledgeById['LAW028'];
      if (!law028) {
        throw new Error('LAW028 不存在');
      }
      
      // 验证法条依据内容完整性
      if (!law028.legalBasis || law028.legalBasis.length < 50) {
        throw new Error(`LAW028 法条依据内容过短: ${law028.legalBasis?.length || 0} 字符`);
      }
      
      // 验证包含期望的法条引用
      if (!law028.legalBasis.includes('劳动合同法') || !law028.legalBasis.includes('劳动争议调解仲裁法')) {
        throw new Error('LAW028 法条依据内容不完整，缺少预期的法条引用');
      }
      
      // 检查其他关键法条
      const criticalLaws = ['LAW001', 'LAW003', 'LAW009', 'LAW013'];
      criticalLaws.forEach(lawId => {
        const law = knowledgeById[lawId];
        if (!law || !law.legalBasis || law.legalBasis.length < 30) {
          throw new Error(`${lawId} 法条依据内容不完整`);
        }
      });
      
      this.addTestResult(testName, true, '关键法条内容完整性验证通过');
      
    } catch (error) {
      this.addTestResult(testName, false, error.message);
    }
  }

  // 添加测试结果
  addTestResult(testName, passed, message) {
    this.testResults.tests.push({
      name: testName,
      passed,
      message,
      timestamp: new Date().toISOString()
    });
    
    if (passed) {
      this.testResults.passed++;
      console.log(`    ✅ ${testName}: ${message}`);
    } else {
      this.testResults.failed++;
      console.log(`    ❌ ${testName}: ${message}`);
    }
  }

  // CSV解析器（简化版）
  parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const row = {};
      headers.forEach((header, i) => {
        row[header.trim()] = (values[i] || '').replace(/"/g, '').trim();
      });
      return row;
    });
  }

  // 生成测试报告
  generateTestReport() {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    let report = `# 数据完整性测试报告\n\n`;
    report += `**执行时间**: ${timestamp}\n\n`;
    report += `## 测试结果概述\n`;
    report += `- 通过: ${this.testResults.passed} 项\n`;
    report += `- 失败: ${this.testResults.failed} 项\n`;
    report += `- 总计: ${this.testResults.tests.length} 项\n\n`;
    
    report += `## 详细测试结果\n\n`;
    
    this.testResults.tests.forEach(test => {
      const status = test.passed ? '✅ 通过' : '❌ 失败';
      report += `### ${test.name}\n`;
      report += `- 状态: ${status}\n`;
      report += `- 结果: ${test.message}\n`;
      report += `- 时间: ${test.timestamp}\n\n`;
    });
    
    return report;
  }
}

module.exports = DataValidator;

// 如果直接运行此文件，执行所有测试
if (require.main === module) {
  const validator = new DataValidator();
  validator.runAllTests().then(results => {
    const report = validator.generateTestReport();
    const reportPath = path.join(__dirname, 'test-report.md');
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`\n📊 测试报告已生成: ${reportPath}`);
    
    process.exit(results.failed > 0 ? 1 : 0);
  });
}
