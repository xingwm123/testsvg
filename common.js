// 初始化共享变量
let currentRect = null;
let currentPath = null;
let pathAssociations = {};


// 导出一个对象，包含getter和setter函数，以便其他模块可以获取和设置这些变量
export const sharedState = {
  getCurrentRect: () => currentRect,
  setCurrentRect: (rect) => { currentRect = rect; },
  getCurrentPath: () => currentPath,
  setCurrentPath: (path) => { currentPath = path; },
  getPathAssociations: () => pathAssociations,
  setPathAssociation: (key, value) => {
    // 可以在这里添加验证或其他逻辑
    pathAssociations[key] = value;
  },
  deletePathAssociation: (key) => {
    // 删除指定的键
    delete pathAssociations[key];
  },
  clearPathAssociations: () => {
    // 清空所有关联
    pathAssociations = {};
  }
};