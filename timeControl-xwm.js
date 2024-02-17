import {sharedState} from './common.js';

import {initializeOrUpdateChart} from './initializeOrUpdateChart.js';

export function timeControl(svg, rects) {

  const margin = {top: 20, right: 20, bottom: 30, left: 20};
  let width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;
  const container = document.querySelector('.svg-container');
  const xAxisYPosition = margin.top + 60; // 定义x轴的垂直位置+10
  let startDate, endDate, months, chineseLocale, chineseTimeFormat;
  let xScale, xAxis;

  // 根据选中的视图类型更新图表
  function updateChart(viewType) {


    // 先清除之前的图表内容
    svg.selectAll('*').remove();

    let plus = parseInt(sharedState.totalDay(viewType) / 2);
    // if (viewType === 'week') {
    //   plus = 4;
    // }

    startDate = new Date(new Date().getTime() - plus * 24 * 60 * 60 * 1000);  // 开始日期
    endDate = new Date(new Date().getTime() + plus * 24 * 60 * 60 * 1000); // 结束日期，40天后
    svg.selectAll('*').remove();
    svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
    svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签

    //let initday = getinitday();
    let distanceBetweenTicks = getonetick();
    ////svg.setAttribute('width', parseInt(svg.getAttribute("width")));
    svg.attr('width', sharedState.totalDay(viewType)*distanceBetweenTicks);
    width = +svg.attr('width') - margin.left - margin.right;

    switch (viewType) {
      case 'day':
        // ... 你的天视图逻辑 ...
        break;
      case 'week':
        chineseLocale = d3.timeFormatLocale({
          "dateTime": "%a %b %e %X %Y",
          "date": "%Y/%-m/%-d",
          "time": "%H:%M:%S",
          "periods": ["上午", "下午"],
          "days": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
          "shortDays": ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
          "months": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          "shortMonths": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        });
        xScale = d3.scaleTime()
          .domain([startDate, endDate])
          .range([margin.left, width - margin.right]);
        chineseTimeFormat = chineseLocale.format("%a %d");
        xAxis = d3.axisTop(xScale)
          .ticks(d3.timeDay.every(1))
          .tickFormat(chineseTimeFormat); // 使用中文格式化函数
        svg.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(0,${xAxisYPosition})`)
          .call(xAxis);

// 添加月份标签
        months = xScale.ticks(d3.timeMonth.every(1));
        months.forEach(month => {
          svg.append('text')
            .attr('class', 'month-label')
            .attr('x', xScale(month))
            .attr('y', margin.top+35) // 适当调整y坐标值
            .text(chineseLocale.format('%Y年%m月')(month)); // 使用中文格式化函数
        });
        weekdrawAxis(svg);
        break;
      case 'month':
        // 创建x轴的时间比例尺
        xScale = d3.scaleTime()
          .domain([startDate, endDate])
          .range([0, width]);

        // 绘制x轴，每天显示一个刻度
        xAxis = d3.axisTop(xScale)
          .ticks(d3.timeDay.every(1))
          .tickFormat(d3.timeFormat('%d'))
          .tickSizeOuter(0);

        // 添加x轴到SVG，并设置周末刻度文字颜色
        const gXMonth = svg.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(0,${xAxisYPosition})`)
          .call(xAxis);

        gXMonth.selectAll('.tick text')
          .classed('weekend-text', d => d.getDay() === 0 || d.getDay() === 6);

        // 添加月份标签
        months = xScale.ticks(d3.timeMonth.every(1));
        months.forEach((month, i) => {
          gXMonth.append('text')
            .attr('class', 'month-label')
            .attr('x', xScale(month))
            .attr('y', margin.top+35) // 确保这个值将标签放在视图内
            .text(d3.timeFormat('%Y年%m月')(month));
        });
        monthdrawAxis(svg);
        break;
      case 'quarter':
        // 设置x轴的时间比例尺，覆盖半年时间
        xScale = d3.scaleTime()
          .domain([startDate, endDate])
          .range([0, width]);

        // 绘制坐标轴
        quarterdrawAxis();
        //container.scrollLeft = xScale(today) - container.offsetWidth / 2; // 滚动到今天

        //quarterdrawAxis();
        break;
    }
    sharedState.setxScale(xScale);
    // 保存日期的x坐标
    const dates = d3.timeDay.range(startDate, endDate); // 生成开始日期和结束日期之间的每一天
    dates.forEach(date => {
      const x = xScale(date);
      sharedState.setCoordinates(d3.timeFormat("%Y-%m-%d")(date), {x});
      console.log(`Saving coordinates for key: ${d3.timeFormat("%Y-%m-%d")(date)}`, x);
    });

//     const currentDate = new Date();
//     const currentXPosition = xScale(currentDate);
//     svg.selectAll('[id^="date-line-"]').remove();
// // 在SVG中添加红色垂直线
//     svg.append('line')
//       .attr('x1', endX)
//       .attr('x2', endX)
//       .attr('y1', 71)
//       .attr('y2', 2000)
//       .attr('stroke', 'red')
//       .attr('stroke-width', 2)
//       .attr('id', `date-line-${uniqueRandomNumber}`); // 添加唯一ID

    dateLine();

  }

  function redraw() {
    let viewtype = document.getElementById('timeframe-select').value;
    if (viewtype === 'quarter') {
      quarterdrawAxis();
    } else if (viewtype === 'month') {
      monthdrawAxis();
    } else if (viewtype === 'week') {
      weekdrawAxis();
    }
  }

  function getinitday() {
    let initday = 0;
    let viewtype = document.getElementById('timeframe-select').value;
    if (viewtype === 'quarter') {
      initday = 90;
    } else if (viewtype === 'month') {
      initday = 40;
    } else if (viewtype === 'week') {
      initday = 10;
    }
    return initday;
  }

  function getplusday() {
    let plus = 0;
    let viewtype = document.getElementById('timeframe-select').value;
    if (viewtype === 'quarter') {
      plus = 90;
    } else if (viewtype === 'month') {
      plus = 30;
    } else if (viewtype === 'week') {
      plus = 7;
    }
    return plus;
  }

  function getonetick() {
    let tick = 0;
    let viewtype = document.getElementById('timeframe-select').value;
    if (viewtype === 'quarter') {
      tick = 20;
    } else if (viewtype === 'month') {
      tick = 65;
    } else if (viewtype === 'week') {
      tick = 240;
    }
    return tick;
  }

  function gettickplus() {
    let tickplus = 0;
    let viewtype = document.getElementById('timeframe-select').value;
    if (viewtype === 'quarter') {
      tickplus = 5;
    } else if (viewtype === 'month') {
      tickplus = 17;
    } else if (viewtype === 'week') {
      tickplus = 5;
    }
    return tickplus;
  }

  function leftscroll() {
    let plus = getplusday();
    let tickplus = gettickplus();

    //startDate.setDate(startDate.getDate() + plus); // 向右滚动一天
    startDate.setDate(startDate.getDate() - plus);
    let distanceBetweenTicks = getonetick();
    let myrange = xScale.range()
    ////svg.setAttribute('width', parseInt(svg.getAttribute("width")));
    svg.attr('width', parseInt(svg.attr("width"))+tickplus*distanceBetweenTicks);
    xScale.domain([startDate, endDate])
      .range([myrange[0], myrange[1]+tickplus*distanceBetweenTicks]); // 设置比例尺的值域为SVG的宽度;
    redraw();
    container.scrollLeft -= 100;
    updateCoordinates(); // 更新坐标
    dateLine();
    initializeOrUpdateChart(false);
  }

