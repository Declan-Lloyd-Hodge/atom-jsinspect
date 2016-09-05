'use babel';

export default class JsinspectView {
  error:""
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('jsinspect');
    this.element.classList.add('pane-item');
    this.element.classList.add('preview-pane');
    this.element.setAttribute('is', 'space-pen-div');

    // Create message element
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  setError(inputError){
    while (this.element.lastChild) {
        this.element.removeChild(this.element.lastChild);
    }
    var allResults = document.createElement('ol');
    allResults.classList.add('has-collapsable-children');
    allResults.classList.add('list-tree');
    allResults.classList.add('focusable-panel');
    allResults.classList.add('results-view');
    allResults.setAttribute('is', 'space-pen-ol');

    inputError.forEach(function(match){
      var resultHeading = document.createElement('div');

      resultHeading.textContent = match["instances"].length + " Similarities found in the following file(s):";
      resultHeading.classList.add('panel-heading');
      resultHeading.setAttribute('is', 'space-pen-div');
      allResults.appendChild(resultHeading);

      var firstResult = document.createElement('li');

      firstResult.setAttribute('is', 'space-pen-li');

      var firstResultTitle = document.createElement('div');

      firstResultTitle.textContent = " - " + match["instances"][0]["path"].replace("../../../","") + ":" + match["instances"][0]["lines"][0] + "," + match["instances"][0]["lines"][1];
      firstResultTitle.classList.add('path-details');
      firstResultTitle.classList.add('list-item');
      firstResultTitle.classList.add('bottom-separator');
      firstResultTitle.setAttribute('is', 'space-pen-div');

      firstResult.appendChild(firstResultTitle);
      allResults.appendChild(firstResult);

      match["diffs"].forEach(function(diff){

        var resultItem = document.createElement('li');

        resultItem.classList.add('list-nested-item');
        resultItem.classList.add('collapsed');
        resultItem.setAttribute('is', 'space-pen-li');

        var resultItemTitle = document.createElement('div');

        resultItemTitle.textContent = "+ " + diff["+"]["path"].replace("../../../","") + ":" + diff["+"]["lines"][0] + "," + diff["+"]["lines"][1];
        resultItemTitle.classList.add('path-details');
        resultItemTitle.classList.add('list-item');
        resultItemTitle.classList.add('bottom-separator');
        resultItemTitle.setAttribute('is', 'space-pen-div');

        var resultItemContent = document.createElement('ul');

        resultItemContent.classList.add('bottom-separator');
        resultItemContent.classList.add('list-tree');
        resultItemContent.setAttribute("path",diff["+"]["path"]);
        resultItemContent.setAttribute("line-number",diff["+"]["lines"][0]);
        resultItemContent.setAttribute('is', 'space-pen-ul');

        diff["diff"].split("\n").forEach(function(splitLine){
          var line = document.createElement('li');
          line.classList.add("line");
          line.classList.add("list-item");
          line.textContent += splitLine;
          resultItemContent.appendChild(line);
        });

        resultItemTitle.addEventListener("click", function(){
          this.parentElement.classList.toggle("collapsed");
          var allSelectedElements = document.querySelectorAll(".selected");
          for(var i = 0; i < allSelectedElements.length; i++){
            allSelectedElements[i].classList.remove("selected");
          }
          this.parentElement.classList.toggle("selected");
        });

        resultItem.appendChild(resultItemTitle);
        resultItem.appendChild(resultItemContent);

        allResults.appendChild(resultItem);

      });
    });
    this.element.appendChild(allResults);
  }

}
