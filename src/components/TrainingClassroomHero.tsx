import './TrainingClassroomHero.css'

/** Animated classroom benches with repair tools for the training hero. */
export default function TrainingClassroomHero() {
  return (
    <div className="training-class-hero" aria-hidden="true">
      <div className="training-class-hero-glow" />
      <div className="training-class-hero-grid" />

      <div className="training-class-room">
        {[0, 1, 2].map((row) => (
          <div key={row} className={`training-class-row training-class-row-${row}`}>
            {[0, 1, 2].map((seat) => (
              <div
                key={seat}
                className={`training-class-bench training-class-bench-${row}-${seat}`}
                style={{ animationDelay: `${(row * 3 + seat) * 0.18}s` }}
              >
                <div className="training-class-mat" />
                <div className="training-class-phone" />
                <div className="training-class-screwdriver" />
                <div className="training-class-tweezers" />
                <div className="training-class-iron" />
                <div className="training-class-parts" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="training-class-float training-class-float-a">ESD mat</div>
      <div className="training-class-float training-class-float-b">Microscope</div>
      <div className="training-class-float training-class-float-c">Hot air</div>

      <p className="training-class-caption">Classroom benches · tools ready</p>
    </div>
  )
}
