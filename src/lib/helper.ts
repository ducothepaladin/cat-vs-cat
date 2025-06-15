export const getSlotRoomId = (userId1: string, userId2: string) => {
  const [id1, id2] = [userId1, userId2].sort();
  return `slot:${id1}:${id2}`;
};