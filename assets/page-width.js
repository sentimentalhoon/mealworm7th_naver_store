(function () {
  var width = new URLSearchParams(window.location.search).get("w");
  if (["840", "640", "400"].indexOf(width) !== -1) {
    document.documentElement.dataset.pageWidth = width;
  }
}());
