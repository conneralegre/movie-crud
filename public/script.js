$('#poster').on("input", function () {
  var imgInput = this.value;
  $('#output').html('<img class="pull-left movieImage" width="300px" height="350px" src="' + imgInput + '"/>');
});