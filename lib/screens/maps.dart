import 'package:electrons/consts.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MapScreen extends StatefulWidget {
  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> with SingleTickerProviderStateMixin {
  LatLng? currentLocation;
  final MapController _mapController = MapController();
  late AnimationController _animationController;
  late Animation<double> _animation;

  final List<LatLng> entryGates = [
    LatLng(31.70184318199131, 76.52270246412306), // Main Gate
    LatLng(31.709085277367958, 76.52262787648044), // Back Gate
  ];

  LatLng? nearestGate;
  List<LatLng> routeCoordinates = [];

  @override
  void initState() {
    super.initState();
    fetchCurrentLocation();

    // Initialize animation controller
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 500),
    )..repeat(reverse: true);

    _animation = Tween<double>(begin: 0, end: 25).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  Future<void> fetchCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.deniedForever) {
        return;
      }
    }

    Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
    setState(() {
      currentLocation = LatLng(position.latitude, position.longitude);
      nearestGate = findNearestGate();
    });
  }

  LatLng? findNearestGate() {
    if (currentLocation != null) {
      return entryGates.reduce((a, b) {
        final distanceA = Geolocator.distanceBetween(
          currentLocation!.latitude,
          currentLocation!.longitude,
          a.latitude,
          a.longitude,
        );
        final distanceB = Geolocator.distanceBetween(
          currentLocation!.latitude,
          currentLocation!.longitude,
          b.latitude,
          b.longitude,
        );
        return distanceA < distanceB ? a : b;
      });
    }
    return null;
  }

  Future<void> fetchRouteFromORS() async {
    if (currentLocation != null && nearestGate != null) {
      const String apiKey = ROUTE_API; // Replace with your ORS API key
      final String url = 'https://api.openrouteservice.org/v2/directions/foot-walking';

      final body = {
        "coordinates": [
          [currentLocation!.longitude, currentLocation!.latitude], // Current Location
          [nearestGate!.longitude, nearestGate!.latitude], // Nearest Gate
        ]
      };

      try {
        final response = await http.post(
          Uri.parse(url),
          headers: {
            "Content-Type": "application/json",
            "Authorization": apiKey,
          },
          body: jsonEncode(body),
        );

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final geometry = data['routes'][0]['geometry'];

          setState(() {
            routeCoordinates = decodePolyline(geometry);
          });
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to fetch route: ${response.statusCode}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error fetching route: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  List<LatLng> decodePolyline(String polyline) {
    List<LatLng> coordinates = [];
    List<int> codes = polyline.codeUnits;
    int index = 0;
    int len = codes.length;
    int latitude = 0;
    int longitude = 0;

    while (index < len) {
      int shift = 0;
      int result = 0;
      int b;
      do {
        b = codes[index++] - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);
      int deltaLat = ((result & 1) == 1 ? ~(result >> 1) : (result >> 1));
      latitude += deltaLat;

      shift = 0;
      result = 0;
      do {
        b = codes[index++] - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);
      int deltaLon = ((result & 1) == 1 ? ~(result >> 1) : (result >> 1));
      longitude += deltaLon;

      coordinates.add(LatLng(latitude / 1E5, longitude / 1E5));
    }
    return coordinates;
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: currentLocation == null
          ? Center(
        child: AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(0, -_animation.value),
              child: Icon(
                Icons.location_pin,
                color: Colors.red,
                size: 50,
              ),
            );
          },
        ),
      )
          : FlutterMap(
        mapController: _mapController,
        options: MapOptions(
          center: currentLocation!,
          zoom: 15,
        ),
        children: [
          TileLayer(
            urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            subdomains: ['a', 'b', 'c'],
          ),
          MarkerLayer(
            markers: [
              Marker(
                point: currentLocation!,
                width: 40,
                height: 40,
                builder: (context) {
                  return Icon(
                    Icons.location_pin,
                    color: Colors.red,
                    size: 40,
                  );
                },
              ),
              ...entryGates.map(
                    (gate) => Marker(
                  point: gate,
                  width: 40,
                  height: 40,
                  builder: (context) {
                    return Icon(
                      Icons.pin_drop,
                      color: Colors.green,
                      size: 40,
                    );
                  },
                ),
              ),
            ],
          ),
          if (routeCoordinates.isNotEmpty)
            PolylineLayer(
              polylines: [
                Polyline(
                  points: routeCoordinates,
                  color: Colors.blue,
                  strokeWidth: 4.0,
                ),
              ],
            ),
        ],
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            backgroundColor: const Color(0xFF2C2C38),
            onPressed: () {
              if (currentLocation != null) {
                _mapController.move(
                  currentLocation!,
                  18.0, // Zoom level
                );
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Zoomed to your location!'),
                    duration: const Duration(seconds: 2),
                    backgroundColor: Colors.lightBlueAccent,
                  ),
                );
              }
            },
            child: const Icon(
              Icons.my_location,
              color: Colors.lightBlueAccent,
            ),
            tooltip: 'Zoom to my location',
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            backgroundColor: Color(0xFF2C2C38),
            onPressed: fetchRouteFromORS,
            child: const Icon(
              Icons.directions,
              color: Colors.lightBlueAccent,
            ),
            tooltip: 'Navigate using ORS',
          ),
        ],
      ),
    );
  }
}