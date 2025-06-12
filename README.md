
# 📱 Chatbot Poliedro — Front-end

Interface mobile e web de um sistema inteligente de pedidos para cantinas e lanchonetes escolares, com autenticação de usuários, interface administrativa e chatbot de atendimento. Desenvolvido com **React Native** e **Expo Router**, com responsividade total para web e mobile.

🔗 Repositório do Back-end: [back](https://github.com/pcavalheiroo/back)

## 📦 Tecnologias utilizadas

- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS via twrnc](https://github.com/jaredh159/tailwind-react-native-classnames)
- [Animatable](https://github.com/oblador/react-native-animatable)
- [Context API](https://reactjs.org/docs/context.html)

## 🧱 Estrutura de Pastas

```
chatbot-poliedro/
├── components/           # Componentes reutilizáveis (Header, Botões, Background)
├── contexts/             # Contexto global do usuário
├── assets/               # Imagens e logos
├── app/                  # Páginas e rotas (Expo Router)
│   ├── index.tsx         # Página inicial
│   └── outras rotas/
├── utils/                # Funções auxiliares (ex: formatação)
├── types/                # Tipagens e interfaces
├── package.json          # Dependências e scripts
└── ...
```

## 🚀 Funcionalidades

- Login/Logout de usuários
- Chatbot para pedidos e dúvidas
- Consulta e exibição de cardápio
- Histórico de pedidos
- Design responsivo adaptado para web e mobile

## 🧪 Testes

Atualmente, o projeto não possui testes automatizados. Testes manuais são feitos via interface mobile e web.

## 🛠️ Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar localmente
npx expo start
```

## 🌐 Deploy

O projeto pode ser empacotado para:

- Android/iOS via `eas build`
- Web (PWA ou estático) via `expo export:web`

---

## 👨‍💻 Autor

Pedro Cavalheiro  
📧 pdrocavalheiro@gmail.com
🔗 [github.com/pcavalheiroo](https://github.com/pcavalheiroo)
