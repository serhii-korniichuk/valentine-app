# Local PWA Setup (LAN, No Hosting)

## 1) Start Vite in LAN mode

```bash
yarn dev --host 0.0.0.0 --port 5173
```

## 2) Get your local IP (macOS)

```bash
ipconfig getifaddr en0
```

If empty, try:

```bash
ipconfig getifaddr en1
```

## 3) Open app on phone (same Wi-Fi)

Open in mobile browser:

```text
http://<YOUR_IP>:5173
```

## 4) Install as PWA

- iPhone (Safari): Share -> Add to Home Screen
- Android (Chrome): Menu -> Install app / Add to Home screen

## 5) If device cannot open URL

- Ensure laptop and phone are in the same network
- Allow Node/Vite in firewall
- Try another port (for example `4173`)

## 6) Better PWA check (preview build)

```bash
yarn build
yarn preview --host 0.0.0.0 --port 4173
```

Then open:

```text
http://<YOUR_IP>:4173
```

This mode is closer to production and usually validates service worker behavior better.
