# coding: utf-8
from pprint import pprint
from socket import *
import struct

#Define connection (socket) parameters
#Address + Port no
#Server would be running on the same host as Client
# serverName = '149.171.37.163'
serverName = 'localhost'

#change this port number if required
serverPort = 5000

clientSocket = socket(AF_INET, SOCK_DGRAM)
#This line creates the client’s socket. The first parameter indicates the address family; in particular,AF_INET indicates that the underlying network is using IPv4.The second parameter indicates that the socket is of type SOCK_DGRAM,which means it is a UDP socket (rather than a TCP socket, where we use SOCK_STREAM).

message = b"studentmarklist\x00"

print(f"message size: {len(message)}")

clientSocket.sendto(message,(serverName, serverPort))


size = (4 + 16) * 50
data, serverAddress = clientSocket.recvfrom(size)

clientSocket.close()

# print(data)
print(data.decode('utf-8'))
# print the received message
n_students = int(data[:4])
if n_students > 50:
    print("fuck off")
    exit(1)
    
print("student count:", n_students)

STUDENT_REC_FORMAT = "16s4s"  # char[16] + unsigned long (4 bytes)
STUDENT_REC_SIZE = struct.calcsize(STUDENT_REC_FORMAT)  # 20 bytes

RESPONSE_MSG_FORMAT = f"{STUDENT_REC_FORMAT * n_students}"
RESPONSE_MSG_SIZE = struct.calcsize(RESPONSE_MSG_FORMAT)
# print(sys.getsizeof(data[4:]))
response = struct.unpack(RESPONSE_MSG_FORMAT, data[4:RESPONSE_MSG_SIZE+4])

# pprint(response)
# pprint(data.decode("utf-8"))

sorted_data = []
for i in range(n_students):
    pos = 2 * i
    name = response[pos].decode('utf-8').strip("\x00")
    sorted_data.append([name, int(response[pos + 1])])

# print(sorted_data)

print("Student marks:")
for student in sorted_data:
    print(f"{student[0]}: ({student[1]})")
    pass

