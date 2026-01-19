#ifndef SERVER_H
#define SERVER_H

#include <string>
#include <functional>

class Server {
public:
    Server(int port);
    ~Server();
    
    void start();
    void stop();
    
    int getPort() const { return port_; }

private:
    int port_;
    int server_fd_;
    bool running_;
    
    void handleClient(int client_socket);
    std::string parseRequest(const std::string& request);
    std::string buildResponse(const std::string& body, const std::string& content_type = "text/plain", int status = 200);
};

#endif // SERVER_H
