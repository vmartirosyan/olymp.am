#include "server.h"
#include <iostream>
#include <csignal>

Server* server_instance = nullptr;

void signalHandler(int signum) {
    std::cout << "\nInterrupt signal (" << signum << ") received.\n";
    if (server_instance) {
        server_instance->stop();
    }
    exit(signum);
}

int main(int argc, char* argv[]) {
    int port = 8080;
    
    if (argc > 1) {
        port = std::atoi(argv[1]);
    }

    std::cout << "Starting Olympiad Management System Backend..." << std::endl;
    std::cout << "Port: " << port << std::endl;

    Server server(port);
    server_instance = &server;

    // Register signal handler
    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);

    server.start();

    return 0;
}
