import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatAPI } from "@/composables/api/chat";
import type {
  ChatRoomSummary,
  CreateChatRoomBody,
  CreateChatMessageBody,
} from "@/types/chat";

const { createChatRoom, createMessage } = useChatAPI();

export const useMutateChat = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createChatRoomMutation } = useMutation({
    mutationFn: (body: CreateChatRoomBody) => createChatRoom(body),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        { queryKey: ["getChatRoomsByUserId"] },
        (oldData: ChatRoomSummary[] | null) =>
          oldData ? [data, ...oldData] : oldData
      );
    },
  });

  const { mutateAsync: createMessageMutation } = useMutation({
    mutationFn: (body: CreateChatMessageBody) => createMessage(body),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        { queryKey: ["getMessagesByRoomId"] },
        (oldData: ChatRoomSummary[] | null) =>
          oldData ? [...oldData, data] : oldData
      );
    },
  });

  return { createChatRoomMutation, createMessageMutation };
};
