import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/constants';
import { getAuthToken } from '../utils/auth';
import toast from 'react-hot-toast';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const token = getAuthToken();
    if (!token) return;

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('notification', (data) => {
      toast.success(data.message, {
        duration: 5000,
        position: 'top-right',
      });
    });

    this.socket.on('request_created', (data) => {
      toast.success(`New blood request: ${data.bloodGroup} needed`, {
        duration: 6000,
        position: 'top-right',
      });
    });

    this.socket.on('student_opted_in', (data) => {
      toast.success(`${data.studentName} opted in for ${data.bloodGroup} request`, {
        duration: 6000,
        position: 'top-right',
      });
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();