//work on GET AJAX calls note fucnion call is // in the doc
//ready and in the post function. see pet hotel


$(document).ready(function () {
  getList();

$('#form').on('click', '#task-submit',  postTask);
$('#task-list').on('click', '#update', updateTask);
$('#task-list').on('click', '#delete', deleteTask);

});
//GET info from todo database tasks table
function getList() {
  $.ajax({
    type: "GET",
    url: "/list",
    success: function(tasks){
      console.log('GET tasks worked');
      tasks.forEach(function(task){
        // console.log('task id', id);
        $('#task-list').parent().children().last().append('<tr class="row">' + '<td class = "task-cont">'  + task.task + '</td>' + '<td class ="comp-cent">&#10060;</td>' +
        '<td><button id="update">Complete Task</button></td>' + '<td><button id="delete">Remove</button></td>' + '<td id="rowId">' + task.id + '</td>' + '</tr>');

      });
    },
    error: function(response){
      console.log("GET /list fail");
    },
  });
}

// //send tasks to the database from form
function postTask () {
  event.preventDefault();
//task object
var task ={};
$.each($('#form').serializeArray(),function (i, field) {
  task[field.name] = field.value;
  console.log('task', task);
});
$.ajax({
  type: "POST",
  url: "/list",
  data: task,
  success: function () {
    console.log('POST/ list works');
    // $('#form').empty();
    getList();
    location.reload();
  },
  error: function(response){
    console.log('POST /list does not work');
  },
});

}
// .children().last().data();
function deleteTask () {
  var conf = confirm("are you sure");
  //selector to find the tr data for id
  var taskId = $(this).closest('tr').find("#rowId").text();
  //row id into object sent as data idObject
  var idObject={};
  idObject.id = taskId;
  console.log('taskId', taskId);
  $.ajax({
    type: 'POST',
    url: '/list/delete/',
    data: idObject,
    success: function () {
      console.log("DELETE success");
      // $('#task-list').empty();

      getList();
      location.reload();
    },
    error: function(){
      console.log("DELETE Failed");
    },
  });
}

function updateTask(){
  var taskId = $(this).closest('tr').find("#rowId").text();
  console.log('taskID update', taskId);
  var idObject = {};
  idObject.id = taskId;
    $(this).closest('tr').find('.comp-cent').text("✅");
    $(this).parent().parent().addClass("color");
  $.ajax({
    type: 'PUT',
    url:'/list/update/',
    data: idObject,
    success: function () {
      console.log("UPDATE success");
      // getList();
      // location.reload();
    },
    error: function () {
      console.log("UPDATE FAILED");
    },
  });
}
