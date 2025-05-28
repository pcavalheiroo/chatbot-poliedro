import { Image } from "react-native";

export default function BackgroundPoliedros() {
    return (
        <>
            <Image source={require("../assets/poliedros/1.png")} style={{ position: "absolute", top: 190, right: -50, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/1.png")} style={{ position: "absolute", top: 395, left: -65, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/5.png")} style={{ position: "absolute", top: 550, left: 10, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/3.png")} style={{ position: "absolute", top: 120, left: -50, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/4.png")} style={{ position: "absolute", top: -50, left: -30, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/9.png")} style={{ position: "absolute", top: -45, right: -10, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/6.png")} style={{ position: "absolute", top: 418, right: 50, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/7.png")} style={{ position: "absolute", bottom: 100, right: -70, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/8.png")} style={{ position: "absolute", bottom: 0, left: -40, width: 100, height: 100 }} resizeMode="contain" />
            <Image source={require("../assets/poliedros/10.png")} style={{ position: "absolute", bottom: -60, right: 50, width: 100, height: 100 }} resizeMode="contain" />
        </>
    );
}
