import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:location/location.dart' as loc;
import 'package:geocoding/geocoding.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? _location;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLocation();
  }

  Future<void> _fetchLocation() async {
    try {
      loc.Location location = loc.Location();

      if (!(await location.serviceEnabled())) {
        if (!(await location.requestService())) {
          throw 'Location services are disabled.';
        }
      }

      if ((await location.hasPermission()) == loc.PermissionStatus.denied) {
        if ((await location.requestPermission()) != loc.PermissionStatus.granted) {
          throw 'Location permissions are denied.';
        }
      }

      final locationData = await location.getLocation();
      final placemarks = await placemarkFromCoordinates(
        locationData.latitude!,
        locationData.longitude!,
      );

      if (placemarks.isNotEmpty) {
        final placemark = placemarks.first;
        setState(() {
          _location =
          '${placemark.locality ?? placemark.subLocality}, ${placemark.country}';
          _isLoading = false;
        });
      } else {
        throw 'Unable to determine location.';
      }
    } catch (e) {
      setState(() {
        _location = 'Error: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final screenHeight = mediaQuery.size.height;

    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: screenHeight),
            child: Padding(
              padding:
              const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // AppBar Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          _location == null || _location!.startsWith('Error')
                              ? const CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor:
                            AlwaysStoppedAnimation<Color>(Colors.grey),
                          )
                              : Row(
                            children: [
                              const Icon(
                                Icons.location_on,
                                size: 24,
                                color: Colors.lightBlueAccent,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                _location!,
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const Icon(
                        Icons.notifications_rounded,
                        size: 30,
                        color: Colors.black,
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Example Skills Section
                  if (_location?.startsWith('Error') ?? false)
                    const Text(
                      'Unable to fetch location. Please try again.',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.red,
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}