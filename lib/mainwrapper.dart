import 'package:electrons/screens/homescreen.dart';
import 'package:flutter/material.dart';

class Mainwrapper extends StatefulWidget {
  const Mainwrapper({super.key});

  @override
  State<Mainwrapper> createState() => _MainWrapperState();
}

class _MainWrapperState extends State<Mainwrapper> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    HomeScreen(), // Home screen
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex], // Display the selected page
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.21),
              blurRadius: 10,
              spreadRadius: 2,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            // Home Icon
            GestureDetector(
              onTap: () {
                setState(() {
                  _selectedIndex = 0;
                });
              },
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: _selectedIndex == 0 ? const Color(0xFFFC4E37) : Colors.transparent,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.home_outlined,
                  color: _selectedIndex == 0 ? Colors.white : Colors.black,
                  size: 28,
                ),
              ),
            ),
            // Profile Icon
            GestureDetector(
              onTap: () {
                setState(() {
                  _selectedIndex = 1;
                });
              },
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: _selectedIndex == 1 ? const Color(0xFFFC4E37) : Colors.transparent,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.person_2_rounded,
                  color: _selectedIndex == 1 ? Colors.white : Colors.black,
                  size: 28,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
