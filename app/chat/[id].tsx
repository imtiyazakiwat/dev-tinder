import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Text, 
  Avatar, 
  IconButton, 
  Surface, 
  useTheme, 
  Appbar,
  Chip,
  Divider
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { spacing, shadows, borderRadius } from '../../constants/theme';

// Mock data for the chat
const mockChats = {
  '1': {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    online: true,
    isTyping: false,
    messages: [
      {
        id: '1',
        text: 'Hey there! I saw your profile and thought your React skills looked impressive. Are you currently working on any interesting projects?',
        sender: 'them',
        timestamp: '10:30 AM',
        read: true,
      },
      {
        id: '2',
        text: `Hi Sarah! Thanks for the message. Yes, I'm actually building a real-time collaborative coding editor using React and WebSockets.`,
        sender: 'me',
        timestamp: '10:32 AM',
        read: true,
      },
      {
        id: '3',
        text: `That sounds really cool! I'm working on something similar with Next.js. Have you considered server-side rendering for better performance?`,
        sender: 'them',
        timestamp: '10:35 AM',
        read: true,
      },
      {
        id: '4',
        text: `I have! Actually, I'm using Next.js too for the frontend. Here's a snippet of how I'm handling the real-time connections:`,
        sender: 'me',
        timestamp: '10:38 AM',
        read: true,
      },
      {
        id: '5',
        text: "```jsx\nconst socket = useSocket();\n\nuseEffect(() => {\n  socket.on('code-change', (newCode) => {\n    setCode(newCode);\n  });\n\n  return () => socket.off('code-change');\n}, [socket]);\n```",
        sender: 'me',
        timestamp: '10:39 AM',
        read: true,
        isCode: true,
      },
      {
        id: '6',
        text: 'Nice approach! I have experience with Next.js as well. Would love to collaborate on something together sometime.',
        sender: 'them',
        timestamp: '10:42 AM',
        read: true,
      },
      {
        id: '7',
        text: "That would be great! What kind of projects are you interested in working on?",
        sender: 'me',
        timestamp: '10:45 AM',
        read: false,
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Alex Rivera',
    role: 'DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    online: false,
    isTyping: false,
    messages: [
      {
        id: '1',
        text: `Hi there! I noticed you have experience with Kubernetes. I've been trying to optimize our cluster configuration.`,
        sender: 'them',
        timestamp: 'Yesterday',
        read: true,
      },
      {
        id: '2',
        text: `Hey Alex! Yes, I've worked quite a bit with K8s. What specific issues are you running into?`,
        sender: 'me',
        timestamp: 'Yesterday',
        read: true,
      },
      {
        id: '3',
        text: `Have you used Terraform with AWS? I'm trying to automate our infrastructure deployment.`,
        sender: 'them',
        timestamp: 'Yesterday',
        read: true,
      },
    ],
  },
};

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  
  // Get chat data based on ID
  const chatData = mockChats[id as string];
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chatData?.messages || []);
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<RNTextInput>(null);
  
  // Simulate typing indicator
  useEffect(() => {
    if (message.length > 0) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);
      }, 1000);
      
      return () => clearTimeout(typingTimeout);
    }
  }, [message]);
  
  // Simulate reply after user sends a message
  const simulateReply = () => {
    setIsTyping(true);
    
    // Show typing indicator for 2 seconds, then send a reply
    setTimeout(() => {
      setIsTyping(false);
      
      const newMessage = {
        id: `reply-${Date.now()}`,
        text: 'Thanks for your message! This is an auto-generated reply from our AI bot since this is a demo.',
        sender: 'them',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      
      setMessages(prev => [...prev, newMessage]);
    }, 2000);
  };
  
  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simulate auto-reply
    simulateReply();
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  // Check if the message contains code (starts with ```), and format it accordingly
  const renderMessageContent = (text, isCode) => {
    if (isCode) {
      return (
        <Surface style={styles.codeBlock}>
          <Text style={styles.codeText}>{text.replace(/```(jsx|js|tsx|ts)?\n|```/g, '')}</Text>
        </Surface>
      );
    }
    
    // Check if text contains code markers
    if (text.includes('```')) {
      const parts = text.split('```');
      
      return parts.map((part, index) => {
        // Even indices are normal text, odd indices are code
        if (index % 2 === 0) {
          return part ? <Text key={`text-${index}`}>{part}</Text> : null;
        } else {
          // Remove language identifier if present
          const code = part.replace(/^(jsx|js|tsx|ts)?\n/, '');
          return (
            <Surface key={`code-${index}`} style={styles.codeBlock}>
              <Text style={styles.codeText}>{code}</Text>
            </Surface>
          );
        }
      });
    }
    
    return <Text>{text}</Text>;
  };
  
  const renderMessage = ({ item }) => {
    const isFromMe = item.sender === 'me';
    
    return (
      <View 
        style={[
          styles.messageBubble, 
          isFromMe ? styles.myMessage : styles.theirMessage,
          { backgroundColor: isFromMe ? theme.colors.primary : theme.colors.surfaceVariant }
        ]}
      >
        <View style={styles.messageContent}>
          {renderMessageContent(item.text, item.isCode)}
        </View>
        <View style={styles.messageFooter}>
          <Text 
            variant="labelSmall" 
            style={[
              styles.timestamp, 
              { color: isFromMe ? 'rgba(255,255,255,0.7)' : theme.colors.onSurfaceVariant }
            ]}
          >
            {item.timestamp}
          </Text>
          {isFromMe && (
            <IconButton
              icon={item.read ? 'check-all' : 'check'}
              size={12}
              iconColor={item.read ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}
              style={styles.readIcon}
            />
          )}
        </View>
      </View>
    );
  };
  
  const renderDateDivider = (date) => (
    <View style={styles.dateDivider}>
      <Divider style={styles.dividerLine} />
      <Chip compact style={styles.dateChip}>{date}</Chip>
      <Divider style={styles.dividerLine} />
    </View>
  );
  
  if (!chatData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="headlineMedium">Chat not found</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Avatar.Image source={{ uri: chatData.avatar }} size={40} />
        <View style={styles.headerInfo}>
          <Text variant="titleMedium" style={styles.headerName}>{chatData.name}</Text>
          <View style={styles.onlineContainer}>
            {chatData.online && <View style={styles.onlineIndicator} />}
            <Text variant="labelSmall" style={styles.headerRole}>
              {chatData.online ? 'Online' : chatData.role}
            </Text>
          </View>
        </View>
        <Appbar.Action icon="video" onPress={() => {
          console.log('Video call');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }} />
        <Appbar.Action icon="dots-vertical" onPress={() => {
          console.log('More options');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }} />
      </Appbar.Header>
      
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        ListHeaderComponent={() => renderDateDivider('Today')}
      />
      
      {/* Typing indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Text variant="labelSmall" style={styles.typingText}>
            {chatData.name} is typing...
          </Text>
        </View>
      )}
      
      {/* Input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <Surface style={styles.inputWrapper} elevation={4}>
          <IconButton
            icon="code-tags"
            size={24}
            iconColor={theme.colors.primary}
            onPress={() => {
              const codeSnippet = '```\n// Your code here\n```';
              setMessage(prev => prev + codeSnippet);
              inputRef.current?.focus();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          
          <RNTextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
          
          <IconButton
            icon="send"
            size={24}
            iconColor={theme.colors.primary}
            style={[
              styles.sendButton,
              message.trim() === '' && styles.sendButtonDisabled
            ]}
            disabled={message.trim() === ''}
            onPress={handleSend}
          />
        </Surface>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
  },
  headerInfo: {
    marginLeft: spacing.s,
    flex: 1,
  },
  headerName: {
    fontWeight: '600',
  },
  headerRole: {
    opacity: 0.7,
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  messageList: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: borderRadius.l,
    padding: spacing.m,
    marginBottom: spacing.m,
    ...shadows.small,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageContent: {
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  timestamp: {
    opacity: 0.7,
    fontSize: 10,
  },
  readIcon: {
    margin: 0,
    padding: 0,
  },
  codeBlock: {
    padding: spacing.s,
    borderRadius: borderRadius.s,
    marginVertical: spacing.xs,
    backgroundColor: '#282c34',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#e6e6e6',
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.m,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dateChip: {
    marginHorizontal: spacing.s,
  },
  typingContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
  },
  typingText: {
    fontStyle: 'italic',
    opacity: 0.7,
  },
  inputContainer: {
    padding: spacing.s,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.l,
    paddingHorizontal: spacing.s,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.s,
    paddingVertical: Platform.OS === 'ios' ? spacing.s : 0,
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 