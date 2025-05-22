import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import BackButton from "../components/BackButton";
import BackgroundPoliedros from "../components/BackgroundPoliedros";

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: any;
}

const menuItems: MenuItem[] = [
    {
        id: 1,
        name: 'Filé de Frango',
        description: 'Filé de frango acompanhado com fritas e salada.',
        price: 24.00,
        image: null
    },
    {
        id: 2,
        name: 'Picanha Grelhada',
        description: 'Picanha grelhada com arroz, feijão e farofa.',
        price: 32.00,
        image: null
    },
    {
        id: 3,
        name: 'Peixe Grelhado',
        description: 'Peixe grelhado com legumes e purê de batatas.',
        price: 28.00,
        image: null
    }
];

export default function Cardapio() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <BackgroundPoliedros />
            <BackButton />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cardápio</Text>
                <Text style={styles.subTitle}>Pratos disponíveis</Text>
            </View>
            
            <ScrollView style={styles.menuList}>
                {menuItems.map((item) => (
                    <View key={item.id} style={styles.menuItem}>
                        <Image
                            source={item.image}
                            style={styles.foodImage}
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                            <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    
    header: {
        paddingTop: 45,
        paddingBottom: 20,
        backgroundColor: '#26c6da',
        alignItems: 'center',
        marginTop: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 18,
        color: '#fff',
    },
    menuList: {
        padding: 15,
        marginTop: 120,
    },
    menuItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 15,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    foodImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e65100',
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#26c6da',
    },
    
});

