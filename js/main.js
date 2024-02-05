
import { createTimeAxes } from '../timeAxes.js'
import { createDraggableRects } from '../circleDraggableRects.js'
import { createSlider } from '../createSlider.js'
import { createDeformationRectangle } from '../createDeformationRectangle.js'
import { getCoordinates } from '../timeAxes.js';

document.addEventListener('DOMContentLoaded', function() {

  const svg = d3.select("svg");

    const rects = [
      { id: "rect-1", x: 100, y: 150, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "lvy", date: "2021-08-01", end: "2021-08-10",relate3:[],relate5: ["rect-3", "rect-2"]},
      { id: "rect-2", x: 200, y: 350, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Helen", date: "2024-02-01", end: "2024-02-10",relate3:[],relate5: ["rect-6"]},
      { id: "rect-3", x: 300, y: 450, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Grace", date: "2024-02-01", end: "2024-02-15",relate3:[],relate5: ["rect-4", "rect-2"]},
      { id: "rect-4", x: 400, y: 550, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Frank", date: "2024-02-05", end: "2024-02-17"},
      { id: "rect-5", x: 500, y: 650, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Eve", date: "2024-02-17", end: "2024-02-19"},
      { id: "rect-6", x: 600, y: 750, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "David", date: "2024-02-18", end: "2024-02-20"},
      { id: "rect-7", x: 700, y: 850, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Carol", date: "2024-02-19", end: "2024-02-21"},
      { id: "rect-8", x: 800, y: 950, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Bob", date: "2024-02-20", end: "2024-02-24"}
    ];


    let startDate = new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000);  // 开始日期
    let endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 结束日期，40天后
  
    // 假设SVG的尺寸已经被设置
    const svgWidth = 900;

    const margin = { top: 45, right: 20, bottom: 30, left: 40 }; // 将top调整为

  
    const scaleTime = d3.scaleTime()
      .domain([startDate, endDate])
      .range([margin.left, svgWidth - margin.right]);

    
    // 创建坐标轴
    createTimeAxes(svg, scaleTime);


    // 过滤掉没有坐标的矩形数据
    const filteredRects = rects.filter(rect => {
      const coordinates = getCoordinates(rect.name, rect.date, rect.end);
      if (coordinates) {
        // 如果找到了坐标，就在原始rect对象上设置x和y
        rect.x = coordinates.x;
        rect.y = coordinates.y;
        rect.width = coordinates.width;
        return true; // 保留这个矩形数据
      } else {
        return false; // 过滤掉这个矩形数据
      }
    });

    // 创建可以拖动的矩形圈
    createDraggableRects(svg, filteredRects);



    //创建拉动条以及覆盖的矩形
    createSlider(svg, filteredRects);


    //左右变形拉动条
    createDeformationRectangle(svg, filteredRects);

  });