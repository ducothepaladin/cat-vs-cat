import { CatStatus } from "../valueObjects/CatStatus.ts";

export class Match {
  constructor(
    public id: string,
    public slot: { playerId: string }[],
    public status: "start" | "pending" | "end",
    public catStatus: CatStatus[],
    public startTime: Date,
    public endTime: NativeDate | null | undefined
  ) {}

  start(): void {
    this.status = "start";
  }

  end(): void {
    this.status = "end";
  }

  getCat(userId: string): CatStatus | null {
    const index = this.slot.indexOf({ playerId: userId });
    return index >= 0 ? this.catStatus[index] : null;
  }
}
