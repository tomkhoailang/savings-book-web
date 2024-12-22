"use client"
import {  SAVING_BOOK_TRANSACTION_COMPLETE, WITH_DRAW_COMPLETE, WITH_DRAW_STATUS } from "./socket.enum"

let ws

const connect = (token, callback) => {
  const wsUrl = `ws://localhost:44342/api/v1/ws?token=${token}&tabId=${crypto.randomUUID()}`
  ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.log("websocket connected");
    if (callback) {
      callback()
    }
  }
  ws.onerror = (error) => {
    console.error("WebSocket error:", error)
  }
}
const disconnect = () => {
  ws?.close()
}
const listenEvent = (callback) => {
  return () => {
    ws.onmessage = (ev) => {
      const jsonData = JSON.parse(ev.data)
      console.log("data coming", jsonData);
      if (jsonData.type === SAVING_BOOK_TRANSACTION_COMPLETE) {
        callback({ type: SAVING_BOOK_TRANSACTION_COMPLETE, data: jsonData })
      }
      if (jsonData.type === WITH_DRAW_STATUS) {
        callback({ type: WITH_DRAW_STATUS, data: jsonData })
      }
    }
  }
}

export const SocketHelper = {
  connect,
  disconnect,
  listenEvent,
}
