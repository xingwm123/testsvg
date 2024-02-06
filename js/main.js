
import { createTimeAxes } from '../timeAxes.js'
import { createDraggableRects } from '../circleDraggableRects.js'
import { createSlider } from '../createSlider.js'
import { createDeformationRectangle } from '../createDeformationRectangle.js'
import { getCoordinates } from '../timeAxes.js';

document.addEventListener('DOMContentLoaded', function() {

  const svg = d3.select("svg");

    const rects = [
      { id: "rect-1", x: 100, y: 150, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "lvy", date: "2021-08-01", end: "2021-08-10",relate3:[],relate5: ['rect-3', "rect-2"]},
      { id: "rect-2", x: 200, y: 350, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Helen", date: "2024-02-01", end: "2024-02-10",relate3:[],relate5: []},
      { id: "rect-3", x: 300, y: 450, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Grace", date: "2024-02-01", end: "2024-02-15",relate3:[],relate5: ["rect-4", "rect-5"]},
      { id: "rect-4", x: 400, y: 550, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Frank", date: "2024-02-05", end: "2024-02-17",relate3:[],relate5: []},
      { id: "rect-5", x: 500, y: 650, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Eve", date: "2024-02-17", end: "2024-02-19",relate3:[],relate5: []},
      { id: "rect-6", x: 600, y: 750, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "David", date: "2024-02-18", end: "2024-02-20",relate3:[],relate5: []},
      { id: "rect-7", x: 700, y: 850, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Carol", date: "2024-02-19", end: "2024-02-21",relate3:[],relate5: []},
      { id: "rect-8", x: 800, y: 950, width: 100, height: 50, fill: 'green', stroke: 'black' , name: "Bob", date: "2024-02-20", end: "2024-02-24",relate3:[],relate5: []}
    ];


    const dataSource =[
      {
        "id": "62569485938",
        "number": "730",
        "name": "Ivy",
        "startDate": "2024-02-05",
        "dueDate": "2024-02-20",
        "owner": "陈二kaAm",
        "status": {
          "id": 62568939426,
          "name": "待办",
          "type": 10,
          "value": "#F1F0F0"
        },
        "relate3": null,
        "relate5": [
          62569527726
        ],
        "fartherId": 0,
        "sortOrder": 730,
        "subItems": [
          {
            "id": "62569527726",
            "number": "731",
            "name": "Helen",
            "startDate": "2024-02-06",
            "dueDate": "2024-02-08",
            "owner": "陈二kaAm",
            "status": {
              "id": 62568939426,
              "name": "待办",
              "type": 10,
              "value": "#F1F0F0"
            },
            "relate3": [
              62569485938
            ],
            "relate5": [
              62569570942
            ],
            "fartherId": 0,
            "sortOrder": 731,
            "subItems": [
              {
                "id": "62569570942",
                "number": "732",
                "name": "Grace",
                "startDate": "2024-02-07",
                "dueDate": "2024-02-09",
                "owner": "陈二kaAm",
                "status": {
                  "id": 62568939426,
                  "name": "待办",
                  "type": 10,
                  "value": "#F1F0F0"
                },
                "relate3": [
                  62569527726,
                  62569527726
                ],
                "relate5": null,
                "fartherId": 0,
                "sortOrder": 732,
                "subItems": [{
                "id": "62569570949",
                "number": "732",
                "name": "Frank",
                "startDate": "2024-02-07",
                "dueDate": "2024-02-09",
                "owner": "陈二kaAm",
                "status": {
                  "id": 62568939426,
                  "name": "待办",
                  "type": 10,
                  "value": "#F1F0F0"
                },
                "relate3": [
                  62569527726,
                  62569527726
                ],
                "relate5": null,
                "fartherId": 0,
                "sortOrder": 732,
                "subItems": []
              }]
              },
              {
                "id": "625695709455",
                "number": "732",
                "name": "Bob",
                "startDate": "2024-02-07",
                "dueDate": "2024-02-09",
                "owner": "陈二kaAm",
                "status": {
                  "id": 62568939426,
                  "name": "待办",
                  "type": 10,
                  "value": "#F1F0F0"
                },
                "relate3": [
                  62569527726,
                  62569527726
                ],
                "relate5": null,
                "fartherId": 0,
                "sortOrder": 732,
                "subItems": []
              }
            ]
          }
        ]
      }
    ]


    // 将嵌套数据结构转换成扁平化的数组
function flattenTasks(data) {
  let result = [];

  function processTask(task, parentId = 0) {
    // 复制当前任务，除了 subItems
    let {subItems, ...rest} = task;
    // 添加 parentId 信息和 subItemss
    rest.fartherId = parentId;
    rest.id = "rect-" + rest.id;
    rest.subItemss = subItems ? subItems.map(item => "rect-" + item.id) : [];
    rest.x = null;
    rest.y = null;
    rest.width = null;
    rest.height = null;
    //fill: 'green', stroke: 'black'
    rest.green = 'green';
    rest.stroke = 'black';

    // 将当前任务添加到结果数组中
    result.push(rest);

    // 递归处理所有子任务
    if (subItems) {
      subItems.forEach(subItem => processTask(subItem, task.id));
    }
  }

  // 从顶级任务开始处理
  data.forEach(task => processTask(task));

  return result;
}

const flattenedTasks = flattenTasks(dataSource);





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
    const filteredRects = flattenedTasks.filter(rect => {
      const coordinates = getCoordinates(rect.name, rect.startDate, rect.dueDate);
      const storedX = localStorage.getItem(`${rect.id}-x`);

      // const storedWidth = localStorage.getItem(`${rect.id}-width`);
      // 如果存储的x坐标不为空，就使用它
      if (storedX !== null) rect.x = parseInt(storedX);
      if (coordinates) {
        // 如果找到了坐标，就在原始rect对象上设置x和y
        if (storedX == null) {
          rect.x = coordinates.x;
        }
        rect.y = coordinates.y -11;
        rect.width = coordinates.width;
        // if (storedWidth != null) {
        //   rect.width = storedWidth;
        // }
        rect.height = 75;
        return true; // 保留这个矩形数据
      } else {
        return false; // 过滤掉这个矩形数据
      }
    });

    // 创建可以拖动的矩形圈
    createDraggableRects(svg, filteredRects);



    // //创建拉动条以及覆盖的矩形
    // createSlider(svg, filteredRects);


    //左右变形拉动条
    createDeformationRectangle(svg, filteredRects);

  });