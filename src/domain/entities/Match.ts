export class Match {
  constructor(
    public id: string,
    public slot: { playerId: string }[],
    public status: "start" | "pending" | "end",
    public startTime: number,  // Timestamp in ms
    public endTime: number | null
  ) {}

  start(): void {
    this.status = "start";
  }

  end(): void {
    this.status = "end";
    this.endTime = Date.now();
  }
}
