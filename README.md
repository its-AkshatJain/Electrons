# 🚨 Suraksha Mitra: AI-Powered Stampede Detection & Crowd Management

A smart, real-time crowd monitoring system that detects chaos and potential stampede conditions using surveillance camera feeds, notifies nearby security personnel (e.g., CRPF, RPF), and silently guides civilians to safety using dynamic evacuation routes.

---

## 🌐 Project Theme

**Travel & Tourism — Public Safety & Crowd Management**

---

## 📖 Introduction

Large gatherings at religious events, tourist hotspots, and festivals often risk turning into dangerous stampedes due to panic, miscommunication, or delays in human response. Traditional systems rely on manual monitoring and passive CCTV feeds, failing to act quickly and predictively.

**Suraksha Mitra** introduces a proactive, AI-driven solution to detect crowd chaos in real-time and automate security responses — reducing human error, avoiding panic, and saving lives.

---

## 🚨 Problem Statement

Traditional crowd monitoring faces multiple challenges:

* **Delayed emergency response**
* **No automated prediction or intervention**
* **Panic among people when danger is announced**
* **Inefficient route planning during evacuations**

---

## 💡 Proposed Solution

**Suraksha Mitra** leverages computer vision and AI to detect stampede-like conditions in real-time and automate response mechanisms:

* Instantly alerts nearby security personnel (CRPF/RPF)
* Guides officers for optimal crowd control placement
* Silently informs civilians (via wristbands/mobile alerts) without causing panic
* Directs people toward safe exits using dynamic route guidance

---

## 🔑 Unique Selling Points (USP)

* ✅ AI-powered chaos detection (computer vision, no manual supervision)
* ✅ Silent, tiered alerting based on proximity & risk level
* ✅ Real-time officer deployment and crowd control
* ✅ Dynamic, congestion-optimized evacuation guidance
* ✅ Works offline/low network using Edge AI processing

---

## 🧭 User Journey Flow

1. **User arrives** at an event monitored by surveillance cameras.
2. System **analyzes crowd density & behavior** in real-time.
3. On detecting danger:

   * Nearby **security personnel** get instant alerts (mobile app).
   * Nearby **civilians** get subtle alerts + safe exit route guidance.
   * Distant users are **rerouted preemptively**.
   * Authorities receive deployment suggestions.
4. **Stampede is averted** through smart interventions.

---

## 🛠️ System Architecture

```
CCTV Cameras → AI Model (Edge/Cloud Processing) →
  ↳ Mobile App (CRPF/RPF)
  ↳ IoT Alert System (Wristbands / Phones)
  ↳ Database (Location, User Mapping, Analytics)
  ↳ Dashboard (for Organizers/Police)
```

---

## ✨ Key Features

* ⚡ Real-time stampede detection
* 🚓 Automated officer deployment alerts
* 📱 Silent crowd evacuation notifications
* 🌐 Crowd heatmap visualization
* 🕊️ Panic-free evacuation control

---

## 🧪 Technology Stack

| Layer        | Technologies                      |
| ------------ | --------------------------------- |
| **Backend**  | Python, Flask / FastAPI           |
| **AI/ML**    | OpenCV, Custom CNN models         |
| **Mobile**   | Flutter / React Native            |
| **IoT**      | BLE-based wristbands, GPS modules |
| **Cloud**    | Firebase / AWS Lambda (optional)  |
| **Database** | Firebase Realtime DB / MongoDB    |

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ombhayde/Electrons
cd Electrons
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the AI Model (Demo Mode)

```bash
python apppy --video demo.mp4
```

### 4. Run the Flask Backend

```bash
python ai-service.py
```

### 5. Connect to Mobile App

* Use local IP or Firebase connection for live testing.

---

## 🧭 Future Scope

* 🔊 Integration with public announcement & emergency beacons
* 📶 Large-scale wristband support for mega events
* 📊 Heatmap-based visual dashboards for security forces
* 🔮 Predictive behavior learning using historical crowd data


---

## 🙌 Acknowledgements

Special thanks to public safety officers and event management teams whose real-world challenges inspired the creation of **Suraksha Mitra**.
