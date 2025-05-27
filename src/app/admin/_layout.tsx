// app/_layout.tsx (PARA TESTE DE DEBUG EXTREMO)
import { Slot } from "expo-router";
// Remova UserProvider e global.css temporariamente
// import { UserProvider } from '../contexts/UserContext';
// import '../styles/global.css'

export default function RootLayout() {
  return (
    // Remova UserProvider temporariamente
    // <UserProvider>
      <Slot />
    // </UserProvider>
  );
}