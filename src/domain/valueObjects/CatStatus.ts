export class CatStatus {
  constructor(
    public hp: number,
    public def: number,
    public critrate: number,
    public position: {
      x: number;
      y: number;
    }
  ) {}

  static init(x: number, y: number): CatStatus {
    return new CatStatus(100, 10, 0.1, { x, y });
  }

  applyDamage(dmg: number) {
    this.hp -= dmg;
  }
}
