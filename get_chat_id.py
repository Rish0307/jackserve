import requests
import sys

TOKEN = "8768120693:AAEzLR8wITx81KgHvgPkX-G4xQIEV1HcRf8"
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

print("Bot running... send any message to @Goldrichhbot")

offset = None
while True:
    try:
        params = {"timeout": 20}
        if offset:
            params["offset"] = offset

        resp = requests.get(
            f"https://api.telegram.org/bot{TOKEN}/getUpdates",
            params=params, timeout=25
        )
        updates = resp.json().get("result", [])

        for update in updates:
            offset = update["update_id"] + 1
            msg = update.get("message")
            if not msg:
                continue

            chat_id = msg["chat"]["id"]
            print(f"Got message from chat_id: {chat_id} — replying...")

            requests.post(
                f"https://api.telegram.org/bot{TOKEN}/sendMessage",
                json={"chat_id": chat_id, "text": "hey im sara"}
            )

    except KeyboardInterrupt:
        print("Stopped.")
        break
    except Exception as e:
        print(f"Error: {e}")
