/**
 * 双模式数据管理器 - 统一管理法条知识和场景数据
 * 支持法条知识和维权场景的双模式切换
 */

const { lawsData, getAllLaws, getLawsByStage, getLawsByTag, getLawById, searchLaws } = require('./laws-data');
const { rightsScenarios, scenarioStats, scenarioById } = require('./rights-scenarios');

/**
 * 双模式数据管理器类
 */
class DualModeManager {
  constructor() {
    // 当前模式：'knowledge' 或 'scenarios'
    this.currentMode = 'knowledge';
  }

  /**
   * 切换模式
   * @param {string} mode - 'knowledge' 或 'scenarios' 
   */
  switchMode(mode) {
    if (mode !== 'knowledge' && mode !== 'scenarios') {
      throw new Error('Mode must be either "knowledge" or "scenarios"');
    }
    this.currentMode = mode;
  }

  /**
   * 获取当前模式的所有数据
   * @returns {Array} 数据数组
   */
  getCurrentModeData() {
    if (this.currentMode === 'knowledge') {
      return getAllLaws();
    } else {
      // 返回扁平化的场景数据
      return Object.values(rightsScenarios).flat();
    }
  }

  /**
   * 按阶段获取当前模式的数据
   * @param {string} stage - 阶段名称 ('onboarding', 'working', 'departure')
   * @returns {Array} 过滤后的数据数组
   */
  getCurrentModeDataByStage(stage) {
    if (this.currentMode === 'knowledge') {
      // 法条数据使用英文阶段名，需要映射中文到英文
      const chineseToEnglishMap = {
        '入职阶段': 'onboarding',
        '在职阶段': 'working',
        '离职阶段': 'departure'
      };
      
      // 如果传入的是中文阶段名，转换为英文
      const englishStage = chineseToEnglishMap[stage] || stage;
      return getLawsByStage(englishStage);
    } else {
      // 场景数据按英文阶段分类
      const englishToScenarioMap = {
        'onboarding': rightsScenarios.onboarding || [],
        'working': rightsScenarios.working || [],
        'departure': rightsScenarios.departure || []
      };
      
      // 处理中文到英文的映射
      const chineseToEnglishMap = {
        '入职阶段': 'onboarding',
        '在职阶段': 'working',
        '离职阶段': 'departure'
      };
      
      const englishStage = chineseToEnglishMap[stage] || stage;
      return englishToScenarioMap[englishStage] || [];
    }
  }

  /**
   * 搜索当前模式的数据
   * @param {string} keyword - 搜索关键词
   * @returns {Array} 搜索结果
   */
  searchCurrentModeData(keyword) {
    if (this.currentMode === 'knowledge') {
      return searchLaws(keyword);
    } else {
      // 场景数据搜索
      if (!keyword || keyword.trim() === '') return [];
      const searchTerm = keyword.toLowerCase().trim();
      const allScenarios = Object.values(rightsScenarios).flat();
      
      return allScenarios.filter(scenario => 
        scenario.title.toLowerCase().includes(searchTerm) ||
        scenario.tag.toLowerCase().includes(searchTerm) ||
        scenario.conditions.toLowerCase().includes(searchTerm) ||
        scenario.explanation.toLowerCase().includes(searchTerm)
      );
    }
  }

  /**
   * 根据ID获取数据项
   * @param {string} id - 数据ID
   * @returns {Object|null} 数据项或null
   */
  getItemById(id) {
    if (this.currentMode === 'knowledge') {
      return getLawById(id);
    } else {
      return scenarioById[id] || null;
    }
  }

  /**
   * 获取当前模式的统计信息
   * @returns {Object} 统计信息
   */
  getCurrentModeStats() {
    if (this.currentMode === 'knowledge') {
      // 法条统计
      const stages = {};
      const tags = {};
      lawsData.forEach(law => {
        stages[law.stage] = (stages[law.stage] || 0) + 1;
        tags[law.tag] = (tags[law.tag] || 0) + 1;
      });
      return {
        total: lawsData.length,
        stages,
        tags,
        mode: 'knowledge'
      };
    } else {
      // 场景统计
      return {
        ...scenarioStats,
        mode: 'scenarios'
      };
    }
  }

  /**
   * 获取所有可用的阶段
   * @returns {Array} 阶段数组
   */
  getAvailableStages() {
    return ['onboarding', 'working', 'departure'];
  }

  /**
   * 获取当前模式名称（用于UI显示）
   * @returns {string} 模式名称
   */
  getCurrentModeName() {
    return this.currentMode === 'knowledge' ? '法条知识' : '维权场景';
  }

  /**
   * 获取阶段显示名称
   * @param {string} stage - 阶段标识
   * @returns {string} 显示名称
   */
  getStageDisplayName(stage) {
    const stageNames = {
      'onboarding': '入职阶段',
      'working': '工作期间', 
      'departure': '离职阶段'
    };
    return stageNames[stage] || stage;
  }

  /**
   * 批量操作：设置展开状态
   * @param {Array} items - 数据项数组
   * @param {boolean} expanded - 展开状态
   * @returns {Array} 更新后的数据项数组
   */
  setExpandedState(items, expanded = false) {
    return items.map(item => ({
      ...item,
      expanded
    }));
  }

  /**
   * 切换单个项目的展开状态
   * @param {Array} items - 数据项数组
   * @param {string} id - 项目ID
   * @returns {Array} 更新后的数据项数组
   */
  toggleItemExpanded(items, id) {
    return items.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    );
  }
}

// 创建单例实例
const dualModeManager = new DualModeManager();

module.exports = {
  DualModeManager,
  dualModeManager
};
