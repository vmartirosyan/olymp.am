#include "api_handler.h"
#include <sstream>
#include <vector>

std::string ApiHandler::handleRequest(const std::string& method, const std::string& path, const std::string& body) {
    // Handle different API endpoints
    if (path == "/api/health" || path == "/api/health/") {
        return handleHealth();
    } else if (path == "/api/problems" || path == "/api/problems/") {
        return handleGetProblems();
    } else if (path == "/api/users" || path == "/api/users/") {
        return handleGetUsers();
    } else {
        return "{\"error\":\"Endpoint not found\",\"status\":404}";
    }
}

std::string ApiHandler::handleHealth() {
    return "{\"status\":\"ok\",\"message\":\"Server is running\"}";
}

std::string ApiHandler::handleGetProblems() {
    // Return sample problems data
    return "{"
           "\"problems\":["
           "{\"id\":1,\"title\":\"Two Sum\",\"difficulty\":\"easy\"},"
           "{\"id\":2,\"title\":\"Binary Search\",\"difficulty\":\"medium\"},"
           "{\"id\":3,\"title\":\"Graph Traversal\",\"difficulty\":\"hard\"}"
           "]"
           "}";
}

std::string ApiHandler::handleGetUsers() {
    // Return sample users data
    return "{"
           "\"users\":["
           "{\"id\":1,\"name\":\"Alice\",\"school\":\"School 1\"},"
           "{\"id\":2,\"name\":\"Bob\",\"school\":\"School 2\"}"
           "]"
           "}";
}

std::string ApiHandler::toJSON(const std::map<std::string, std::string>& data) {
    std::ostringstream json;
    json << "{";
    bool first = true;
    for (const auto& pair : data) {
        if (!first) json << ",";
        json << "\"" << pair.first << "\":\"" << pair.second << "\"";
        first = false;
    }
    json << "}";
    return json.str();
}
