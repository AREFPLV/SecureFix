import DeviceBookGrid from '@/components/DeviceBookGrid'

export default function BookDeviceSection() {
  return (
    <section id="bookarepair" className="section book-home">
      <div className="container">
        <h2 className="section-title">
          Select your <span className="accent">device</span> and book a repair
        </h2>
        <p className="section-subtitle">
          Choose the device, then the model, then the repair. Each repair shows the price from the
          workshop list.
        </p>
        <DeviceBookGrid />
      </div>
    </section>
  )
}
