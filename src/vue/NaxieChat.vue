<template>
  <div ref="containerRef" class="naxie-vue-wrapper"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { NaxieVanilla, NaxieVanillaOptions, NaxieEvents } from '../vanilla';

// Props
interface Props {
  title?: string;
  placeholder?: string;
  apiConfig: {
    apiKey: string;
    baseUrl?: string;
  };
  websocketConfig?: {
    endpoint: string;
    baseUrl?: string;
  };
  customData?: Record<string, any>;
  defaultOpen?: boolean;
  showBubble?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Chat with Dashboard',
  placeholder: 'Ask a question',
  defaultOpen: false,
  showBubble: true,
});

// Emits
const emit = defineEmits<{
  messageSent: [message: any];
  messageReceived: [message: any];
  connectionOpened: [];
  connectionClosed: [];
  connectionError: [error: any];
  chatOpened: [];
  chatClosed: [];
  stateChanged: [state: any];
}>();

// Refs
const containerRef = ref<HTMLElement | null>(null);
let naxieInstance: NaxieVanilla | null = null;

// Initialize Naxie
onMounted(() => {
  if (!containerRef.value) return;

  const options: NaxieVanillaOptions = {
    title: props.title,
    placeholder: props.placeholder,
    apiConfig: props.apiConfig,
    websocketConfig: props.websocketConfig,
    customData: props.customData,
    defaultOpen: props.defaultOpen,
    showBubble: props.showBubble,
  };

  naxieInstance = new NaxieVanilla(containerRef.value, options);

  // Setup event listeners
  naxieInstance.on(NaxieEvents.MESSAGE_SENT, (message) => {
    emit('messageSent', message);
  });

  naxieInstance.on(NaxieEvents.MESSAGE_RECEIVED, (message) => {
    emit('messageReceived', message);
  });

  naxieInstance.on(NaxieEvents.CONNECTION_OPENED, () => {
    emit('connectionOpened');
  });

  naxieInstance.on(NaxieEvents.CONNECTION_CLOSED, () => {
    emit('connectionClosed');
  });

  naxieInstance.on(NaxieEvents.CONNECTION_ERROR, (error) => {
    emit('connectionError', error);
  });

  naxieInstance.on(NaxieEvents.CHAT_OPENED, () => {
    emit('chatOpened');
  });

  naxieInstance.on(NaxieEvents.CHAT_CLOSED, () => {
    emit('chatClosed');
  });

  naxieInstance.on(NaxieEvents.STATE_CHANGED, (state) => {
    emit('stateChanged', state);
  });
});

// Cleanup on unmount
onBeforeUnmount(() => {
  if (naxieInstance) {
    naxieInstance.destroy();
    naxieInstance = null;
  }
});

// Expose methods
defineExpose({
  sendMessage: (text: string) => naxieInstance?.sendMessage(text),
  open: () => naxieInstance?.open(),
  close: () => naxieInstance?.close(),
  toggleMaximize: () => naxieInstance?.toggleMaximize(),
  getState: () => naxieInstance?.getState(),
});
</script>

<style scoped>
.naxie-vue-wrapper {
  /* Wrapper styling if needed */
}
</style>
