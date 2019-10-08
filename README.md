# Class Manager

[Demo](http://dev.dwightmillar.com/class_manager)

### Features
- User can view classes
- User can view students
- User can view assignments
- User can view grades
- User can add classes
- User can add students
- User can add assignments
- User can update grades
- User can delete students
- User can delete classes

### Planned Features
- User can log in as unique user
- User can track attendance
- User can log in as student
- User can send assignments for students to view

This project is a revamped version of a previous one that only featured one view with student name, class name, and grade all in one table. Intuitively I thought that this should be split into different views where students are grouped by classes, and thus began this project. The most challenging part of this app was implenting React Router, which I decided to learn to give the user the ability to "go back" within the app, which I thought was a necessary part of the user experience. Implementing this on the live site was a whole other challenge because I decided to host this project within a subdirectory, which interfered with how Apache interpreted the URL. Regardless, I managed to get it working and became very familiar with how to work both React Router and Apache2's configuration files.
