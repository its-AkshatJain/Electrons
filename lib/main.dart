import 'package:flutter/material.dart';
import 'mainwrapper.dart';
/*import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';*/

/*void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );*/
void main(){
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Mainwrapper(),
    );
  }
}
/*

class AuthCheck extends StatefulWidget {
  @override
  _AuthCheckState createState() => _AuthCheckState();
}

class _AuthCheckState extends State<AuthCheck> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkUserStatus();
    });
  }

  Future<void> _checkUserStatus() async {
    try {
      User? user = FirebaseAuth.instance.currentUser;

      if (user == null) {
        // No user logged in
        _navigateTo(PhoneLoginScreen());
        return;
      }

      String? token = await user.getIdToken();

      if (token != null && token.isNotEmpty) {
        // User logged in with valid token
        _navigateTo(Mainwrapper());
      } else {
        // Token invalid or empty
        _navigateTo(PhoneLoginScreen());
      }
    } catch (e) {
      // Handle errors (e.g., Firebase or network issues)
      _navigateTo(PhoneLoginScreen());
    }
  }

  void _navigateTo(Widget screen) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => screen),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: CircularProgressIndicator(), // Show loading indicator while checking the status
      ),
    );
  }
}*/
