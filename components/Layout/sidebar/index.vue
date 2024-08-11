<script setup lang="ts">
import { markRaw, watch } from "vue";
import sidebarItems from "./sidebarItems";

const sidebarMenu = markRaw(sidebarItems);
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Navigation -->
  <!-- ---------------------------------------------- -->
  <perfect-scrollbar class="scrollnavbar">
    <div class="sidebar_profile border-bottom">
      <v-list class="bg-muted">
        <v-list-item class="pa-4 pb-0 ml-1">
          <v-list-item-title class="text-h6 mb-1">سعيد محفوظ</v-list-item-title>
          <v-list-item-subtitle class="text-subtitle-1">مطور ويب</v-list-item-subtitle>
          <template v-slot:prepend class="me-0">
            <v-avatar size="45" class="me-0">
              <img src="/images/profile/user-3.jpg" width="50" />
            </v-avatar>
          </template>

        </v-list-item>
      </v-list>
    </div>
    <v-list class="py-5 px-4 bg-muted" density="compact">
      <!---Menu Loop -->
      <template v-for="(item, i) in sidebarMenu">
        <!---Item Sub Header -->
        <LayoutSidebarNavGroup :item="item" v-if="item.header" :key="item.title" />
        <!---Single Item-->
        <LayoutSidebarNavItem :item="item" v-else class="leftPadding" />
        <!---End Single Item-->
      </template>
    </v-list>



  </perfect-scrollbar>
</template>
