import config from "../appConfig.json";
import { getItem } from "../libs/AsyncStorage";

export function createCustomerWebSocket(): WebSocket {
  const ws = new WebSocket(config.WEBSOCKET_URL);

  ws.onopen = async () => {
    const customerId = await getItem("customer_id");
    const customerSocketData = JSON.stringify({
      subscriptionType: "customer",
      subscription_id: customerId
    });

    console.log("websocket connected, registering subscription");

    ws.send(customerSocketData);
  }

  ws.onmessage = (e) => {
    console.log("websocket message", e.data);
  }

  return ws;
}

export function createChefWebSocket(): WebSocket {
  const ws = new WebSocket(config.WEBSOCKET_URL);

  ws.onopen = async () => {
    console.log("websocket connected, registering subscription");

    ws.send(JSON.stringify({
      subscriptionType: "chef",
      subscription_id: 1
    }));
  }

  ws.onmessage = (e) => {
    console.log("websocket message", e.data);
  }

  return ws;
}