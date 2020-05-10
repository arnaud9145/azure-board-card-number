const CLASS_NAME_TO_WATCH_FOR_TRIGGERING_NEW_COMPUTATION = "lwp";
const CLASS_NAME_TO_FIND_SWIMLANES =
  "cell member-content member content swimlanes";
const CLASS_NAME_TO_FIND_COLUMS = "cell member-content member content";
const CLASS_NAME_TO_FIND_HEADERS = "header-container row header";
const CLASS_NAME_TO_FIND_COLUMNS_IN_SWIMLANE = "content-container row content";

const computeSums = function (columns) {
  let columnSums = [];
  for (let colIndex = 0; colIndex < columns.length; colIndex++) {
    const column = columns[colIndex];
    let columnSum = 0;
    for (let i = 0; i < column.children.length; i++) {
      const child = column.children[i];
      const pointContainers = child.getElementsByClassName("witRemainingWork");
      for (let pointContainer of pointContainers) {
        if (pointContainer.children[0].innerText !== "") {
          columnSum += parseFloat(
            pointContainer.children[0].innerText.replace(",", ".")
          );
        }
      }
    }
    columnSums.push(columnSum);
  }
  return columnSums;
};

const computeSumsBySwimelanes = function (swimlanesContainer) {
  const swimlanes = swimlanesContainer[0].children;
  const columnSums = [];
  for (let laneIndex = 0; laneIndex < swimlanes.length; laneIndex++) {
    const swimlane = swimlanes[laneIndex];
    const laneColumns = swimlane.getElementsByClassName(
      CLASS_NAME_TO_FIND_COLUMNS_IN_SWIMLANE
    );

    const columnSum = computeSums(laneColumns[0].children);
    columnSums.push(columnSum);

    const swimlaneHeader = swimlane.getElementsByClassName(
      "member-header ui-droppable"
    );
    if (
      swimlaneHeader &&
      swimlaneHeader[0] &&
      !swimlaneHeader[0].className.includes("swimlane-collapsed")
    ) {
      let pointsContainer = swimlaneHeader[0].getElementsByClassName(
        "points-container swimlane-member-header"
      )[0];
      if (!pointsContainer) {
        pointsContainer = document.createElement("DIV");
        pointsContainer.className = "points-container swimlane-member-header";
        pointsContainer.style["vertical-align"] = "top";
        pointsContainer.style["margin-top"] = "5px";
        swimlaneHeader[0].appendChild(pointsContainer);
      }
      pointsContainer.innerHTML = "";
      for (let i = 0; i < columnSum.length; i++) {
        const span = document.createElement("SPAN");
        span.className = "limit";
        span.style.color = "white";
        span.style.backgroundColor = "#47bae0";
        span.style.padding = "1px 4px";
        span.style["border-radius"] = "4px";
        span.style["font-weight"] = "normal";
        span.style["font-size"] = "12px";
        span.style["margin-left"] = i === 0 ? "75px" : "208px";
        const textnode = document.createTextNode(columnSum[i]);
        span.appendChild(textnode);
        pointsContainer.appendChild(span);
      }
    }
  }
  return columnSums;
};

const designSums = function (columnSums, headers) {
  for (let headIndex = 0; headIndex < headers.length; headIndex++) {
    const header = headers[headIndex];
    const topcount = header.getElementsByClassName("limit");
    if (topcount.length > 0) {
      topcount[0].innerText = columnSums[headIndex];
      topcount[0].style.color = "white";
      topcount[0].style.backgroundColor = "#47bae0";
      topcount[0].style.padding = "1px 5px";
      topcount[0].style["border-radius"] = "5px";
      topcount[0].style["font-weight"] = "normal";
      topcount[0].style["margin-left"] = "5px";
      topcount[0].style["font-size"] = "18px";
    } else {
      const lastHeader = header.getElementsByClassName(
        "click-to-edit horizontal"
      );
      const container = document.createElement("DIV");
      container.className = "container";
      const span = document.createElement("SPAN");
      span.className = "limit";
      span.style.color = "white";
      span.style.backgroundColor = "#47bae0";
      span.style.padding = "1px 5px";
      span.style["border-radius"] = "5px";
      span.style["font-weight"] = "normal";
      span.style["font-size"] = "18px";
      span.style["position"] = "absolute";
      const textnode = document.createTextNode(columnSums[headIndex]);
      span.appendChild(textnode);
      container.appendChild(span);
      lastHeader[0].appendChild(container);
    }
  }
};

const combineLaneSums = function (columnSumsBySwimlanes) {
  const columnSums = columnSumsBySwimlanes[0];
  for (let index = 1; index < columnSumsBySwimlanes.length; index++) {
    columnSumsBySwimlanes[index].forEach((sum, i) => {
      columnSums[i] += sum;
    });
  }

  return [0, ...columnSums];
};

const observerMethod = function (mutations) {
  for (let i = 0; i < mutations.length; i++) {
    const mutationTarget = mutations[i].target;
    if (
      mutationTarget &&
      mutationTarget.className ===
        CLASS_NAME_TO_WATCH_FOR_TRIGGERING_NEW_COMPUTATION
    ) {
      const swimlanes = document.getElementsByClassName(
        CLASS_NAME_TO_FIND_SWIMLANES
      );
      const columns = document.getElementsByClassName(
        CLASS_NAME_TO_FIND_COLUMS
      );
      if (swimlanes.length > 0) {
        const columnSumsBySwimlanes = computeSumsBySwimelanes(swimlanes);
        const columnSums = combineLaneSums(columnSumsBySwimlanes);

        const lastColumnSum = computeSums([columns[columns.length - 1]])[0];
        columnSums.push(lastColumnSum);
        let headers = document.getElementsByClassName(
          CLASS_NAME_TO_FIND_HEADERS
        )[0];
        if (headers) {
          designSums(columnSums, headers.children);
        }
      } else {
        const columnSums = computeSums(columns);
        let headers = document.getElementsByClassName(
          CLASS_NAME_TO_FIND_HEADERS
        )[0];
        if (headers) {
          designSums(columnSums, headers.children);
        }
      }
    }
  }
};

const observer = new MutationObserver(observerMethod);
observer.observe(document, { subtree: true, childList: true });
