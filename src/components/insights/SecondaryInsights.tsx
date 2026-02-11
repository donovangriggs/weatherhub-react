import { DaylightSchedule } from './DaylightSchedule'
import { PrecipitationMap } from './PrecipitationMap'

export const SecondaryInsights = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DaylightSchedule />
      <PrecipitationMap />
    </section>
  )
}
