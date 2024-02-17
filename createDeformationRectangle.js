import {updatePathPositions, updateLinks, updateText} from './circleDraggableRects.js'


export function createDeformationRectangle(svg, rects) {

  rects.forEach(rect => {
    let id = rect.id.replace("rect-", "");


    const rightAnchorArea = svg.append("rect")
      .attr("id", `right-anchor-${id}`)
      .attr("x", rect.x + rect.width - 3)
      .attr("y", rect.y)
      .attr("width", 6)
      .attr("height", rect.height)
      .style("fill", "black")
      .style("display", "none")
      .style("cursor", "ew-resize")
      .call(d3.drag().on("drag", function (event) {
        dragRightAnchor(event, rect);
      }).on('end', function (event) {
        rightdragEnded(event, rect)
      }));


    const leftAnchorArea = svg.append("rect")
      .attr("id", `left-anchor-${id}`)
      .attr("x", rect.x - 3)
      .attr("y", rect.y)
      .attr("width", 6)
      .attr("height", rect.height)
      .style("fill", "black")
      .style("display", "none")
      .style("cursor", "ew-resize")
      .call(d3.drag().on("drag", function (event) {
        dragLeftAnchor(event, rect);
      }).on('end', function (event) {
        leftdragEnded(event, rect)
      }));

    leftAnchorArea.on("mouseover", function () {
      leftAnchorArea.style("display", "block");
      // leftAnchorArea.style("cursor", "ew-resize");
      rightAnchorArea.style("display", "block");
      // rightAnchorArea.style("cursor", "ew-resize");
    })
      .on("mouseout", function () {
        leftAnchorArea.style("display", "none");
        rightAnchorArea.style("display", "none");
      });

    rightAnchorArea.on("mouseover", function () {
      leftAnchorArea.style("display", "block");
      leftAnchorArea.style("cursor", "ew-resize");
      rightAnchorArea.style("display", "block");
      rightAnchorArea.style("cursor", "ew-resize");
    })
      .on("mouseout", function () {
        leftAnchorArea.style("display", "none");
        rightAnchorArea.style("display", "none");
      });

    // svg.select(`#rect-${id}`).on("mouseover", function () {
    //   leftAnchorArea.style("display", "block");
    //   // leftAnchorArea.style("cursor", "ew-resize");
    //   rightAnchorArea.style("display", "block");
    //   // svg.select(`#circle-right-${id}`).style("display", "block");
    //   // rightAnchorArea.style("cursor", "ew-resize");
    // })
    //   .on("mouseout", function () {
    //     leftAnchorArea.style("display", "none");
    //     rightAnchorArea.style("display", "none");
    //     // svg.select(`#circle-right-${id}`).style("display", "none");
    //   });
    //
    //
    // svg.append('rect')
    //   .attr('id',`rect-right-${id}`)
    //   .attr('x', rect.x+rect.width) // 设置为矩形的右上角X坐标
    //   .attr('y', rect.y+rect.height/2-20) // 设置为矩形的中点Y坐标
    //   .attr('width', 50)
    //   .attr('height', 50)
    //   .style("fill", "transparent")
    //   // .style("display", "none")
    //   // .attr('fill', 'red')
    //   // .call(d3.drag()
    //   .on('mouseover', mouseover_rectright) // 定义开始拖拽的行为
    //   .on('mouseout', mouseout_rectright);


  });


  function dragRightAnchor(event, rect) {
    var newWidth = Math.max(10, event.x - rect.x);
    rect.width = newWidth;
    d3.select(`#rect-${rect.id}`).attr("width", newWidth);
    updateRelatedElements(rect);
    updatePathPositions(svg, rect.id.replace("rect-", "") + "");
    updateText(svg,rect);
  }

  function dragLeftAnchor(event, rect) {
    var newWidth = Math.max(10, rect.x + rect.width - event.x);
    var newX = rect.x + rect.width - newWidth;
    rect.x = newX;
    rect.width = newWidth;
    d3.select(`#rect-${rect.id}`)
      .attr("x", newX)
      .attr("width", newWidth);
    updateRelatedElements(rect);
    updatePathPositions(svg, rect.id.replace("rect-", "") + "");
    updateText(svg,rect);
  }

  function leftdragEnded(event, rect) {
    updatePathPositions(svg, rect.id.replace("rect-", "") + "", true);
  }

  function rightdragEnded(event, rect) {
    updatePathPositions(svg, rect.id.replace("rect-", "") + "", true);
  }


  function updateRelatedElements(rect) {
    let id = rect.id.replace("rect-", "")
    // 更新当前拖动的矩形的位置
    d3.select(`#right-anchor-${id}`).attr("x", rect.x + rect.width - 3);
    d3.select(`#left-anchor-${id}`).attr("x", rect.x - 3);
    d3.selectAll(`#${rect.id}`)
      .attr('x', rect.x)
      .attr('y', rect.y)
      .attr('width', rect.width)
      .attr('height', rect.height);

    d3.selectAll(`.circle-right-${id}`)
      .attr('cx', rect.x + rect.width + 8) // 更新为矩形的右上角X坐标
      .attr('cy', rect.y + rect.height / 2); // 更新为矩形的中点Y坐标

    updateLinks(svg, rects)
  }

  // function mouseover_rectright(event){
  //   let id = event.currentTarget.id.replace("rect-right-","").replace("circle-right-","")
  //   svg.selectAll(`#circle-right-${id}`).attr('style', 'display:block');
  //   // d3.select(this).attr('style', 'display:block');
  // }
  //
  // function mouseout_rectright(event){
  //   let id = event.currentTarget.id.replace("rect-right-","").replace("circle-right-","")
  //   svg.selectAll(`#circle-right-${id}`).attr('style', 'display:none');
  //   // d3.select(this).attr('style', 'display:none');
  // }


}

