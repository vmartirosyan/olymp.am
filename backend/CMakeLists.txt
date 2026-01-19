cmake_minimum_required(VERSION 3.10)
project(OlympiadBackend VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(include)

# Find required packages
find_package(Threads REQUIRED)

# Source files
set(SOURCES
    src/main.cpp
    src/server.cpp
    src/api_handler.cpp
)

# Headers
set(HEADERS
    include/server.h
    include/api_handler.h
)

# Create executable
add_executable(olympiad_server ${SOURCES} ${HEADERS})

# Link libraries
target_link_libraries(olympiad_server Threads::Threads)
