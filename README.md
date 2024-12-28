## Welcome To Resto Go

<div style="display:flex; justify-content:center;">
    <img 
        src="assets/adaptive-icon.png" 
        alt="Resto Go Icon" 
        style="width: 100px; height: 100px; border-radius: 50%;"
    />
</div>

## Installation Guide
While this project uses expo, we recommend the local installation using metro

### Development Installation
1. `npx expo prebuild` - generate /android file
2. `npx react-native-asset` - linking the MaterialIcon
3. `npx react-native run-android` - run with usb tethering

### Production Installation (.apk)
1. `npx expo prebuild`
2. `npx react-native-asset` 
3. `npx react-native build-android`

## project Configuration
The project's config are located in `~/appConfig.json`
- `BASE_URL`: basepath for hosting url (http/https)
- `WEBSOCKET_URL`: path for websocket url (ws/wss)
- `AXIOS_ADMIN_JWT_TOKEN`: JWT token for staff user (still on development)
- `AXIOS_TIMEOUT`: max timeout for axios (in ms)