// function getDistanceBetweenTicks(){
//   // 获取相邻时间刻度之间的距离
//   const tickValues = xScale.ticks(); // 获取所有的刻度值
//   let distanceBetweenTicks = 0;
//   if (tickValues.length > 1) {
//     distanceBetweenTicks = xScale(tickValues[1]) - xScale(tickValues[0]); // 计算相邻刻度的像素距离
//   }
//   return distanceBetweenTicks;
// }

  function rightscroll() {
    let plus = getplusday();
    let tickplus = gettickplus();

    //startDate.setDate(startDate.getDate() + plus); // 向右滚动一天
    endDate.setDate(endDate.getDate() + plus);
    let distanceBetweenTicks = getonetick();
    let myrange = xScale.range()
    ////svg.setAttribute('width', parseInt(svg.getAttribute("width")));
    svg.attr('width', parseInt(svg.attr("width"))+tickplus*distanceBetweenTicks);
    xScale.domain([startDate, endDate])
        .range([myrange[0], myrange[1]+tickplus*distanceBetweenTicks]); // 设置比例尺的值域为SVG的宽度;
    redraw();
    container.scrollLeft += 100;
    updateCoordinates(); // 更新坐标
    dateLine();
    initializeOrUpdateChart(false);
  }

  function todayclick() {
    const today = new Date();
    const todayPosition = xScale(today);
    container.scrollLeft = todayPosition - container.clientWidth / 2 + margin.left;
    updateCoordinates(); // 更新坐标
    initializeOrUpdateChart(false);
  }

  function monthdrawAxis() {
    // 移除已有的轴和标签
    svg.selectAll('g.axis').remove();
    svg.selectAll('.month-label').remove();

    svg.selectAll('*').remove();
    svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
    svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签

    // Adjusted margin top to create space for month labels
    const axisTopMargin = margin.top + 20; // Add more space for month labels above the axis

    // Create new axis
    const gX = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${xAxisYPosition})`)
      .call(xAxis);

    // Set the color for weekend text labels
    gX.selectAll('.tick text')
      .style('fill', function (d) {
        return (d.getDay() === 0 || d.getDay() === 6) ? 'lightgrey' : 'black';
      });

    // Add new month labels above the axis line
    xScale.ticks(d3.timeMonth.every(1)).forEach(function (month) {
      svg.append('text')
        .attr('class', 'month-label')
        .attr('x', xScale(month))
        .attr('y', margin.top +35) // Adjust this value to move label above the axis
        .text(d3.timeFormat('%Y年%m月')(month));
    });
  }

  function weekdrawAxis() {
    // 移除旧的轴和标签
    svg.selectAll('g.axis').remove();
    svg.selectAll('.month-label').remove();

    svg.selectAll('*').remove();
    svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
    svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签

    // 绘制新的轴
    const gX = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${xAxisYPosition})`)
      .call(xAxis);

    // 设置周末日期的文本颜色
    gX.selectAll('.tick text')
      .style('fill', function (d) {
        return (d.getDay() === 0 || d.getDay() === 6) ? 'lightgrey' : 'black';
      });

    // 重新绘制月份标签
    xScale.ticks(d3.timeMonth.every(1)).forEach(function (month) {
      svg.append('text')
        .attr('class', 'month-label')
        .attr('x', xScale(month))
        .attr('y', margin.top)
        .text(chineseLocale.format('%Y年%m月')(month));
    });
  }

  function quarterdrawAxis() {
    svg.selectAll('*').remove();
    svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
    svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签
    // 移除旧的轴和标签
    svg.selectAll('g.axis').remove();
    svg.selectAll('.month-label').remove();

    // 计算每7天一个刻度的值
    const everySevenDays = d3.utcDay.range(startDate, d3.utcDay.offset(endDate, 1)).filter(function (d) {
      return d.getUTCDay() === 1;
    });

    const xAxis = d3.axisTop(xScale)
      .tickSizeInner(6)
      .tickSizeOuter(0)
      .tickPadding(6)
      .tickValues(everySevenDays) // 使用每7天的刻度值
      .tickFormat(d3.timeFormat('%-d')); // 仅格式化日期

    const gX = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${xAxisYPosition})`)
      .call(xAxis);

    // 添加年月标签
    const firstDayOfMonths = xScale.ticks(d3.timeMonth);
    firstDayOfMonths.forEach((firstDayOfMonth) => {
      svg.append('text')
        .attr('class', 'year-month-label')
        .attr('x', xScale(firstDayOfMonth))
        .attr('y', margin.top + 35) // 适当调整y坐标值，使标签出现在时间轴上方
        .text(d3.timeFormat('%Y年%m月')(firstDayOfMonth))
        .attr('text-anchor', 'middle'); // 文本居中对齐
    });
  }

  function updateCoordinates() {
    sharedState.clearCoordinates(); // 清除之前的坐标
    const dates = d3.timeDay.range(startDate, endDate); // 生成开始日期和结束日期之间的每一天
    dates.forEach(date => {
      const x = xScale(date); // 使用xScale来获取每个日期的x坐标
      sharedState.setCoordinates(d3.timeFormat("%Y-%m-%d")(date), {x}); // 更新sharedState中的坐标
      console.log(`Updating coordinates for key: ${d3.timeFormat("%Y-%m-%d")(date)}`, x);
    });
  }

  function generateUniqueRandomNumber() {
    return Date.now() + Math.floor(Math.random() * 1000000);
  }

  // 调用函数生成唯一随机数
  var uniqueRandomNumber = generateUniqueRandomNumber();

  function dateLine() {
    svg.selectAll('[id^="date-line-"]').remove();
    const currentDate = new Date();
    const endX = sharedState.getCoordinates(d3.timeFormat("%Y-%m-%d")(currentDate))?.x;

    // 在SVG中添加红色垂直线
    svg.append('line')
      .attr('x1', endX)
      .attr('x2', endX)
      .attr('y1', 71)
      .attr('y2', 2000)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('id', `date-line-${uniqueRandomNumber}`); // 添加唯一ID
  }

  function timeframechange() {
    let viewtype = document.getElementById('timeframe-select').value;
    svg.selectAll('*').remove();
    svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
    svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签
    updateChart(viewtype);
    rects.forEach(rect => {
      localStorage.removeItem(`${rect.id}-x`);
    });
    sharedState.clearCoordinates();
    updateCoordinates(); // 更新坐标
    initializeOrUpdateChart(false);
  }

  // 绑定下拉框事件
  document.getElementById('timeframe-select').addEventListener('change', timeframechange);


  // 向左滚动按钮事件处理器
  document.getElementById('scroll-left').addEventListener('click', leftscroll);

// 向右滚动按钮事件处理器
  document.getElementById('scroll-right').addEventListener('click', rightscroll);

  document.getElementById('today-button').addEventListener('click', todayclick);

  setTimeout(() => {
    timeframechange();
  }, 10);

}
