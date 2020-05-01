chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript({
    code: `
      const columns = document.getElementsByClassName("cell member-content member content")
      let columnSums = []
      for(let colIndex = 0; colIndex < columns.length; colIndex++){
        const column = columns[colIndex]
        let columnSum = 0
        for(let i = 1; i < column.children.length; i++) {
          const child = column.children[i]
          const pointContainers = child.getElementsByClassName("witRemainingWork")
          for(let pointContainer of pointContainers) {
            if(pointContainer.children[0].innerText !== '') {
              columnSum += parseFloat(pointContainer.children[0].innerText.replace(',', '.'))

            }
          }
        }

        columnSums.push(columnSum)
      }
      const headers = document.getElementsByClassName("header-container row header")[0].children
      for(let headIndex = 0; headIndex < headers.length; headIndex++){
        console.log(headIndex)
        const header = headers[headIndex]
        const topcount = header.getElementsByClassName("limit")
        if(topcount.length > 0) {
          topcount[0].innerText = columnSums[headIndex]
          topcount[0].style.color="white"
          topcount[0].style.backgroundColor = "#47bae0"
          topcount[0].style.padding = "1px 5px"
          topcount[0].style["border-radius"]= "5px"
          topcount[0].style["font-weight"]= "normal"
          topcount[0].style["margin-left"]= "5px"
          topcount[0].style["font-size"]= "18px"
        }
      }

    `,
  });
});
