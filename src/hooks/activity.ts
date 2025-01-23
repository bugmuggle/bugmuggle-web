import { useEffect, useState } from "react"
import pb from "../lib/pocketbase/client"

export type ChannelType = {
  id: string
  name: string
}

export const useActivity = function () {
  const [channels, setChannels] = useState<ChannelType[]>([])
  const [actChannel, setActChannel] = useState<string>('')

  useEffect(() => {
    pb.collection('channels').getList()
      .then(res => {
        setChannels(res.items)
        setActChannel(res.items?.[0]?.id || '')
      })
  }, [])

  return {
    channels,
    setChannels,

    actChannel,
    setActChannel
  }
}
