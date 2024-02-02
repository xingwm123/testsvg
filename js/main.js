
import { createTimeAxes } from '../timeAxes.js'
import { createDraggableRects } from '../circleDraggableRects.js'
import { createSlider } from '../createSlider.js'
import { createDeformationRectangle } from '../createDeformationRectangle.js'

document.addEventListener('DOMContentLoaded', function() {

  const svg = d3.select("svg");

    const rects = [
      { id: "rect-1", x: 100, y: 150, width: 100, height: 100, fill: 'green', stroke: 'black' },
      { id: "rect-2", x: 200, y: 350, width: 100, height: 100, fill: 'green', stroke: 'black' },
      { id: "rect-3", x: 300, y: 450, width: 100, height: 100, fill: 'green', stroke: 'black' },
      { id: "rect-4", x: 400, y: 550, width: 100, height: 100, fill: 'green', stroke: 'black' },
      { id: "rect-5", x: 500, y: 650, width: 100, height: 100, fill: 'green', stroke: 'black' },
      { id: "rect-6", x: 600, y: 750, width: 100, height: 100, fill: 'green', stroke: 'black' },
      { id: "rect-7", x: 700, y: 850, width: 100, height: 100, fill: 'green', stroke: 'black' },
      { id: "rect-8", x: 800, y: 950, width: 100, height: 100, fill: 'green', stroke: 'black' }
    ];

    // 创建可以拖动的矩形圈
    createDraggableRects(svg, rects);


    let startDate = new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000); // 开始日期
    let endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 结束日期，40天后
  
    // 假设SVG的尺寸已经被设置
    const svgWidth = 900;

    const margin = { top: 45, right: 20, bottom: 30, left: 40 }; // 将top调整为

  
    const scaleTime = d3.scaleTime()
      .domain([startDate, endDate])
      .range([margin.left, svgWidth - margin.right]);

    
    // 创建坐标轴
    createTimeAxes(svg, scaleTime);



    //创建拉动条以及覆盖的矩形
    createSlider(svg, rects);


    //左右变形拉动条
    createDeformationRectangle(svg, rects);

  });