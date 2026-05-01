import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../../lib/utils"

const SheetContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => {} })

export function Sheet({ open: controlledOpen, onOpenChange, children }: { open?: boolean, onOpenChange?: (open: boolean) => void, children: React.ReactNode }) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

export function SheetTrigger({ asChild, children, className }: { asChild?: boolean, children: React.ReactElement, className?: string }) {
  const { setOpen } = React.useContext(SheetContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e)
        setOpen(true)
      }
    })
  }
  return <button className={className} onClick={() => setOpen(true)}>{children}</button>
}

export function SheetContent({
  side = "bottom",
  className,
  children,
}: {
  side?: "bottom" | "right"
  className?: string
  children: React.ReactNode
}) {
  const { open, setOpen } = React.useContext(SheetContext)

  // Bloqueia scroll do body quando o sheet estiver aberto
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* Sheet panel */}
          <motion.div
            initial={side === "bottom" ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
            animate={side === "bottom" ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
            exit={side === "bottom" ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "fixed z-[110] bg-white shadow-2xl flex flex-col",
              side === "bottom"
                ? "inset-x-0 bottom-0 rounded-t-3xl max-h-[92vh] sm:inset-0 sm:m-auto sm:h-fit sm:w-full sm:max-w-lg sm:rounded-2xl sm:max-h-[85vh] sm:!transform-none"
                : "inset-y-0 right-0 w-80 max-w-full",
              className
            )}
          >
            {children}
            {/* Espaçador para safe area e para garantir que o scroll passe dos botões (apenas mobile) */}
            {side === "bottom" && (
              <div className="w-full shrink-0 sm:hidden" style={{ height: "max(2rem, env(safe-area-inset-bottom))" }} />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function SheetHeader({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn("flex flex-col space-y-1", className)}>{children}</div>
}

export function SheetTitle({ className, children }: { className?: string, children: React.ReactNode }) {
  return <h2 className={cn("text-base font-bold text-slate-900", className)}>{children}</h2>
}
