import { Server, Socket } from "socket.io";
import { StartMatch } from "../../../usecases/match/StartMatch.ts";
import { MatchRepository } from "../../../infrastructure/repositories/MatchRepository.ts";
import { UpdatePosition } from "../../../usecases/match/UpdatePosition.ts";


export const updatePositionHandler = (socket: Socket) => {
  socket.on('update_position', async ({ matchId, p1Position, p2Position}) => {
    const useCase = new UpdatePosition(new MatchRepository());
    const result = await useCase.execute({ matchId, p1Position, p2Position});

    console.log(result);

    socket.emit('position_updated', {p1Position: result.p1Position, p2Position: result.p2Position});
  })
}
