'use client'

import clsx from 'clsx'
import { useLang, useTranslations } from 'hooks'
import React, { useEffect, useRef, useState } from 'react'
import { clamp, isWithinRect, modifyRect } from 'utils'

function Tooltip({
  children,
  className,
  id,
  content,
  position = 'top',
  href,
  theme,
  offset = 12,
}: {
  children: React.ReactNode
  className?: string
  id: string
  content: any
  position?: string
  href?: string
  offset?: number
  theme?: string
}) {
  const targetRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  const lang = useLang()
  const t = useTranslations(lang)

  const handleMouseEnter = (e) => {
    updatePosition()
    updateZIndex()
    setVisible(true)
  }

  const handleMouseMove = (e) => {
    if (!visible) {
      return
    }

    const mouse = { x: e.clientX, y: e.clientY }
    const targetEl = targetRef.current
    const tooltipEl = tooltipRef.current

    if (targetEl && tooltipEl) {
      const targetRect = targetEl.getBoundingClientRect()
      const tooltipRect = tooltipEl.getBoundingClientRect()
      const prop = position !== 'top' ? 'top' : 'bottom'

      if (
        !isWithinRect(mouse, targetRect) &&
        !isWithinRect(mouse, modifyRect(tooltipRect, { [prop]: offset }))
      ) {
        setVisible(false)
      }
    }
  }

  const updatePosition = () => {
    const target = targetRef.current
    const tooltip = tooltipRef.current
    const arrow = arrowRef.current

    if (target && tooltip) {
      const targetRect = target.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()

      const tooltipX =
        targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
      const tooltipY =
        position === 'top'
          ? targetRect.top - tooltipRect.height - offset
          : targetRect.bottom + offset

      const resultX = clamp(tooltipX, 0, window.innerWidth - tooltipRect.width)
      const resultY = clamp(
        tooltipY,
        0,
        window.innerHeight - tooltipRect.height
      )

      tooltip.style.transform = `translate3d(${resultX}px, ${resultY}px, 0px)`

      if (arrow) {
        const arrowOffsetX = Math.ceil(Math.abs(resultX - tooltipX))
        const arrowX =
          arrowOffsetX !== 0 ? `calc(-50% + ${arrowOffsetX}px)` : '-50%'
        const arrowY = position === 'top' ? '50%' : '-50%'
        const arrowRotation = position === 'top' ? 225 : 45

        arrow.style.transform = `translate3d(${arrowX}, ${arrowY}, 0px) rotate(${arrowRotation}deg)`
      }
    }
  }

  const updateZIndex = () => {
    const tooltip = tooltipRef.current

    if (tooltip) {
      tooltip.style.zIndex = '20'

      findTooltips().forEach((otherTooltip: HTMLElement) => {
        if (otherTooltip === tooltipRef.current) {
          return
        }

        otherTooltip.style.zIndex = '10'
      })
    }
  }

  const findTooltips = () => {
    const tooltips = Array.from(document.querySelectorAll('.tooltip'))

    return tooltips.filter((tooltip) => tooltip !== tooltipRef.current)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [visible])

  return (
    <>
      <span
        className={clsx(
          'tooltip absolute top-0 left-0 z-10 max-w-md border border-white px-5 py-2 text-center shadow-lg shadow-black/25 transition-opacity delay-150 ease-in-out',
          theme,
          {
            'pointer-events-all opacity-100': visible,
            'pointer-events-none opacity-0': !visible,
          }
        )}
        ref={tooltipRef}
        role="tooltip"
        id={id}
      >
        <span
          className={clsx(
            'absolute left-1/2 h-3 w-3 border-l border-t border-white',
            theme,
            {
              'top-[-1px]': position !== 'top',
              'bottom-[-1px]': position === 'top',
            }
          )}
          ref={arrowRef}
        />
        <span className="font-nunitoleading-none text-white">
          {typeof content === 'string' ? t(content) : content}
        </span>
      </span>

      <span
        onMouseEnter={handleMouseEnter}
        ref={targetRef}
        aria-describedby={id}
      >
        {href && (
          <a href={href} className={className}>
            {children}
          </a>
        )}
        {!href && <span className={className}>{children}</span>}
      </span>
    </>
  )
}

export default Tooltip
