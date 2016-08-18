document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas");

  canvas.height = 500;
  canvas.width = 500;
  let context = canvas.getContext("2d");

  context.fillStyle = "beige";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "gray";
  context.fillRect((canvas.width / 3), 0, (canvas.width / 3), canvas.height);

  
});
