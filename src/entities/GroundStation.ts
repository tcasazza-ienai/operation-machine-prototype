export class GroundStation {
  private readonly name: string;
  private readonly latitude: number;
  private readonly longitude: number;
  private readonly altitude: number;
  private readonly min_elevation: number;
  private readonly max_range: number;

  constructor(
    name: string,
    latitude: number,
    longitude: number,
    altitude: number,
    min_elevation: number,
    max_range: number
  ) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.min_elevation = min_elevation;
    this.max_range = max_range;
  }
}
