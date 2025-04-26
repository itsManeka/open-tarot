import { useEffect, useRef } from 'react'

export function useCarouselScroll(ref: React.RefObject<HTMLDivElement | null>) {
    const isDown = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const handleMouseDown = (e: MouseEvent) => {
            isDown.current = true
            startX.current = e.pageX - el.offsetLeft
            scrollLeft.current = el.scrollLeft
        }

        const handleMouseLeave = () => {
            isDown.current = false
        }

        const handleMouseUp = () => {
            isDown.current = false
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown.current) return
            e.preventDefault()
            const x = e.pageX - el.offsetLeft
            const walk = (x - startX.current) * 1.5
            el.scrollLeft = scrollLeft.current - walk
        }

        el.addEventListener('mousedown', handleMouseDown)
        el.addEventListener('mouseleave', handleMouseLeave)
        el.addEventListener('mouseup', handleMouseUp)
        el.addEventListener('mousemove', handleMouseMove)

        return () => {
            el.removeEventListener('mousedown', handleMouseDown)
            el.removeEventListener('mouseleave', handleMouseLeave)
            el.removeEventListener('mouseup', handleMouseUp)
            el.removeEventListener('mousemove', handleMouseMove)
        }
    }, [ref])
}
