import { UserProvider } from '../contexts/UserContext';
import { Slot } from "expo-router";
import '../styles/global.css'

export default function RootLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}