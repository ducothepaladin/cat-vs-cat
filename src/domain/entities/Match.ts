import { CatStatus } from "../valueObjects/CatStatus.ts";

export class Match {
  constructor(
    public id: string,
    public slot: { playerId: string }[],
    public status: "start" | "pending" | "end",
    public startTime: Date,
    public endTime: NativeDate | null | undefined
  ) {}

  start(): void {
    this.status = "start";
  }

  end(): void {
    this.status = "end";
  }
}
