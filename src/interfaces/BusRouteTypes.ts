export default interface BusRouteTypes extends Document {
  busNumber: string
  routeNumber: string
  startLocation: string
  endLocation: string
  routeStops: string[]
  status: boolean
}
