// 初始化共享变量111
let currentRect = null;
let currentPath = null;
let pathAssociations = {};
const coordinatesMap = new Map();

// 导出一个对象，包含getter和setter函数，以及coordinatesMap的操作方法
export const sharedState = {
  getCurrentRect: () => currentRect,
  setCurrentRect: (rect) => { currentRect = rect; },
  getCurrentPath: () => currentPath,
  setCurrentPath: (path) => { currentPath = path; },
  getPathAssociations: () => pathAssociations,
  setPathAssociation: (key, value) => {
    pathAssociations[key] = value;
  },
  deletePathAssociation: (key) => {
    delete pathAssociations[key];
  },
  clearPathAssociations: () => {
    pathAssociations = {};
  },
  // 新增方法操作coordinatesMap
  setCoordinates: (key, value) => {
    coordinatesMap.set(key, value);
  },
  getCoordinates: (key) => {
    return coordinatesMap.get(key);
  },
  deleteCoordinates: (key) => {
    coordinatesMap.delete(key);
  },
  clearCoordinates: () => {
    coordinatesMap.clear();
  },
  // 可选：获取整个Map的方法，如果需要的话
  getAllCoordinates: () => {
    return coordinatesMap;
  },
  // 在sharedState对象中添加
  hasCoordinates: (key) => {
    return coordinatesMap.has(key);
  }
};
