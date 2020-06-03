
var getUserMedia = ( function () {
  if (navigator.getUserMedia) {
    return navigator.getUserMedia.bind(navigator)
  }
  if (navigator.webkitGetUserMedia) {
    return navigator.webkitGetUserMedia.bind(navigator)
  }
  if (navigator.mozGetUserMedia) {
    return navigator.mozGetUserMedia.bind(navigator)
  }
}) ();

function onReceiveStream(stream) {
  var audio = document.querySelector('audio');
  console.log(audio);

  audio.srcObject = stream;
  audio.onloadedmetadata = function (e) {
    console.log("");
    audio.play();
  }
}

function call() {
  var personToCall = document.getElementById('destinationid').value;
  console.log('in call with ' + personToCall);

  var peer = new Peer();
  getUserMedia(
    {
      video: false,
      audio: true,
    },
    function (stream) {
      var call = peer.call(personToCall, stream);
      call.on('stream', function (remoteStream) {
        console.log(remoteStream);
        onReceiveStream(remoteStream);
      });
    },
    function (err) {
      console.log('failed', err);
    }
  );
}

function generate() {
  var peer = new Peer();
  peer.on('open', function(id) {
    document.getElementById('peerid').innerHTML = id;
  });

  peer.on('call', function(call) {
    getUserMedia(
      {
        video: false,
        audio: true
      },
      function(stream) {
        console.log('in call');
        call.answer(stream);
        call.on('stream', function(remoteStream) {
          console.log('remoteStream');
          onReceiveStream(remoteStream);
        });
      },
      function(err) {
        console.log('failed', err)
      }
    );
  });
}

