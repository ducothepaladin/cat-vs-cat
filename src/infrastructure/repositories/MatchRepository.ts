import { Match as M } from "../../domain/entities/Match";
import Match from "../../infrastructure/db/models/Match";
import { IMatchRepository } from "../../domain/repositories/IMatchRepository";
import { MatchPayload } from "../../infrastructure/type/Match";

export class MatchRepository implements IMatchRepository {
  async createRoom(match: MatchPayload): Promise<M | null> {
    const matchDoc = await Match.create({
      slot: [match.slot[0], match.slot[1]],
      match_status: match.status,
    });

    if (!matchDoc) return null;

    const slot = matchDoc.slot.map((s: any) => ({
      playerId: s?.playerId ? s.playerId.toString() : "",
    }));

    const status = matchDoc.match_status;
    const startTime = matchDoc.createdAt.getTime();
    const endTime = matchDoc.endTime ?? null;

    const matchData = new M(
      matchDoc._id.toString(),
      slot,
      status,
      startTime,
      endTime
    );

    return matchData;
  }

  async findMatchById(id: string): Promise<M | null> {
    const matchDoc = await Match.findById(id);

    if (!matchDoc) throw new Error("Match not found");

    const slot = matchDoc.slot.map((s: any) => ({
      playerId: s?.playerId ? s.playerId.toString() : "",
    }));

    const status = matchDoc.match_status;
    const startTime = matchDoc.createdAt.getTime();
    const endTime = matchDoc.endTime ?? null;

    const match = new M(id, slot, status, startTime, endTime);

    return match;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const match = await this.findMatchById(id);

    switch (status) {
      case "end":
        match?.end();
        break;
      default:
        throw new Error(`Invaild status: ${status}`);
    }

    await Match.findByIdAndUpdate(id, {
      match_status: match?.status,
      endTime: match?.endTime,
    });
  }
}
