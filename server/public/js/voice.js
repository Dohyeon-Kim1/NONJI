const socket = io();
const roomID = window.location.pathname.split('/').pop();
document.getElementById('roomID').textContent = roomID;
socket.emit('join-room', roomID);

let localStream;
let peerConnection;
const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

const startBtn = document.getElementById('startCall');
const endBtn = document.getElementById('endCall');
const remoteAudio = document.getElementById('remoteAudio');

startBtn.onclick = async () => {
  startBtn.disabled = true;
  endBtn.disabled = false;

  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  peerConnection = new RTCPeerConnection(config);

  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) socket.emit('candidate', { roomID, candidate: e.candidate });
  };
  peerConnection.ontrack = (e) => {
    remoteAudio.srcObject = e.streams[0];
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', { roomID, offer });
};

endBtn.onclick = () => {
  peerConnection.close();
  peerConnection = null;
  localStream.getTracks().forEach(track => track.stop());
  localStream = null;
  startBtn.disabled = false;
  endBtn.disabled = true;
};

socket.on('offer', async ({ offer }) => {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(config);
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = (e) => {
      if (e.candidate) socket.emit('candidate', { roomID, candidate: e.candidate });
    };
    peerConnection.ontrack = (e) => {
      remoteAudio.srcObject = e.streams[0];
    };
  }

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', { roomID, answer });
});

socket.on('answer', async ({ answer }) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', async ({ candidate }) => {
  if (peerConnection) {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('ICE 추가 에러:', err);
    }
  }
});