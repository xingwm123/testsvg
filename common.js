// 初始化共享变量111
let currentRect = null;
let currentPath = null;
let pathAssociations = {};
let elementAll = [];
let paths = [];
let xScale = null;
const coordinatesMap = new Map();

let relatedElements = {};

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
  setxScale: (scale) => {
    xScale = scale;
  },
  getxScale: () => {
    return xScale;
  },
  setRelatedElements: (key,value) => {
    relatedElements[key] = value;
  },
  getRelatedElements: (key) => {
    return relatedElements[key];
  },
  deleteRelatedElements: (key) => {
    delete relatedElements[key];
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
  },
  setElement: (value) => {
    elementAll.push(value);
  },
  getElement: (index) => {
    return elementAll[index];
  },
  deleteElement: (index) => {
    if (index >= 0 && index < elementAll.length) {
      elementAll.splice(index, 1);
    }
  },
  clearElements: () => {
    elementAll = [];
  },
  // 获取整个elementAll数组的方法
  getAllElements: () => {
    return elementAll;
  },
  setPaths: (value) => {
    paths.push(value);
  },
  getPaths: (index) => {
    return paths[index];
  },
  deletePaths: (index) => {
    if (index >= 0 && index < paths.length) {
      paths.splice(index, 1);
    }
  },
  clearPaths: () => {
    paths = [];
  },
  // 获取整个elementAll数组的方法
  getAllPaths: () => {
    return paths;
  },

  totalDay: (viewtype) => {
    let plus = 0;
    if(viewtype=== 'quarter'){
      plus = 90;
    }else if(viewtype === 'month'){
      plus = 30;
    }else if(viewtype === 'week'){
      plus = 10;
    }
    return plus;
  }
};
