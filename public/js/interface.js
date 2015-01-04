function loadPosts() {
  $.get('http://localhost:3000/posts', function(data) {
      $.each(data, function(index, post) {
          $('.post-post').prepend('<li class="post-body">' + post.body + '<p class="post-user">' + post.createdAt + 
            '<br><br><button class="delete" data-id=' + post._id + ' type="submit">Delete</button></p></li>').fadeIn('slow');
      });
  });
}

function makePost() {
  var body = $('#body').val();
      $.post('http://localhost:3000/posts', {post: body}, function(data) {
          socket.emit('new-post', data);
      });
}

function validLogin() {
  var email = $('#email').val();
  var password = $('#password').val();
  $.ajax({
    type: "POST",
    url: "/sessions",
    data: {email: email, password: password},
    cache: false,
    success: function(res) {
      var page = $(location).attr('href');
      if(res.result == 'correct') {
          $('#signin').fadeOut('slow', function() {
              $(document.body).load(page, function() {
                $('.tempMessages').append('<section class="flash notice">' + res.message + '</section>');
                  setTimeout(function() {
                    $('.flash').remove().fadeOut('slow')}, 5000);
              }).fadeIn('slow')
            });
      }
      else {
          console.log('fail');
          return false;
      }
    }
  });
}

function signup() {
  var email = $('#email').val();
  var password = $('#password').val();
  var fullname = $('#name').val();
  var username = $('#username').val();
  $.ajax({
    url: '/users',
    type: 'POST',
    data: {email: email, password: password, fullname: fullname,
      username: username},
    success: function(result) {
      var page = $(location).attr('href');
      if(result == 'correct') {
        $('#signup').fadeOut('slow', function() {
          $(document.body).load(page).fadeIn('slow');
        });
      }
      else {
        console.log('fail');
        return false;
      }
    }
  });
}
    

function logout() {
  $.ajax({
    url: '/sessions',
    type: 'DELETE',
    success: function(result) {
      var page = $(location).attr('href');
      if(result == 'correct') {
        $(document.body).load(page).fadeIn('slow');
      }
    }
  });
}

function deletePost(post) {
  var _id = $(post).data('id')
  $.ajax({
      url: '/posts',
      type: 'DELETE',
      data: {id: _id},
      success: function(result) {
        if(result == 'correct') {
          console.log(_id);
          socket.emit('delete-post', _id);
        }
      }
  });
}

$(document).ready(function() {

  $('#submit').on('click', function(event) {
    event.preventDefault();
    makePost();
  });
      
  $("#login").on('click', function(event) {
    event.preventDefault();
    validLogin();       
  });

  $('#logout').on('click', function(event) {
    event.preventDefault();
    logout();
  });

  $('#new-user').on('click', function(event) {
    event.preventDefault();
    signup();
  });

  $('.post-post').on('click', '.delete', function() {
    deletePost(this);  
  });
});
