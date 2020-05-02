
const computeSums = function(columns) {
  let columnSums = []
  for(let colIndex = 0; colIndex < columns.length; colIndex++){
    const column = columns[colIndex]
    let columnSum = 0
    for(let i = 0; i < column.children.length; i++) {
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
  return columnSums
}

const designSums = function(columnSums, headers) {
  for(let headIndex = 0; headIndex < headers.length; headIndex++){
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
}

const CLASS_NAME_TO_WATCH_FOR_TRIGGERING_NEW_COMPUTATION = "lwp"
const CLASS_NAME_TO_FIND_COLUMS = "cell member-content member content"
const CLASS_NAME_TO_FIND_HEADERS = "header-container row header"

const observerMethod = function(mutations) {
  for(let i = 0; i < mutations.length; i++){

    const mutationTarget = mutations[i].target
    if(mutationTarget && mutationTarget.className === CLASS_NAME_TO_WATCH_FOR_TRIGGERING_NEW_COMPUTATION){

      const columns = document.getElementsByClassName(CLASS_NAME_TO_FIND_COLUMS)
      columnSums = computeSums(columns)
      let headers = document.getElementsByClassName(CLASS_NAME_TO_FIND_HEADERS)[0]
      if(headers){
        designSums(columnSums, headers.children)
      }
    }
  }
};

const observer = new MutationObserver(observerMethod);
observer.observe(document, {subtree : true, childList : true})

