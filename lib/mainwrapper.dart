import 'package:electrons/geminibot.dart';
import 'package:electrons/screens/homescreen.dart';
import 'package:electrons/screens/maps.dart';
import 'package:electrons/screens/profilescreen.dart';
import 'package:flutter/material.dart';
import 'package:animated_bottom_navigation_bar/animated_bottom_navigation_bar.dart';

class Mainwrapper extends StatefulWidget {
  const Mainwrapper({Key? key}) : super(key: key);

  @override
  State<Mainwrapper> createState() => _MainWrapperState();
}

class _MainWrapperState extends State<Mainwrapper> {
  int _bottomNavIndex = 0;

  // Replace placeholder `Container`s with your actual screen widgets
  final List<Widget> _pages = [
    HomeScreen(),
    MapScreen(),
    GeminiChatBotApp(), // Replace with actual screen
     // Replace with actual screen
    /*HistoryScreen(),  // Replace with actual screen
    NotificationsScreen(),*/ // Replace with actual screen
    ProfileScreen()// Replace with actual screen
  ];

  final List<IconData> iconList = [
    Icons.home_filled,
    Icons.map_outlined,
    Icons.chat,
    /*Icons.history,
    Icons.notifications_none,*/
    Icons.person_outline,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_bottomNavIndex],
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(0.0), // Adds space from all sides
        child: AnimatedBottomNavigationBar(
          icons: iconList,
          activeIndex: _bottomNavIndex,
          gapLocation: GapLocation.none,
          notchSmoothness: NotchSmoothness.smoothEdge,
          leftCornerRadius: 20,
          rightCornerRadius: 20,
          backgroundColor: const Color(0xFF2C2C38), // Dark background color
          activeColor: Colors.lightBlueAccent,
          inactiveColor: Colors.grey.shade400,
          iconSize: 26,
          onTap: (index) {
            setState(() {
              _bottomNavIndex = index;
            });
          },
          elevation: 10,
          height: 60,
        ),
      ),
    );
  }
}

// Example Screens
class MessagesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Messages')),
      body: Center(child: Text('Messages Screen')),
    );
  }
}

class SearchScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Search')),
      body: Center(child: Text('Search Screen')),
    );
  }
}

class HistoryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('History')),
      body: Center(child: Text('History Screen')),
    );
  }
}

class NotificationsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Notifications')),
      body: Center(child: Text('Notifications Screen')),
    );
  }
}

