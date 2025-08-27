// 工作流程管理器 - Core Laws数据处理工作流
// 负责统一管理从CSV到前端展示的完整数据流程

const fs = require('fs');
const path = require('path');

class WorkflowManager {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.assetsDir = path.join(this.baseDir, '../../assets/core-laws');
    this.outputDir = this.baseDir;
    
    // 工作流程状态
    this.status = {
      csvParsing: false,
      dataValidation: false,
      jsGeneration: false,
      frontendCompatibility: false,
      testing: false
    };
    
    // 数据统计
    this.stats = {
      legalKnowledge: { total: 0, onboarding: 0, working: 0, departure: 0 },
      rightsScenarios: { total: 0, onboarding: 0, working: 0, departure: 0 },
      errors: [],
      warnings: []
    };
  }

  // 执行完整工作流程
  async executeFullWorkflow() {
    console.log('🚀 开始执行完整数据处理工作流程...\n');
    
    try {
      // Step 1: CSV解析和验证
      await this.step1_ParseAndValidateCSV();
      
      // Step 2: 数据转换和生成
      await this.step2_TransformAndGenerate();
      
      // Step 3: 前端兼容性检查
      await this.step3_CheckFrontendCompatibility();
      
      // Step 4: 数据完整性测试
      await this.step4_RunDataIntegrityTests();
      
      // Step 5: 生成工作流程报告
      await this.step5_GenerateReport();
      
      console.log('\n🎉 工作流程执行完成!');
      return true;
      
    } catch (error) {
      console.error('❌ 工作流程执行失败:', error.message);
      this.stats.errors.push(`工作流程失败: ${error.message}`);
      return false;
    }
  }

  // Step 1: CSV解析和验证
  async step1_ParseAndValidateCSV() {
    console.log('📋 Step 1: CSV解析和验证...');
    this.status.csvParsing = true;
    
    const legalKnowledgeCSV = path.join(this.assetsDir, '法条知识-最终标准版.csv');
    const rightsScenariosCSV = path.join(this.assetsDir, '维权场景-最终标准版.csv');
    
    // 验证CSV文件存在
    if (!fs.existsSync(legalKnowledgeCSV)) {
      throw new Error(`法条知识CSV文件不存在: ${legalKnowledgeCSV}`);
    }
    if (!fs.existsSync(rightsScenariosCSV)) {
      throw new Error(`维权场景CSV文件不存在: ${rightsScenariosCSV}`);
    }
    
    // 解析CSV文件
    const legalData = this.parseCSV(legalKnowledgeCSV);
    const scenarioData = this.parseCSV(rightsScenariosCSV);
    
    // 验证数据完整性
    this.validateLegalKnowledgeData(legalData);
    this.validateRightsScenariosData(scenarioData);
    
    // 更新统计信息
    this.updateLegalKnowledgeStats(legalData);
    this.updateRightsScenariosStats(scenarioData);
    
    console.log('✅ CSV解析和验证完成');
    console.log(`   法条知识: ${this.stats.legalKnowledge.total} 条`);
    console.log(`   维权场景: ${this.stats.rightsScenarios.total} 个`);
    
    return { legalData, scenarioData };
  }

  // Step 2: 数据转换和生成
  async step2_TransformAndGenerate() {
    console.log('🔄 Step 2: 数据转换和生成...');
    this.status.jsGeneration = true;
    
    // 执行数据重新生成脚本
    const { main } = require('../regenerate-data.js');
    await main();
    
    console.log('✅ JS数据文件生成完成');
  }

  // Step 3: 前端兼容性检查
  async step3_CheckFrontendCompatibility() {
    console.log('🔍 Step 3: 前端兼容性检查...');
    this.status.frontendCompatibility = true;
    
    // 检查生成的JS文件是否存在
    const legalKnowledgeJS = path.join(this.outputDir, 'legal-knowledge.js');
    const rightsScenariosJS = path.join(this.outputDir, 'rights-scenarios.js');
    
    if (!fs.existsSync(legalKnowledgeJS)) {
      throw new Error('法条知识JS文件生成失败');
    }
    if (!fs.existsSync(rightsScenariosJS)) {
      throw new Error('维权场景JS文件生成失败');
    }
    
    // 测试数据加载
    try {
      const { legalKnowledge, knowledgeById } = require(legalKnowledgeJS);
      const { rightsScenarios, scenarioById } = require(rightsScenariosJS);
      
      // 验证关键数据点
      if (!legalKnowledge || !knowledgeById) {
        throw new Error('法条知识数据结构不完整');
      }
      if (!rightsScenarios || !scenarioById) {
        throw new Error('维权场景数据结构不完整');
      }
      
      // 检查LAW028是否存在且有完整内容
      const law028 = knowledgeById['LAW028'];
      if (!law028 || !law028.legalBasis || law028.legalBasis.length < 50) {
        this.stats.warnings.push('LAW028法条依据内容可能不完整');
      }
      
      console.log('✅ 前端兼容性检查通过');
      
    } catch (error) {
      throw new Error(`前端兼容性检查失败: ${error.message}`);
    }
  }

  // Step 4: 数据完整性测试
  async step4_RunDataIntegrityTests() {
    console.log('🧪 Step 4: 数据完整性测试...');
    this.status.testing = true;
    
    const DataValidator = require('./data-validator.js');
    const validator = new DataValidator();
    
    const testResults = await validator.runAllTests();
    
    if (testResults.failed > 0) {
      this.stats.errors.push(`数据完整性测试失败: ${testResults.failed} 项`);
      this.stats.warnings.push('建议检查数据质量');
    }
    
    console.log(`✅ 数据完整性测试完成 (通过: ${testResults.passed}, 失败: ${testResults.failed})`);
  }

  // Step 5: 生成工作流程报告
  async step5_GenerateReport() {
    console.log('📊 Step 5: 生成工作流程报告...');
    
    const report = this.generateWorkflowReport();
    const reportPath = path.join(__dirname, 'workflow-report.md');
    
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`✅ 工作流程报告已生成: ${reportPath}`);
  }

  // CSV解析器
  parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',');
      const row = { _lineNumber: index + 2 };
      headers.forEach((header, i) => {
        row[header.trim()] = (values[i] || '').replace(/"/g, '').trim();
      });
      return row;
    });
  }

  // 验证法条知识数据
  validateLegalKnowledgeData(data) {
    data.forEach((row, index) => {
      // 必填字段检查
      const requiredFields = ['法条ID', '问题标题', '简明结论', '法条依据'];
      requiredFields.forEach(field => {
        if (!row[field] || row[field].trim().length === 0) {
          this.stats.errors.push(`第${row._lineNumber}行 ${field} 字段为空`);
        }
      });
      
      // ID格式检查
      if (row['法条ID'] && !row['法条ID'].match(/^LAW\d{3}$/)) {
        this.stats.errors.push(`第${row._lineNumber}行 法条ID格式错误: ${row['法条ID']}`);
      }
      
      // 法条依据长度检查
      if (row['法条依据'] && row['法条依据'].length < 20) {
        this.stats.warnings.push(`第${row._lineNumber}行 法条依据内容可能过短`);
      }
    });
  }

  // 验证维权场景数据
  validateRightsScenariosData(data) {
    data.forEach((row, index) => {
      // 必填字段检查
      const requiredFields = ['场景ID', '场景标题', '所需条件', '操作步骤'];
      requiredFields.forEach(field => {
        if (!row[field] || row[field].trim().length === 0) {
          this.stats.errors.push(`第${row._lineNumber}行 ${field} 字段为空`);
        }
      });
      
      // ID格式检查
      if (row['场景ID'] && !row['场景ID'].match(/^SCENE\d{3}$/)) {
        this.stats.errors.push(`第${row._lineNumber}行 场景ID格式错误: ${row['场景ID']}`);
      }
    });
  }

  // 更新法条知识统计
  updateLegalKnowledgeStats(data) {
    this.stats.legalKnowledge.total = data.length;
    this.stats.legalKnowledge.onboarding = data.filter(row => row['阶段'] === '入职阶段').length;
    this.stats.legalKnowledge.working = data.filter(row => row['阶段'] === '在职阶段').length;
    this.stats.legalKnowledge.departure = data.filter(row => row['阶段'] === '离职阶段').length;
  }

  // 更新维权场景统计
  updateRightsScenariosStats(data) {
    this.stats.rightsScenarios.total = data.length;
    this.stats.rightsScenarios.onboarding = data.filter(row => row['阶段'] === '入职阶段').length;
    this.stats.rightsScenarios.working = data.filter(row => row['阶段'] === '在职阶段').length;
    this.stats.rightsScenarios.departure = data.filter(row => row['阶段'] === '离职阶段').length;
  }

  // 生成工作流程报告
  generateWorkflowReport() {
    const timestamp = new Date().toISOString().split('T')[0];
    
    return `# Core Laws 数据处理工作流程报告

## 执行时间
${new Date().toLocaleString('zh-CN')}

## 数据统计

### 法条知识
- 总计: ${this.stats.legalKnowledge.total} 条
- 入职阶段: ${this.stats.legalKnowledge.onboarding} 条
- 在职阶段: ${this.stats.legalKnowledge.working} 条
- 离职阶段: ${this.stats.legalKnowledge.departure} 条

### 维权场景
- 总计: ${this.stats.rightsScenarios.total} 个
- 入职阶段: ${this.stats.rightsScenarios.onboarding} 个
- 在职阶段: ${this.stats.rightsScenarios.working} 个
- 离职阶段: ${this.stats.rightsScenarios.departure} 个

## 工作流程状态
- CSV解析: ${this.status.csvParsing ? '✅ 完成' : '❌ 未完成'}
- 数据验证: ${this.status.dataValidation ? '✅ 完成' : '❌ 未完成'}
- JS生成: ${this.status.jsGeneration ? '✅ 完成' : '❌ 未完成'}
- 前端兼容性: ${this.status.frontendCompatibility ? '✅ 完成' : '❌ 未完成'}
- 测试验证: ${this.status.testing ? '✅ 完成' : '❌ 未完成'}

## 问题报告

### 错误 (${this.stats.errors.length})
${this.stats.errors.length > 0 ? this.stats.errors.map(error => `- ${error}`).join('\n') : '无错误'}

### 警告 (${this.stats.warnings.length})
${this.stats.warnings.length > 0 ? this.stats.warnings.map(warning => `- ${warning}`).join('\n') : '无警告'}

## 质量评估
- 数据完整性: ${this.stats.errors.length === 0 ? '优秀' : '需要改进'}
- 结构规范性: ${this.status.frontendCompatibility ? '符合标准' : '不符合标准'}
- 可用性: ${this.status.testing ? '测试通过' : '测试失败'}

---
*此报告由 Core Laws 工作流程管理器自动生成*
`;
  }
}

// 导出
module.exports = WorkflowManager;

// 如果直接运行此文件，执行完整工作流程
if (require.main === module) {
  const manager = new WorkflowManager();
  manager.executeFullWorkflow().then(success => {
    process.exit(success ? 0 : 1);
  });
}
