import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, TextInput, Modal, Switch } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import axios from 'axios';
import AppHeader from '../../components/AppHeader';
import MenuItemCardAdmin from '../../components/MenuItemCardAdmin';
import { useUser } from '../../contexts/UserContext';
import * as Animatable from 'react-native-animatable';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface MenuItem {
    _id: string;
    nome: string;
    preco: number;
    categoria: string;
    descricao: string;
    disponibilidade: boolean;
}

export default function CardapioGerenciar() {
    const { user } = useUser();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState<MenuItem | null>(null);

    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descricao, setDescricao] = useState('');
    const [disponibilidade, setDisponibilidade] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchMenuItems = useCallback(async () => {
        if (!user || user.role !== 'admin') {
            setError("Acesso negado. Apenas administradores podem gerenciar o cardápio.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<MenuItem[]>(`${API_BASE_URL}/admin/cardapio/todos`);
            setMenuItems(response.data);
        } catch (err) {
            console.error("Erro ao buscar itens do cardápio:", err);
            setError("Não foi possível carregar os itens do cardápio.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMenuItems();
    }, [fetchMenuItems]);

    const handleOpenModal = useCallback((itemToEdit: MenuItem | null = null) => {
        if (itemToEdit) {
            setIsEditing(true);
            setCurrentEditItem(itemToEdit);
            setNome(itemToEdit.nome);
            setPreco(itemToEdit.preco.toString());
            setCategoria(itemToEdit.categoria);
            setDescricao(itemToEdit.descricao);
            setDisponibilidade(itemToEdit.disponibilidade);
        } else {
            setIsEditing(false);
            setCurrentEditItem(null);
            setNome('');
            setPreco('');
            setCategoria('');
            setDescricao('');
            setDisponibilidade(true);
        }
        setModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalVisible(false);
        setIsSubmitting(false);
    }, []);

    const handleSubmitItem = useCallback(async () => {
        if (!nome || !preco || !categoria || !descricao) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }
        const precoNormalizado = preco.replace(',', '.');
        if (isNaN(parseFloat(precoNormalizado))) {
            Alert.alert("Erro", "Preço deve ser um número válido.");
            return;
        }

        setIsSubmitting(true);
        const itemData = {
            nome,
            preco: parseFloat(precoNormalizado),
            categoria,
            descricao,
            disponibilidade
        };

        try {
            if (isEditing && currentEditItem) {
                await axios.put(`${API_BASE_URL}/admin/cardapio/${currentEditItem._id}`, itemData);
                Alert.alert("Sucesso", "Item atualizado com sucesso!");
            } else {
                await axios.post(`${API_BASE_URL}/admin/cardapio`, itemData);
                Alert.alert("Sucesso", "Item adicionado com sucesso!");
            }
            handleCloseModal();
            fetchMenuItems();
        } catch (err: any) {
            console.error("Erro ao salvar item:", err);
            const msg = axios.isAxiosError(err) && err.response?.data?.erro || "Falha ao salvar item.";
            Alert.alert("Erro", msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [nome, preco, categoria, descricao, disponibilidade, isEditing, currentEditItem, handleCloseModal, fetchMenuItems]);

    const handleDeleteItem = useCallback(async (itemId: string, itemName: string) => {
        Alert.alert(
            "Excluir Item",
            `Tem certeza que deseja excluir o item "${itemName}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_BASE_URL}/admin/cardapio/${itemId}`);
                            Alert.alert("Sucesso", "Item excluído!");
                            fetchMenuItems();
                        } catch (err: any) {
                            console.error("Erro ao excluir item:", err);
                            const msg = axios.isAxiosError(err) && err.response?.data?.erro || "Falha ao excluir item.";
                            Alert.alert("Erro", msg);
                        }
                    },
                },
            ]
        );
    }, [fetchMenuItems]);

    const handleToggleAvailability = useCallback(async (itemId: string, currentAvailability: boolean) => {
        try {
            await axios.put(`${API_BASE_URL}/admin/cardapio/${itemId}`, { disponibilidade: !currentAvailability });
            Alert.alert("Sucesso", `Item ${!currentAvailability ? 'disponibilizado' : 'indisponibilizado'}!`);
            fetchMenuItems();
        } catch (err: any) {
            console.error("Erro ao alternar disponibilidade:", err);
            const msg = axios.isAxiosError(err) && err.response?.data?.erro || "Falha ao alternar disponibilidade.";
            Alert.alert("Erro", msg);
        }
    }, [fetchMenuItems]);

    const filteredMenuItems = useMemo(() => {
        if (!searchTerm) {
            return menuItems;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return menuItems.filter(item =>
            item.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.categoria.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.descricao.toLowerCase().includes(lowerCaseSearchTerm) ||
            item._id.toLowerCase().includes(lowerCaseSearchTerm.slice(-6))
        );
    }, [menuItems, searchTerm]);

    return (
        <View style={tw`flex-1 bg-[#f7f7f7]`}>
            <Animatable.View animation="fadeInDown" duration={800} delay={100}>
                <AppHeader title="Gerenciar Cardápio" />
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" duration={800} delay={300} style={tw`flex-row items-center border border-gray-300 rounded-lg mx-6 mt-4 mb-4 bg-white px-3`}>
                <Ionicons name="search" size={20} color={tw.color('gray-500')!} style={tw`mr-1`} />
                <TextInput
                    style={tw`flex-1 p-2 text-gray-800`}
                    placeholder="Buscar por nome, categoria, descrição ou ID..."
                    placeholderTextColor={tw.color('gray-500')!}
                    autoCorrect={true}
                    autoComplete="off"
                    spellCheck={true}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </Animatable.View>

            <Animatable.View animation="fadeIn" duration={1000} delay={500} style={tw`flex-1 px-4`}>
                {loading ? (
                    <Animatable.View
                        animation="pulse"
                        iterationCount="infinite"
                        duration={1500}
                        style={tw`flex-1 justify-center items-center`}
                    >
                        <ActivityIndicator size="large" color="#005B7F" />
                        <Text style={tw`mt-4 text-lg text-gray-700`}>Carregando cardápio...</Text>
                    </Animatable.View>
                ) : error ? (
                    <Animatable.View
                        animation="shake"
                        duration={800}
                        style={tw`flex-1 justify-center items-center p-4 bg-red-100 rounded-lg`}
                    >
                        <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
                    </Animatable.View>
                ) : filteredMenuItems.length === 0 ? (
                    <Animatable.View
                        animation="bounceIn"
                        duration={1000}
                        style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}
                    >
                        <Text style={tw`text-yellow-700 text-base text-center`}>{searchTerm ? "Nenhum item encontrado para esta busca. 🔎" : "Nenhum item no cardápio. 😔"}</Text>
                    </Animatable.View>
                ) : (
                    <FlatList
                        data={filteredMenuItems}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => (
                            <Animatable.View
                                animation="fadeInRight"
                                duration={600}
                                delay={index * 100}
                            >
                                <MenuItemCardAdmin
                                    item={item}
                                    onEdit={handleOpenModal}
                                    onDelete={handleDeleteItem}
                                    onToggleAvailability={handleToggleAvailability}
                                />
                            </Animatable.View>
                        )}
                        contentContainerStyle={tw`pb-4`}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </Animatable.View>

            <Animatable.View animation="bounceIn" duration={1000} delay={700}>
                <TouchableOpacity
                    onPress={() => handleOpenModal()}
                    style={tw`absolute bottom-6 right-6 bg-[#005B7F] w-14 h-14 rounded-full justify-center items-center shadow-lg`}
                >
                    <Ionicons name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </Animatable.View>

            <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={handleCloseModal}>
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                    <Animatable.View animation="zoomIn" duration={500} style={tw`bg-white p-6 rounded-lg w-11/12 shadow-xl`}>
                        <Text style={tw`text-xl font-bold mb-4 text-center text-[#005B7F]`}>
                            {isEditing ? 'Editar Item do Cardápio' : 'Adicionar Novo Item'}
                        </Text>

                        <TextInput
                            placeholder="Nome do Item"
                            placeholderTextColor={tw.color('gray-500')!}
                            autoCorrect={true}
                            autoComplete="off"
                            spellCheck={true}
                            value={nome}
                            onChangeText={setNome}
                            style={tw`border border-gray-300 rounded p-3 mb-3 text-gray-800`}
                        />
                        <TextInput
                            placeholder="Preço (ex: 12.50)"
                            placeholderTextColor={tw.color('gray-500')!}
                            autoCorrect={true}
                            autoComplete="off"
                            spellCheck={true}
                            value={preco}
                            onChangeText={setPreco}
                            keyboardType="numeric"
                            style={tw`border border-gray-300 rounded p-3 mb-3 text-gray-800`}
                        />
                        <TextInput
                            placeholder="Categoria (ex: Lanches, Bebidas)"
                            placeholderTextColor={tw.color('gray-500')!}
                            autoCorrect={true}
                            autoComplete="off"
                            spellCheck={true}
                            value={categoria}
                            onChangeText={setCategoria}
                            style={tw`border border-gray-300 rounded p-3 mb-3 text-gray-800`}
                        />
                        <TextInput
                            placeholder="Descrição (opcional)"
                            placeholderTextColor={tw.color('gray-500')!}
                            autoCorrect={true}
                            autoComplete="off"
                            spellCheck={true}
                            value={descricao}
                            onChangeText={setDescricao}
                            multiline
                            numberOfLines={3}
                            style={tw`border border-gray-300 rounded p-3 mb-4 text-gray-800 h-24`}
                        />

                        <View style={tw`flex-row justify-between items-center mb-6`}>
                            <Text style={tw`text-base text-gray-700`}>Disponível:</Text>
                            <Switch
                                trackColor={{ false: "#ccc", true: "#81b0ff" }}
                                thumbColor={disponibilidade ? "#005B7F" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setDisponibilidade}
                                value={disponibilidade}
                            />
                        </View>

                        <View style={tw`flex-row justify-between`}>
                            <TouchableOpacity
                                onPress={handleCloseModal}
                                style={tw`bg-gray-300 px-5 py-3 rounded-lg`}
                            >
                                <Text style={tw`text-gray-800 font-semibold`}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSubmitItem}
                                style={tw`bg-[#005B7F] px-5 py-3 rounded-lg ${isSubmitting ? 'opacity-50' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={tw`text-white font-semibold`}>{isEditing ? 'Salvar Alterações' : 'Adicionar Item'}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>
            </Modal>
        </View>
    );
}