import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import suidPlugin from "@suid/vite-plugin";
import { undestructurePlugin } from "babel-plugin-solid-undestructure"

export default defineConfig({
  plugins: [
    ...undestructurePlugin("ts"),
    solid(),
    suidPlugin()
  ],
  build: {
    target: "esnext",
  },
})
