import { Match as M } from "../../domain/entities/Match.ts";
import Match from "../../infrastructure/db/models/Match.ts";
import { CatStatus } from "../../domain/valueObjects/CatStatus.ts";
import { IMatchRepository } from "../../domain/repositories/IMatchRepository.ts";
import { MatchPayload } from "../../infrastructure/type/Match.ts";

export class MatchRepository implements IMatchRepository {
  async createRoom(match: MatchPayload): Promise<M | null> {
    const matchDoc = await Match.create({
      slot: [match.slot[0], match.slot[1]],
      catStatus: [match.catStatus[0], match.catStatus[1]],
      match_status: match.status,
    });

    if (!matchDoc) return null;

    const slot = matchDoc.slot.map((s: any) => ({
      playerId: s?.playerId ? s.playerId.toString() : "",
    }));

    const catStatus = matchDoc.catStatus.map(
      (cs: any) => new CatStatus(cs.hp, cs.def, cs.critrate, cs.position)
    );
    const status = matchDoc.match_status;
    const startTime = matchDoc.createdAt;
    const endTime = matchDoc.endTime;

    const matchData = new M(
      matchDoc._id.toString(),
      slot,
      status,
      catStatus,
      startTime,
      endTime
    );

    return matchData;
  }

  async findMatchById(id: string): Promise<M | null> {
    const matchDoc = await Match.findById(id);

    if (!matchDoc) return null;

    const slot = matchDoc.slot.map((s: any) => ({
      playerId: s?.playerId ? s.playerId.toString() : "",
    }));

    const catStatus = matchDoc.catStatus.map(
      (cs: any) => new CatStatus(cs.hp, cs.def, cs.critrate, cs.position)
    );
    const status = matchDoc.match_status;
    const startTime = matchDoc.createdAt;
    const endTime = matchDoc.endTime;

    const match = new M(id, slot, status, catStatus, startTime, endTime);

    return match;
  }

  async updatePosition(
    matchId: string,
    p1Position: { x: number; y: number },
    p2Position: { x: number; y: number }
  ): Promise<M | null> {
    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      {
        $set: {
          "catStatus.0.position": p1Position,
          "catStatus.1.position": p2Position,
        },
      },
      { new: true }
    );

    const match = await this.findMatchById(updatedMatch?._id.toString() ?? "");

    return match;
  }
}
