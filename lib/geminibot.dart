import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'consts.dart';

void main() {
  runApp(GeminiChatBotApp());
}

class GeminiChatBotApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Gemini Chat Bot',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: GeminiChatBotScreen(),
    );
  }
}

class GeminiChatBotScreen extends StatefulWidget {
  @override
  _GeminiChatBotScreenState createState() => _GeminiChatBotScreenState();
}

class _GeminiChatBotScreenState extends State<GeminiChatBotScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];
  bool _isTyping = false;

  // Call the Gemini API
  Future<String> fetchTravelSuggestions(String userInput) async {
    const String apiKey = GEMINI_API_KEY;
    const String apiUrl =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    try {
      final response = await http.post(
        Uri.parse('$apiUrl?key=$apiKey'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          "contents": [
            {
              "parts": [
                {
                  "text":
                  "$userInput. Provide me a brief suggestion for my travel query."
                }
              ]
            }
          ]
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data["candidates"]?[0]?["content"]?["parts"]?[0]?["text"] ??
            "No suggestion available.";
      } else {
        throw 'Failed to fetch suggestions. Status: ${response.statusCode}, Body: ${response.body}';
      }
    } catch (e) {
      return "Error: $e";
    }
  }

  // Handle sending messages
  void _sendMessage() async {
    final userMessage = _controller.text.trim();
    if (userMessage.isNotEmpty) {
      setState(() {
        _messages.add({"sender": "user", "text": userMessage});
        _isTyping = true; // Bot starts typing
      });

      // Simulate bot typing delay
      await Future.delayed(Duration(seconds: 1));

      final botResponse = await fetchTravelSuggestions(userMessage);

      setState(() {
        _messages.add({"sender": "bot", "text": botResponse});
        _isTyping = false; // Bot stops typing
      });

      _controller.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Gemini Chat Bot'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _messages.length + (_isTyping ? 1 : 0), // Add one for "typing"
              itemBuilder: (context, index) {
                if (_isTyping && index == _messages.length) {
                  // Show typing indicator
                  return Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      padding: EdgeInsets.all(12),
                      margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        "Typing...",
                        style: TextStyle(
                          color: Colors.black87,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                  );
                }

                final message = _messages[index];
                final isUser = message["sender"] == "user";
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    padding: EdgeInsets.all(12),
                    margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                    decoration: BoxDecoration(
                      color: isUser ? Colors.blueAccent : Colors.grey[300],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      message["text"] ?? "",
                      style: TextStyle(
                        color: isUser ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isTyping)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "Gemini is typing...",
                  style: TextStyle(fontStyle: FontStyle.italic),
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: "Ask me something about traveling...",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _sendMessage,
                  child: Icon(Icons.send),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}