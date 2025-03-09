import 'package:electrons/firebase_options.dart';
import 'package:electrons/screens/onboardscreen.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Request notification permissions (iOS-specific)
  FirebaseMessaging messaging = FirebaseMessaging.instance;
  NotificationSettings settings = await messaging.requestPermission(
    alert: true,
    announcement: false,
    badge: true,
    carPlay: false,
    criticalAlert: false,
    provisional: false,
    sound: true,
  );

  print('User granted permission: ${settings.authorizationStatus}');

  // Initialize Firebase Messaging and set up listeners
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print("Notification received: ${message.notification?.title}");
    // Show a snackbar or dialog for the notification
  });

  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    print("Notification clicked: ${message.notification?.title}");
    // Handle navigation based on the notification
  });

  FirebaseMessaging.instance.getInitialMessage().then((RemoteMessage? message) {
    if (message != null) {
      print("Notification launched the app: ${message.notification?.title}");
      // Navigate to a specific screen if needed
    }
  });

  // Subscribe to topic
  await FirebaseMessaging.instance.subscribeToTopic('stampede-alerts');

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: OnboardingScreen(),
    );
  }
}