interface SkyGradientProps {
  readonly skyColors: { readonly top: string; readonly mid: string; readonly bottom: string }
}

export const SkyGradient = ({ skyColors }: SkyGradientProps) => (
  <div
    aria-hidden="true"
    className="fixed inset-0 z-0"
    style={{
      background: `linear-gradient(to bottom, ${skyColors.top}, ${skyColors.mid}, ${skyColors.bottom})`,
      transition: 'background 800ms cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateY(var(--parallax-sky, 0px))',
    }}
  />
)
