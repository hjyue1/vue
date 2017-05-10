
<template>
  <div class="chatapp">
    <thread-section></thread-section>
    <message-section></message-section>
  </div>
</template>
<script>

import ThreadSection from 'containers/threadSection';
import MessageSection from 'containers/messageSection';
import 'lesses/chat.less'

export default {
  name: 'messages',
  components: {
    ThreadSection,
    MessageSection
  }
}
</script>