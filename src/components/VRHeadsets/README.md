# VR Headsets Component

This component provides a real-time monitoring interface for virtual reality training devices. It displays connected VR headsets with their current status, battery levels, user information, and training progress.

## Features

- **Real-time Monitoring**: Connects to Firebase Realtime Database to get live device status
- **Device Status**: Shows connection status, battery level, and charging status
- **User Information**: Displays current user profile and training progress
- **Progress Tracking**: Circular progress indicator showing course completion rate
- **Responsive Design**: Adapts to different screen sizes with mobile-first approach
- **Internationalization**: Supports both English and Arabic languages
- **Dark Mode**: Compatible with dark/light theme switching
- **Skeleton Loading**: Provides loading states while data is being fetched

## Components

### VRHeadsets

Main component that manages the list of VR devices and Firebase connection.

### ConnectedHeadsetCard

Wrapper component that fetches student data for a connected device.

### HeadsetCard

Individual device card displaying all device information and status.

### VRHeadsetsSkeleton & HeadsetCardSkeleton

Loading state components with skeleton animations.

## Usage

```tsx
import VRHeadsets from "@components/VRHeadsets";

function VRPage() {
  return (
    <div>
      <h1>VR Monitoring</h1>
      <VRHeadsets />
    </div>
  );
}
```

## Dependencies

- Firebase Realtime Database
- React i18next for internationalization
- Module SCSS for styling
- CircularProgress component

## Configuration

The component requires Firebase configuration with the following structure:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  // ... other config
};
```

## Data Structure

### Firebase Device Structure

```typescript
type FirebaseDevice = {
  Battery: number;
  BatteryCharging: boolean;
  Connected: boolean;
  ControlApp: {
    CurrentCourseId: string;
    CurrentProgress: string;
    CurrentUserId: string;
    IPAddress: string;
    IsUserLogin: boolean;
  };
  "db-id": string;
};
```

### GraphQL Device Structure

```typescript
type GraphQLDevice = {
  id: string;
  macAddress: string;
  name: string;
};
```

## Styling

The component uses CSS Modules with SCSS for styling. Key features include:

- Responsive grid layout
- Hover effects and transitions
- Dark mode support
- RTL language support
- Mobile-first responsive design

## Internationalization

Translation keys used:

- `vr_headsets.title`
- `vr_headsets.subtitle`
- `vr_headsets.light_effect`
- `vr_headsets.headset`
- `vr_headsets.default_avatar`
- `vr_headsets.completion_rate`
- `vr_headsets.firefighting`

## Future Enhancements

- Real GraphQL integration for device data
- Device management actions (restart, update, etc.)
- Historical data and analytics
- Device grouping and filtering
- Push notifications for device events
