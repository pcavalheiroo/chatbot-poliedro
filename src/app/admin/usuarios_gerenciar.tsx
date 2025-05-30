// app/(admin)/usuarios-gerenciar.tsx
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import axios from 'axios';
import AppHeader from '../../components/AppHeader';
import { useUser } from '../../contexts/UserContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface UserAdmin {
    _id: string;
    email: string;
    role: string;
    criado_em: string;
}

export default function UsuariosGerenciar() {
    const { user } = useUser();
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Funções de Fetch e Gerenciamento de Usuários ---

    const fetchUsers = useCallback(async () => {
        if (!user || user.role !== 'admin') {
            setError("Acesso negado. Apenas administradores podem gerenciar usuários.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<UserAdmin[]>(`${API_BASE_URL}/admin/usuarios/todos`);
            setUsers(response.data);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setError("Não foi possível carregar os usuários.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // <<<<<<<<<<<<<<< ESTA É A FUNÇÃO QUE ESTAVA DANDO ERRO NO ESCOPO >>>>>>>>>>>>>>>
    const handleCloseModal = useCallback(() => {
        setModalVisible(false);
        setIsAddingUser(false); // Reseta o estado de loading do modal
        setNewEmail(''); // Limpa o email
        setNewPassword(''); // Limpa a senha
    }, []);

    const handleAddUser = useCallback(async () => {
        if (!newEmail || !newPassword) {
            Alert.alert("Erro", "Email e Senha são obrigatórios.");
            return;
        }
        setIsAddingUser(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/usuarios`, {
                email: newEmail,
                senha: newPassword,
                role: 'user'
            });
            Alert.alert("Sucesso", response.data.mensagem || "Usuário adicionado!");
            handleCloseModal(); // <<<<<<<<<<< AQUI ELA É CHAMADA, E ESTÁ NO ESCOPO CORRETO >>>>>>>>>
            fetchUsers();
        } catch (err: any) {
            console.error("Erro ao adicionar usuário:", err);
            const msg = axios.isAxiosError(err) && err.response?.data?.erro || "Falha ao adicionar usuário.";
            Alert.alert("Erro", msg);
        } finally {
            setIsAddingUser(false);
        }
    }, [newEmail, newPassword, fetchUsers, handleCloseModal]); // Adicionado handleCloseModal como dependência

    const handleDeleteUser = useCallback(async (userId: string, userEmail: string) => {
        Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja excluir o usuário ${userEmail}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_BASE_URL}/admin/usuarios/${userId}`);
                            Alert.alert("Sucesso", "Usuário excluído!");
                            fetchUsers();
                        } catch (err: any) {
                            console.error("Erro ao excluir usuário:", err);
                            const msg = axios.isAxiosError(err) && err.response?.data?.erro || "Falha ao excluir usuário.";
                            Alert.alert("Erro", msg);
                        }
                    },
                },
            ]
        );
    }, [fetchUsers]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) {
            return users;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return users.filter(userItem =>
            userItem.email.toLowerCase().includes(lowerCaseSearchTerm) ||
            userItem._id.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [users, searchTerm]);

    const renderUserItem = useCallback(({ item }: { item: UserAdmin }) => (
        <View style={tw`bg-white p-4 m-2 rounded-lg shadow-md flex-row justify-between items-center`}>
            <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold text-[#005B7F]`}>{item.email}</Text>
                <Text style={tw`text-sm text-gray-500`}>ID: {item._id.slice(-8)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteUser(item._id, item.email)} style={tw`ml-4 p-2`}>
                <Ionicons name="trash-outline" size={24} color={tw.color('red-500')!} />
            </TouchableOpacity>
        </View>
    ), [handleDeleteUser]);

    return (
        <View style={tw`flex-1 bg-[#f7f7f7]`}>
            <AppHeader title="Gerenciar Usuários" />

            <View style={tw`flex-row items-center border border-gray-300 rounded-lg mx-6 mt-4 mb-4 bg-white px-3`}>
                <Ionicons name="search" size={20} color={tw.color('gray-500')!} style={tw`mr-1`} />
                <TextInput
                    style={tw`flex-1 p-2 text-gray-800`}
                    placeholder="Buscar por email ou ID do usuário..."
                    placeholderTextColor={tw.color('gray-500')!}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            <View style={tw`flex-1 px-4`}>
                {loading ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color="#005B7F" />
                        <Text style={tw`mt-4 text-lg text-gray-700`}>Carregando usuários...</Text>
                    </View>
                ) : error ? (
                    <View style={tw`flex-1 justify-center items-center p-4 bg-red-100 rounded-lg`}>
                        <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
                    </View>
                ) : filteredUsers.length === 0 ? (
                    <View style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}>
                        <Text style={tw`text-yellow-700 text-base text-center`}>{searchTerm ? "Nenhum usuário encontrado para esta busca. 🔎" : "Nenhum usuário cadastrado. 😔"}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item._id}
                        renderItem={renderUserItem}
                        contentContainerStyle={tw`pb-4`}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={tw`absolute bottom-6 right-6 bg-[#FAA41F] w-14 h-14 rounded-full justify-center items-center shadow-lg`}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Modal de Adição de Usuário */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={handleCloseModal} // <<<<<<<<<<< AQUI ESTAVA O PROBLEMA DE ESCOPO >>>>>>>>>
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                    <View style={tw`bg-white p-6 rounded-lg w-11/12 shadow-xl`}>
                        <Text style={tw`text-xl font-bold mb-4 text-center text-[#005B7F]`}>Adicionar Usuário</Text>
                        <TextInput
                            placeholder="Email do novo usuário"
                            placeholderTextColor={tw.color('gray-500')!}
                            value={newEmail}
                            onChangeText={setNewEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={tw`border border-gray-300 rounded p-3 mb-3 text-gray-800`}
                        />
                        <TextInput
                            placeholder="Senha do novo usuário"
                            placeholderTextColor={tw.color('gray-500')!}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            style={tw`border border-gray-300 rounded p-3 mb-6 text-gray-800`}
                        />
                        <View style={tw`flex-row justify-between`}>
                            <TouchableOpacity
                                onPress={handleCloseModal} // <<<<<<<<<<< AQUI ESTAVA O PROBLEMA DE ESCOPO >>>>>>>>>
                                style={tw`bg-gray-300 px-5 py-3 rounded-lg`}
                            >
                                <Text style={tw`text-gray-800 font-semibold`}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleAddUser}
                                style={tw`bg-[#FAA41F] px-5 py-3 rounded-lg ${isAddingUser ? 'opacity-50' : ''}`}
                                disabled={isAddingUser}
                            >
                                {isAddingUser ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={tw`text-white font-semibold`}>Adicionar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({});