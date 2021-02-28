/// <reference path="jquery-3.3.1.min.js" />

var socket;
var fileName;
$(document).ready(function () {
    socket = io.connect('http://localhost:8080');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    socket.on('typing', feedback);
    socket.on('fileUpload', sendFile);

    $('#send').click(sendMessage);
    $('#message').keypress(processEnterPress);
    $('#message').on('keydown', processKeyDown);
    $('#uploadFile').on('change', uploadFile);
});

function uploadFile(e) {
    let file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (event) => {
        fileName = event.target.result
    };
    fileReader.readAsDataURL(file);
};

function addUser() {
    socket.emit('adduser', prompt("Type Your Name!!"));
}

function processMessage(username, data) {
    document.querySelector('#feedback').innerHTML = '';
    document.querySelector('#output_msg').innerHTML += '<b>' + username + ': </b>' + data + '<br>';
}


function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<li>' + key + '</li>');
    });
}

function sendMessage() {
    var message = $('#message').val();
    if (message != "") {
        $('#message').val('');
        socket.emit('sendchat', message);
        $('#message').focus();
        $('#message').val('');


    } else if (fileName != "") {
        sendImage(message, fileName)
        fileName = "";
        $('#message').focus();
        $('#message').val('');

    } else {
        $('#message').val('');
        $('#message').focus();

    }

    
}


function sendFile(username, data, imgurl) {
    document.querySelector('#feedback').innerHTML = '';
    let label = document.createElement('label');
    let img = document.createElement('img');
    let text = document.createElement('p');

    text.innerHTML = data;
    label.innerHTML = username;
    label.setAttribute('id', 'userHeading');
    text.setAttribute('id', 'msg');
    img.setAttribute('id', 'userImg');

    img.src = imgurl;
    let br = document.createElement('br');

    document.querySelector('#output_msg').appendChild(label);
    document.querySelector('#output_msg').appendChild(text);
    document.querySelector('#output_msg').appendChild(img);
    document.querySelector('#output_msg').appendChild(br);

    document.querySelector('#uploadFile').value = "";

    $('#feedback').html('');
}



function sendImage(message, fileName) {
    socket.emit('fileUpload', message, fileName);
}
function processEnterPress(e) {
    if (e.which == 13) {
        e.preventDefault();
        sendMessage();
    }
}
function processKeyDown() {
    socket.emit('typing', '');
}

function feedback(data) {
    $('#feedback').html('<p>' + data + ' is typing a message...</p>');
}
