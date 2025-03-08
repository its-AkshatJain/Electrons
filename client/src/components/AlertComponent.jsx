import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function AlertComponent() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        socket.emit("requestAlerts");

        socket.on("alerts", (data) => {
            setAlerts(data.matchedUsers);
        });

        return () => socket.off("alerts");
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Alerts</h2>
            {alerts.length === 0 ? <p>No alerts</p> : alerts.map((alert, idx) => (
                <div key={idx} className="p-2 border mt-2">
                    <p><strong>User:</strong> {alert.name} ({alert.email})</p>
                    <p><strong>User IP:</strong> {alert.userIP}</p>
                    <p><strong>Camera ID:</strong> {alert.cameraId}</p>
                    <p><strong>Distance:</strong> {alert.distance}</p>
                    <p><strong>Message:</strong> {alert.message}</p>
                </div>
            ))}
        </div>
    );
}

export default AlertComponent;
