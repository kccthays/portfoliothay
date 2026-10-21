import * as React from 'react'

const SLICES = 12

type ImageItem = { src: string; alt?: string }

type TiltedGridHeroProps = React.ComponentProps<'div'> & {
  images: ImageItem[]
  speed?: number
  tileHeight?: number
  aspectRatio?: number
  gap?: number
  children?: React.ReactNode
}

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 34,
  aspectRatio = 16 / 9,
  gap = 5,
  children,
  className,
  ...props
}: TiltedGridHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [columns, setColumns] = React.useState(6)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const resize = () => {
      const width = element.clientWidth
      const tileWidth = Math.min(width * 0.52, (element.clientHeight * tileHeight) / 100 * aspectRatio)
      setColumns(Math.max(4, Math.ceil(width / (tileWidth + 24)) + 2))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [aspectRatio, tileHeight])

  return (
    <div ref={ref} className={cx('tilted-grid-hero relative isolate overflow-hidden', className)} {...props}>
      <div className="tilted-grid-hero__band" aria-hidden="true">
        {Array.from({ length: columns }, (_, index) => {
          const image = images[index % images.length]
          return (
            <div
              key={index}
              className="tilted-grid-hero__tile"
              style={{
                width: `min(52vw, ${tileHeight * aspectRatio}vh)`,
                height: `${tileHeight}%`,
                animationDelay: `${-index * speed}s`,
                animationDuration: `${columns * speed}s`,
                marginRight: `${gap}%`,
              }}
            >
              {Array.from({ length: SLICES }, (_, slice) => (
                <span key={slice} className="tilted-grid-hero__slice" style={{ left: `${(slice / SLICES) * 100}%`, width: `${100 / SLICES + 0.6}%` }}>
                  <img src={image.src} alt={slice === 0 ? image.alt ?? '' : ''} draggable={false} style={{ left: `${-(slice * 100)}%`, width: `${SLICES * 100}%` }} />
                </span>
              ))}
            </div>
          )
        })}
      </div>
      <div className="tilted-grid-hero__fade" aria-hidden="true" />
      {children}
    </div>
  )
}

export default TiltedGridHero
