#ifndef API_HANDLER_H
#define API_HANDLER_H

#include <string>
#include <map>

class ApiHandler {
public:
    static std::string handleRequest(const std::string& method, const std::string& path, const std::string& body);
    
private:
    static std::string handleHealth();
    static std::string handleGetProblems();
    static std::string handleGetUsers();
    static std::string toJSON(const std::map<std::string, std::string>& data);
};

#endif // API_HANDLER_H
